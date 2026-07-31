const express = require("express");
const rateLimit = require("express-rate-limit");
const Booking = require("../models/Booking");
const { CAB_TYPES } = require("../data/cabTypes");
const { authenticateAdmin } = require("./admin");

const router = express.Router();

// Booking creation is the write path that actually matters for revenue —
// limit it more gently than search, but still enough to blunt a retry-storm
// or scripted abuse from taking the DB down with everyone else.
const bookingLimiter = rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", bookingLimiter, async (req, res) => {
  const { tripType, from, to, date, cabTypeId, distanceKm, estimatedFare, riderName, contactNumber, address } = req.body || {};

  // require core trip fields and basic rider contact info
  if (!from || !to || !date || !cabTypeId || !riderName || !contactNumber) {
    return res.status(400).json({ error: "from, to, date, cabTypeId, riderName and contactNumber are required" });
  }
  if (!CAB_TYPES.some((c) => c.id === cabTypeId)) {
    return res.status(400).json({ error: `Unknown cabTypeId: ${cabTypeId}` });
  }

  try {
    const booking = await Booking.create({
      tripType,
      from,
      to,
      date,
      cabTypeId,
      distanceKm,
      estimatedFare,
      riderName,
      contactNumber,
      address,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(503).json({ error: "Booking service unavailable, please retry" });
  }
});

// GET /api/bookings?status=pending_confirmation&page=1&limit=20
// Always paginated — an unbounded "list everything" query is the single
// most common way a booking table falls over once it has real volume.
router.get("/", authenticateAdmin, async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const filter = req.query.status ? { status: req.query.status } : {};

  try {
    const [results, total] = await Promise.all([
      Booking.find(filter)
        .sort({ createdAt: -1 }) // uses the {status, createdAt} index
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Booking.countDocuments(filter),
    ]);
    res.json({ results, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(503).json({ error: "Booking lookup unavailable" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).lean();
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: "Invalid booking id" });
  }
});

const allowedActionRoles = ["dispatcher", "admin", "superadmin"];

router.post("/:id/confirm", authenticateAdmin, async (req, res) => {
  try {
    if (!allowedActionRoles.includes(req.adminUser.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.status === "confirmed") {
      return res.json(booking);
    }

    booking.status = "confirmed";
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: "Invalid booking id" });
  }
});

router.post("/:id/cancel", authenticateAdmin, async (req, res) => {
  try {
    if (!allowedActionRoles.includes(req.adminUser.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.status === "cancelled") {
      return res.json(booking);
    }

    booking.status = "cancelled";
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: "Invalid booking id" });
  }
});

router.post("/:id/complete", authenticateAdmin, async (req, res) => {
  try {
    if (!allowedActionRoles.includes(req.adminUser.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.status === "completed") {
      return res.json(booking);
    }

    booking.status = "completed";
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: "Invalid booking id" });
  }
});

module.exports = router;

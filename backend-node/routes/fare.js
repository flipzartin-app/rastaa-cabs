const express = require("express");
const { CAB_TYPES } = require("../data/cabTypes");

const router = express.Router();

const JAVA_FARE_SERVICE_URL =
  process.env.JAVA_FARE_SERVICE_URL || "https://rastaa-cabs.onrender.com/api/fare/calculate";

function localEstimate(cabTypeId, distanceKm) {
  const cab = CAB_TYPES.find((c) => c.id === cabTypeId) || CAB_TYPES[0];
  const extraKm = Math.max(0, distanceKm - cab.baseKm);
  const total = cab.baseFare + extraKm * cab.perKm;
  return { total: Math.round(total), source: "node-fallback" };
}

// POST /api/fare/estimate  { cabTypeId, distanceKm, tripType }
router.post("/estimate", async (req, res) => {
  const { cabTypeId, distanceKm, tripType } = req.body || {};

  if (!cabTypeId || typeof distanceKm !== "number") {
    return res.status(400).json({ error: "cabTypeId and numeric distanceKm are required" });
  }

  try {
    // The Java service owns the real pricing rules (surge windows, toll
    // tables, round-trip multipliers, etc). Node is just the gateway here.
    const javaRes = await fetch(JAVA_FARE_SERVICE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cabTypeId, distanceKm, tripType }),
      signal: AbortSignal.timeout(3000),
    });

    if (!javaRes.ok) throw new Error(`Java service responded ${javaRes.status}`);

    const data = await javaRes.json();
    return res.json({ total: data.total, source: "java-fare-engine" });
  } catch (err) {
    // Fare engine unreachable — degrade gracefully instead of failing the booking flow.
    return res.json(localEstimate(cabTypeId, distanceKm));
  }
});

module.exports = router;

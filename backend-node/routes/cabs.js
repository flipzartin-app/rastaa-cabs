const express = require("express");
const CabType = require("../models/CabType");
const { CITIES } = require("../data/cabTypes");

const router = express.Router();

// Cab types change rarely, so a short in-process cache takes real load off
// Mongo on a page that every visitor hits. Swap for Redis once you're
// running more than one Node instance, so the cache is shared instead of
// re-warmed per instance.
let cabTypeCache = { data: null, expiresAt: 0 };
const CACHE_TTL_MS = 60_000;

router.get("/cabtypes", async (req, res) => {
  try {
    if (cabTypeCache.data && cabTypeCache.expiresAt > Date.now()) {
      return res.json(cabTypeCache.data);
    }

    // secondaryPreferred: this is a read-only, staleness-tolerant query, so
    // let it land on a replica instead of competing with writes on the primary.
    const cabTypes = await CabType.find().read("secondaryPreferred").lean();
    cabTypeCache = { data: cabTypes, expiresAt: Date.now() + CACHE_TTL_MS };
    res.json(cabTypes);
  } catch (err) {
    res.status(503).json({ error: "Cab type lookup unavailable" });
  }
});

router.get("/cities", (req, res) => {
  // Small, static enough not to need a DB round trip at all.
  res.json(CITIES);
});

module.exports = router;

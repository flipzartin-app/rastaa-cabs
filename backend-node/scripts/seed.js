require("dotenv").config();
const { connectDB } = require("../db/connect");
const CabType = require("../models/CabType");
const Route = require("../models/Route");
const { CAB_TYPES } = require("../data/cabTypes");

const ROUTES = [
  { from: "Chandigarh", to: "Delhi", km: 247, hours: "4h 17m", fare: 2989 },
  { from: "Chandigarh", to: "Shimla", km: 112, hours: "3h 09m", fare: 1423 },
  { from: "Chandigarh", to: "Manali", km: 310, hours: "7h 40m", fare: 4550 },
  { from: "Chandigarh", to: "Amritsar", km: 234, hours: "4h 05m", fare: 2810 },
  { from: "Ludhiana", to: "Chandigarh", km: 100, hours: "2h 05m", fare: 1330 },
  { from: "Delhi", to: "Chandigarh", km: 247, hours: "4h 20m", fare: 2989 },
];

async function seed() {
  await connectDB();

  for (const cab of CAB_TYPES) {
    await CabType.updateOne({ id: cab.id }, { $set: cab }, { upsert: true });
  }

  for (const route of ROUTES) {
    await Route.updateOne(
      { from: route.from, to: route.to },
      { $set: route },
      { upsert: true }
    );
  }

  console.log(`Seeded ${CAB_TYPES.length} cab types and ${ROUTES.length} routes.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

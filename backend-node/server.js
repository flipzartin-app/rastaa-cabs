require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connectDB } = require("./db/connect");
const cabsRouter = require("./routes/cabs");
const fareRouter = require("./routes/fare");
const bookingsRouter = require("./routes/bookings");
const { router: adminRouter } = require("./routes/admin");
const searchRouter = require("./routes/search");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "rastaa-cabs-backend-node" });
});

app.use("/api", cabsRouter);
app.use("/api/fare", fareRouter);
app.use("/api/admin", adminRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/routes", searchRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

async function start() {
  try {
    await connectDB();
  } catch (err) {
    console.error("Could not connect to MongoDB:", err.message);
    console.error("Start MongoDB (see docker-compose.yml) or set MONGODB_URI, then retry.");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Rastaa Cabs Node API listening on http://localhost:${PORT}`);
    console.log(
      `Fare requests are forwarded to ${process.env.JAVA_FARE_SERVICE_URL || "http://localhost:8080/api/fare/calculate"}`
    );
  });
}

start();

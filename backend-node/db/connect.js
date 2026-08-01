const mongoose = require("mongoose");
const dns = require('dns');


let isConnected = false;
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;

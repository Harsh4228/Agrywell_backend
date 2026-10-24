const dns = require("dns");
const mongoose = require("mongoose");
const env = require("./env");

mongoose.set("strictQuery", true);

// Optional override for machines whose local resolver rejects the SRV lookups used by mongodb+srv URIs.
if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(",").map((s) => s.trim()).filter(Boolean));
}

async function connectDB() {
  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`[db] connected to ${mongoose.connection.name}`);
}

async function disconnectDB() {
  await mongoose.connection.close();
}

module.exports = { connectDB, disconnectDB };

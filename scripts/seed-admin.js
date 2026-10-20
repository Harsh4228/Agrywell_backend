/**
 * Creates the admin account from ADMIN_EMAIL / ADMIN_PASSWORD, or resets its password if it exists.
 * Usage: npm run seed:admin
 */
const env = require("../src/config/env");
const { connectDB, disconnectDB } = require("../src/config/db");
const Admin = require("../src/models/Admin");

async function main() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first");
  if (env.isProduction && password.length < 10) throw new Error("ADMIN_PASSWORD must be at least 10 characters");

  await connectDB();
  let admin = await Admin.findOne({ email });
  if (admin) {
    admin.password = password;
    await admin.save();
    console.log(`Updated password for ${email}`);
  } else {
    admin = await Admin.create({ email, password, name: process.env.ADMIN_NAME || "Administrator" });
    console.log(`Created admin ${email}`);
  }
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => disconnectDB());

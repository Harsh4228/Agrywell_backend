require("dotenv").config();

const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function list(value) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const env = {
  NODE_ENV,
  isProduction,
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI: required("MONGODB_URI"),
  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  // Comma-separated list of allowed browser origins. Empty = allow all (development only).
  CORS_ORIGINS: list(process.env.CORS_ORIGINS),
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  CONTACT_TO_EMAIL: list(process.env.CONTACT_TO_EMAIL || "harshbutani1@gmail.com"),
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL || "Agriwell Website <onboarding@resend.dev>",
  UPLOAD_MAX_MB: Number(process.env.UPLOAD_MAX_MB) || 10,
};

if (isProduction && env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters in production");
}

if (isProduction && env.CORS_ORIGINS.length === 0) {
  console.warn("[env] CORS_ORIGINS is empty — the API will accept requests from any origin.");
}

module.exports = env;

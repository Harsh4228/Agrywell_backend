const jwt = require("jsonwebtoken");
const env = require("../config/env");
const Admin = require("../models/Admin");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const JWT_OPTIONS = { algorithm: "HS256", audience: "agriwell-admin", issuer: "agriwell-api" };

function signToken(admin) {
  return jwt.sign({ sub: admin.id, v: admin.tokenVersion || 0 }, env.JWT_SECRET, { ...JWT_OPTIONS, expiresIn: env.JWT_EXPIRES_IN });
}

const requireAuth = asyncHandler(async (req, res, next) => {
  // Admin data must never be cached by browsers or proxies.
  res.set("Cache-Control", "no-store");

  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) throw ApiError.unauthorized();

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: [JWT_OPTIONS.algorithm],
      audience: JWT_OPTIONS.audience,
      issuer: JWT_OPTIONS.issuer,
    });
  } catch {
    throw ApiError.unauthorized("Session expired. Please sign in again.");
  }

  // Look the admin up so that deleting an account or bumping its token version revokes old tokens.
  const admin = await Admin.findById(payload.sub);
  if (!admin) throw ApiError.unauthorized("Account no longer exists");
  if ((payload.v ?? 0) !== (admin.tokenVersion || 0)) throw ApiError.unauthorized("Session ended. Please sign in again.");

  req.admin = admin;
  next();
});

module.exports = { requireAuth, signToken };

const jwt = require("jsonwebtoken");
const env = require("../config/env");
const Admin = require("../models/Admin");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

function signToken(admin) {
  return jwt.sign({ sub: admin.id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) throw ApiError.unauthorized();

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw ApiError.unauthorized("Session expired. Please sign in again.");
  }

  // Look the admin up so that deleting an account revokes its outstanding tokens.
  const admin = await Admin.findById(payload.sub);
  if (!admin) throw ApiError.unauthorized("Account no longer exists");

  req.admin = admin;
  next();
});

module.exports = { requireAuth, signToken };

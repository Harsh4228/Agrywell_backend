const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { signToken } = require("../middleware/auth");

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync("agriwell-timing-equaliser", 12);

const invalidCredentials = () => ApiError.unauthorized("Invalid email or password");

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select("+password +failedLoginAttempts +lockUntil");

  if (!admin) {
    await bcrypt.compare(password, DUMMY_HASH);
    throw invalidCredentials();
  }

  if (admin.isLocked()) {
    const minutes = Math.ceil((admin.lockUntil - Date.now()) / 60000);
    throw new ApiError(423, `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`);
  }

  if (!(await admin.comparePassword(password))) {
    admin.failedLoginAttempts = (admin.failedLoginAttempts || 0) + 1;
    if (admin.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      admin.failedLoginAttempts = 0;
      admin.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
    }
    await admin.save();
    throw invalidCredentials();
  }

  admin.failedLoginAttempts = 0;
  admin.lockUntil = undefined;
  admin.lastLoginAt = new Date();
  await admin.save();

  res.json({ success: true, data: { token: signToken(admin), admin: admin.toPublic() } });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.admin.toPublic() });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select("+password");
  if (!(await admin.comparePassword(req.body.currentPassword))) {
    throw ApiError.badRequest("Current password is incorrect");
  }
  admin.password = req.body.newPassword;
  // Signs out every other session; this one continues with the fresh token.
  admin.tokenVersion = (admin.tokenVersion || 0) + 1;
  await admin.save();
  res.json({ success: true, message: "Password updated", data: { token: signToken(admin) } });
});

/** Revokes every token issued so far, including the caller's. */
exports.logoutAll = asyncHandler(async (req, res) => {
  await Admin.updateOne({ _id: req.admin.id }, { $inc: { tokenVersion: 1 } });
  res.json({ success: true, message: "Signed out of all devices" });
});

const Admin = require("../models/Admin");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { signToken } = require("../middleware/auth");

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await admin.comparePassword(password))) {
    throw ApiError.unauthorized("Invalid email or password");
  }

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
  await admin.save();
  res.json({ success: true, message: "Password updated" });
});

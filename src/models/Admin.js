const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    name: { type: String, trim: true },
    lastLoginAt: Date,
    // Brute-force protection: the account locks for a while after repeated wrong passwords.
    failedLoginAttempts: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, select: false },
    // Bumped on password change / "sign out everywhere"; tokens carrying an older value are rejected.
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

adminSchema.methods.isLocked = function isLocked() {
  return Boolean(this.lockUntil && this.lockUntil > Date.now());
};

adminSchema.methods.toPublic = function toPublic() {
  return { id: this.id, email: this.email, name: this.name || "" };
};

module.exports = mongoose.model("Admin", adminSchema);

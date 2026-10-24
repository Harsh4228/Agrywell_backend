const rateLimit = require("express-rate-limit");

const base = { standardHeaders: "draft-7", legacyHeaders: false };

const apiLimiter = rateLimit({ ...base, windowMs: 60 * 1000, limit: 300 });

const loginLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: { success: false, message: "Too many login attempts. Please try again in 15 minutes." },
});

const contactLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: { success: false, message: "Too many messages sent. Please try again later." },
});

const uploadLimiter = rateLimit({
  ...base,
  windowMs: 10 * 60 * 1000,
  limit: 40,
  message: { success: false, message: "Too many uploads. Please wait a few minutes." },
});

module.exports = { apiLimiter, loginLimiter, contactLimiter, uploadLimiter };

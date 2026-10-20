const mongoose = require("mongoose");
const multer = require("multer");
const { ZodError } = require("zod");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");

function notFound(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = 500;
  let message = "Something went wrong. Please try again later.";
  let details;

  if (err instanceof ApiError) {
    status = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    status = 400;
    message = "Validation failed";
    details = err.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message }));
  } else if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = "Validation failed";
    details = Object.values(err.errors).map((e) => ({ path: e.path, message: e.message }));
  } else if (err instanceof mongoose.Error.CastError) {
    status = 400;
    message = `Invalid ${err.path}`;
  } else if (err instanceof multer.MulterError) {
    status = 400;
    message = err.code === "LIMIT_FILE_SIZE" ? `File exceeds ${env.UPLOAD_MAX_MB} MB limit` : err.message;
  } else if (err && err.code === 11000) {
    status = 409;
    message = `A record with this ${Object.keys(err.keyValue || {}).join(", ") || "value"} already exists`;
  } else if (err && err.type === "entity.parse.failed") {
    status = 400;
    message = "Malformed JSON body";
  }

  if (status >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}`, err);
  }

  res.status(status).json({
    success: false,
    message,
    ...(details && { details }),
    ...(!env.isProduction && status >= 500 && { stack: err.stack }),
  });
}

module.exports = { notFound, errorHandler };

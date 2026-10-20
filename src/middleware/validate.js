const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");

// Parses req.body with a zod schema and replaces it with the sanitized result.
const validateBody = (schema) => (req, res, next) => {
  req.body = schema.parse(req.body);
  next();
};

const validateObjectId = (param = "id") => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
    return next(ApiError.badRequest(`Invalid ${param}`));
  }
  next();
};

module.exports = { validateBody, validateObjectId };

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const env = require("./config/env");
const routes = require("./routes");
const { UPLOAD_DIR } = require("./middleware/upload");
const { apiLimiter } = require("./middleware/rateLimit");
const { notFound, errorHandler } = require("./middleware/error");

const app = express();

// Render / Vercel sit behind a proxy; needed for correct client IPs in rate limiting.
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
// Dev servers pick the next free port (8080, 8081, 8082…), so any localhost port is allowed outside production.
const LOCALHOST = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

function allowOrigin(origin, callback) {
  if (!env.CORS_ORIGINS.length) return callback(null, true);
  const allowed = !origin || env.CORS_ORIGINS.includes(origin) || (!env.isProduction && LOCALHOST.test(origin));
  callback(null, allowed);
}

app.use(
  cors({
    origin: allowOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.isProduction ? "combined" : "dev"));

app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "7d", index: false }));

app.get("/", (req, res) => res.json({ name: "Agriwell API", status: "ok" }));
app.use("/api", apiLimiter, routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

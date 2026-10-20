const env = require("./src/config/env");
const app = require("./src/app");
const { connectDB, disconnectDB } = require("./src/config/db");

async function start() {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`[server] listening on port ${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = (signal) => {
    console.log(`[server] ${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

process.on("unhandledRejection", (reason) => {
  console.error("[server] unhandled rejection:", reason);
});

start().catch((err) => {
  console.error("[server] failed to start:", err);
  process.exit(1);
});

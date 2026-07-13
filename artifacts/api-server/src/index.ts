import { env } from "./lib/env";
import { logger } from "./lib/logger";
import { pool } from "@workspace/db";
import app from "./app";

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "Server listening");
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────
async function shutdown(signal: string) {
  logger.info({ signal }, "Shutdown signal received");

  server.close(async (err) => {
    if (err) {
      logger.error({ err }, "Error closing HTTP server");
      process.exit(1);
    }
    try {
      await pool.end();
      logger.info("Database pool closed");
      process.exit(0);
    } catch (poolErr) {
      logger.error({ err: poolErr }, "Error closing database pool");
      process.exit(1);
    }
  });

  // Force exit if graceful shutdown takes > 10 s
  setTimeout(() => {
    logger.warn("Shutdown timeout — forcing exit");
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.fatal({ reason }, "Unhandled promise rejection");
  process.exit(1);
});

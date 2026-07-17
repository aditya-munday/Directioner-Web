import {
  type Request,
  type Response,
  type NextFunction,
  type ErrorRequestHandler,
} from "express";
import { logger } from "./logger";
import { env } from "./env";

/** Structured application error — maps directly to an HTTP status code. */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

/** Convenience factory helpers */
export const forbidden = (msg = "Forbidden") => new AppError(403, msg);
export const notFoundError = (msg = "Not found") => new AppError(404, msg);
export const badRequest = (msg: string) => new AppError(400, msg);
export const conflict = (msg: string) => new AppError(409, msg);
export const tooManyRequests = (msg: string) => new AppError(429, msg);

/** Duck-typed ZodError check — works for both zod v3 and v4 */
function isZodError(
  err: unknown,
): err is { issues: Array<{ path: PropertyKey[]; message: string }> } {
  return (
    err instanceof Error &&
    "issues" in err &&
    Array.isArray((err as { issues: unknown }).issues)
  );
}

/** 404 handler — mount after all routes */
export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  next(new AppError(404, `Route not found: ${req.method} ${req.path}`));
}

/** Central error handler — mount last */
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req,
  res,
  _next,
) => {
  const isProd = env.NODE_ENV === "production";

  if (isZodError(err)) {
    res.status(422).json({
      error: "Validation error",
      issues: err.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.code ? { code: err.code } : {}),
    });
    return;
  }

  // Postgres unique-violation
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === "23505"
  ) {
    res.status(409).json({ error: "Duplicate entry — resource already exists" });
    return;
  }

  // Postgres foreign-key violation
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === "23503"
  ) {
    res.status(400).json({ error: "Referenced resource does not exist" });
    return;
  }

  // Database not configured
  if (
    err instanceof Error &&
    err.message.includes("DATABASE_URL")
  ) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }

  logger.error({ err }, "Unhandled error");

  // In production, never leak internal error details
  res.status(500).json({
    error: isProd
      ? "Internal server error"
      : (err instanceof Error ? err.message : "Internal server error"),
  });
};

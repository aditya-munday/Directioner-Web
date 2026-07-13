import { type RequestHandler } from "express";

type ParseableSchema = {
  safeParse(
    data: unknown,
  ):
    | { success: true; data: unknown }
    | { success: false; error: unknown };
};

type RequestTarget = "body" | "query" | "params";

/**
 * Middleware factory — validates req[target] against the given Zod schema.
 * On success, replaces req[target] with the parsed (coerced) value.
 * On failure, forwards the ZodError to the error handler.
 */
export function validate(
  schema: ParseableSchema,
  target: RequestTarget = "body",
): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse((req as Record<string, unknown>)[target]);
    if (!result.success) {
      next(result.error);
      return;
    }
    (req as Record<string, unknown>)[target] = result.data;
    next();
  };
}

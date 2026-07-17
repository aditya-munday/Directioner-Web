/**
 * Validates environment variables at startup.
 * In development, Supabase + DB vars are optional — the server boots in
 * "degraded" mode (auth routes return 503) so the frontend can still be
 * developed without a live database.
 */
import { z } from "zod";

const envSchema = z.object({
  PORT: z
    .string()
    .regex(/^\d+$/, "PORT must be a numeric string")
    .default("3001")
    .transform(Number),
  DATABASE_URL: z.string().optional().default(""),
  // Accept both VITE_SUPABASE_* (frontend-shared) and plain SUPABASE_* names
  VITE_SUPABASE_URL: z.string().optional().default(""),
  VITE_SUPABASE_ANON_KEY: z.string().optional().default(""),
  SUPABASE_URL: z.string().optional().default(""),
  SUPABASE_ANON_KEY: z.string().optional().default(""),
  // Service role key — required for secure server-side auth token verification
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(""),
  // Razorpay — required for payment processing
  RAZORPAY_KEY_ID:     z.string().optional().default(""),
  RAZORPAY_KEY_SECRET: z.string().optional().default(""),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  ALLOWED_ORIGIN: z.string().optional(),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal"])
    .default("info"),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const lines = result.error.issues
      .map((i) => `  ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Environment validation failed:\n${lines}`);
  }

  const env = result.data;

  // Normalise: prefer plain SUPABASE_* over VITE_SUPABASE_* on the server
  if (!env.SUPABASE_URL && env.VITE_SUPABASE_URL)
    env.SUPABASE_URL = env.VITE_SUPABASE_URL;
  if (!env.SUPABASE_ANON_KEY && env.VITE_SUPABASE_ANON_KEY)
    env.SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

  // Warn in dev if optional vars are missing — fail hard in production
  if (env.NODE_ENV === "production") {
    const missing: string[] = [];
    if (!env.DATABASE_URL)             missing.push("DATABASE_URL");
    if (!env.SUPABASE_URL)             missing.push("SUPABASE_URL (or VITE_SUPABASE_URL)");
    if (!env.SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
    if (!env.RAZORPAY_KEY_ID)          missing.push("RAZORPAY_KEY_ID");
    if (!env.RAZORPAY_KEY_SECRET)      missing.push("RAZORPAY_KEY_SECRET");
    if (missing.length) {
      throw new Error(`Missing required production env vars: ${missing.join(", ")}`);
    }
  }

  return env;
}

export const env = parseEnv();

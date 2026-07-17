import { Request, Response, NextFunction } from "express";
import { supabase, supabaseConfigured } from "../lib/supabase";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

// Very rough JWT shape check — rejects obviously malformed tokens before
// making a network round-trip to Supabase.
const JWT_PATTERN = /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/;

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!supabaseConfigured || !supabase) {
    res.status(503).json({
      error: "Authentication unavailable — Supabase not configured",
      hint: "Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and DATABASE_URL environment variables",
    });
    return;
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  const token = authHeader.slice(7).trim();

  // Reject malformed tokens immediately without a Supabase round-trip
  if (!token || !JWT_PATTERN.test(token)) {
    res.status(401).json({ error: "Malformed token" });
    return;
  }

  // Token length sanity check (Supabase JWTs are < 4 KB)
  if (token.length > 4096) {
    res.status(401).json({ error: "Token too large" });
    return;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  req.userId = data.user.id;
  next();
}

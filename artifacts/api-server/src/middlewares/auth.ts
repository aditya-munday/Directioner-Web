import { Request, Response, NextFunction } from "express";
import { supabase, supabaseConfigured } from "../lib/supabase";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!supabaseConfigured || !supabase) {
    res.status(503).json({
      error: "Authentication unavailable — Supabase not configured",
      hint: "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables",
    });
    return;
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  const token = authHeader.slice(7);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  req.userId = data.user.id;
  next();
}

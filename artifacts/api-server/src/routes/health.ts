import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";
import { asyncHandler } from "../lib/async-handler";

const router: IRouter = Router();

router.get(
  "/healthz",
  asyncHandler(async (_req, res) => {
    // Verify DB connectivity
    await pool.query("SELECT 1");

    res.json({ status: "ok", db: "ok", ts: new Date().toISOString() });
  }),
);

export default router;

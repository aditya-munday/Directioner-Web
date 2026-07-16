import { Link } from "wouter";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "#070708" }}
    >
      {/* Giant 404 watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{
          fontFamily: "'TASA Orbiter Display', sans-serif",
          fontWeight: 800,
          fontSize: "40vw",
          color: "rgba(255,255,255,0.018)",
          letterSpacing: "-0.05em",
          lineHeight: 1,
        }}
      >
        404
      </div>

      <div className="relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] mb-6"
            style={{ color: "rgba(255,255,255,0.2)" }}>
            FIG.404 — ROUTE_NOT_FOUND
          </div>
          <h1
            className="font-display font-bold text-white mb-4 leading-none"
            style={{ fontSize: "clamp(48px, 10vw, 120px)", letterSpacing: "-0.05em" }}
          >
            Lost.
          </h1>
          <p className="font-mono text-xs mb-10" style={{ color: "rgba(255,255,255,0.3)" }}>
            This page doesn't exist in the system.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/"
              className="font-mono font-bold text-sm uppercase tracking-wide px-8 py-4 transition-all"
              style={{ background: "#FFE500", color: "#000" }}>
              Return Home
            </Link>
            <Link href="/dashboard"
              className="font-mono text-xs uppercase tracking-wide px-8 py-4 transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
              Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

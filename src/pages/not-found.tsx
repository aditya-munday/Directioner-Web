import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, AnimatePresence } from "framer-motion";

/* ── Glitch text ── */
const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#@$%&";
function useGlitch(text: string, active: boolean) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  useAnimationFrame(() => {
    if (!active) return;
    frame.current++;
    if (frame.current % 3 !== 0) return;
    setDisplay(
      text.split("").map((ch, i) =>
        Math.random() < 0.1 ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : ch
      ).join("")
    );
  });
  useEffect(() => { if (!active) setDisplay(text); }, [active, text]);
  return display;
}

/* ── Particle ── */
function Particle({ i }: { i: number }) {
  const x = `${Math.random() * 100}%`;
  const delay = Math.random() * 4;
  const duration = 6 + Math.random() * 8;
  const size = 1 + Math.random() * 2;
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, left: x, bottom: 0, background: i % 3 === 0 ? "#FFE500" : "rgba(255,255,255,0.4)" }}
      animate={{ y: [0, -(300 + Math.random() * 400)], opacity: [0, 0.6, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

/* ── Scan line ── */
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none"
      style={{ background: "linear-gradient(90deg, transparent, rgba(255,229,0,0.15), transparent)" }}
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    />
  );
}

const ERROR_CODES = [
  "ERR_ROUTE_NOT_FOUND",
  "SIGSEGV — STACK OVERFLOW",
  "404 — NULL POINTER",
  "FATAL: PAGE UNMOUNTED",
];

export default function NotFound() {
  const [glitching, setGlitching] = useState(false);
  const [codeIdx, setCodeIdx] = useState(0);
  const glitchText = useGlitch("LOST.", glitching);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitching(true);
      setCodeIdx(i => (i + 1) % ERROR_CODES.length);
      setTimeout(() => setGlitching(false), 400);
    }, 3000);
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{ background: "#070708" }}>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => <Particle key={i} i={i} />)}
      </div>

      {/* Scan lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <ScanLine />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none dot-grid opacity-20" />

      {/* Giant 404 watermark — animated */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none font-display font-bold"
        style={{ fontSize: "40vw", color: "rgba(255,255,255,0.015)", letterSpacing: "-0.05em", lineHeight: 1 }}
        animate={glitching ? { x: [0, -4, 6, -2, 0], skewX: [0, -2, 1, 0] } : { x: 0, skewX: 0 }}
        transition={{ duration: 0.3 }}
      >
        404
      </motion.div>

      {/* Yellow glow at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: 600, height: 300, background: "radial-gradient(ellipse, rgba(255,229,0,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} />

      <div className="relative text-center">
        {/* Error code */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 flex items-center justify-center gap-2"
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#f43f5e" }}
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <AnimatePresence mode="wait">
            <motion.span
              key={codeIdx}
              initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              exit={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              transition={{ duration: 0.25 }}
              className="font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              {ERROR_CODES[codeIdx]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Heading with glitch */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-white mb-4 leading-none cursor-default select-none"
          style={{ fontSize: "clamp(80px, 14vw, 180px)", letterSpacing: "-0.05em" }}
          onMouseEnter={() => { setGlitching(true); setTimeout(() => setGlitching(false), 600); }}
        >
          <motion.span
            animate={glitching ? {
              color: ["#fff", "#FFE500", "#f43f5e", "#fff"],
              textShadow: ["none", "0 0 20px rgba(255,229,0,0.8)", "0 0 20px rgba(244,63,94,0.8)", "none"],
            } : {}}
            transition={{ duration: 0.3 }}
          >
            {glitchText}
          </motion.span>
        </motion.h1>

        {/* Subtext */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="font-mono text-xs mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>
            The page you're looking for doesn't exist in the system.
          </div>
          <div className="font-mono text-[10px] mb-10" style={{ color: "rgba(255,255,255,0.12)" }}>
            → Try navigating back or check the URL for typos.
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-wide px-8 py-4 transition-all"
              style={{ background: "#FFE500", color: "#000" }}
            >
              ← Return Home
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide px-8 py-4 transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
            >
              Dashboard →
            </Link>
          </motion.div>
        </motion.div>

        {/* Decorative grid lines */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 w-full max-w-sm mx-auto h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", transformOrigin: "center" }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-4 font-mono text-[9px] uppercase tracking-[0.3em]"
          style={{ color: "rgba(255,255,255,0.1)" }}
        >
          Directioner · v2 · 2026
        </motion.div>
      </div>
    </div>
  );
}

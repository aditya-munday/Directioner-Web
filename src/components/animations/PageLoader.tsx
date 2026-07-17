/**
 * Morningstar.ventures-inspired page loader.
 * Shows once per session: letters stagger in, counter counts to 100,
 * then the entire panel slides upward (curtain lift) to reveal the page.
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "directioner_loaded_v2";

export function PageLoader() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem(STORAGE_KEY));
  const [count, setCount] = useState(0);
  const [reveal, setReveal] = useState(false);

  const finish = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setVisible(false), 950);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const DURATION = 1700;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 2.8);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setCount(100);
        setTimeout(() => {
          setReveal(true);
          finish();
        }, 320);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, finish]);

  if (!visible) return null;

  const letters = "DIRECTIONER".split("");

  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
        style={{ background: "#070708" }}
        animate={reveal ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />

        {/* Top-left label */}
        <motion.div
          className="absolute top-7 left-8 font-mono text-[9px] uppercase tracking-[0.35em]"
          style={{ color: "rgba(255,255,255,0.12)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Loading
        </motion.div>

        {/* Top-right version */}
        <motion.div
          className="absolute top-7 right-8 font-mono text-[9px] uppercase tracking-[0.25em]"
          style={{ color: "rgba(255,255,255,0.12)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          GPT-4o · V2
        </motion.div>

        {/* Letter stagger */}
        <div className="flex items-center gap-[0.02em]">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              className="font-display font-bold text-white"
              style={{ fontSize: "clamp(32px, 5vw, 68px)", letterSpacing: "0.15em" }}
              initial={{ y: 50, opacity: 0, filter: "blur(8px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.65,
                delay: 0.1 + i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          className="font-mono text-[9px] uppercase tracking-[0.45em] mt-6"
          style={{ color: "rgba(255,255,255,0.18)" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Production-grade AI for Discord
        </motion.p>

        {/* Yellow accent dot */}
        <motion.div
          className="mt-10 w-1.5 h-1.5 rounded-full bg-primary"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0.5], scale: [0, 1, 1] }}
          transition={{ delay: 0.8, duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Progress bar at bottom */}
        <div
          className="absolute bottom-10 left-8 right-8"
          style={{ height: "1px", background: "rgba(255,255,255,0.05)" }}
        >
          <motion.div
            className="h-full bg-primary origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: count / 100 }}
            transition={{ ease: "linear", duration: 0.05 }}
            style={{ transformOrigin: "left" }}
          />
        </div>

        {/* Counter */}
        <motion.div
          className="absolute bottom-[52px] left-8 font-mono text-[9px] tabular-nums"
          style={{ color: "rgba(255,255,255,0.2)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {String(count).padStart(3, "0")}
        </motion.div>

        {/* Right: percentage */}
        <motion.div
          className="absolute bottom-[52px] right-8 font-mono text-[9px] tabular-nums"
          style={{ color: "rgba(255,255,255,0.2)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {count}%
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

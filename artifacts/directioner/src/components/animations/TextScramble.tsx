/**
 * Text scramble effect — characters cycle through random glyphs before
 * settling on the real character. Triggers when element enters viewport.
 * Inspired by deeo.studio / cyberpunk HUD aesthetics.
 */
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>/\\|[]{}";

function scramble(text: string, progress: number): string {
  return text
    .split("")
    .map((char, i) => {
      if (char === " ") return " ";
      const revealAt = i / Math.max(text.replace(/ /g, "").length, 1);
      if (progress > revealAt + 0.08) return char;
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    })
    .join("");
}

export function TextScramble({
  text,
  className,
  delay = 0,
  duration = 1.0,
  tag = "span",
  trigger,
  style,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  tag?: React.ElementType;
  trigger?: boolean;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  const active = trigger !== undefined ? trigger : inView;

  const [displayed, setDisplayed] = useState(() =>
    text
      .split("")
      .map((c) => (c === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
      .join("")
  );
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active || done) return;

    const DELAY_MS = delay * 1000;
    const DURATION_MS = duration * 1000;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - start - DELAY_MS;
      if (elapsed < 0) { raf = requestAnimationFrame(tick); return; }
      const t = Math.min(elapsed / DURATION_MS, 1);
      setDisplayed(scramble(text, t));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplayed(text);
        setDone(true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, text, delay, duration, done]);

  const Tag = tag as React.ElementType;

  return (
    <Tag
      ref={ref}
      className={className}
      aria-label={text}
      style={{ fontVariantNumeric: "tabular-nums", ...style }}
    >
      {displayed}
    </Tag>
  );
}

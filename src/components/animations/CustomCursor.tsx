/**
 * Premium custom cursor — inspired by cp-agency.eu and deeo.studio.
 * Small dot that follows instantly + larger ring with spring physics.
 * Ring expands and shifts to yellow on hoverable elements.
 * Automatically skips on touch/mobile devices.
 */
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hidden, setHidden] = useState(true);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Ring follows with spring lag
  const ringX = useSpring(mouseX, { stiffness: 130, damping: 20, mass: 0.08 });
  const ringY = useSpring(mouseY, { stiffness: 130, damping: 20, mass: 0.08 });

  useEffect(() => {
    // Skip on touch-primary devices
    if (window.matchMedia("(hover: none)").matches) return;
    setMounted(true);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setHidden(false);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]'
      );
      setHovered(!!interactive);
    };

    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    // Hide native cursor
    document.body.style.cursor = "none";
    // Also hide cursor on all child elements that might override
    const style = document.createElement("style");
    style.id = "custom-cursor-style";
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.getElementById("custom-cursor-style")?.remove();
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <>
      {/* Dot — snappy, mix-blend-mode difference for inversion effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
        }}
        animate={{
          width: clicking ? 4 : hovered ? 12 : 7,
          height: clicking ? 4 : hovered ? 12 : 7,
          backgroundColor: hovered ? "#FFE500" : "#ffffff",
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      />

      {/* Ring — spring lag, expands on hover */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: clicking ? 20 : hovered ? 54 : 34,
          height: clicking ? 20 : hovered ? 54 : 34,
          borderColor: hovered
            ? "rgba(255,229,0,0.75)"
            : "rgba(255,255,255,0.28)",
          backgroundColor: hovered
            ? "rgba(255,229,0,0.07)"
            : "transparent",
          opacity: hidden ? 0 : 0.9,
          scale: clicking ? 0.85 : 1,
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Outer subtle glow ring — only visible on hover */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9996] rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          border: "1px solid rgba(255,229,0,0.18)",
        }}
        animate={{
          width: hovered ? 76 : 0,
          height: hovered ? 76 : 0,
          opacity: hovered && !hidden ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  );
}

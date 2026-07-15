/**
 * ClipReveal — reveals content via clip-path animation instead of
 * a plain y-translate fade. More dramatic for section entries.
 * Inspired by cp-agency.eu / deeo.studio entrance animations.
 */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Direction = "up" | "down" | "left" | "right";

function getClipPath(dir: Direction, hidden: boolean) {
  if (!hidden) return "inset(0% 0% 0% 0%)";
  switch (dir) {
    case "up":    return "inset(100% 0% 0% 0%)";
    case "down":  return "inset(0% 0% 100% 0%)";
    case "left":  return "inset(0% 100% 0% 0%)";
    case "right": return "inset(0% 0% 0% 100%)";
  }
}

export function ClipReveal({
  children,
  className,
  delay = 0,
  duration = 0.75,
  direction = "up",
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: Direction;
  once?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: getClipPath(direction, true) }}
      animate={{ clipPath: inView ? getClipPath(direction, false) : getClipPath(direction, true) }}
      transition={{ duration, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerClip — reveals multiple children one by one with clip-path.
 */
export function StaggerClip({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode[];
  className?: string;
  stagger?: number;
  delay?: number;
  direction?: Direction;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ clipPath: getClipPath(direction, true), opacity: 0 }}
          animate={{
            clipPath: inView ? getClipPath(direction, false) : getClipPath(direction, true),
            opacity: inView ? 1 : 0,
          }}
          transition={{
            duration: 0.7,
            delay: delay + i * stagger,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

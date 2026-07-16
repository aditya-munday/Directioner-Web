/**
 * BorderBeam — an animated glow that sweeps around the card border.
 * Add as a child or sibling inside a `position: relative` container.
 * Inspired by premium SaaS card treatments (deeo.studio, noon.ai).
 */
import { motion } from "framer-motion";

interface BorderBeamProps {
  /** Duration of one sweep cycle in seconds */
  duration?: number;
  /** Width of the beam glow */
  size?: number;
  /** Color of the beam */
  color?: string;
  /** Delay before animation starts */
  delay?: number;
  className?: string;
}

export function BorderBeam({
  duration = 4,
  size = 120,
  color = "#FFE500",
  delay = 0,
  className = "",
}: BorderBeamProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] ${className}`}
    >
      {/* Top beam sweep */}
      <motion.div
        className="absolute top-0 left-0"
        style={{
          height: "1px",
          width: size,
          background: `linear-gradient(90deg, transparent, ${color}90, transparent)`,
          filter: `blur(1px)`,
        }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: duration * 0.5,
        }}
      />
      {/* Right beam sweep */}
      <motion.div
        className="absolute top-0 right-0"
        style={{
          width: "1px",
          height: size,
          background: `linear-gradient(180deg, transparent, ${color}60, transparent)`,
          filter: `blur(1px)`,
        }}
        animate={{ y: ["-100%", "200%"] }}
        transition={{
          duration: duration * 1.2,
          delay: delay + duration * 0.25,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: duration * 0.5,
        }}
      />
      {/* Bottom beam sweep */}
      <motion.div
        className="absolute bottom-0 right-0"
        style={{
          height: "1px",
          width: size,
          background: `linear-gradient(270deg, transparent, ${color}60, transparent)`,
          filter: `blur(1px)`,
        }}
        animate={{ x: ["100%", "-200%"] }}
        transition={{
          duration,
          delay: delay + duration * 0.5,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: duration * 0.5,
        }}
      />
      {/* Left beam sweep */}
      <motion.div
        className="absolute bottom-0 left-0"
        style={{
          width: "1px",
          height: size,
          background: `linear-gradient(0deg, transparent, ${color}40, transparent)`,
          filter: `blur(1px)`,
        }}
        animate={{ y: ["100%", "-200%"] }}
        transition={{
          duration: duration * 1.2,
          delay: delay + duration * 0.75,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: duration * 0.5,
        }}
      />
    </div>
  );
}

/**
 * Convenience wrapper — adds BorderBeam to any card.
 * Wrap your card content with this instead of adding BorderBeam manually.
 */
export function WithBeam({
  children,
  className = "",
  beamColor,
  beamDuration,
  beamDelay,
}: {
  children: React.ReactNode;
  className?: string;
  beamColor?: string;
  beamDuration?: number;
  beamDelay?: number;
}) {
  return (
    <div className={`relative ${className}`}>
      <BorderBeam color={beamColor} duration={beamDuration} delay={beamDelay} />
      {children}
    </div>
  );
}

/**
 * 3D perspective tilt card — mouse position drives rotateX/Y.
 * A dynamic glow follows the cursor inside the card.
 * Inspired by lapz.io / deeo.studio card interactions.
 */
import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glowColor?: string;
  /** If true, wraps children in a relative container for the glow overlay */
  showGlow?: boolean;
}

export function TiltCard({
  children,
  className = "",
  intensity = 7,
  glowColor = "rgba(255,229,0,0.07)",
  showGlow = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;   // 0→1 left→right
    const ny = (e.clientY - rect.top) / rect.height;   // 0→1 top→bottom
    setTilt({
      rx: (ny - 0.5) * -intensity * 2,  // negative so tilt feels natural
      ry: (nx - 0.5) * intensity * 2,
      gx: nx * 100,
      gy: ny * 100,
      active: true,
    });
  };

  const onLeave = () => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
      transition={{ type: "spring", stiffness: 220, damping: 28, mass: 0.08 }}
      style={{ transformStyle: "preserve-3d", perspective: 900 }}
    >
      {showGlow && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, ${glowColor}, transparent 65%)`,
            opacity: tilt.active ? 1 : 0,
            zIndex: 1,
          }}
        />
      )}
      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </motion.div>
  );
}

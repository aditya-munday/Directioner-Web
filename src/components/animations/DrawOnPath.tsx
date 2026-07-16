import { motion } from "framer-motion";

export function DrawOnPath({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {/* We expect SVG elements inside to pick up these context variants if they use variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }} */}
      {children}
    </motion.div>
  );
}

import { motion } from "framer-motion";
import React from "react";

export function StaggeredGrid({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

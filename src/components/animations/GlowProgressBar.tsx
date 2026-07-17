import { motion } from "framer-motion";

export function GlowProgressBar({ percentage }: { percentage: number }) {
  // Determine color based on percentage
  let color = "bg-primary";
  if (percentage > 70) color = "bg-orange-500";
  if (percentage > 90) color = "bg-red-500";

  return (
    <div className="w-full h-2 bg-background border border-border overflow-hidden relative">
      <motion.div 
        className={`h-full ${color}`} 
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}

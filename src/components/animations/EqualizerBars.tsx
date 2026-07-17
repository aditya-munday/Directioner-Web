import { cn } from "@/lib/utils";

export function EqualizerBars({ className, active = true }: { className?: string, active?: boolean }) {
  return (
    <div className={cn("flex items-end gap-[2px] h-4", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i} 
          className={cn("w-1 rounded-sm", i % 2 === 0 ? "bg-accent" : "bg-primary")}
          style={{
            height: '20%',
            animation: active ? `eq-bounce 0.${5+i}s ease infinite alternate` : 'none',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
      <style>{`
        @keyframes eq-bounce {
          0% { height: 20%; }
          100% { height: 100%; }
        }
      `}</style>
    </div>
  );
}

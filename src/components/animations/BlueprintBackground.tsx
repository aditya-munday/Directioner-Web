import { cn } from "@/lib/utils";

export function BlueprintBackground({ className, children }: { className?: string, children?: React.ReactNode }) {
  return (
    <div className={cn("relative overflow-hidden bg-blueprint text-blueprint-foreground border border-white/10", className)}>
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 245, 160, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 160, 0.5) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          animation: 'blueprint-pan 8s ease-in-out infinite alternate'
        }}
      />
      <div className="relative z-10">{children}</div>
      <style>{`
        @keyframes blueprint-pan {
          from { transform: translate(0, 0); }
          to { transform: translate(-15px, -15px); }
        }
      `}</style>
    </div>
  );
}

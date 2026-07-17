import { cn } from "@/lib/utils";

export function BlueprintScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="w-full h-[1px] bg-primary/40 shadow-[0_0_8px_rgba(255,229,0,0.8)]"
        style={{ animation: 'scanline 3s linear infinite' }}
      />
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(800px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

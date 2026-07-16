import { cn } from "@/lib/utils";

export function OscilloscopeWave({ className, color = "currentColor", amplitude = 40, frequency = 4, speed = 2, opacity = 1 }: { className?: string, color?: string, amplitude?: number, frequency?: number, speed?: number, opacity?: number }) {
  return (
    <div className={cn("relative w-full h-40 overflow-hidden", className)} style={{ opacity }}>
      <svg className="absolute w-[200%] h-full top-0 left-0" style={{ animation: `wave-slide ${speed}s linear infinite` }} viewBox="0 0 2400 160" preserveAspectRatio="none">
        <path 
          d={`M0 80 Q ${300/frequency} ${80-amplitude}, ${600/frequency} 80 T ${1200/frequency} 80 T ${1800/frequency} 80 T ${2400/frequency} 80 T 3000 80`}
          fill="none" 
          stroke={color} 
          strokeWidth="2"
          className="opacity-50"
          strokeDasharray="4 4"
        />
        <path 
          d={`M0 80 Q ${300/frequency} ${80+amplitude}, ${600/frequency} 80 T ${1200/frequency} 80 T ${1800/frequency} 80 T ${2400/frequency} 80 T 3000 80`}
          fill="none" 
          stroke={color} 
          strokeWidth="2"
        />
      </svg>
      <style>{`
        @keyframes wave-slide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

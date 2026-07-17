import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

export function Typewriter({ text, speed = 40, prefix = "", className }: { text: string, speed?: number, prefix?: string, className?: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {prefix && <span className="text-primary">{prefix}</span>}
      {displayed}
      <span className={cn("inline-block w-2 h-4 bg-primary ml-1 align-middle", done ? "animate-pulse opacity-50" : "opacity-100")} />
    </span>
  );
}

import { useCountUp } from "@/hooks/use-count-up";

interface CountUpNumberProps {
  target: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export function CountUpNumber({ target, duration = 1.5, decimals = 0, prefix = "", suffix = "" }: CountUpNumberProps) {
  const count = useCountUp(target, duration, decimals);
  return <span>{prefix}{count}{suffix}</span>;
}

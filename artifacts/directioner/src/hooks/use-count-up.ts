import { useEffect, useState } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

export function useCountUp(target: number, duration: number = 1.5, decimals: number = 0) {
  const [count, setCount] = useState(0);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000 });

  useEffect(() => {
    motionValue.set(target);
  }, [target, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setCount(Number(latest.toFixed(decimals)));
    });
  }, [springValue, decimals]);

  return count;
}


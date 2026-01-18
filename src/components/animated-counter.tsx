"use client";

import React, { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  to: number;
  duration?: number; // seconds
  suffix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  to,
  duration = 2.5,
  suffix = "",
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true }); // ✅ inView is boolean

  useEffect(() => {
    if (!inView) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min(
        (timestamp - startTimestamp) / (duration * 2000),
        1
      );
      setCount(Math.floor(progress * to));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(to);
      }
    };

    requestAnimationFrame(step);
  }, [inView, to, duration]);

  return (
    <div ref={ref} className="text-3xl font-bold">
      {count}
      {suffix}
    </div>
  );
};

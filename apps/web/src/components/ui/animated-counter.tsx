"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
}

export function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  label,
  duration = 2.5,
}: AnimatedCounterProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div ref={ref} className="text-center group">
      <div className="text-4xl md:text-6xl font-bold text-gradient-gold mb-2 transition-transform group-hover:scale-110 duration-300">
        {inView ? (
          <>
            {prefix}
            <CountUp end={end} duration={duration} separator=" " />
            {suffix}
          </>
        ) : (
          <span className="opacity-0">0</span>
        )}
      </div>
      <div className="text-cream/50 text-sm md:text-base font-medium uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

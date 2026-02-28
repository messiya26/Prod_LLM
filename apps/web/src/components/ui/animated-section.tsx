"use client";

import { ReactNode, useRef, useEffect, useState } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: "fadeUp" | "fadeIn" | "scaleIn";
  delay?: number;
  className?: string;
}

export function AnimatedSection({
  children,
  animation = "fadeUp",
  delay = 0,
  className = "",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: "-20px", threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const baseStyle = {
    transition: `opacity 0.35s ease-out ${delay}s, transform 0.35s ease-out ${delay}s`,
  };

  const hiddenStyles: Record<string, React.CSSProperties> = {
    fadeUp: { opacity: 0, transform: "translateY(20px)" },
    fadeIn: { opacity: 0 },
    scaleIn: { opacity: 0, transform: "scale(0.97)" },
  };

  const visibleStyle: React.CSSProperties = { opacity: 1, transform: "none" };

  return (
    <div
      ref={ref}
      style={{ ...baseStyle, ...(visible ? visibleStyle : hiddenStyles[animation]) }}
      className={className}
    >
      {children}
    </div>
  );
}

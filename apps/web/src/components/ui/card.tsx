interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div
      className={`bg-navy/40 border border-cream/5 rounded-2xl p-6 backdrop-blur-sm ${hover ? "hover:border-gold/20 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

type BadgeVariant = "gold" | "navy" | "success" | "info";

const variants: Record<BadgeVariant, string> = {
  gold: "bg-gold/15 text-gold border-gold/30",
  navy: "bg-navy-light/50 text-cream/80 border-cream/10",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  info: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({
  children,
  variant = "gold",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

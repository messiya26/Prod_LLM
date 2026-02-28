interface GoldDividerProps {
  className?: string;
  width?: string;
}

export function GoldDivider({ className = "", width = "w-24" }: GoldDividerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${width} h-px bg-gradient-to-r from-transparent via-gold to-transparent`} />
    </div>
  );
}

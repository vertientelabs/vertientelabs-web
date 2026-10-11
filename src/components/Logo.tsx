type Props = { size?: number; className?: string; mono?: boolean };

/** The V: two strokes, one vertex, one solid ink (inner stroke at 42%). */
export function VMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="7 15 50 36" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 18 L32 48 L54 18" strokeWidth="4" />
      <path d="M18 18 L32 42 L46 18" strokeWidth="2.5" opacity=".42" />
    </svg>
  );
}

/** Main lockup: V + "vertiente" (Geist) + "labs" (Instrument Serif italic). */
export function Logo({ size = 24, className = "", mono = false }: Props) {
  return (
    <span className={`logo ${mono ? "logo--mono" : ""} ${className}`} style={{ "--s": `${size}px` } as React.CSSProperties} aria-label="Vertiente Labs">
      <VMark className="logo__v" />
      <span className="logo__wm" aria-hidden="true">
        vertiente<i>labs</i>
      </span>
    </span>
  );
}

interface Props { className?: string; size?: number }

export const LockInLogo = ({ className, size = 56 }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-10 -10 84 84"
    width={size}
    height={size}
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <style>{`
      @keyframes lockin-second { to { transform: rotate(360deg); } }
      @keyframes lockin-minute { to { transform: rotate(360deg); } }
      .lockin-second { transform-origin: 32px 32px; animation: lockin-second 60s linear infinite; }
      .lockin-minute { transform-origin: 32px 32px; animation: lockin-minute 1800s linear infinite; }
      @media (prefers-reduced-motion: reduce) {
        .lockin-second, .lockin-minute { animation: none; }
      }
    `}</style>
    {/* Analog clock behind the lock */}
    <g stroke="currentColor" strokeLinecap="round" opacity="0.55">
      <circle cx="32" cy="32" r="36" strokeWidth="1.5" fill="none" />
      {/* hour ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        const outer = 34;
        const inner = i % 3 === 0 ? 28 : 31;
        const x1 = 32 + Math.sin(a) * outer;
        const y1 = 32 - Math.cos(a) * outer;
        const x2 = 32 + Math.sin(a) * inner;
        const y2 = 32 - Math.cos(a) * inner;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 3 === 0 ? 2 : 1} />;
      })}
    </g>
    {/* Slow rotating minute hand (very subtle) */}
    <g className="lockin-minute" stroke="currentColor" strokeLinecap="round" opacity="0.45">
      <line x1="32" y1="32" x2="32" y2="8" strokeWidth="1.25" />
    </g>
    {/* Sweeping second hand */}
    <g className="lockin-second" stroke="currentColor" strokeLinecap="round" opacity="0.6">
      <line x1="32" y1="34" x2="32" y2="4" strokeWidth="0.9" />
    </g>
    {/* Shackle */}
    <path
      d="M20 28v-7a12 12 0 0 1 24 0v7"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
    {/* Lock body */}
    <rect
      x="13"
      y="28"
      width="38"
      height="30"
      rx="6"
      fill="currentColor"
    />
    {/* Barbell across the body */}
    <g stroke="hsl(var(--primary-foreground))" strokeLinecap="round">
      <line x1="22" y1="43" x2="42" y2="43" strokeWidth="3" />
      <line x1="20" y1="40" x2="20" y2="46" strokeWidth="5" />
      <line x1="44" y1="40" x2="44" y2="46" strokeWidth="5" />
      <line x1="17" y1="41.5" x2="17" y2="44.5" strokeWidth="3" />
      <line x1="47" y1="41.5" x2="47" y2="44.5" strokeWidth="3" />
    </g>
  </svg>
);
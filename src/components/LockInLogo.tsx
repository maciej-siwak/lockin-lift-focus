interface Props { className?: string; size?: number }

export const LockInLogo = ({ className, size = 56 }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-26 -26 116 116"
    width={size}
    height={size}
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <style>{`
      @keyframes lockin-second { to { transform: rotate(360deg); } }
      @keyframes lockin-minute { to { transform: rotate(360deg); } }
      @keyframes lockin-glow { 0%,100% { opacity: .55; } 50% { opacity: .9; } }
      .lockin-second { transform-origin: 32px 32px; animation: lockin-second 60s linear infinite; }
      .lockin-minute { transform-origin: 32px 32px; animation: lockin-minute 1800s linear infinite; }
      .lockin-glow { animation: lockin-glow 4s ease-in-out infinite; transform-origin: 32px 32px; }
      @media (prefers-reduced-motion: reduce) {
        .lockin-second, .lockin-minute, .lockin-glow { animation: none; }
      }
    `}</style>
    <defs>
      <radialGradient id="lockin-face" cx="50%" cy="40%" r="65%">
        <stop offset="0%" stopColor="hsl(var(--primary) / 0.18)" />
        <stop offset="70%" stopColor="hsl(var(--primary) / 0.04)" />
        <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
      </radialGradient>
      <linearGradient id="lockin-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(var(--primary))" />
        <stop offset="100%" stopColor="hsl(140 80% 45%)" />
      </linearGradient>
    </defs>
    {/* Soft halo */}
      <circle cx="32" cy="32" r="52" fill="url(#lockin-face)" className="lockin-glow" />
    {/* Analog clock behind the lock */}
    <g stroke="hsl(var(--primary))" strokeLinecap="round" opacity="0.7">
      <circle cx="32" cy="32" r="50" strokeWidth="1.25" fill="none" opacity="0.35" />
      <circle cx="32" cy="32" r="48" strokeWidth="1.75" fill="none" />
      {/* hour ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        const outer = 46;
        const inner = i % 3 === 0 ? 38 : 42;
        const x1 = 32 + Math.sin(a) * outer;
        const y1 = 32 - Math.cos(a) * outer;
        const x2 = 32 + Math.sin(a) * inner;
        const y2 = 32 - Math.cos(a) * inner;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 3 === 0 ? 2.25 : 1} />;
      })}
    </g>
    {/* Slow rotating minute hand (very subtle) */}
    <g className="lockin-minute" stroke="hsl(var(--primary))" strokeLinecap="round" opacity="0.55">
      <line x1="32" y1="32" x2="32" y2="-4" strokeWidth="1.5" />
    </g>
    {/* Sweeping second hand */}
    <g className="lockin-second" stroke="hsl(var(--primary))" strokeLinecap="round" opacity="0.75">
      <line x1="32" y1="36" x2="32" y2="-9" strokeWidth="1" />
      <circle cx="32" cy="32" r="1.6" fill="hsl(var(--primary))" />
    </g>
    {/* Shackle */}
    <path
      d="M20 28v-7a12 12 0 0 1 24 0v7"
      stroke="hsl(var(--primary))"
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
      fill="url(#lockin-body)"
    />
    {/* Barbell across the body */}
    <g stroke="hsl(var(--primary-foreground))" strokeLinecap="round">
      {/* bar */}
      <line x1="20" y1="43" x2="44" y2="43" strokeWidth="2.5" />
      {/* inner plates */}
      <line x1="22" y1="37" x2="22" y2="49" strokeWidth="5" />
      <line x1="42" y1="37" x2="42" y2="49" strokeWidth="5" />
      {/* outer plates */}
      <line x1="18" y1="39" x2="18" y2="47" strokeWidth="4" />
      <line x1="46" y1="39" x2="46" y2="47" strokeWidth="4" />
      {/* end caps */}
      <line x1="15" y1="41.5" x2="15" y2="44.5" strokeWidth="2.5" />
      <line x1="49" y1="41.5" x2="49" y2="44.5" strokeWidth="2.5" />
    </g>
  </svg>
);
interface Props { className?: string; size?: number }

export const LockInLogo = ({ className, size = 56 }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-8 -16 80 88"
    width={size}
    height={size}
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <style>{`
      @keyframes lockin-second { to { transform: rotate(360deg); } }
      @keyframes lockin-minute { to { transform: rotate(360deg); } }
      @keyframes lockin-hour { to { transform: rotate(360deg); } }
      .lockin-second { transform-origin: 32px 32px; animation: lockin-second 60s linear infinite; }
      .lockin-minute { transform-origin: 32px 32px; animation: lockin-minute 1800s linear infinite; }
      .lockin-hour { transform-origin: 32px 32px; animation: lockin-hour 21600s linear infinite; }
      @media (prefers-reduced-motion: reduce) {
        .lockin-second, .lockin-minute, .lockin-hour { animation: none; }
      }
    `}</style>
    <defs>
      <radialGradient id="lockin-face" cx="50%" cy="38%" r="70%">
        <stop offset="0%" stopColor="hsl(var(--card))" />
        <stop offset="100%" stopColor="hsl(0 0% 3%)" />
      </radialGradient>
      <linearGradient id="lockin-bezel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(var(--primary))" />
        <stop offset="100%" stopColor="hsl(var(--primary) / 0.65)" />
      </linearGradient>
    </defs>

    {/* Shackle — sits behind the case, becomes the watch's hinge / lock loop */}
    <path
      d="M20 14V9a12 12 0 0 1 24 0v5"
      stroke="hsl(var(--primary))"
      strokeWidth="4.25"
      strokeLinecap="round"
      fill="none"
      opacity="0.95"
    />

    {/* Watch case (outer bezel) — also the lock body */}
    <circle cx="32" cy="32" r="27" fill="url(#lockin-bezel)" />
    {/* Inner case ring */}
    <circle cx="32" cy="32" r="24.5" fill="hsl(0 0% 3%)" />
    {/* Watch face */}
    <circle cx="32" cy="32" r="22.5" fill="url(#lockin-face)" />
    {/* Subtle inner highlight */}
    <circle cx="32" cy="32" r="22.5" fill="none" stroke="hsl(var(--primary) / 0.35)" strokeWidth="0.6" />

    {/* Hour ticks on the face */}
    <g stroke="hsl(var(--primary))" strokeLinecap="round">
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        const outer = 21;
        const inner = i % 3 === 0 ? 17 : 19;
        const x1 = 32 + Math.sin(a) * outer;
        const y1 = 32 - Math.cos(a) * outer;
        const x2 = 32 + Math.sin(a) * inner;
        const y2 = 32 - Math.cos(a) * inner;
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            strokeWidth={i % 3 === 0 ? 1.6 : 0.8}
            opacity={i % 3 === 0 ? 0.95 : 0.55}
          />
        );
      })}
    </g>

    {/* Clock hands */}
    <g style={{ transform: "rotate(-60deg)", transformOrigin: "32px 32px" }}>
      <g className="lockin-hour" stroke="hsl(var(--primary))" strokeLinecap="round" opacity="0.85">
        <line x1="32" y1="34" x2="32" y2="20" strokeWidth="2.4" />
      </g>
    </g>
    <g style={{ transform: "rotate(60deg)", transformOrigin: "32px 32px" }}>
      <g className="lockin-minute" stroke="hsl(var(--primary))" strokeLinecap="round" opacity="0.7">
        <line x1="32" y1="34" x2="32" y2="14" strokeWidth="1.6" />
      </g>
    </g>
    <g className="lockin-second" stroke="hsl(var(--primary))" strokeLinecap="round" opacity="0.9">
      <line x1="32" y1="36" x2="32" y2="12" strokeWidth="0.8" />
    </g>

    {/* Barbell across the watch face — the heart of the mark */}
    <g stroke="hsl(var(--primary))" strokeLinecap="round">
      {/* bar */}
      <line x1="22" y1="32" x2="42" y2="32" strokeWidth="1.6" opacity="0.95" />
      {/* inner plates */}
      <line x1="24" y1="28" x2="24" y2="36" strokeWidth="3.6" />
      <line x1="40" y1="28" x2="40" y2="36" strokeWidth="3.6" />
      {/* outer plates */}
      <line x1="20" y1="29.5" x2="20" y2="34.5" strokeWidth="2.8" />
      <line x1="44" y1="29.5" x2="44" y2="34.5" strokeWidth="2.8" />
      {/* end caps */}
      <line x1="17.5" y1="31" x2="17.5" y2="33" strokeWidth="1.6" />
      <line x1="46.5" y1="31" x2="46.5" y2="33" strokeWidth="1.6" />
    </g>

    {/* Center pin over the barbell — like a clock pivot / lock keyhole stud */}
    <circle cx="32" cy="32" r="1.6" fill="hsl(var(--primary))" />
    <circle cx="32" cy="32" r="0.7" fill="hsl(0 0% 3%)" />
  </svg>
);
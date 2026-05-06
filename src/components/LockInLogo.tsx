interface Props { className?: string; size?: number }

export const LockInLogo = ({ className, size = 56 }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Analog clock behind the lock */}
    <g stroke="currentColor" strokeLinecap="round" opacity="0.55">
      <circle cx="32" cy="32" r="28" strokeWidth="1.5" fill="none" />
      {/* hour ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        const x1 = 32 + Math.sin(a) * 26;
        const y1 = 32 - Math.cos(a) * 26;
        const x2 = 32 + Math.sin(a) * (i % 3 === 0 ? 22 : 24);
        const y2 = 32 - Math.cos(a) * (i % 3 === 0 ? 22 : 24);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 3 === 0 ? 2 : 1} />;
      })}
    </g>
    {/* Clock hands (10:10 pose) */}
    <g stroke="currentColor" strokeLinecap="round" opacity="0.7">
      <line x1="32" y1="32" x2="22" y2="25" strokeWidth="1.75" />
      <line x1="32" y1="32" x2="42" y2="22" strokeWidth="1.75" />
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
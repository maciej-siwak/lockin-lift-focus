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
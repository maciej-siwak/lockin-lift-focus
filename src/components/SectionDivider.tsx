interface Props {
  className?: string;
}

/** Restrained editorial rule: a short gold tick leading into a hairline. */
export const SectionDivider = ({ className = "" }: Props) => (
  <div className={`flex items-center gap-2.5 ${className}`} aria-hidden="true">
    <span className="h-[2px] w-10 shrink-0 rounded-full bg-primary/70" />
    <span className="h-px flex-1 bg-primary/20" />
  </div>
);

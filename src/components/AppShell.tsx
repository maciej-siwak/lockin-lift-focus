import { ReactNode } from "react";

interface AppShellProps {
  title?: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  immersive?: boolean;
}

export const AppShell = ({ title, subtitle, left, right, children, immersive }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {!immersive && (
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="mx-auto max-w-md px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-3 flex items-center gap-3">
            <div className="min-w-10 flex justify-start shrink-0">{left}</div>
            <div className="flex-1 text-center min-w-0">
              {title && <h1 className="text-base font-semibold tracking-tight truncate">{title}</h1>}
              {subtitle && <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>}
            </div>
            <div className="min-w-10 flex justify-end shrink-0">{right}</div>
          </div>
        </header>
      )}
      <main className={immersive ? "flex-1 flex flex-col" : "flex-1 mx-auto w-full max-w-md px-5 pb-[calc(env(safe-area-inset-bottom)+2.5rem)]"}>
        {children}
      </main>
    </div>
  );
};
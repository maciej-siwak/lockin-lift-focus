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
            <div className="w-10 flex justify-start">{left}</div>
            <div className="flex-1 text-center">
              {title && <h1 className="text-base font-semibold tracking-tight">{title}</h1>}
              {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
            <div className="w-10 flex justify-end">{right}</div>
          </div>
        </header>
      )}
      <main className={immersive ? "flex-1 flex flex-col" : "flex-1 mx-auto w-full max-w-md px-5 pb-[max(env(safe-area-inset-bottom),1.5rem)]"}>
        {children}
      </main>
    </div>
  );
};
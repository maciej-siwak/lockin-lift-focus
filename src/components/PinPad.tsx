import { useState } from "react";
import { Delete } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  expectedCode: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const PinPad = ({ title, subtitle, expectedCode, onSuccess, onCancel }: Props) => {
  const [entry, setEntry] = useState("");
  const [error, setError] = useState(false);

  const press = (n: string) => {
    setError(false);
    setEntry(prev => {
      const next = (prev + n).slice(0, expectedCode.length);
      if (next.length === expectedCode.length) {
        setTimeout(() => {
          if (next === expectedCode) onSuccess();
          else { setError(true); setEntry(""); navigator.vibrate?.(200); }
        }, 100);
      }
      return next;
    });
  };
  const back = () => setEntry(p => p.slice(0, -1));

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs">{subtitle}</p>}

      <div className={`mt-8 flex gap-3 ${error ? "animate-pulse" : ""}`}>
        {Array.from({ length: expectedCode.length }).map((_, i) => (
          <span key={i}
            className={`w-3.5 h-3.5 rounded-full transition-base ${
              i < entry.length ? (error ? "bg-destructive" : "bg-primary") : "bg-secondary"
            }`}
          />
        ))}
      </div>
      {error && <p className="mt-3 text-sm text-destructive">Wrong code. Try again.</p>}

      <div className="mt-10 grid grid-cols-3 gap-3 w-full max-w-xs">
        {["1","2","3","4","5","6","7","8","9"].map(n => (
          <button key={n} onClick={() => press(n)} className="h-16 rounded-2xl bg-card border border-border text-2xl font-mono-timer font-bold active:bg-secondary transition-base">{n}</button>
        ))}
        <button onClick={onCancel} className="h-16 rounded-2xl text-sm font-semibold text-muted-foreground active:bg-secondary transition-base">{onCancel ? "Cancel" : ""}</button>
        <button onClick={() => press("0")} className="h-16 rounded-2xl bg-card border border-border text-2xl font-mono-timer font-bold active:bg-secondary transition-base">0</button>
        <button onClick={back} aria-label="Backspace" className="h-16 rounded-2xl flex items-center justify-center text-muted-foreground active:bg-secondary transition-base"><Delete className="w-6 h-6" /></button>
      </div>
    </div>
  );
};
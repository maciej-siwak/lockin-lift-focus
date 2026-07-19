import { useEffect, useState } from "react";
import { Lock, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LockInLogo } from "./LockInLogo";
import {
  FREE_SESSION_LIMIT,
  completedSessionCount,
  getUnlockPrice,
  initPurchases,
  isUnlocked,
  onUnlockChange,
  purchaseUnlock,
  restorePurchases,
  shouldLock,
} from "@/lib/purchase";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/lib/i18n";

interface Props { children: React.ReactNode }

export const UnlockGate = ({ children }: Props) => {
  const t = useT();
  const [locked, setLocked] = useState<boolean>(shouldLock());
  const [busy, setBusy] = useState(false);
  const [, force] = useState(0);
  const sessions = completedSessionCount();
  const remaining = Math.max(0, FREE_SESSION_LIMIT - sessions);

  useEffect(() => {
    initPurchases();
    const off = onUnlockChange((u) => {
      setLocked(!u && completedSessionCount() >= FREE_SESSION_LIMIT);
      force((x) => x + 1);
    });
    // Re-evaluate on focus (e.g. after finishing a session in another view).
    const onFocus = () => setLocked(shouldLock());
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      off();
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  // Poll lightly so lock kicks in right after a session save without needing focus.
  useEffect(() => {
    if (locked || isUnlocked()) return;
    const id = setInterval(() => setLocked(shouldLock()), 2000);
    return () => clearInterval(id);
  }, [locked]);

  const handleBuy = async () => {
    setBusy(true);
    const res = await purchaseUnlock();
    setBusy(false);
    if (!res.ok) toast({ title: t("unlock.purchaseFail"), description: res.error });
  };

  const handleRestore = async () => {
    setBusy(true);
    await restorePurchases();
    setBusy(false);
    if (!isUnlocked()) toast({ title: t("unlock.noPurchase"), description: t("unlock.noPurchaseDesc") });
  };

  if (!locked) return <>{children}</>;

  const price = getUnlockPrice();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md flex flex-col items-center animate-fade-in">
        <div className="relative">
          <LockInLogo size={96} className="text-primary" />
          <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-glow">
            <Lock className="w-5 h-5" strokeWidth={2.75} />
          </div>
        </div>

        <p className="mt-6 text-[10px] font-bold text-primary tracking-[0.3em] uppercase">
          {t("unlock.trialComplete")}
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-center leading-tight">
          {t("unlock.crushedBefore")}<span className="text-primary">{sessions}</span>{t("unlock.crushedAfter")}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground text-center max-w-xs">
          {t("unlock.pitchBefore")}<span className="font-semibold text-foreground">Lock In</span>{t("unlock.pitchAfter")}
        </p>

        <div className="mt-8 w-full rounded-3xl border-2 border-primary/60 bg-card/60 p-5 shadow-glow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/15 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold leading-tight">Lock In — {t("unlock.fullAccessSuffix")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t("unlock.oneTime")}</p>
            </div>
            {price && (
              <span className="text-sm font-bold text-primary tabular-nums">{price}</span>
            )}
          </div>

          <ul className="mt-4 space-y-2 text-sm">
            {[
              t("unlock.feature1"),
              t("unlock.feature2"),
              t("unlock.feature3"),
            ].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-foreground/90">{f}</span>
              </li>
            ))}
          </ul>

          <Button
            onClick={handleBuy}
            disabled={busy}
            className="mt-5 w-full h-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-glow"
          >
            {busy ? t("unlock.wait") : price ? t("unlock.unlockFor", { price }) : t("unlock.unlockFull")}
          </Button>

          <button
            onClick={handleRestore}
            disabled={busy}
            className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-base"
          >
            <RotateCcw className="w-3.5 h-3.5" /> {t("unlock.restore")}
          </button>
        </div>

        <p className="mt-6 text-[11px] text-muted-foreground text-center max-w-xs leading-relaxed">
          {remaining === 0
            ? t("unlock.usedAll")
            : t("unlock.free", { n: remaining })}
        </p>
      </div>
    </div>
  );
};
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Trophy, Share2, Dumbbell, Eye, Flame, Sparkles } from "lucide-react";
import { AppShell } from "./AppShell";
import { storage } from "@/lib/storage";
import type { SessionLog, SetLog } from "@/lib/types";
import { toast } from "sonner";
import { useT } from "@/lib/i18n";

type ExMode = "weight_reps" | "reps" | "time";

const setMode = (s: SetLog): ExMode => {
  if ((s.seconds ?? 0) > 0 && s.weight === 0 && s.reps === 0) return "time";
  if (s.weight === 0 && s.reps > 0) return "reps";
  return "weight_reps";
};

const formatSet = (s: SetLog, unit: string): string => {
  const m = setMode(s);
  if (m === "time") return `${s.seconds}s`;
  if (m === "reps") return `${s.reps} reps`;
  return `${s.weight}${unit} × ${s.reps} reps`;
};

interface Props { onBack: () => void; }

export const Records = ({ onBack }: Props) => {
  const t = useT();
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const unit = useMemo(() => storage.getSettings().weightUnit, []);

  useEffect(() => { setSessions(storage.getSessions()); }, []);

  // Focus stats: best (lowest focus breaks in a session) + current/best streak of 0-break sessions
  const focusStats = useMemo(() => {
    const withFocus = sessions.filter(s => s.focusBreaks != null);
    if (withFocus.length === 0) return null;
    const fullFocusCount = withFocus.filter(s => s.focusBreaks === 0).length;
    // sessions are stored newest-first; iterate chronologically for streaks
    const chrono = [...withFocus].sort((a, b) => a.startedAt - b.startedAt);
    let best = 0, run = 0, current = 0;
    for (const s of chrono) {
      if (s.focusBreaks === 0) { run++; if (run > best) best = run; }
      else run = 0;
    }
    // current streak = trailing run from most recent
    for (let i = chrono.length - 1; i >= 0; i--) {
      if (chrono[i].focusBreaks === 0) current++;
      else break;
    }
    return { fullFocusCount, best, current, totalTracked: withFocus.length };
  }, [sessions]);

  const topByExercise = useMemo(() => {
    const map: Record<string, SetLog[]> = {};
    for (const s of sessions) {
      for (const ex of s.exercises) {
        const key = ex.exerciseName.toLowerCase();
        if (!map[key]) map[key] = [];
        for (const set of ex.sets) {
          if (set.weight > 0 && set.reps > 0) map[key].push(set);
          else if (set.weight === 0 && set.reps > 0) map[key].push(set);
          else if ((set.seconds ?? 0) > 0) map[key].push(set);
        }
      }
    }
    const out: Array<{ key: string; mode: ExMode; sets: SetLog[] }> = [];
    for (const [key, sets] of Object.entries(map)) {
      // Determine the dominant mode for this exercise (most recent set wins ties)
      const mode = setMode(sets[sets.length - 1]);
      const filtered = sets.filter(s => setMode(s) === mode);
      const top = [...filtered]
        .sort((a, b) => {
          if (mode === "time") return (b.seconds ?? 0) - (a.seconds ?? 0);
          if (mode === "reps") return b.reps - a.reps;
          return (b.weight - a.weight) || (b.reps - a.reps);
        })
        .slice(0, 3);
      if (top.length > 0) out.push({ key, mode, sets: top });
    }
    return out;
  }, [sessions]);

  const displayName = useMemo(() => {
    const m: Record<string, string> = {};
    for (const s of sessions) for (const e of s.exercises) {
      const k = e.exerciseName.toLowerCase();
      if (!m[k]) m[k] = e.exerciseName;
    }
    return m;
  }, [sessions]);

  const sharePRs = async () => {
    if (topByExercise.length === 0) {
      toast(t("records.noRecords"));
      return;
    }
    const lines: string[] = [`🏆 Top Records — Lock In`, ""];
    for (const { key, sets } of topByExercise) {
      lines.push(displayName[key] ?? key);
      sets.forEach((set, i) => {
        lines.push(`${i + 1}. ${formatSet(set, unit)}`);
      });
      lines.push("");
    }
    try {
      await navigator.clipboard.writeText(lines.join("\n").trimEnd());
      toast(t("records.copied"));
    } catch {
      toast(t("common.copyFail"));
    }
  };

  const shareFocus = async () => {
    if (!focusStats) return;
    const lines = [
      `🎯 Focus records — Lock In`,
      ``,
      `Full focus sessions: ${focusStats.fullFocusCount}`,
      `Best streak: ${focusStats.best}`,
      `Current streak: ${focusStats.current}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast(t("records.focusCopied"));
    } catch {
      toast(t("common.copyFail"));
    }
  };

  const shareExercise = async (key: string, sets: SetLog[]) => {
    const name = displayName[key] ?? key;
    const lines = [
      `🏆 ${name} — Top Records`,
      ...sets.map((set, i) => `${i + 1}. ${formatSet(set, unit)}`),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast(t("records.exCopied", { name }));
    } catch {
      toast(t("common.copyFail"));
    }
  };

  return (
    <AppShell
      title={t("records.title")}
      left={<button onClick={onBack} aria-label={t("common.back")} className="p-2 -ml-2"><ArrowLeft className="w-5 h-5" /></button>}
      right={
        topByExercise.length > 0 ? (
          <button onClick={sharePRs} aria-label={t("records.shareRecords")} className="p-2 -mr-2 text-muted-foreground hover:text-primary transition-base">
            <Share2 className="w-5 h-5" />
          </button>
        ) : undefined
      }
    >
      <div className="pt-5">
        {focusStats && (
          <section className="rounded-2xl bg-gradient-dark border border-border p-4 shadow-card mb-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t("records.focusRecords")}</h3>
              </div>
              <button
                onClick={shareFocus}
                aria-label={t("records.focusRecords")}
                className="p-1.5 -mr-1 text-muted-foreground hover:text-primary transition-base"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <FocusStat label={t("records.fullFocus")} value={focusStats.fullFocusCount} icon={<Eye className="w-3 h-3" />} />
              <FocusStat label={t("records.bestStreak")} value={focusStats.best} icon={<Flame className="w-3 h-3" />} />
              <FocusStat
                label={t("records.currentStreak")}
                value={focusStats.current}
                icon={<Flame className="w-3 h-3" />}
                tone={focusStats.current > 10 ? "gold" : focusStats.current > 5 ? "orange" : undefined}
              />
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground text-center">
              {t("records.streakDesc")}
            </p>
          </section>
        )}
        {topByExercise.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/80 p-10 text-center bg-card/40">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <p className="mt-4 text-base font-semibold">{t("records.empty")}</p>
            <p className="mt-1.5 text-xs text-muted-foreground max-w-[16rem] mx-auto leading-relaxed">
              Your top 3 lifts per exercise will appear here as you train.
            </p>
          </div>
        ) : (
          <section className="rounded-2xl bg-gradient-dark border border-border p-4 shadow-card">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t("records.top3")}</h3>
            </div>
            <ul className="mt-3 space-y-3">
              {topByExercise.map(({ key, mode, sets }) => (
                <li key={key} className="rounded-xl bg-card border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold truncate flex-1">{displayName[key] ?? key}</p>
                    <button
                      onClick={() => shareExercise(key, sets)}
                      aria-label={t("common.share")}
                      className="p-1.5 -mr-1 text-muted-foreground hover:text-primary transition-base shrink-0"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <ol className="mt-2 space-y-1">
                    {sets.map((set, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <span className="w-5 text-center shrink-0 font-mono-timer text-xs font-bold text-primary">
                          {i + 1}.
                        </span>
                        {mode === "weight_reps" && (
                          <>
                            <span className="font-mono-timer font-bold text-foreground">{set.weight}{unit}</span>
                            <span className="text-muted-foreground">×</span>
                            <span className="font-mono-timer text-foreground">{set.reps} {t("session.repsLabel")}</span>
                          </>
                        )}
                        {mode === "reps" && (
                          <span className="font-mono-timer font-bold text-foreground">{set.reps} {t("session.repsLabel")}</span>
                        )}
                        {mode === "time" && (
                          <span className="font-mono-timer font-bold text-foreground">{set.seconds}s</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </AppShell>
  );
};

const FocusStat = ({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  tone?: "orange" | "gold";
}) => {
  const toneClass =
    tone === "gold"
      ? "text-[hsl(45_95%_58%)] drop-shadow-[0_0_8px_hsl(45_95%_58%/0.55)]"
      : tone === "orange"
      ? "text-[hsl(22_95%_58%)] drop-shadow-[0_0_8px_hsl(22_95%_58%/0.45)]"
      : "";
  const borderClass =
    tone === "gold"
      ? "border-[hsl(45_95%_58%/0.5)]"
      : tone === "orange"
      ? "border-[hsl(22_95%_58%/0.5)]"
      : "border-border";
  return (
    <div className={`rounded-xl bg-card border ${borderClass} p-2 text-center transition-base`}>
      <p className={`font-mono-timer text-2xl font-bold leading-none flex items-center justify-center gap-1 ${toneClass}`}>
        {icon}{value}
      </p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{label}</p>
    </div>
  );
};
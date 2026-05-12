import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Dumbbell, Trash2, ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { AppShell } from "./AppShell";
import { storage } from "@/lib/storage";
import type { SessionLog, SetLog } from "@/lib/types";
import { toast } from "sonner";
import { useT } from "@/lib/i18n";

const formatSet = (s: SetLog, unit: string): string => {
  if ((s.seconds ?? 0) > 0 && s.weight === 0 && s.reps === 0) return `${s.seconds}s`;
  if (s.weight === 0 && s.reps > 0) return `${s.reps} reps`;
  return `${s.weight || 0}${unit} × ${s.reps}`;
};

interface Props { onBack: () => void; }

export const History = ({ onBack }: Props) => {
  const t = useT();
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const unit = useMemo(() => storage.getSettings().weightUnit, []);

  useEffect(() => { setSessions(storage.getSessions()); }, []);

  const remove = (id: string) => {
    const next = sessions.filter(s => s.id !== id);
    setSessions(next);
    storage.saveSessions(next);
  };

  const toggle = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const share = async (s: SessionLog) => {
    const date = new Date(s.startedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
    const totalSets = s.exercises.reduce((a, e) => a + e.sets.length, 0);
    const totalVol = s.exercises.reduce(
      (a, e) => a + e.sets.reduce((b, x) => b + x.reps * x.weight, 0), 0,
    );
    const lines = [
      `🔒 ${s.workoutName} — Lock In`,
      date,
      `Exercises: ${s.exercises.length} • Sets: ${totalSets} • Volume: ${Math.round(totalVol)}${unit}`,
      "",
      ...s.exercises.map(e =>
        `• ${e.exerciseName}\n  ${e.sets.map(set => formatSet(set, unit)).join(", ")}`
      ),
    ];
    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast(t("common.copyOk"));
    } catch {
      toast(t("common.copyFail"));
    }
  };

  return (
    <AppShell
      title={t("history.title")}
      left={<button onClick={onBack} aria-label={t("common.back")} className="p-2 -ml-2"><ArrowLeft className="w-5 h-5" /></button>}
    >
      <div className="pt-5">
        {sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <Dumbbell className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">{t("history.empty")}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {sessions.map(s => {
              const totalSets = s.exercises.reduce((a, e) => a + e.sets.length, 0);
              const totalVol = s.exercises.reduce(
                (a, e) => a + e.sets.reduce((b, x) => b + x.reps * x.weight, 0), 0,
              );
              const isOpen = !!expanded[s.id];
              return (
                <li key={s.id} className="rounded-2xl bg-card border border-border p-4 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => toggle(s.id)}
                      className="min-w-0 flex-1 text-left flex items-start gap-2"
                      aria-expanded={isOpen}
                    >
                      {isOpen
                        ? <ChevronUp className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                        : <ChevronDown className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />}
                      <div className="min-w-0 flex-1">
                      <h4 className="font-semibold truncate">{s.workoutName}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(s.startedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                      {s.focusBreaks != null && (
                        <p className="text-[11px] mt-1">
                          <span className="text-muted-foreground">{t("session.focusBreaks", { n: "" }).replace(/\s*$/, "")}</span>
                          <span className={`font-semibold ${s.focusBreaks === 0 ? "text-primary" : "text-foreground"}`}>{s.focusBreaks}</span>
                        </p>
                      )}
                      </div>
                    </button>
                    <div className="flex items-center shrink-0">
                      <button onClick={() => share(s)} aria-label={t("common.share")} className="p-2 text-muted-foreground hover:text-primary transition-base">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => remove(s.id)} aria-label={t("common.delete")} className="p-2 text-muted-foreground hover:text-destructive transition-base">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {isOpen && (
                    <>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <Mini label={t("history.exercises")} value={s.exercises.length} />
                        <Mini label={t("history.sets")} value={totalSets} />
                        <Mini label={t("history.vol", { unit })} value={Math.round(totalVol)} />
                      </div>
                      {(s.focusScore != null || s.focusBreaks != null) && (
                        <div className="mt-2 flex items-center justify-between rounded-xl bg-secondary/50 px-3 py-2 text-[11px]">
                          <span className="text-muted-foreground">
                            {t("session.focusBreaks", { n: "" }).replace(/\s*$/, "")}<span className="text-foreground font-semibold">{s.focusBreaks ?? 0}</span>
                          </span>
                          {s.focusScore != null && (
                            <span className={`font-bold uppercase tracking-wider ${
                              s.focusScore >= 85 ? "text-primary" : s.focusScore >= 60 ? "text-foreground" : "text-muted-foreground"
                            }`}>
                              {s.focusScore}/100 · {s.focusScore >= 85 ? t("session.lockedInLabel") : s.focusScore >= 60 ? t("session.focused") : t("session.distracted")}
                            </span>
                          )}
                        </div>
                      )}
                      <ul className="mt-3 space-y-1.5">
                        {s.exercises.map(e => {
                          return (
                            <li key={e.exerciseId} className="rounded-xl bg-secondary/50 p-2.5">
                              <p className="text-sm font-semibold truncate">{e.exerciseName}</p>
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                {e.sets.map((set, i) => {
                                  return (
                                    <span
                                      key={i}
                                      className="text-[11px] font-mono-timer rounded-md px-1.5 py-0.5 inline-flex items-center gap-1 bg-background border border-border"
                                    >
                                      {formatSet(set, unit)}
                                    </span>
                                  );
                                })}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
};

const Mini = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl bg-secondary/60 p-2 text-center">
    <p className="font-mono-timer text-lg font-bold leading-none">{value}</p>
    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{label}</p>
  </div>
);
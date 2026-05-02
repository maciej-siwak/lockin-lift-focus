import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Dumbbell, Trash2, ChevronDown, ChevronUp, Share2, Flame } from "lucide-react";
import { AppShell } from "./AppShell";
import { storage } from "@/lib/storage";
import type { SessionLog, SetLog } from "@/lib/types";
import { toast } from "sonner";
import { buildPRs, flagSet } from "@/lib/prs";

const formatSet = (s: SetLog, unit: string): string => {
  if ((s.seconds ?? 0) > 0 && s.weight === 0 && s.reps === 0) return `${s.seconds}s`;
  if (s.weight === 0 && s.reps > 0) return `${s.reps} reps`;
  return `${s.weight || 0}${unit} × ${s.reps}`;
};

interface Props { onBack: () => void; }

export const History = ({ onBack }: Props) => {
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
      toast("Copied to clipboard");
    } catch {
      toast("Could not copy");
    }
  };

  return (
    <AppShell
      title="Lifting history"
      left={<button onClick={onBack} aria-label="Back" className="p-2 -ml-2"><ArrowLeft className="w-5 h-5" /></button>}
    >
      <div className="pt-5">
        {sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <Dumbbell className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No sessions logged yet.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {sessions.map(s => {
              const totalSets = s.exercises.reduce((a, e) => a + e.sets.length, 0);
              const totalVol = s.exercises.reduce(
                (a, e) => a + e.sets.reduce((b, x) => b + x.reps * x.weight, 0), 0,
              );
              const isOpen = !!expanded[s.id];
              // PRs that existed BEFORE this session — used to flag PR-breaking sets
              const priorPRs = buildPRs(sessions, s.startedAt);
              // Per-exercise: was any PR broken in this session?
              const sessionPRCount = s.exercises.reduce((acc, e) => {
                const prior = priorPRs[e.exerciseName.toLowerCase()];
                return acc + e.sets.reduce((a, set) => {
                  const f = flagSet(set, prior);
                  return a + (f.weight || f.reps || f.volume ? 1 : 0);
                }, 0);
              }, 0);
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
                      <h4 className="font-semibold truncate flex items-center gap-1.5">
                        {s.workoutName}
                        {sessionPRCount > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/15 rounded-full px-1.5 py-0.5">
                            <Flame className="w-3 h-3" /> {sessionPRCount} PR
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(s.startedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                      </div>
                    </button>
                    <div className="flex items-center shrink-0">
                      <button onClick={() => share(s)} aria-label="Share" className="p-2 text-muted-foreground hover:text-primary transition-base">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => remove(s.id)} aria-label="Delete" className="p-2 text-muted-foreground hover:text-destructive transition-base">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {isOpen && (
                    <>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <Mini label="Exercises" value={s.exercises.length} />
                        <Mini label="Sets" value={totalSets} />
                        <Mini label={`Vol ${unit}`} value={Math.round(totalVol)} />
                      </div>
                      <ul className="mt-3 space-y-1.5">
                        {s.exercises.map(e => {
                          const prior = priorPRs[e.exerciseName.toLowerCase()];
                          return (
                            <li key={e.exerciseId} className="rounded-xl bg-secondary/50 p-2.5">
                              <p className="text-sm font-semibold truncate">{e.exerciseName}</p>
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                {e.sets.map((set, i) => {
                                  const f = flagSet(set, prior);
                                  const isPR = f.weight || f.reps || f.volume;
                                  const title = [
                                    f.weight && "Top weight",
                                    f.reps && "Top reps",
                                    f.volume && "Top set volume",
                                  ].filter(Boolean).join(" • ");
                                  return (
                                    <span
                                      key={i}
                                      title={isPR ? `New PR: ${title}` : undefined}
                                      className={`text-[11px] font-mono-timer rounded-md px-1.5 py-0.5 inline-flex items-center gap-1 ${
                                        isPR
                                          ? "bg-primary/15 border border-primary/40 text-primary font-bold shadow-glow"
                                          : "bg-background border border-border"
                                      }`}
                                    >
                                      {isPR && <Flame className="w-2.5 h-2.5" />}
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
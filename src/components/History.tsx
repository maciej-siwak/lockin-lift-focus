import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Dumbbell, Trash2 } from "lucide-react";
import { AppShell } from "./AppShell";
import { storage } from "@/lib/storage";
import type { SessionLog } from "@/lib/types";

interface Props { onBack: () => void; }

export const History = ({ onBack }: Props) => {
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const unit = useMemo(() => storage.getSettings().weightUnit, []);

  useEffect(() => { setSessions(storage.getSessions()); }, []);

  const remove = (id: string) => {
    const next = sessions.filter(s => s.id !== id);
    setSessions(next);
    storage.saveSessions(next);
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
              return (
                <li key={s.id} className="rounded-2xl bg-card border border-border p-4 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold truncate">{s.workoutName}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(s.startedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                    <button onClick={() => remove(s.id)} aria-label="Delete" className="p-2 text-muted-foreground hover:text-destructive transition-base">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <Mini label="Exercises" value={s.exercises.length} />
                    <Mini label="Sets" value={totalSets} />
                    <Mini label={`Vol ${unit}`} value={Math.round(totalVol)} />
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {s.exercises.map(e => (
                      <li key={e.exerciseId} className="rounded-xl bg-secondary/50 p-2.5">
                        <p className="text-sm font-semibold truncate">{e.exerciseName}</p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {e.sets.map((set, i) => (
                            <span key={i} className="text-[11px] font-mono-timer bg-background border border-border rounded-md px-1.5 py-0.5">
                              {set.weight || 0}{unit} × {set.reps}
                            </span>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
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
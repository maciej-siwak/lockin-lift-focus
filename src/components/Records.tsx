import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Trophy, Share2, Dumbbell } from "lucide-react";
import { AppShell } from "./AppShell";
import { storage } from "@/lib/storage";
import type { SessionLog, SetLog } from "@/lib/types";
import { toast } from "sonner";

interface Props { onBack: () => void; }

export const Records = ({ onBack }: Props) => {
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const unit = useMemo(() => storage.getSettings().weightUnit, []);

  useEffect(() => { setSessions(storage.getSessions()); }, []);

  const topByExercise = useMemo(() => {
    const map: Record<string, SetLog[]> = {};
    for (const s of sessions) {
      for (const ex of s.exercises) {
        const key = ex.exerciseName.toLowerCase();
        if (!map[key]) map[key] = [];
        for (const set of ex.sets) {
          if (set.weight > 0 && set.reps > 0) map[key].push(set);
        }
      }
    }
    const out: Array<{ key: string; sets: SetLog[] }> = [];
    for (const [key, sets] of Object.entries(map)) {
      const top = [...sets]
        .sort((a, b) => (b.weight - a.weight) || (b.reps - a.reps))
        .slice(0, 3);
      if (top.length > 0) out.push({ key, sets: top });
    }
    return out.sort((a, b) => (b.sets[0].weight - a.sets[0].weight));
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
      toast("No records yet");
      return;
    }
    const lines: string[] = [`🏆 Top Records — Lock In`, ""];
    for (const { key, sets } of topByExercise) {
      lines.push(displayName[key] ?? key);
      sets.forEach((set, i) => {
        lines.push(`${i + 1}. ${set.weight}${unit} × ${set.reps} reps`);
      });
      lines.push("");
    }
    try {
      await navigator.clipboard.writeText(lines.join("\n").trimEnd());
      toast("Records copied to clipboard");
    } catch {
      toast("Could not copy");
    }
  };

  return (
    <AppShell
      title="Personal records"
      left={<button onClick={onBack} aria-label="Back" className="p-2 -ml-2"><ArrowLeft className="w-5 h-5" /></button>}
      right={
        topByExercise.length > 0 ? (
          <button onClick={sharePRs} aria-label="Share records" className="p-2 -mr-2 text-muted-foreground hover:text-primary transition-base">
            <Share2 className="w-5 h-5" />
          </button>
        ) : undefined
      }
    >
      <div className="pt-5">
        {topByExercise.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <Dumbbell className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No records yet. Log a session to start tracking PRs.</p>
          </div>
        ) : (
          <section className="rounded-2xl bg-gradient-dark border border-border p-4 shadow-card">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Top 3 per exercise</h3>
            </div>
            <ul className="mt-3 space-y-3">
              {topByExercise.map(({ key, sets }) => (
                <li key={key} className="rounded-xl bg-card border border-border p-3">
                  <p className="text-sm font-semibold truncate">{displayName[key] ?? key}</p>
                  <ol className="mt-2 space-y-1">
                    {sets.map((set, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <span className="font-mono-timer text-xs font-bold text-primary w-4 text-center shrink-0">{i + 1}.</span>
                        <span className="font-mono-timer font-bold text-foreground">{set.weight}{unit}</span>
                        <span className="text-muted-foreground">×</span>
                        <span className="font-mono-timer text-foreground">{set.reps} reps</span>
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
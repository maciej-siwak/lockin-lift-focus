import { useEffect, useState } from "react";
import { Plus, Dumbbell, Settings as SettingsIcon, Play, Trash2, Pencil, History as HistoryIcon, Trophy } from "lucide-react";
import { AppShell } from "./AppShell";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import type { Workout } from "@/lib/types";

interface Props {
  onNewWorkout: () => void;
  onEditWorkout: (id: string) => void;
  onStartWorkout: (id: string) => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenRecords: () => void;
}

export const Home = ({ onNewWorkout, onEditWorkout, onStartWorkout, onOpenSettings, onOpenHistory, onOpenRecords }: Props) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => { setWorkouts(storage.getWorkouts()); }, []);

  const removeWorkout = (id: string) => {
    const next = workouts.filter(w => w.id !== id);
    setWorkouts(next);
    storage.saveWorkouts(next);
  };

  return (
    <AppShell
      right={
        <button onClick={onOpenSettings} aria-label="Settings" className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-base">
          <SettingsIcon className="w-5 h-5" />
        </button>
      }
    >
      <section className="pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight leading-none">
          LOCK <span className="text-primary">IN</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1 tracking-[0.2em] uppercase">Focused Lifts</p>
      </section>

      <section className="pt-6">
        <div className="rounded-3xl bg-gradient-dark border border-border p-6 shadow-card relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
          <p className="text-xs font-semibold text-primary tracking-[0.2em] uppercase">Today</p>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight leading-tight">No distractions.<br/>Just lifts.</h2>
          <p className="mt-3 text-sm text-muted-foreground">Build a plan, lock in, and train.</p>
          <Button onClick={onNewWorkout} className="mt-5 h-12 px-5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
            <Plus className="w-4 h-4 mr-1.5" /> New workout
          </Button>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your workouts</h3>
          <span className="text-xs text-muted-foreground">{workouts.length}</span>
        </div>

        {workouts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <Dumbbell className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No workouts yet.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {workouts.map(w => (
              <li key={w.id} className="rounded-2xl bg-card border border-border p-4 shadow-card transition-base">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold truncate">{w.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {w.exercises.length} exercise{w.exercises.length !== 1 ? "s" : ""} · {w.exercises.reduce((s, e) => s + e.sets, 0)} sets
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onEditWorkout(w.id)} aria-label="Edit" className="p-2 text-muted-foreground hover:text-foreground transition-base">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeWorkout(w.id)} aria-label="Delete" className="p-2 text-muted-foreground hover:text-destructive transition-base">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <Button
                  onClick={() => onStartWorkout(w.id)}
                  disabled={w.exercises.length === 0}
                  className="mt-3 w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-glow"
                >
                  <Play className="w-4 h-4 mr-1.5 fill-current" /> Lock in
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 space-y-3">
        <button
          onClick={onOpenRecords}
          className="w-full rounded-2xl bg-card border border-border p-4 flex items-center gap-3 text-left transition-base hover:bg-secondary"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">Personal records</p>
            <p className="text-xs text-muted-foreground mt-0.5">Top 3 lifts per exercise.</p>
          </div>
        </button>
        <button
          onClick={onOpenHistory}
          className="w-full rounded-2xl bg-card border border-border p-4 flex items-center gap-3 text-left transition-base hover:bg-secondary"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
            <HistoryIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">Lifting history</p>
            <p className="text-xs text-muted-foreground mt-0.5">Review your past sessions and lifts.</p>
          </div>
        </button>
      </section>
    </AppShell>
  );
};
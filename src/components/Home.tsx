import { useEffect, useState } from "react";
import { Plus, Dumbbell, Settings as SettingsIcon, Play, Trash2, Pencil, History as HistoryIcon, Trophy, Target } from "lucide-react";
import { AppShell } from "./AppShell";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import type { Workout } from "@/lib/types";
import { LockInLogo } from "./LockInLogo";
import { useT } from "@/lib/i18n";

interface Props {
  onNewWorkout: () => void;
  onEditWorkout: (id: string) => void;
  onStartWorkout: (id: string) => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenRecords: () => void;
}

export const Home = ({ onNewWorkout, onEditWorkout, onStartWorkout, onOpenSettings, onOpenHistory, onOpenRecords }: Props) => {
  const t = useT();
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
        <button onClick={onOpenSettings} aria-label={t("home.settings")} className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-base">
          <SettingsIcon className="w-5 h-5" />
        </button>
      }
    >
      {/* Hero — logo + wordmark */}
      <section className="pt-10 pb-2 flex flex-col items-center animate-fade-in">
        <div className="relative flex items-center justify-center">
          <LockInLogo size={128} className="relative text-primary drop-shadow-[0_0_30px_hsl(var(--primary)/0.35)]" />
        </div>
        <h1 className="mt-5 text-[2.75rem] font-black tracking-tight leading-none">
          LOCK <span className="text-primary">IN</span>
        </h1>
        <p className="mt-2.5 text-[11px] text-muted-foreground tracking-[0.4em] uppercase font-semibold">{t("home.tagline")}</p>
      </section>

      {/* Today CTA — glowing outlined card */}
      <section className="mt-7 animate-fade-in">
        <div className="relative rounded-3xl border-2 border-primary/60 bg-card/50 p-5 shadow-glow overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
          <div className="flex items-start gap-3 relative">
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-primary/15 flex items-center justify-center text-primary">
              <Target className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-primary tracking-[0.25em] uppercase">{t("home.today")}</p>
              <h2 className="mt-1 text-lg font-extrabold tracking-tight leading-snug">{t("home.todayHeadline")}</h2>
            </div>
          </div>
          <Button
            onClick={onNewWorkout}
            className="relative mt-4 w-full h-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-glow"
          >
            <Plus className="w-4 h-4 mr-1.5" strokeWidth={3} /> {t("home.newWorkout")}
          </Button>
        </div>
      </section>

      {/* Your workouts */}
      <section className="mt-8 animate-fade-in">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-base font-bold tracking-tight">{t("home.yourWorkouts")}</h3>
          <span className="text-xs text-muted-foreground tabular-nums">{workouts.length}</span>
        </div>

        {workouts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <Dumbbell className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">{t("home.noWorkouts")}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {workouts.map(w => {
              const totalSets = w.exercises.reduce((s, e) => s + e.sets, 0);
              return (
                <li key={w.id} className="group rounded-2xl bg-card border border-border p-4 shadow-card transition-base hover:border-primary/40">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold truncate leading-tight">{w.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {t(w.exercises.length === 1 ? "home.exercise_one" : "home.exercise_other", { n: w.exercises.length })} · {t(totalSets === 1 ? "home.set_one" : "home.set_other", { n: totalSets })}
                      </p>
                    </div>
                    <button
                      onClick={() => onStartWorkout(w.id)}
                      disabled={w.exercises.length === 0}
                      aria-label={t("home.lockIn")}
                      className="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-glow transition-base hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-end gap-1">
                    <button onClick={() => onEditWorkout(w.id)} aria-label={t("common.edit")} className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-base inline-flex items-center gap-1.5">
                      <Pencil className="w-3.5 h-3.5" /> {t("common.edit")}
                    </button>
                    <button onClick={() => removeWorkout(w.id)} aria-label={t("common.delete")} className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-base inline-flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5" /> {t("common.delete")}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* History */}
      <section className="mt-8 mb-4 animate-fade-in">
        <h3 className="text-base font-bold tracking-tight mb-3 px-1">{t("home.progress")}</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onOpenRecords}
            className="rounded-2xl bg-card border border-border p-4 flex flex-col items-start gap-3 text-left transition-base hover:border-primary/40 hover:bg-secondary"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm">{t("home.records")}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{t("home.recordsDesc")}</p>
            </div>
          </button>
          <button
            onClick={onOpenHistory}
            className="rounded-2xl bg-card border border-border p-4 flex flex-col items-start gap-3 text-left transition-base hover:border-primary/40 hover:bg-secondary"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
              <HistoryIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm">{t("home.history")}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{t("home.historyDesc")}</p>
            </div>
          </button>
        </div>
      </section>
    </AppShell>
  );
};
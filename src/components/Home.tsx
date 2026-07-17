import { useEffect, useState } from "react";
import { Dumbbell, Settings as SettingsIcon, Play, Trash2, Pencil, History as HistoryIcon, Trophy, Lightbulb, ArrowUpRight } from "lucide-react";
import { AppShell } from "./AppShell";
import { storage } from "@/lib/storage";
import type { Workout } from "@/lib/types";
import { useT } from "@/lib/i18n";

interface Props {
  onNewWorkout: () => void;
  onEditWorkout: (id: string) => void;
  onStartWorkout: (id: string) => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenRecords: () => void;
  onOpenSuggestions: () => void;
}

export const Home = ({ onNewWorkout, onEditWorkout, onStartWorkout, onOpenSettings, onOpenHistory, onOpenRecords, onOpenSuggestions }: Props) => {
  const t = useT();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    setWorkouts(storage.getWorkouts());
    setSessionCount(storage.getSessions().length);
  }, []);

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
      {/* Wordmark header */}
      <section className="pt-6 flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 border-2 border-primary flex items-center justify-center relative">
            <div className="absolute w-[2px] h-3.5 bg-primary" style={{ top: 3 }} />
            <div className="w-3 h-[2px] bg-primary" />
          </div>
          <div className="flex flex-col leading-none">
            <h1 className="font-display text-2xl uppercase tracking-tight">LOCK IN</h1>
            <span className="text-[10px] tracking-[0.25em] text-muted-foreground font-semibold uppercase mt-1">{t("home.tagline")}</span>
          </div>
        </div>
      </section>

      {/* Today block — sharp border, no glow */}
      <section className="mt-8 animate-fade-in">
        <div className="border border-border p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.25em]">{t("home.today")}</p>
              <h2 className="mt-1 font-display text-xl uppercase leading-tight">{t("home.todayHeadline")}</h2>
            </div>
            <div className="border border-border px-2 py-1 bg-secondary">
              <span className="font-mono-data text-[10px] text-muted-foreground uppercase">Sess {String(sessionCount).padStart(2, "0")}</span>
            </div>
          </div>
          <button
            onClick={onNewWorkout}
            className="w-full bg-primary text-primary-foreground py-4 font-display text-sm uppercase tracking-wider hover:bg-primary/90 active:bg-primary/80 transition-base"
          >
            {t("home.newWorkout")}
          </button>
        </div>
      </section>

      {/* Library / Your workouts */}
      <section className="mt-8 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.25em]">{t("home.yourWorkouts")}</h3>
          <span className="font-mono-data text-[10px] text-muted-foreground uppercase">{String(workouts.length).padStart(2, "0")} total</span>
        </div>

        {workouts.length === 0 ? (
          <div className="border border-dashed border-border p-8 text-center">
            <Dumbbell className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">{t("home.noWorkouts")}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {workouts.map(w => {
              const totalSets = w.exercises.reduce((s, e) => s + e.sets, 0);
              return (
                <li key={w.id} className="bg-card/40 border border-border">
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 shrink-0 bg-secondary border border-border flex items-center justify-center text-muted-foreground">
                      <Dumbbell className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm truncate leading-tight">{w.name}</h4>
                      <p className="font-mono-data text-[10px] text-muted-foreground uppercase mt-1 truncate">
                        {w.exercises.length} EX · {totalSets} SETS
                      </p>
                    </div>
                    <button
                      onClick={() => onStartWorkout(w.id)}
                      disabled={w.exercises.length === 0}
                      aria-label={t("home.lockIn")}
                      className="shrink-0 w-9 h-9 rounded-full border-2 border-primary text-primary flex items-center justify-center transition-base hover:bg-primary hover:text-primary-foreground active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>
                  <div className="border-t border-border px-4 py-2 flex justify-end gap-5">
                    <button onClick={() => onEditWorkout(w.id)} aria-label={t("common.edit")} className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-base inline-flex items-center gap-1.5">
                      <Pencil className="w-3 h-3" /> {t("common.edit")}
                    </button>
                    <button onClick={() => removeWorkout(w.id)} aria-label={t("common.delete")} className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-destructive transition-base inline-flex items-center gap-1.5">
                      <Trash2 className="w-3 h-3" /> {t("common.delete")}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Progress */}
      <section className="mt-8 mb-4 animate-fade-in">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.25em] mb-4">{t("home.progress")}</h3>
        <div className="grid grid-cols-2 gap-3">
          <StatTile
            icon={<Trophy className="w-4 h-4" />}
            label={t("home.records")}
            desc={t("home.recordsDesc")}
            onClick={onOpenRecords}
          />
          <StatTile
            icon={<HistoryIcon className="w-4 h-4" />}
            label={t("home.history")}
            desc={t("home.historyDesc")}
            onClick={onOpenHistory}
          />
        </div>
        <button
          onClick={onOpenSuggestions}
          className="mt-3 w-full border border-border p-4 flex items-center gap-4 text-left transition-base hover:border-primary/60"
        >
          <div className="w-10 h-10 bg-secondary border border-border flex items-center justify-center text-muted-foreground shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm">Exercise suggestions</p>
            <p className="font-mono-data text-[10px] text-muted-foreground uppercase mt-1">Proven lifts · By muscle group</p>
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </section>
    </AppShell>
  );
};

const StatTile = ({ icon, label, desc, onClick }: { icon: React.ReactNode; label: string; desc: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="border border-border p-4 flex flex-col gap-3 text-left transition-base hover:border-primary/60"
  >
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.25em]">{label}</span>
      <span className="text-muted-foreground">{icon}</span>
    </div>
    <p className="font-mono-data text-[10px] text-muted-foreground uppercase leading-snug">{desc}</p>
  </button>
);
import { useEffect, useMemo, useState } from "react";
import { Dumbbell, Settings as SettingsIcon, Play, Trash2, Pencil, History as HistoryIcon, Trophy, Lightbulb, ChevronRight, Flame, Plus } from "lucide-react";
import { AppShell } from "./AppShell";
import { storage } from "@/lib/storage";
import type { Workout, SessionLog } from "@/lib/types";
import { useT } from "@/lib/i18n";
import { LockInLogo } from "./LockInLogo";
import { buildPRs } from "@/lib/prs";

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
  const [sessions, setSessions] = useState<SessionLog[]>([]);

  useEffect(() => {
    setWorkouts(storage.getWorkouts());
    setSessions(storage.getSessions());
  }, []);

  const removeWorkout = (id: string) => {
    const next = workouts.filter(w => w.id !== id);
    setWorkouts(next);
    storage.saveWorkouts(next);
  };

  const stats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    const dow = (now.getDay() + 6) % 7; // Monday = 0
    startOfWeek.setDate(now.getDate() - dow);
    startOfWeek.setHours(0, 0, 0, 0);
    const thisWeek = sessions.filter(s => s.startedAt >= startOfWeek.getTime()).length;

    // streak: consecutive days back from today with at least one session
    const days = new Set(
      sessions.map(s => {
        const d = new Date(s.startedAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );
    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    // allow today OR yesterday to start the streak
    if (!days.has(cursor.getTime())) cursor.setDate(cursor.getDate() - 1);
    while (days.has(cursor.getTime())) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    const prMap = buildPRs(sessions);
    const prCount = Object.keys(prMap).length;

    return { total: sessions.length, thisWeek, streak, prCount };
  }, [sessions]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return t("home.greetLate") ?? "Late night lift.";
    if (h < 12) return t("home.greetMorning") ?? "Good morning.";
    if (h < 18) return t("home.greetAfternoon") ?? "Good afternoon.";
    return t("home.greetEvening") ?? "Good evening.";
  }, [t]);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    []
  );

  return (
    <AppShell
      left={
        <div className="flex items-center gap-2 pl-1">
          <LockInLogo size={28} className="text-primary" />
          <span className="font-display text-sm uppercase tracking-[0.18em]">Lock In</span>
        </div>
      }
      right={
        <button
          onClick={onOpenSettings}
          aria-label={t("home.settings")}
          className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-base"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      }
    >
      {/* Greeting */}
      <section className="pt-6 animate-fade-in">
        <p className="font-mono-data text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          {today}
        </p>
        <h1 className="mt-2 text-[32px] leading-[1.05] font-display uppercase tracking-tight">
          {greeting}
          <br />
          <span className="text-muted-foreground/70">Time to </span>
          <span className="text-primary">lock in.</span>
        </h1>
      </section>

      {/* Stats strip */}
      <section className="mt-6 grid grid-cols-3 gap-2 animate-fade-in">
        <StatChip
          value={stats.streak}
          label={stats.streak === 1 ? "day streak" : "day streak"}
          accent
          icon={<Flame className="w-3 h-3" />}
        />
        <StatChip value={stats.thisWeek} label="this week" />
        <StatChip value={stats.total} label="total lifts" />
      </section>

      {/* Primary action */}
      <section className="mt-5 animate-fade-in">
        <button
          onClick={onNewWorkout}
          className="group relative w-full rounded-3xl bg-primary text-primary-foreground p-5 text-left overflow-hidden transition-base active:scale-[0.99]"
        >
          <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none">
            <Dumbbell className="w-40 h-40" strokeWidth={1.5} />
          </div>
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-foreground/15 flex items-center justify-center">
              <Plus className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-70">
                {t("home.today")}
              </p>
              <p className="mt-1 text-lg font-bold leading-tight">{t("home.newWorkout")}</p>
            </div>
            <ChevronRight className="w-5 h-5 opacity-70 transition-transform group-hover:translate-x-0.5" />
          </div>
        </button>
      </section>

      {/* Workouts */}
      <section className="mt-8 animate-fade-in">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-sm font-bold tracking-tight">{t("home.yourWorkouts")}</h3>
          <span className="font-mono-data text-[11px] text-muted-foreground">
            {workouts.length}
          </span>
        </div>

        {workouts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <Dumbbell className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">{t("home.noWorkouts")}</p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {workouts.map(w => {
              const totalSets = w.exercises.reduce((s, e) => s + e.sets, 0);
              const disabled = w.exercises.length === 0;
              return (
                <li
                  key={w.id}
                  className="group rounded-2xl bg-card border border-border p-3.5 transition-base hover:border-primary/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-[15px] truncate leading-tight">{w.name}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                        {w.exercises.length} {w.exercises.length === 1 ? "exercise" : "exercises"} · {totalSets} sets
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onEditWorkout(w.id)}
                        aria-label={t("common.edit")}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-base"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeWorkout(w.id)}
                        aria-label={t("common.delete")}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-secondary transition-base"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onStartWorkout(w.id)}
                        disabled={disabled}
                        aria-label={t("home.lockIn")}
                        className="ml-1 w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-base hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Progress */}
      <section className="mt-8 mb-6 animate-fade-in">
        <h3 className="text-sm font-bold tracking-tight mb-3">{t("home.progress")}</h3>
        <div className="grid grid-cols-2 gap-2.5">
          <ProgressTile
            onClick={onOpenRecords}
            icon={<Trophy className="w-4 h-4" />}
            value={stats.prCount}
            label={t("home.records")}
            desc={t("home.recordsDesc")}
          />
          <ProgressTile
            onClick={onOpenHistory}
            icon={<HistoryIcon className="w-4 h-4" />}
            value={stats.total}
            label={t("home.history")}
            desc={t("home.historyDesc")}
          />
        </div>
        <button
          onClick={onOpenSuggestions}
          className="mt-2.5 w-full rounded-2xl bg-card border border-border p-3.5 flex items-center gap-3 text-left transition-base hover:border-primary/40"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[14px] leading-tight">Exercise suggestions</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Proven lifts by muscle group</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </section>
    </AppShell>
  );
};

const StatChip = ({
  value,
  label,
  icon,
  accent,
}: {
  value: number;
  label: string;
  icon?: React.ReactNode;
  accent?: boolean;
}) => (
  <div
    className={`rounded-2xl border p-3 ${
      accent
        ? "bg-primary/10 border-primary/25 text-primary"
        : "bg-card border-border text-foreground"
    }`}
  >
    <div className="flex items-center gap-1.5">
      <span className="font-mono-data text-2xl font-bold leading-none tabular-nums">{value}</span>
      {icon && <span className={accent ? "text-primary" : "text-muted-foreground"}>{icon}</span>}
    </div>
    <p
      className={`mt-1.5 text-[10px] uppercase tracking-[0.15em] font-semibold ${
        accent ? "text-primary/80" : "text-muted-foreground"
      }`}
    >
      {label}
    </p>
  </div>
);

const ProgressTile = ({
  icon,
  value,
  label,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  desc: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="rounded-2xl bg-card border border-border p-4 flex flex-col gap-3 text-left transition-base hover:border-primary/40"
  >
    <div className="flex items-center justify-between">
      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <span className="font-mono-data text-2xl font-bold leading-none tabular-nums">{value}</span>
    </div>
    <div>
      <p className="font-semibold text-sm leading-tight">{label}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{desc}</p>
    </div>
  </button>
);
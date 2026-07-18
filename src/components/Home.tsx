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
    if (h < 5) return "Late night.";
    if (h < 12) return "Good morning.";
    if (h < 18) return "Good afternoon.";
    return "Good evening.";
  }, []);

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
        <div className="flex items-center gap-2.5 pl-0.5">
          <LockInLogo size={26} className="text-primary" />
          <span className="font-display text-[13px] uppercase tracking-[0.22em]">Lock In</span>
        </div>
      }
      right={
        <button
          onClick={onOpenSettings}
          aria-label={t("home.settings")}
          className="w-10 h-10 -mr-2 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-base"
        >
          <SettingsIcon className="w-[18px] h-[18px]" strokeWidth={1.75} />
        </button>
      }
    >
      {/* Greeting */}
      <section className="pt-8 animate-fade-in">
        <p className="font-mono-data text-[10px] uppercase tracking-[0.32em] text-muted-foreground/80">
          {today}
        </p>
        <h1 className="mt-3 text-[30px] leading-[1.05] font-display uppercase tracking-[-0.01em] break-words">
          {greeting}
        </h1>
        <p className="mt-2 text-[15px] leading-snug text-muted-foreground">
          Time to <span className="text-foreground">lock in</span>
          <span className="text-primary">.</span>
        </p>
      </section>

      {/* Stats strip */}
      <section className="mt-8 rounded-2xl border border-border/70 bg-card/40 divide-x divide-border/70 grid grid-cols-3 overflow-hidden animate-fade-in">
        <StatCell value={stats.streak} label="Streak" suffix={stats.streak === 1 ? "day" : "days"} accent icon={<Flame className="w-3 h-3" strokeWidth={2} />} />
        <StatCell value={stats.thisWeek} label="This week" suffix="lifts" />
        <StatCell value={stats.total} label="All time" suffix="lifts" />
      </section>

      {/* Primary action */}
      <section className="mt-4 animate-fade-in">
        <button
          onClick={onNewWorkout}
          className="group relative w-full rounded-2xl border border-border bg-card p-4 text-left overflow-hidden transition-base hover:border-primary/50 active:scale-[0.995]"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
              <Plus className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono-data text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {t("home.today")}
              </p>
              <p className="mt-0.5 text-[15px] font-semibold leading-tight">{t("home.newWorkout")}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>
        </button>
      </section>

      {/* Workouts */}
      <section className="mt-10 animate-fade-in">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="font-mono-data text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{t("home.yourWorkouts")}</h3>
          <span className="font-mono-data text-[10px] tracking-[0.15em] text-muted-foreground/70 tabular-nums">
            {String(workouts.length).padStart(2, "0")}
          </span>
        </div>

        {workouts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 p-10 text-center">
            <Dumbbell className="w-7 h-7 mx-auto text-muted-foreground/60" strokeWidth={1.5} />
            <p className="mt-4 text-[13px] text-muted-foreground">{t("home.noWorkouts")}</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {workouts.map(w => {
              const totalSets = w.exercises.reduce((s, e) => s + e.sets, 0);
              const disabled = w.exercises.length === 0;
              return (
                <li
                  key={w.id}
                  className="group rounded-2xl bg-card border border-border/70 p-3 transition-base hover:border-primary/40"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-secondary/70 flex items-center justify-center text-muted-foreground">
                      <Dumbbell className="w-[18px] h-[18px]" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-[15px] truncate leading-tight tracking-tight">{w.name}</h4>
                      <p className="font-mono-data text-[10px] uppercase tracking-[0.16em] text-muted-foreground mt-1 truncate">
                        {w.exercises.length} {w.exercises.length === 1 ? "ex" : "ex"} <span className="opacity-40 mx-1">·</span> {totalSets} sets
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        onClick={() => onEditWorkout(w.id)}
                        aria-label={t("common.edit")}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground/70 hover:text-foreground hover:bg-secondary transition-base"
                      >
                        <Pencil className="w-[15px] h-[15px]" strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={() => removeWorkout(w.id)}
                        aria-label={t("common.delete")}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground/70 hover:text-destructive hover:bg-secondary transition-base"
                      >
                        <Trash2 className="w-[15px] h-[15px]" strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={() => onStartWorkout(w.id)}
                        disabled={disabled}
                        aria-label={t("home.lockIn")}
                        className="ml-1.5 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-base hover:brightness-110 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <Play className="w-[14px] h-[14px] fill-current ml-0.5" />
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
      <section className="mt-10 mb-8 animate-fade-in">
        <h3 className="font-mono-data text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-4">{t("home.progress")}</h3>
        <div className="grid grid-cols-2 gap-2">
          <ProgressTile
            onClick={onOpenRecords}
            icon={<Trophy className="w-[15px] h-[15px]" strokeWidth={1.75} />}
            value={stats.prCount}
            label={t("home.records")}
            desc={t("home.recordsDesc")}
          />
          <ProgressTile
            onClick={onOpenHistory}
            icon={<HistoryIcon className="w-[15px] h-[15px]" strokeWidth={1.75} />}
            value={stats.total}
            label={t("home.history")}
            desc={t("home.historyDesc")}
          />
        </div>
        <button
          onClick={onOpenSuggestions}
          className="mt-2 w-full rounded-2xl bg-card border border-border/70 p-3.5 flex items-center gap-3.5 text-left transition-base hover:border-primary/40"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary/70 flex items-center justify-center text-muted-foreground shrink-0">
            <Lightbulb className="w-[15px] h-[15px]" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[14px] leading-tight tracking-tight">Exercise suggestions</p>
            <p className="font-mono-data text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">Proven lifts by muscle group</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground/70" />
        </button>
      </section>
    </AppShell>
  );
};

const StatCell = ({
  value,
  label,
  suffix,
  icon,
  accent,
}: {
  value: number;
  label: string;
  suffix?: string;
  icon?: React.ReactNode;
  accent?: boolean;
}) => (
  <div className="px-3.5 py-3.5">
    <div className="flex items-baseline gap-1.5">
      <span className={`font-display text-[26px] leading-none tabular-nums ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </span>
      {suffix && (
        <span className="font-mono-data text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70">{suffix}</span>
      )}
      {icon && <span className={`ml-auto ${accent ? "text-primary" : "text-muted-foreground/50"}`}>{icon}</span>}
    </div>
    <p className="mt-2 font-mono-data text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
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
    className="rounded-2xl bg-card border border-border/70 p-4 flex flex-col gap-4 text-left transition-base hover:border-primary/40"
  >
    <div className="flex items-center justify-between">
      <div className="w-9 h-9 rounded-xl bg-secondary/70 flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <span className="font-display text-[22px] leading-none tabular-nums text-foreground">{value}</span>
    </div>
    <div>
      <p className="font-semibold text-[14px] leading-tight tracking-tight">{label}</p>
      <p className="font-mono-data text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1.5 leading-snug">{desc}</p>
    </div>
  </button>
);
import { useEffect, useMemo, useState } from "react";
import { Dumbbell, Settings as SettingsIcon, Play, Trash2, Pencil, History as HistoryIcon, Trophy, Lightbulb, ChevronRight, Flame, Plus, Eye, LineChart as LineChartIcon } from "lucide-react";
import { AppShell } from "./AppShell";
import { storage } from "@/lib/storage";
import type { Workout, SessionLog } from "@/lib/types";
import { useT } from "@/lib/i18n";
import { LockInLogo } from "./LockInLogo";
import { ConfirmDelete } from "./ConfirmDelete";

interface Props {
  onNewWorkout: () => void;
  onEditWorkout: (id: string) => void;
  onStartWorkout: (id: string) => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenRecords: () => void;
  onOpenSuggestions: () => void;
  onOpenCharts: () => void;
}

export const Home = ({ onNewWorkout, onEditWorkout, onStartWorkout, onOpenSettings, onOpenHistory, onOpenRecords, onOpenSuggestions, onOpenCharts }: Props) => {
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

  const focusStats = useMemo(() => {
    const withFocus = sessions.filter(s => s.focusBreaks != null);
    const fullFocusCount = withFocus.filter(s => s.focusBreaks === 0).length;
    const chrono = [...withFocus].sort((a, b) => a.startedAt - b.startedAt);
    let best = 0, run = 0, current = 0;
    for (const s of chrono) {
      if (s.focusBreaks === 0) { run++; if (run > best) best = run; }
      else run = 0;
    }
    for (let i = chrono.length - 1; i >= 0; i--) {
      if (chrono[i].focusBreaks === 0) current++;
      else break;
    }
    return { fullFocusCount, best, current, hasData: withFocus.length > 0, total: sessions.length };
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
        <div className="flex items-center gap-3 pl-0.5">
          <LockInLogo size={38} className="text-primary drop-shadow-[0_0_10px_hsl(var(--primary)/0.35)]" />
          <span className="font-display text-[15px] uppercase tracking-[0.24em]">Lock In</span>
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

      {/* Focus records strip */}
      <section className="mt-8 rounded-2xl border border-border/70 bg-card/40 p-3.5 animate-fade-in">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-3.5 h-3.5 text-primary" />
          <h3 className="font-mono-data text-[10px] uppercase tracking-[0.24em] text-primary">
            {t("records.focusRecords")}
          </h3>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border/70">
          <FocusCell value={focusStats.fullFocusCount} label={t("records.fullFocus")} />
          <FocusCell value={focusStats.best} label={t("records.bestStreak")} icon={<Flame className="w-3 h-3" strokeWidth={2} />} />
          <FocusCell
            value={focusStats.current}
            label={t("records.currentStreak")}
            accent
            icon={<Flame className="w-3 h-3" strokeWidth={2} />}
          />
        </div>
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
                      <ConfirmDelete
                        onConfirm={() => removeWorkout(w.id)}
                        description={`"${w.name}" will be removed. This action cannot be undone.`}
                        trigger={
                          <button
                            aria-label={t("common.delete")}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground/70 hover:text-destructive hover:bg-secondary transition-base"
                          >
                            <Trash2 className="w-[15px] h-[15px]" strokeWidth={1.75} />
                          </button>
                        }
                      />
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
            label={t("home.records")}
            desc={t("home.recordsDesc")}
          />
          <ProgressTile
            onClick={onOpenHistory}
            icon={<HistoryIcon className="w-[15px] h-[15px]" strokeWidth={1.75} />}
            label={t("home.history")}
            desc={t("home.historyDesc")}
          />
          <ProgressTile
            onClick={onOpenSuggestions}
            icon={<Lightbulb className="w-[15px] h-[15px]" strokeWidth={1.75} />}
            label={t("home.suggestions")}
            desc={t("home.suggestionsDesc")}
          />
          <ProgressTile
            onClick={onOpenCharts}
            icon={<LineChartIcon className="w-[15px] h-[15px]" strokeWidth={1.75} />}
            label={t("home.charts")}
            desc={t("home.chartsDesc")}
          />
        </div>
      </section>
    </AppShell>
  );
};

const FocusCell = ({
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
  <div className="px-2 first:pl-0 last:pr-0 text-center">
    <div className="flex items-baseline justify-center gap-1">
      <span className={`font-display text-[24px] leading-none tabular-nums ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </span>
      {icon && <span className={accent ? "text-primary" : "text-muted-foreground/60"}>{icon}</span>}
    </div>
    <p className="mt-2 font-mono-data text-[9px] uppercase tracking-[0.18em] text-muted-foreground leading-tight">
      {label}
    </p>
  </div>
);

const ProgressTile = ({
  icon,
  label,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
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
      <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
    </div>
    <div>
      <p className="font-semibold text-[14px] leading-tight tracking-tight">{label}</p>
      <p className="font-mono-data text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1.5 leading-snug">{desc}</p>
    </div>
  </button>
);
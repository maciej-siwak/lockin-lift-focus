import { useEffect, useMemo, useRef, useState } from "react";
import { Lock, Check, SkipForward, X, Plus, Minus, Shuffle, ArrowRight, Eye } from "lucide-react";
import { AppShell } from "./AppShell";
import { Button } from "@/components/ui/button";
import { storage, uid } from "@/lib/storage";
import type { Workout, SessionLog, ExerciseLog, SetLog, ExerciseMode } from "@/lib/types";
import { beep, vibrate } from "@/lib/feedback";
import { toast } from "sonner";
import { useT } from "@/lib/i18n";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface Props {
  workoutId: string;
  onExit: () => void;
}

type Phase = "picking" | "previewing" | "lifting" | "resting" | "ready" | "logging" | "done";

export const Session = ({ workoutId, onExit }: Props) => {
  const t = useT();
  const settings = useMemo(() => storage.getSettings(), []);
  const workout = useMemo<Workout | undefined>(
    () => storage.getWorkouts().find(w => w.id === workoutId),
    [workoutId]
  );

  const [exIdx, setExIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0); // sets completed for current exercise
  const [phase, setPhase] = useState<Phase>("picking");
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);
  const [restLeft, setRestLeft] = useState(0);
  const [readyLeft, setReadyLeft] = useState(3);
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  // pending logging state for an exercise just finished
  const [pendingSets, setPendingSets] = useState<SetLog[]>([]);
  const sessionIdRef = useRef(uid());
  const startedAtRef = useRef(Date.now());
  const wakeLockRef = useRef<any>(null);
  const lastBeepRef = useRef(-1);

  // Focus tracking
  const [focusBreaks, setFocusBreaks] = useState(0);
  const [awayMs, setAwayMs] = useState(0);
  const awayStartRef = useRef<number | null>(null);
  const [exitOpen, setExitOpen] = useState(false);

  // Countdown timer for time-based exercises (during lifting phase)
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const lastTimerBeepRef = useRef(-1);

  const current = workout?.exercises[exIdx];
  const currentMode: ExerciseMode = current?.mode ?? "weight_reps";
  const baseTargetSeconds = current?.targetSeconds ?? 30;
  const targetSeconds =
    currentMode === "time" && current?.repsPerSet?.[setIdx] != null
      ? current.repsPerSet[setIdx]
      : baseTargetSeconds;

  // Reset countdown whenever we enter a new lifting set for a time-based exercise
  useEffect(() => {
    if (phase === "lifting" && currentMode === "time") {
      setTimeLeft(targetSeconds);
      setTimerRunning(true);
      lastTimerBeepRef.current = -1;
    }
  }, [phase, exIdx, setIdx, currentMode, targetSeconds]);

  // Tick the countdown
  useEffect(() => {
    if (!timerRunning || phase !== "lifting") return;
    const id = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (next <= 5 && next > 0 && next !== lastTimerBeepRef.current) {
          lastTimerBeepRef.current = next;
          if (settings.sound) beep(880, 0.08, 0.18);
          if (settings.vibration) vibrate(40);
        }
        if (next <= 0) {
          if (settings.sound) beep(1320, 0.25, 0.25);
          if (settings.vibration) vibrate([100, 60, 200]);
          clearInterval(id);
          setTimerRunning(false);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, phase, settings]);

  // Reps for current set in current exercise (supports pyramid)
  const repsForSet = (idx: number): number => {
    if (!current) return 0;
    const arr = current.repsPerSet;
    if (arr && arr[idx] != null) return arr[idx];
    return current.reps;
  };

  // Wake lock
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // @ts-ignore
        if (navigator.wakeLock?.request) {
          // @ts-ignore
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        }
      } catch {}
    })();
    const onVis = async () => {
      if (document.visibilityState === "visible" && active) {
        try {
          // @ts-ignore
          wakeLockRef.current = await navigator.wakeLock?.request("screen");
        } catch {}
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      active = false;
      document.removeEventListener("visibilitychange", onVis);
      try { wakeLockRef.current?.release?.(); } catch {}
    };
  }, []);

  // Focus break tracking — count app/tab backgrounding during a session
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "hidden") {
        awayStartRef.current = Date.now();
        setFocusBreaks(n => n + 1);
      } else if (document.visibilityState === "visible" && awayStartRef.current) {
        const delta = Date.now() - awayStartRef.current;
        awayStartRef.current = null;
        setAwayMs(ms => ms + delta);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Warn before navigating away
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // Rest timer
  useEffect(() => {
    if (phase !== "resting") return;
    const id = setInterval(() => {
      setRestLeft(prev => {
        const next = prev - 1;
        if (next <= 10 && next > 0 && next !== lastBeepRef.current) {
          lastBeepRef.current = next;
          if (settings.sound) beep(880, 0.08, 0.18);
          if (settings.vibration) vibrate(40);
        }
        if (next <= 0) {
          if (settings.sound) beep(1320, 0.25, 0.25);
          if (settings.vibration) vibrate([100, 60, 200]);
          clearInterval(id);
          setReadyLeft(3);
          setPhase("ready");
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, settings]);

  // Ready, Set, Lift! interlude
  useEffect(() => {
    if (phase !== "ready") return;
    const id = setInterval(() => {
      setReadyLeft(prev => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(id);
          setPhase("lifting");
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  if (!workout) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <p>{t("session.notFound")}</p>
          <Button onClick={onExit} className="mt-4">{t("common.back")}</Button>
        </div>
      </div>
    );
  }

  const totalSets = workout.exercises.reduce((s, e) => s + e.sets, 0);
  const completedSetsAcrossExercises = logs.reduce((s, e) => s + e.sets.length, 0);
  // visual progress = completed (logged) + currently-finished-but-unlogged
  const progressDots = completedSetsAcrossExercises + setIdx;

  const completeSet = () => {
    if (!current) return;
    if (settings.vibration) vibrate(30);
    const nextSetCount = setIdx + 1;
    const isLastSet = nextSetCount >= current.sets;
    setSetIdx(nextSetCount);
    if (isLastSet) {
      // Open logging screen
      const last = storage.getLastWeights()[current.name.toLowerCase()] ?? 0;
      const mode: ExerciseMode = current.mode ?? "weight_reps";
      const seed: SetLog[] = Array.from({ length: current.sets }).map((_, i) => ({
        setIndex: i,
        weight: mode === "weight_reps" ? last : 0,
        reps: mode === "time" ? 0 : repsForSet(i),
        seconds: mode === "time"
          ? (current.repsPerSet?.[i] ?? current.targetSeconds ?? 30)
          : undefined,
        completedAt: Date.now(),
      }));
      setPendingSets(seed);
      setPhase("logging");
    } else {
      setRestLeft(current.restSeconds);
      lastBeepRef.current = -1;
      setPhase("resting");
    }
  };

  const skipRest = () => {
    setRestLeft(0);
    setReadyLeft(3);
    setPhase("ready");
  };

  const saveLogged = (newLogs: ExerciseLog[]) => {
    // Snapshot focus stats. If currently away, include current away interval.
    const totalAway = awayMs + (awayStartRef.current ? Date.now() - awayStartRef.current : 0);
    const focusScore = computeFocusScore(focusBreaks, totalAway);
    const session: SessionLog = {
      id: sessionIdRef.current,
      workoutId: workout.id,
      workoutName: workout.name,
      startedAt: startedAtRef.current,
      endedAt: Date.now(),
      exercises: newLogs,
      focusBreaks,
      awayMs: totalAway,
      focusScore,
    };
    storage.upsertSession(session);
  };

  const confirmLogging = () => {
    if (!current) return;
    const entry: ExerciseLog = {
      exerciseId: current.id,
      exerciseName: current.name,
      sets: pendingSets,
    };
    const nextLogs = [...logs.filter(l => l.exerciseId !== current.id), entry];
    setLogs(nextLogs);

    // store last weight = max weight used
    const maxW = pendingSets.reduce((m, s) => Math.max(m, s.weight), 0);
    if (maxW > 0) storage.setLastWeight(current.name, maxW);

    saveLogged(nextLogs);

    const nextCompleted = new Set(completedIds);
    nextCompleted.add(current.id);
    setCompletedIds(nextCompleted);
    setPendingSets([]);
    setSetIdx(0);
    if (nextCompleted.size >= workout.exercises.length) {
      setPhase("done");
      return;
    }
    setPhase("picking");
  };

  const pickExercise = (idx: number) => {
    setExIdx(idx);
    setSetIdx(0);
    setReadyLeft(3);
    setPhase("ready");
  };

  const requestExit = () => {
    setExitOpen(true);
  };

  const confirmExit = () => {
    setExitOpen(false);
    saveLogged(logs);
    toast(t("session.endedToast"));
    onExit();
  };

  // Done screen
  if (phase === "done") {
    const totalReps = logs.reduce((s, e) => s + e.sets.reduce((ss, x) => ss + x.reps, 0), 0);
    const totalVolume = logs.reduce((s, e) => s + e.sets.reduce((ss, x) => ss + x.reps * x.weight, 0), 0);
    const setsLogged = logs.reduce((s, e) => s + e.sets.length, 0);
    const totalAway = awayMs + (awayStartRef.current ? Date.now() - awayStartRef.current : 0);
    const focusScore = computeFocusScore(focusBreaks, totalAway);
    const fl = focusLabel(focusScore);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center shadow-glow">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold tracking-tight">{t("session.done")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{workout.name}</p>
        <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-xs">
          <Stat label={t("history.sets")} value={setsLogged} />
          <Stat label={t("session.repsLabel")} value={totalReps} />
          <Stat label={t("history.vol", { unit: settings.weightUnit })} value={Math.round(totalVolume)} />
        </div>
        <div className="mt-4 w-full max-w-xs rounded-2xl bg-card border border-border p-4 text-left">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("session.focusScore")}</p>
              <p className={`mt-1 font-mono-timer text-3xl font-extrabold ${fl.tone}`}>{focusScore}<span className="text-muted-foreground text-base">/100</span></p>
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${fl.tone}`}>
              {fl.label === "Locked In" ? t("session.lockedInLabel") : fl.label === "Focused" ? t("session.focused") : t("session.distracted")}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {totalAway > 0
              ? t("session.focusBreaksAway", { n: focusBreaks, s: Math.round(totalAway / 1000) })
              : t("session.focusBreaks", { n: focusBreaks })}
          </p>
        </div>
        <Button onClick={onExit} className="mt-10 w-full max-w-xs h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold">{t("session.finish")}</Button>
      </div>
    );
  }

  // Picking screen — choose any remaining exercise
  if (phase === "picking") {
    const remaining = workout.exercises
      .map((e, i) => ({ e, i }))
      .filter(({ e }) => !completedIds.has(e.id));
    const isFirst = completedIds.size === 0;
    return (
      <AppShell immersive>
        <div className="flex-1 flex flex-col px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary tracking-[0.2em] uppercase">
              <Lock className="w-3.5 h-3.5" /> {t("session.lockedIn")}
            </div>
            <div className="flex items-center gap-1">
              <FocusChip count={focusBreaks} t={t} />
              <button onClick={requestExit} aria-label={t("session.endSession")} className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-base">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex gap-1">
            {Array.from({ length: totalSets }).map((_, i) => (
              <span key={i} className={`flex-1 h-1 rounded-full ${i < completedSetsAcrossExercises ? "bg-primary" : "bg-secondary"}`} />
            ))}
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isFirst ? t("session.pickFirst") : t("session.pickNext")}
            </p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight leading-tight">
              {workout.name}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("session.machineBusy")}
            </p>
          </div>

          <ul className="mt-5 space-y-3 flex-1 overflow-y-auto">
            {remaining.map(({ e, i }) => (
              <li key={e.id}>
                <button
                  onClick={() => pickExercise(i)}
                  className="w-full rounded-2xl bg-card border border-border p-4 flex items-center gap-3 text-left transition-base hover:bg-secondary hover:border-primary/40"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{e.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {e.sets} {t("session.setsLabel")} · {e.repsPerSet ? e.repsPerSet.join("/") + " " + t("session.repsLabel") : `${e.reps} ${t("session.repsLabel")}`} · {e.restSeconds}s {t("session.restLabel")}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary shrink-0" />
                </button>
              </li>
            ))}
          </ul>

          {completedIds.size > 0 && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              {t("session.exDone", { done: completedIds.size, total: workout.exercises.length })}
            </p>
          )}
        </div>
        <ExitDialog open={exitOpen} onOpenChange={setExitOpen} hasLogs={logs.length > 0} onConfirm={confirmExit} t={t} />
      </AppShell>
    );
  }

  return (
    <AppShell immersive>
      <div className="flex-1 flex flex-col px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary tracking-[0.2em] uppercase">
            <Lock className="w-3.5 h-3.5" /> {t("session.lockedIn")}
          </div>
          <div className="flex items-center gap-1">
            <FocusChip count={focusBreaks} t={t} />
            <button onClick={requestExit} aria-label={t("session.endSession")} className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-base">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="mt-3 flex gap-1">
          {Array.from({ length: totalSets }).map((_, i) => (
            <span key={i} className={`flex-1 h-1 rounded-full ${i < progressDots ? "bg-primary" : "bg-secondary"}`} />
          ))}
        </div>

        {/* Exercise heading */}
        <div className="mt-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("session.exProgress", { cur: completedIds.size + 1, total: workout.exercises.length, left: workout.exercises.length - completedIds.size - (phase === "logging" ? 1 : 0) })}
              </p>
              <h2 className="mt-1 text-3xl font-extrabold tracking-tight leading-tight">{current!.name}</h2>
            </div>
            {phase === "lifting" && setIdx === 0 && (
              <button
                onClick={() => setPhase("picking")}
                aria-label={t("session.switch")}
                className="shrink-0 inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-primary/40 transition-base"
              >
                <Shuffle className="w-3 h-3" /> {t("session.switch")}
              </button>
            )}
          </div>
        </div>

        {phase === "lifting" && (
          <div className="mt-6 flex-1 flex flex-col">
            <div className="rounded-3xl bg-gradient-dark border border-border p-6 shadow-card flex-1 flex flex-col items-center justify-center">
              <p className="text-xl sm:text-2xl font-extrabold tracking-tight text-primary animate-pulse text-center px-2 leading-tight">
                {t("session.workMsg")}
              </p>
              <p className="mt-6 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("session.set")}</p>
              <p className="font-mono-timer text-4xl font-bold mt-1">
                {setIdx + 1}<span className="text-muted-foreground text-xl">/{current!.sets}</span>
              </p>
              {currentMode === "time" ? (
                <>
                  <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {timeLeft === 0 ? t("session.timesUp") : t("session.timeLeft")}
                  </p>
                  <div className="relative mt-3 mb-4">
                    {timerRunning && timeLeft <= 5 && timeLeft > 0 && (
                      <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
                    )}
                    <p
                      key={timeLeft}
                      className={`relative font-mono-timer font-extrabold tracking-tighter ${
                        timerRunning && timeLeft <= 5 && timeLeft > 0
                          ? "text-primary text-8xl animate-count-pop"
                          : timeLeft === 0
                            ? "text-primary text-8xl"
                            : "text-primary text-7xl"
                      }`}
                    >
                      {formatTime(timeLeft)}
                      <span className="text-muted-foreground text-xl ml-2 font-mono-timer">{t("session.sec")}</span>
                    </p>
                  </div>
                </>
              ) : (
                <>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("session.target")}</p>
                <p className="font-mono-timer text-3xl font-bold mt-1 text-primary">
                  {repsForSet(setIdx)} <span className="text-muted-foreground text-base">{t("session.repsLabel")}</span>
                </p>
                </>
              )}
              {current!.repsPerSet && (
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("session.pyramid")}: {current!.repsPerSet.join(" · ")}{currentMode === "time" ? "s" : ""}
                </p>
              )}
            </div>

            <p className="mt-4 text-center text-sm text-muted-foreground px-4">
              {t("session.afterSet", { action: t("session.startRest") })}
            </p>

            <Button onClick={completeSet} className="mt-5 w-full h-16 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-extrabold text-lg shadow-glow">
              <Check className="w-5 h-5 mr-2" /> {t("session.startRest")}
            </Button>
          </div>
        )}

        {phase === "resting" && (
          <div className="mt-6 flex-1 flex flex-col items-center justify-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("session.rest")}</p>
            <div className="relative mt-4">
              {restLeft <= 10 && (
                <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
              )}
              <div className={`relative font-mono-timer font-extrabold tracking-tighter ${restLeft <= 10 ? "text-primary text-[9rem] animate-count-pop" : "text-foreground text-[7rem]"}`}
                key={restLeft}>
                {formatTime(restLeft)}
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t("session.nextSet", { n: setIdx + 1, total: current!.sets })}</p>

            <div className="mt-10 grid grid-cols-2 gap-3 w-full">
              <Button variant="outline" onClick={() => setRestLeft(r => r + 15)} className="h-14 rounded-2xl border-border bg-secondary text-foreground font-semibold">{t("session.add15")}</Button>
              <Button onClick={skipRest} className="h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                <SkipForward className="w-4 h-4 mr-1.5" /> {t("session.skipRest")}
              </Button>
            </div>
          </div>
        )}

        {phase === "ready" && (
          <div className="mt-6 flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {completedSetsAcrossExercises === 0 && setIdx === 0 ? t("session.starting") : t("session.getUp")}
            </p>
            <h2 className="mt-4 font-extrabold tracking-tight text-5xl leading-tight">
              {t("session.readySetGo")}
            </h2>
            <p className="mt-8 font-mono-timer text-6xl font-bold text-primary animate-count-pop" key={readyLeft}>
              {readyLeft}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">{t("session.setOf", { n: setIdx + 1, total: current!.sets, name: current!.name })}</p>
          </div>
        )}

        {phase === "logging" && (
          <LoggingPanel
            unit={settings.weightUnit}
            sets={pendingSets}
            setSets={setPendingSets}
            onConfirm={confirmLogging}
            restSeconds={current!.restSeconds}
            mode={current!.mode ?? "weight_reps"}
            t={t}
          />
        )}
      </div>
      <ExitDialog open={exitOpen} onOpenChange={setExitOpen} hasLogs={logs.length > 0} onConfirm={confirmExit} t={t} />
    </AppShell>
  );
};

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m > 0) return `${m}:${String(sec).padStart(2, "0")}`;
  return String(sec);
}

function computeFocusScore(breaks: number, totalAwayMs: number): number {
  let score = 100;
  score -= breaks * 5;
  if (totalAwayMs > 30_000) score -= 10;
  return Math.max(0, Math.min(100, score));
}

function focusLabel(score: number): { label: string; tone: string } {
  if (score >= 85) return { label: "Locked In", tone: "text-primary" };
  if (score >= 60) return { label: "Focused", tone: "text-foreground" };
  return { label: "Distracted", tone: "text-muted-foreground" };
}

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-2xl bg-card border border-border p-3">
    <p className="font-mono-timer text-2xl font-bold">{value}</p>
    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{label}</p>
  </div>
);

const FocusChip = ({ count, t }: { count: number; t: (k: string, p?: Record<string, string | number>) => string }) => (
  <span
    title="Times you left the app during this workout"
    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider border ${count > 0 ? "border-warning/40 bg-warning/10 text-warning" : "border-border bg-muted text-muted-foreground"}`}
  >
    <Eye className="w-3 h-3" />
    {t("session.focusBreaks", { n: count })}
  </span>
);

const ExitDialog = ({
  open, onOpenChange, hasLogs, onConfirm, t,
}: { open: boolean; onOpenChange: (v: boolean) => void; hasLogs: boolean; onConfirm: () => void; t: (k: string) => string }) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent className="rounded-2xl border-border bg-card max-w-sm">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-xl font-extrabold tracking-tight">{t("session.endTitle")}</AlertDialogTitle>
        <AlertDialogDescription className="text-sm text-muted-foreground">
          {t("session.endDesc")}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="gap-2">
        <AlertDialogCancel className="rounded-xl">{t("session.keepGoing")}</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          {t("session.endSession")}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const LoggingPanel = ({
  unit, sets, setSets, onConfirm, restSeconds, mode, t,
}: {
  unit: string;
  sets: SetLog[];
  setSets: (updater: (prev: SetLog[]) => SetLog[]) => void;
  onConfirm: () => void;
  restSeconds: number;
  mode: ExerciseMode;
  t: (k: string, p?: Record<string, string | number>) => string;
}) => {
  const update = (i: number, patch: Partial<SetLog>) =>
    setSets(prev => prev.map((s, idx) => idx === i ? { ...s, ...patch } : s));

  const setAllWeight = (w: number) =>
    setSets(prev => prev.map(s => ({ ...s, weight: w })));

  const firstWeight = sets[0]?.weight ?? 0;
  const allSame = sets.every(s => s.weight === firstWeight);

  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = Math.floor(elapsed / 60);
  const ss = elapsed % 60;
  const timeStr = `${mm}:${String(ss).padStart(2, "0")}`;

  return (
    <div className="mt-5 flex-1 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("session.logSets")}</p>
          <p className="text-sm text-muted-foreground mt-1">{t("session.logHint")}</p>
        </div>
        <div className="rounded-xl bg-secondary border border-border px-3 py-1.5 text-center shrink-0">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground leading-none">{t("session.recover")}</p>
          <p className="font-mono-timer text-lg font-bold text-primary leading-tight mt-0.5">{timeStr}</p>
        </div>
      </div>

      {/* Bulk weight - applies to all sets if same. Only for weight×reps mode. */}
      {mode === "weight_reps" && (
        <div className="mt-4 rounded-2xl bg-card border border-border p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
            {t("session.weightAll", { unit })}
          </p>
          <Stepper
            value={firstWeight}
            onChange={setAllWeight}
            step={2.5}
            decimals
            large
          />
          {!allSame && (
            <p className="text-[10px] text-muted-foreground text-center mt-1">{t("session.differs")}</p>
          )}
        </div>
      )}

      {/* Per-set rows */}
      <ul className="mt-3 space-y-2 overflow-y-auto">
        {sets.map((s, i) => (
          <li key={i} className="rounded-2xl bg-card border border-border p-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold w-7 h-7 rounded-full bg-secondary text-foreground flex items-center justify-center shrink-0">{i + 1}</span>
              <div className="flex-1 grid grid-cols-2 gap-2">
                {mode === "weight_reps" && (
                  <>
                    <MiniStepper label={unit} value={s.weight} onChange={v => update(i, { weight: v })} step={2.5} decimals />
                    <MiniStepper label={t("session.repsLabel")} value={s.reps} onChange={v => update(i, { reps: v })} step={1} />
                  </>
                )}
                {mode === "reps" && (
                  <div className="col-span-2">
                    <MiniStepper label={t("session.repsLabel")} value={s.reps} onChange={v => update(i, { reps: v })} step={1} />
                  </div>
                )}
                {mode === "time" && (
                  <div className="col-span-2">
                    <MiniStepper label={t("session.seconds")} value={s.seconds ?? 0} onChange={v => update(i, { seconds: v })} step={5} />
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Button onClick={onConfirm} className="mt-4 w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-extrabold text-base shadow-glow">
        <Check className="w-5 h-5 mr-2" /> {t("session.saveContinue")}
      </Button>
    </div>
  );
};

const Stepper = ({
  value, onChange, step, decimals, large,
}: { value: number; onChange: (v: number) => void; step: number; decimals?: boolean; large?: boolean }) => {
  const dec = () => onChange(Math.max(0, +(value - step).toFixed(decimals ? 2 : 0)));
  const inc = () => onChange(+(value + step).toFixed(decimals ? 2 : 0));
  return (
    <div className="flex items-center justify-between mt-2 gap-2">
      <button onClick={dec} className={`${large ? "w-12 h-12" : "w-9 h-9"} rounded-full bg-secondary text-foreground font-bold shrink-0 flex items-center justify-center`}>
        <Minus className="w-5 h-5" />
      </button>
      <input
        inputMode="decimal"
        value={value === 0 ? "" : String(value)}
        placeholder="0"
        onChange={e => {
          const v = parseFloat(e.target.value.replace(/[^0-9.]/g, "")) || 0;
          onChange(v);
        }}
        className={`flex-1 min-w-0 bg-transparent text-center font-mono-timer font-bold outline-none ${large ? "text-4xl" : "text-2xl"}`}
      />
      <button onClick={inc} className={`${large ? "w-12 h-12" : "w-9 h-9"} rounded-full bg-secondary text-foreground font-bold shrink-0 flex items-center justify-center`}>
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

const MiniStepper = ({
  label, value, onChange, step, decimals,
}: { label: string; value: number; onChange: (v: number) => void; step: number; decimals?: boolean }) => {
  const dec = () => onChange(Math.max(0, +(value - step).toFixed(decimals ? 2 : 0)));
  const inc = () => onChange(+(value + step).toFixed(decimals ? 2 : 0));
  return (
    <div className="rounded-xl bg-secondary p-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">{label}</p>
      <div className="flex items-center justify-between mt-1 gap-1">
        <button onClick={dec} className="w-7 h-7 rounded-full bg-background text-foreground font-bold text-sm shrink-0">−</button>
        <input
          inputMode="decimal"
          value={value === 0 ? "" : String(value)}
          placeholder="0"
          onChange={e => {
            const v = parseFloat(e.target.value.replace(/[^0-9.]/g, "")) || 0;
            onChange(v);
          }}
          className="flex-1 min-w-0 bg-transparent text-center font-mono-timer text-base font-bold outline-none"
        />
        <button onClick={inc} className="w-7 h-7 rounded-full bg-background text-foreground font-bold text-sm shrink-0">+</button>
      </div>
    </div>
  );
};
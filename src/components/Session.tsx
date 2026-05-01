import { useEffect, useMemo, useRef, useState } from "react";
import { Lock, Check, SkipForward, X, Plus, Minus } from "lucide-react";
import { AppShell } from "./AppShell";
import { Button } from "@/components/ui/button";
import { PinPad } from "./PinPad";
import { storage, uid } from "@/lib/storage";
import type { Workout, SessionLog, ExerciseLog, SetLog } from "@/lib/types";
import { beep, vibrate } from "@/lib/feedback";
import { toast } from "sonner";

interface Props {
  workoutId: string;
  onExit: () => void;
}

type Phase = "lifting" | "resting" | "ready" | "logging" | "done";

export const Session = ({ workoutId, onExit }: Props) => {
  const settings = useMemo(() => storage.getSettings(), []);
  const workout = useMemo<Workout | undefined>(
    () => storage.getWorkouts().find(w => w.id === workoutId),
    [workoutId]
  );

  const [exIdx, setExIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0); // sets completed for current exercise
  const [phase, setPhase] = useState<Phase>("ready");
  const [restLeft, setRestLeft] = useState(0);
  const [readyLeft, setReadyLeft] = useState(5);
  const [showUnlock, setShowUnlock] = useState(false);
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  // pending logging state for an exercise just finished
  const [pendingSets, setPendingSets] = useState<SetLog[]>([]);
  const sessionIdRef = useRef(uid());
  const startedAtRef = useRef(Date.now());
  const wakeLockRef = useRef<any>(null);
  const lastBeepRef = useRef(-1);

  const current = workout?.exercises[exIdx];

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
          setReadyLeft(5);
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
          <p>Workout not found.</p>
          <Button onClick={onExit} className="mt-4">Back</Button>
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
      const seed: SetLog[] = Array.from({ length: current.sets }).map((_, i) => ({
        setIndex: i,
        weight: last,
        reps: current.reps,
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
    setReadyLeft(5);
    setPhase("ready");
  };

  const saveLogged = (newLogs: ExerciseLog[]) => {
    const session: SessionLog = {
      id: sessionIdRef.current,
      workoutId: workout.id,
      workoutName: workout.name,
      startedAt: startedAtRef.current,
      endedAt: Date.now(),
      exercises: newLogs,
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

    const isLastExercise = exIdx + 1 >= workout.exercises.length;
    if (isLastExercise) {
      setPhase("done");
      return;
    }
    setExIdx(i => i + 1);
    setSetIdx(0);
    setPendingSets([]);
    setPhase("lifting");
  };

  const requestExit = () => setShowUnlock(true);
  const confirmExit = () => {
    if (logs.length > 0) saveLogged(logs);
    toast("Session ended");
    onExit();
  };

  // Done screen
  if (phase === "done") {
    const totalReps = logs.reduce((s, e) => s + e.sets.reduce((ss, x) => ss + x.reps, 0), 0);
    const totalVolume = logs.reduce((s, e) => s + e.sets.reduce((ss, x) => ss + x.reps * x.weight, 0), 0);
    const setsLogged = logs.reduce((s, e) => s + e.sets.length, 0);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center shadow-glow">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold tracking-tight">Locked in. Done.</h2>
        <p className="mt-2 text-sm text-muted-foreground">{workout.name}</p>
        <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-xs">
          <Stat label="Sets" value={setsLogged} />
          <Stat label="Reps" value={totalReps} />
          <Stat label={`Vol ${settings.weightUnit}`} value={Math.round(totalVolume)} />
        </div>
        <Button onClick={onExit} className="mt-10 w-full max-w-xs h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold">Finish</Button>
      </div>
    );
  }

  return (
    <AppShell immersive>
      {showUnlock && (
        <PinPad
          title="Enter unlock code"
          subtitle="Confirm you really want to leave the session."
          expectedCode={settings.unlockCode}
          onSuccess={confirmExit}
          onCancel={() => setShowUnlock(false)}
        />
      )}

      <div className="flex-1 flex flex-col px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary tracking-[0.2em] uppercase">
            <Lock className="w-3.5 h-3.5" /> Locked in
          </div>
          <button onClick={requestExit} aria-label="End session" className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-base">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="mt-3 flex gap-1">
          {Array.from({ length: totalSets }).map((_, i) => (
            <span key={i} className={`flex-1 h-1 rounded-full ${i < progressDots ? "bg-primary" : "bg-secondary"}`} />
          ))}
        </div>

        {/* Exercise heading */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Exercise {exIdx + 1} / {workout.exercises.length}
          </p>
          <h2 className="mt-1 text-3xl font-extrabold tracking-tight leading-tight">{current!.name}</h2>
        </div>

        {phase === "lifting" && (
          <div className="mt-6 flex-1 flex flex-col">
            <div className="rounded-3xl bg-gradient-dark border border-border p-6 shadow-card flex-1 flex flex-col items-center justify-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary/70 animate-pulse">
                • Lifting in progress
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Set</p>
              <p className="font-mono-timer text-7xl font-bold mt-2">
                {setIdx + 1}<span className="text-muted-foreground text-3xl">/{current!.sets}</span>
              </p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target</p>
              <p className="font-mono-timer text-5xl font-bold mt-1 text-primary">{current!.reps} <span className="text-muted-foreground text-xl">reps</span></p>
            </div>

            <p className="mt-4 text-center text-sm text-muted-foreground px-4">
              After you finish your set, press <span className="text-foreground font-semibold">Start Rest</span> to recover for the next lift.
            </p>

            <Button onClick={completeSet} className="mt-5 w-full h-16 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-extrabold text-lg shadow-glow">
              <Check className="w-5 h-5 mr-2" /> Start Rest
            </Button>
          </div>
        )}

        {phase === "resting" && (
          <div className="mt-6 flex-1 flex flex-col items-center justify-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rest</p>
            <div className="relative mt-4">
              {restLeft <= 10 && (
                <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
              )}
              <div className={`relative font-mono-timer font-extrabold tracking-tighter ${restLeft <= 10 ? "text-primary text-[9rem] animate-count-pop" : "text-foreground text-[7rem]"}`}
                key={restLeft}>
                {formatTime(restLeft)}
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Next: set {setIdx + 1} of {current!.sets}</p>

            <div className="mt-10 grid grid-cols-2 gap-3 w-full">
              <Button variant="outline" onClick={() => setRestLeft(r => r + 15)} className="h-14 rounded-2xl border-border bg-secondary text-foreground font-semibold">+15s</Button>
              <Button onClick={skipRest} className="h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                <SkipForward className="w-4 h-4 mr-1.5" /> Skip rest
              </Button>
            </div>
          </div>
        )}

        {phase === "ready" && (
          <div className="mt-6 flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {completedSetsAcrossExercises === 0 && setIdx === 0 ? "Starting" : "Get up"}
            </p>
            <h2 className="mt-4 font-extrabold tracking-tight text-5xl leading-tight">
              Ready,<br/>Set,<br/><span className="text-primary">Lift!</span>
            </h2>
            <p className="mt-8 font-mono-timer text-6xl font-bold text-primary animate-count-pop" key={readyLeft}>
              {readyLeft}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">Set {setIdx + 1} of {current!.sets} — {current!.name}</p>
          </div>
        )}

        {phase === "logging" && (
          <LoggingPanel
            unit={settings.weightUnit}
            sets={pendingSets}
            setSets={setPendingSets}
            onConfirm={confirmLogging}
            restSeconds={current!.restSeconds}
          />
        )}
      </div>
    </AppShell>
  );
};

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m > 0) return `${m}:${String(sec).padStart(2, "0")}`;
  return String(sec);
}

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-2xl bg-card border border-border p-3">
    <p className="font-mono-timer text-2xl font-bold">{value}</p>
    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{label}</p>
  </div>
);

const LoggingPanel = ({
  unit, sets, setSets, onConfirm, restSeconds,
}: {
  unit: string;
  sets: SetLog[];
  setSets: (updater: (prev: SetLog[]) => SetLog[]) => void;
  onConfirm: () => void;
  restSeconds: number;
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
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Log your sets</p>
          <p className="text-sm text-muted-foreground mt-1">Enter your results while you recover for the next exercise.</p>
        </div>
        <div className="rounded-xl bg-secondary border border-border px-3 py-1.5 text-center shrink-0">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground leading-none">Recover</p>
          <p className="font-mono-timer text-lg font-bold text-primary leading-tight mt-0.5">{timeStr}</p>
        </div>
      </div>

      {/* Bulk weight - applies to all sets if same */}
      <div className="mt-4 rounded-2xl bg-card border border-border p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
          Weight all sets ({unit})
        </p>
        <Stepper
          value={firstWeight}
          onChange={setAllWeight}
          step={2.5}
          decimals
          large
        />
        {!allSame && (
          <p className="text-[10px] text-muted-foreground text-center mt-1">Per-set weights differ — tap a row to override.</p>
        )}
      </div>

      {/* Per-set rows */}
      <ul className="mt-3 space-y-2 overflow-y-auto">
        {sets.map((s, i) => (
          <li key={i} className="rounded-2xl bg-card border border-border p-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold w-7 h-7 rounded-full bg-secondary text-foreground flex items-center justify-center shrink-0">{i + 1}</span>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <MiniStepper
                  label={unit}
                  value={s.weight}
                  onChange={v => update(i, { weight: v })}
                  step={2.5}
                  decimals
                />
                <MiniStepper
                  label="reps"
                  value={s.reps}
                  onChange={v => update(i, { reps: v })}
                  step={1}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Button onClick={onConfirm} className="mt-4 w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-extrabold text-base shadow-glow">
        <Check className="w-5 h-5 mr-2" /> Save & continue
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
import { useEffect, useMemo, useRef, useState } from "react";
import { Lock, Check, SkipForward, X } from "lucide-react";
import { AppShell } from "./AppShell";
import { Button } from "@/components/ui/button";
import { PinPad } from "./PinPad";
import { storage, uid } from "@/lib/storage";
import type { Workout, SessionLog, ExerciseLog } from "@/lib/types";
import { beep, vibrate } from "@/lib/feedback";
import { toast } from "sonner";

interface Props {
  workoutId: string;
  onExit: () => void;
}

type Phase = "lifting" | "resting" | "done";

export const Session = ({ workoutId, onExit }: Props) => {
  const settings = useMemo(() => storage.getSettings(), []);
  const workout = useMemo<Workout | undefined>(
    () => storage.getWorkouts().find(w => w.id === workoutId),
    [workoutId]
  );

  const [exIdx, setExIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("lifting");
  const [restLeft, setRestLeft] = useState(0);
  const [weight, setWeight] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const [showUnlock, setShowUnlock] = useState(false);
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const sessionIdRef = useRef(uid());
  const startedAtRef = useRef(Date.now());
  const wakeLockRef = useRef<any>(null);
  const lastBeepRef = useRef(-1);

  const current = workout?.exercises[exIdx];

  // Initialize last weight when exercise changes
  useEffect(() => {
    if (!current) return;
    const last = storage.getLastWeights()[current.name.toLowerCase()];
    setWeight(last ? String(last) : "");
    setReps(String(current.reps));
    setSetIdx(0);
    setPhase("lifting");
  }, [exIdx, current]);

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
          setPhase("lifting");
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, settings]);

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
  const completedSets = logs.reduce((s, e) => s + e.sets.length, 0);

  const logSet = () => {
    if (!current) return;
    const w = parseFloat(weight) || 0;
    const r = parseInt(reps) || 0;
    setLogs(prev => {
      const copy = [...prev];
      let entry = copy.find(e => e.exerciseId === current.id);
      if (!entry) { entry = { exerciseId: current.id, exerciseName: current.name, sets: [] }; copy.push(entry); }
      entry.sets.push({ setIndex: setIdx, weight: w, reps: r, completedAt: Date.now() });
      return copy;
    });
    if (w > 0) storage.setLastWeight(current.name, w);
    if (settings.vibration) vibrate(30);

    const isLastSet = setIdx + 1 >= current.sets;
    const isLastExercise = exIdx + 1 >= workout.exercises.length;

    if (isLastSet && isLastExercise) {
      finish([...logs]); // finish below uses fresh logs via state, but pass current snapshot
      setPhase("done");
      return;
    }
    if (isLastSet) {
      setExIdx(i => i + 1);
      return;
    }
    setSetIdx(i => i + 1);
    setRestLeft(current.restSeconds);
    lastBeepRef.current = -1;
    setPhase("resting");
  };

  const skipRest = () => { setPhase("lifting"); setRestLeft(0); };

  const finish = (_snapshot?: ExerciseLog[]) => {
    const session: SessionLog = {
      id: sessionIdRef.current,
      workoutId: workout.id,
      workoutName: workout.name,
      startedAt: startedAtRef.current,
      endedAt: Date.now(),
      exercises: logs,
    };
    storage.appendSession(session);
  };

  const requestExit = () => setShowUnlock(true);
  const confirmExit = () => { finish(); toast("Session ended"); onExit(); };

  // Done screen
  if (phase === "done") {
    const totalReps = logs.reduce((s, e) => s + e.sets.reduce((ss, x) => ss + x.reps, 0), 0);
    const totalVolume = logs.reduce((s, e) => s + e.sets.reduce((ss, x) => ss + x.reps * x.weight, 0), 0);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center shadow-glow">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold tracking-tight">Locked in. Done.</h2>
        <p className="mt-2 text-sm text-muted-foreground">{workout.name}</p>
        <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-xs">
          <Stat label="Sets" value={completedSets} />
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
            <span key={i} className={`flex-1 h-1 rounded-full ${i < completedSets ? "bg-primary" : "bg-secondary"}`} />
          ))}
        </div>

        {/* Exercise heading */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Exercise {exIdx + 1} / {workout.exercises.length}
          </p>
          <h2 className="mt-1 text-3xl font-extrabold tracking-tight leading-tight">{current!.name}</h2>
        </div>

        {phase === "lifting" ? (
          <div className="mt-6 flex-1 flex flex-col">
            <div className="rounded-3xl bg-gradient-dark border border-border p-6 shadow-card">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Set</p>
                  <p className="font-mono-timer text-5xl font-bold mt-1">
                    {setIdx + 1}<span className="text-muted-foreground text-2xl">/{current!.sets}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target</p>
                  <p className="font-mono-timer text-5xl font-bold mt-1 text-primary">{current!.reps}</p>
                  <p className="text-xs text-muted-foreground -mt-1">reps</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <NumPadField label={`Weight (${settings.weightUnit})`} value={weight} onChange={setWeight} step={2.5} decimals />
              <NumPadField label="Reps done" value={reps} onChange={setReps} step={1} />
            </div>

            <Button onClick={logSet} className="mt-auto w-full h-16 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-extrabold text-lg shadow-glow">
              <Check className="w-5 h-5 mr-2" /> Log set
            </Button>
          </div>
        ) : (
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

const NumPadField = ({
  label, value, onChange, step, decimals,
}: { label: string; value: string; onChange: (v: string) => void; step: number; decimals?: boolean }) => {
  const num = parseFloat(value) || 0;
  const dec = () => onChange(String(Math.max(0, +(num - step).toFixed(decimals ? 2 : 0))));
  const inc = () => onChange(String(+(num + step).toFixed(decimals ? 2 : 0)));
  return (
    <div className="rounded-2xl bg-card border border-border p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">{label}</p>
      <div className="flex items-center justify-between mt-2 gap-1">
        <button onClick={dec} className="w-9 h-9 rounded-full bg-secondary text-foreground font-bold text-lg shrink-0">−</button>
        <input
          inputMode="decimal"
          value={value}
          onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
          placeholder="0"
          className="flex-1 min-w-0 bg-transparent text-center font-mono-timer text-2xl font-bold outline-none"
        />
        <button onClick={inc} className="w-9 h-9 rounded-full bg-secondary text-foreground font-bold text-lg shrink-0">+</button>
      </div>
    </div>
  );
};
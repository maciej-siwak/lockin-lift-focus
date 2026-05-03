import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Check } from "lucide-react";
import { AppShell } from "./AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { storage, uid } from "@/lib/storage";
import type { Workout, ExerciseTemplate, ExerciseMode } from "@/lib/types";
import { toast } from "sonner";

interface Props {
  workoutId?: string;
  onBack: () => void;
  onSaved: () => void;
}

export const WorkoutBuilder = ({ workoutId, onBack, onSaved }: Props) => {
  const settings = storage.getSettings();
  const [name, setName] = useState("Push Day");
  const [exercises, setExercises] = useState<ExerciseTemplate[]>([]);

  useEffect(() => {
    if (workoutId) {
      const w = storage.getWorkouts().find(x => x.id === workoutId);
      if (w) { setName(w.name); setExercises(w.exercises); }
    } else {
      setExercises([newExercise(settings.defaultRestSeconds)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workoutId]);

  function newExercise(rest: number): ExerciseTemplate {
    return { id: uid(), name: "", sets: 3, reps: 8, restSeconds: rest, mode: "weight_reps", targetSeconds: 30, repsPerSet: undefined };
  }

  const update = (id: string, patch: Partial<ExerciseTemplate>) => {
    setExercises(list => list.map(e => e.id === id ? { ...e, ...patch } : e));
  };
  const remove = (id: string) => setExercises(list => list.filter(e => e.id !== id));

  const togglePyramid = (ex: ExerciseTemplate) => {
    if (ex.repsPerSet) {
      update(ex.id, { repsPerSet: undefined });
    } else {
      update(ex.id, { repsPerSet: Array.from({ length: ex.sets }).map(() => ex.reps) });
    }
  };

  const setSetCount = (ex: ExerciseTemplate, sets: number) => {
    if (ex.repsPerSet) {
      const next = Array.from({ length: sets }).map((_, i) => ex.repsPerSet?.[i] ?? ex.reps);
      update(ex.id, { sets, repsPerSet: next });
    } else {
      update(ex.id, { sets });
    }
  };

  const setRepAt = (ex: ExerciseTemplate, idx: number, v: number) => {
    const arr = (ex.repsPerSet ?? Array.from({ length: ex.sets }).map(() => ex.reps)).slice();
    arr[idx] = v;
    update(ex.id, { repsPerSet: arr });
  };

  const save = () => {
    const cleaned = exercises.map(e => {
      const trimmed = { ...e, name: e.name.trim() };
      if (trimmed.repsPerSet) {
        trimmed.repsPerSet = trimmed.repsPerSet.slice(0, trimmed.sets);
        while (trimmed.repsPerSet.length < trimmed.sets) trimmed.repsPerSet.push(trimmed.reps);
      }
      return trimmed;
    }).filter(e => e.name);
    if (!name.trim()) return toast.error("Name your workout");
    if (cleaned.length === 0) return toast.error("Add at least one exercise");
    const all = storage.getWorkouts();
    if (workoutId) {
      const idx = all.findIndex(w => w.id === workoutId);
      if (idx >= 0) all[idx] = { ...all[idx], name: name.trim(), exercises: cleaned };
    } else {
      const w: Workout = { id: uid(), name: name.trim(), createdAt: Date.now(), exercises: cleaned };
      all.unshift(w);
    }
    storage.saveWorkouts(all);
    toast.success("Workout saved");
    onSaved();
  };

  return (
    <AppShell
      title={workoutId ? "Edit workout" : "New workout"}
      left={<button onClick={onBack} aria-label="Back" className="p-2 -ml-2"><ArrowLeft className="w-5 h-5" /></button>}
      right={<button onClick={save} aria-label="Save" className="p-2 -mr-2 text-primary"><Check className="w-5 h-5" /></button>}
    >
      <div className="pt-5 space-y-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workout name</label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Push Day"
            className="mt-2 h-12 text-base bg-card border-border rounded-xl"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exercises</label>
          </div>
          <ul className="space-y-3">
            {exercises.map((ex, i) => (
              <li key={ex.id} className="rounded-2xl bg-card border border-border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold w-6 h-6 rounded-full bg-secondary text-foreground flex items-center justify-center">{i + 1}</span>
                  <Input
                    value={ex.name}
                    onChange={e => update(ex.id, { name: e.target.value })}
                    placeholder="Exercise name (e.g. Bench Press)"
                    className="flex-1 h-11 bg-secondary border-0 rounded-lg"
                  />
                  <button onClick={() => remove(ex.id)} aria-label="Remove" className="p-2 text-muted-foreground hover:text-destructive transition-base">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <ModeToggle
                  value={ex.mode ?? "weight_reps"}
                  onChange={m => update(ex.id, { mode: m })}
                />
                <div className="grid grid-cols-3 gap-2">
                  <NumField label="Sets" value={ex.sets} min={1} max={20} onChange={v => setSetCount(ex, v)} />
                  {(ex.mode ?? "weight_reps") === "time" ? (
                    <NumField label="Time" suffix="s" step={5} value={ex.targetSeconds ?? 30} min={5} max={1800} onChange={v => update(ex.id, { targetSeconds: v })} />
                  ) : (
                    <NumField
                      label={ex.repsPerSet ? "Base reps" : "Reps"}
                      value={ex.reps}
                      min={1}
                      max={50}
                      onChange={v => update(ex.id, { reps: v })}
                    />
                  )}
                  <NumField label="Rest" suffix="s" step={15} value={ex.restSeconds} min={15} max={600} onChange={v => update(ex.id, { restSeconds: v })} />
                </div>

                {(ex.mode ?? "weight_reps") !== "time" && (
                  <div className="rounded-xl bg-secondary/60 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold">Pyramid sets</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                          Different reps per set — e.g. 10, 8, 6.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => togglePyramid(ex)}
                        aria-pressed={!!ex.repsPerSet}
                        className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-base ${
                          ex.repsPerSet
                            ? "bg-primary text-primary-foreground shadow-glow"
                            : "bg-background border border-border text-muted-foreground"
                        }`}
                      >
                        {ex.repsPerSet ? "On" : "Off"}
                      </button>
                    </div>
                    {ex.repsPerSet && (
                      <div className="mt-3 grid grid-cols-4 gap-1.5">
                        {Array.from({ length: ex.sets }).map((_, i) => (
                          <PyramidCell
                            key={i}
                            index={i}
                            value={ex.repsPerSet?.[i] ?? ex.reps}
                            onChange={v => setRepAt(ex, i, v)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground px-1">
                  {(ex.mode ?? "weight_reps") === "weight_reps" && "You'll log weight × reps for each set (e.g. Bench Press)."}
                  {ex.mode === "reps" && "Bodyweight — you'll log reps only (e.g. Dips, Pull-ups)."}
                  {ex.mode === "time" && "Timed hold — you'll log seconds per set (e.g. Battle Ropes, Plank)."}
                </p>
              </li>
            ))}
          </ul>

          <Button
            variant="outline"
            onClick={() => setExercises(list => [...list, newExercise(settings.defaultRestSeconds)])}
            className="w-full mt-3 h-12 rounded-2xl border-dashed border-border bg-transparent text-foreground hover:bg-secondary"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add exercise
          </Button>
        </div>

        <Button onClick={save} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base shadow-glow">
          Save workout
        </Button>
      </div>
    </AppShell>
  );
};

const NumField = ({
  label, value, onChange, min = 0, max = 999, step = 1, suffix,
}: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; suffix?: string }) => {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));
  return (
    <div className="rounded-xl bg-secondary p-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">{label}</p>
      <div className="flex items-center justify-between mt-1">
        <button onClick={dec} className="w-7 h-7 rounded-full bg-background text-foreground font-bold text-sm">−</button>
        <span className="font-mono-timer font-bold text-lg">{value}{suffix}</span>
        <button onClick={inc} className="w-7 h-7 rounded-full bg-background text-foreground font-bold text-sm">+</button>
      </div>
    </div>
  );
};

const ModeToggle = ({ value, onChange }: { value: ExerciseMode; onChange: (m: ExerciseMode) => void }) => {
  const opts: Array<{ id: ExerciseMode; label: string; hint: string }> = [
    { id: "weight_reps", label: "Weight × Reps", hint: "Bench, Squat" },
    { id: "reps", label: "Reps only", hint: "Dips, Pull-ups" },
    { id: "time", label: "Time", hint: "Plank, Ropes" },
  ];
  return (
    <div className="rounded-xl bg-secondary p-1 grid grid-cols-3 gap-1">
      {opts.map(o => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-lg px-2 py-1.5 text-center transition-base ${
              active
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <p className="text-[11px] font-bold leading-tight">{o.label}</p>
            <p className={`text-[9px] leading-tight ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{o.hint}</p>
          </button>
        );
      })}
    </div>
  );
};
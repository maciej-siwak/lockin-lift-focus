import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Check } from "lucide-react";
import { AppShell } from "./AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { storage, uid } from "@/lib/storage";
import type { Workout, ExerciseTemplate, ExerciseMode } from "@/lib/types";
import { toast } from "sonner";
import { useT } from "@/lib/i18n";

interface Props {
  workoutId?: string;
  onBack: () => void;
  onSaved: () => void;
}

export const WorkoutBuilder = ({ workoutId, onBack, onSaved }: Props) => {
  const t = useT();
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
    const isTime = (ex.mode ?? "weight_reps") === "time";
    const base = isTime ? (ex.targetSeconds ?? 30) : ex.reps;
    if (ex.repsPerSet) {
      update(ex.id, { repsPerSet: undefined });
    } else {
      update(ex.id, { repsPerSet: Array.from({ length: ex.sets }).map(() => base) });
    }
  };

  const setSetCount = (ex: ExerciseTemplate, sets: number) => {
    const isTime = (ex.mode ?? "weight_reps") === "time";
    const base = isTime ? (ex.targetSeconds ?? 30) : ex.reps;
    if (ex.repsPerSet) {
      const next = Array.from({ length: sets }).map((_, i) => ex.repsPerSet?.[i] ?? base);
      update(ex.id, { sets, repsPerSet: next });
    } else {
      update(ex.id, { sets });
    }
  };

  const setRepAt = (ex: ExerciseTemplate, idx: number, v: number) => {
    const isTime = (ex.mode ?? "weight_reps") === "time";
    const base = isTime ? (ex.targetSeconds ?? 30) : ex.reps;
    const arr = (ex.repsPerSet ?? Array.from({ length: ex.sets }).map(() => base)).slice();
    arr[idx] = v;
    update(ex.id, { repsPerSet: arr });
  };

  const save = () => {
    const cleaned = exercises.map(e => {
      const trimmed = { ...e, name: e.name.trim() };
      if (trimmed.repsPerSet) {
        const isTime = (trimmed.mode ?? "weight_reps") === "time";
        const base = isTime ? (trimmed.targetSeconds ?? 30) : trimmed.reps;
        trimmed.repsPerSet = trimmed.repsPerSet.slice(0, trimmed.sets);
        while (trimmed.repsPerSet.length < trimmed.sets) trimmed.repsPerSet.push(base);
      }
      return trimmed;
    }).filter(e => e.name);
    if (!name.trim()) return toast.error(t("builder.errName"));
    if (cleaned.length === 0) return toast.error(t("builder.errExercise"));
    const all = storage.getWorkouts();
    if (workoutId) {
      const idx = all.findIndex(w => w.id === workoutId);
      if (idx >= 0) all[idx] = { ...all[idx], name: name.trim(), exercises: cleaned };
    } else {
      const w: Workout = { id: uid(), name: name.trim(), createdAt: Date.now(), exercises: cleaned };
      all.unshift(w);
    }
    storage.saveWorkouts(all);
    toast.success(t("builder.savedToast"));
    onSaved();
  };

  return (
    <AppShell
      title={workoutId ? t("builder.editTitle") : t("builder.newTitle")}
      left={<button onClick={onBack} aria-label={t("common.back")} className="p-2 -ml-2"><ArrowLeft className="w-5 h-5" /></button>}
      right={<button onClick={save} aria-label={t("common.save")} className="p-2 -mr-2 text-primary"><Check className="w-5 h-5" /></button>}
    >
      <div className="pt-5 space-y-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("builder.workoutName")}</label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t("builder.workoutNamePh")}
            className="mt-2 h-12 text-base bg-card border-border rounded-xl"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("builder.exercises")}</label>
          </div>
          <ul className="space-y-3">
            {exercises.map((ex, i) => (
              <li key={ex.id} className="rounded-2xl bg-card border border-border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold w-6 h-6 rounded-full bg-secondary text-foreground flex items-center justify-center">{i + 1}</span>
                  <Input
                    value={ex.name}
                    onChange={e => update(ex.id, { name: e.target.value })}
                    placeholder={t("builder.exerciseNamePh")}
                    className="flex-1 h-11 bg-secondary border-0 rounded-lg"
                  />
                  <button onClick={() => remove(ex.id)} aria-label={t("builder.remove")} className="p-2 text-muted-foreground hover:text-destructive transition-base">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <ModeToggle
                  value={ex.mode ?? "weight_reps"}
                  onChange={m => update(ex.id, { mode: m })}
                  t={t}
                />
                <div className="grid grid-cols-3 gap-2">
                  <NumField label={t("builder.sets")} value={ex.sets} min={1} max={20} onChange={v => setSetCount(ex, v)} />
                  {(ex.mode ?? "weight_reps") === "time" ? (
                    <NumField
                      label={ex.repsPerSet ? t("builder.baseTime") : t("builder.time")}
                      suffix="s"
                      step={5}
                      value={ex.targetSeconds ?? 30}
                      min={5}
                      max={1800}
                      onChange={v => update(ex.id, { targetSeconds: v })}
                    />
                  ) : (
                    <NumField
                      label={ex.repsPerSet ? t("builder.baseReps") : t("builder.reps")}
                      value={ex.reps}
                      min={1}
                      max={50}
                      onChange={v => update(ex.id, { reps: v })}
                    />
                  )}
                  <NumField label={t("builder.rest")} suffix="s" step={15} value={ex.restSeconds} min={15} max={600} onChange={v => update(ex.id, { restSeconds: v })} />
                </div>

                {(() => {
                  const isTime = (ex.mode ?? "weight_reps") === "time";
                  return (
                  <div className="rounded-xl bg-secondary/60 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold">{t("builder.pyramid")}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                          {isTime ? t("builder.pyramidDescTime") : t("builder.pyramidDescReps")}
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
                        {ex.repsPerSet ? t("builder.on") : t("builder.off")}
                      </button>
                    </div>
                    {ex.repsPerSet && (
                      <div className="mt-3 grid grid-cols-4 gap-1.5">
                        {Array.from({ length: ex.sets }).map((_, i) => (
                          <PyramidCell
                            key={i}
                            index={i}
                            value={ex.repsPerSet?.[i] ?? (isTime ? (ex.targetSeconds ?? 30) : ex.reps)}
                            onChange={v => setRepAt(ex, i, v)}
                            min={isTime ? 5 : 1}
                            max={isTime ? 1800 : 50}
                            step={isTime ? 5 : 1}
                            suffix={isTime ? "s" : undefined}
                            label={t("builder.set")}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  );
                })()}
                <p className="text-[10px] text-muted-foreground px-1">
                  {(ex.mode ?? "weight_reps") === "weight_reps" && t("builder.descWeight")}
                  {ex.mode === "reps" && t("builder.descReps")}
                  {ex.mode === "time" && t("builder.descTime")}
                </p>
              </li>
            ))}
          </ul>

          <Button
            variant="outline"
            onClick={() => setExercises(list => [...list, newExercise(settings.defaultRestSeconds)])}
            className="w-full mt-3 h-12 rounded-2xl border-dashed border-border bg-transparent text-foreground hover:bg-secondary"
          >
            <Plus className="w-4 h-4 mr-1.5" /> {t("builder.addExercise")}
          </Button>
        </div>

        <Button onClick={save} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base shadow-glow">
          {t("builder.saveWorkout")}
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
    <div className="rounded-xl bg-secondary p-2 min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">{label}</p>
      <div className="flex items-center justify-between mt-1 gap-0.5">
        <button onClick={dec} className="w-6 h-6 rounded-full bg-background text-foreground font-bold text-sm shrink-0 flex items-center justify-center">−</button>
        <span className="font-mono-timer font-bold text-sm min-w-0 text-center">
          {value}{suffix && <span className="text-muted-foreground text-[10px] ml-0.5">{suffix}</span>}
        </span>
        <button onClick={inc} className="w-6 h-6 rounded-full bg-background text-foreground font-bold text-sm shrink-0 flex items-center justify-center">+</button>
      </div>
    </div>
  );
};

const PyramidCell = ({
  index, value, onChange, min = 1, max = 50, step = 1, suffix, label = "Set",
}: { index: number; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; suffix?: string; label?: string }) => {
  return (
    <div className="rounded-lg bg-background border border-border p-1.5">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground text-center">{label} {index + 1}</p>
      <div className="flex items-center justify-between mt-0.5 gap-0.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-5 h-5 rounded-full bg-secondary text-foreground font-bold text-xs shrink-0 flex items-center justify-center"
        >−</button>
        <span className="font-mono-timer font-bold text-sm">
          {value}{suffix && <span className="text-muted-foreground text-[9px] ml-0.5">{suffix}</span>}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-5 h-5 rounded-full bg-secondary text-foreground font-bold text-xs shrink-0 flex items-center justify-center"
        >+</button>
      </div>
    </div>
  );
};

const ModeToggle = ({ value, onChange, t }: { value: ExerciseMode; onChange: (m: ExerciseMode) => void; t: (k: string) => string }) => {
  const opts: Array<{ id: ExerciseMode; label: string; hint: string }> = [
    { id: "weight_reps", label: t("builder.modeWeight"), hint: t("builder.modeWeightHint") },
    { id: "reps", label: t("builder.modeReps"), hint: t("builder.modeRepsHint") },
    { id: "time", label: t("builder.modeTime"), hint: t("builder.modeTimeHint") },
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
export type ExerciseMode = "weight_reps" | "reps" | "time";

export interface ExerciseTemplate {
  id: string;
  name: string;
  sets: number;
  reps: number;
  restSeconds: number;
  /** How this exercise is measured. Defaults to "weight_reps" when missing (legacy). */
  mode?: ExerciseMode;
  /** Target seconds per set, used when mode === "time" (e.g. battle ropes, plank). */
  targetSeconds?: number;
  /** Optional pyramid: per-set reps overrides. Length should equal `sets`. */
  repsPerSet?: number[];
  /** Optional per-set weight overrides (weight_reps mode). Length should equal `sets`. */
  weightPerSet?: number[];
}

export interface Workout {
  id: string;
  name: string;
  createdAt: number;
  exercises: ExerciseTemplate[];
}

export interface SetLog {
  setIndex: number;
  weight: number;
  reps: number;
  /** Duration logged for time-based exercises. Optional for backwards compat. */
  seconds?: number;
  completedAt: number;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
}

export interface SessionLog {
  id: string;
  workoutId: string;
  workoutName: string;
  startedAt: number;
  endedAt?: number;
  exercises: ExerciseLog[];
  /** Times the user left the app (tab/app backgrounded) during this session. */
  focusBreaks?: number;
  /** Total ms spent away from the app during this session. */
  awayMs?: number;
  /** 0–100 focus score computed at session end. */
  focusScore?: number;
}

export interface Settings {
  unlockCode: string;
  defaultRestSeconds: number;
  sound: boolean;
  vibration: boolean;
  weightUnit: "kg" | "lb";
  language?: "en" | "es" | "pt" | "de" | "ja" | "ko" | "pl" | "bg";
}
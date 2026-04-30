export interface ExerciseTemplate {
  id: string;
  name: string;
  sets: number;
  reps: number;
  restSeconds: number;
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
}

export interface Settings {
  unlockCode: string;
  defaultRestSeconds: number;
  sound: boolean;
  vibration: boolean;
  weightUnit: "kg" | "lb";
}
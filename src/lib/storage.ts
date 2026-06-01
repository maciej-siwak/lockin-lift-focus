import type { Workout, SessionLog, Settings } from "./types";

const KEYS = {
  workouts: "lockin.workouts",
  sessions: "lockin.sessions",
  settings: "lockin.settings",
  lastWeights: "lockin.lastWeights",
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const defaultSettings: Settings = {
  unlockCode: "1234",
  defaultRestSeconds: 90,
  sound: true,
  vibration: true,
  weightUnit: "kg",
  language: "en",
};

const buildDefaultWorkouts = (): Workout[] => [
  {
    id: uid(),
    name: "Full Body Compound",
    createdAt: Date.now(),
    exercises: [
      { id: uid(), name: "Squat", sets: 4, reps: 10, restSeconds: 120, mode: "weight_reps",
        repsPerSet: [10, 8, 8, 5], weightPerSet: [60, 60, 60, 60] },
      { id: uid(), name: "Bench Press", sets: 4, reps: 10, restSeconds: 120, mode: "weight_reps",
        repsPerSet: [10, 8, 8, 5], weightPerSet: [60, 100, 100, 100] },
      { id: uid(), name: "Deadlift", sets: 4, reps: 10, restSeconds: 150, mode: "weight_reps",
        repsPerSet: [10, 8, 8, 5], weightPerSet: [100, 100, 100, 100] },
      { id: uid(), name: "Overhead Press", sets: 4, reps: 10, restSeconds: 90, mode: "weight_reps",
        repsPerSet: [10, 8, 8, 5], weightPerSet: [45, 45, 45, 45] },
      { id: uid(), name: "Barbell Row", sets: 3, reps: 8, restSeconds: 90, mode: "weight_reps",
        weightPerSet: [70, 70, 70] },
      { id: uid(), name: "Pull-Up", sets: 3, reps: 8, restSeconds: 90, mode: "reps" },
      { id: uid(), name: "Plank", sets: 3, reps: 0, restSeconds: 60, mode: "time", targetSeconds: 60 },
    ],
  },
];

export const storage = {
  getWorkouts: (): Workout[] => {
    if (localStorage.getItem(KEYS.workouts) === null) {
      const seeded = buildDefaultWorkouts();
      write(KEYS.workouts, seeded);
      return seeded;
    }
    return read<Workout[]>(KEYS.workouts, []);
  },
  saveWorkouts: (w: Workout[]) => write(KEYS.workouts, w),

  getSessions: () => read<SessionLog[]>(KEYS.sessions, []),
  saveSessions: (s: SessionLog[]) => write(KEYS.sessions, s),
  appendSession: (s: SessionLog) => {
    const all = storage.getSessions();
    all.unshift(s);
    storage.saveSessions(all.slice(0, 100));
  },
  upsertSession: (s: SessionLog) => {
    const all = storage.getSessions();
    const idx = all.findIndex(x => x.id === s.id);
    if (idx >= 0) all[idx] = s;
    else all.unshift(s);
    storage.saveSessions(all.slice(0, 100));
  },

  getSettings: (): Settings => ({ ...defaultSettings, ...read<Partial<Settings>>(KEYS.settings, {}) }),
  saveSettings: (s: Settings) => write(KEYS.settings, s),

  getLastWeights: (): Record<string, number> => read(KEYS.lastWeights, {}),
  setLastWeight: (exerciseName: string, weight: number) => {
    const all = storage.getLastWeights();
    all[exerciseName.toLowerCase()] = weight;
    write(KEYS.lastWeights, all);
  },
};

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
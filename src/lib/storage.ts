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

export const storage = {
  getWorkouts: () => read<Workout[]>(KEYS.workouts, []),
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
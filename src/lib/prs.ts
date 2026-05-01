import type { SessionLog, SetLog } from "./types";

export interface ExercisePR {
  bestWeight: number;
  bestReps: number;
  bestSetVolume: number; // weight * reps for a single set
  bestE1RM: number; // estimated one-rep max (Epley)
}

const empty = (): ExercisePR => ({ bestWeight: 0, bestReps: 0, bestSetVolume: 0, bestE1RM: 0 });

const e1rm = (w: number, r: number) => (w > 0 && r > 0 ? w * (1 + r / 30) : 0);

/**
 * Build PRs per exercise name from sessions, considering only sessions
 * STARTED STRICTLY BEFORE `beforeTs`. Pass Infinity to include all.
 */
export function buildPRs(sessions: SessionLog[], beforeTs = Infinity): Record<string, ExercisePR> {
  const map: Record<string, ExercisePR> = {};
  for (const s of sessions) {
    if (s.startedAt >= beforeTs) continue;
    for (const ex of s.exercises) {
      const key = ex.exerciseName.toLowerCase();
      const pr = map[key] ?? empty();
      for (const set of ex.sets) {
        if (set.weight > pr.bestWeight) pr.bestWeight = set.weight;
        if (set.reps > pr.bestReps) pr.bestReps = set.reps;
        const vol = set.weight * set.reps;
        if (vol > pr.bestSetVolume) pr.bestSetVolume = vol;
        const est = e1rm(set.weight, set.reps);
        if (est > pr.bestE1RM) pr.bestE1RM = est;
      }
      map[key] = pr;
    }
  }
  return map;
}

export type SetPRFlags = {
  weight: boolean;
  reps: boolean;
  volume: boolean;
};

export function flagSet(set: SetLog, prior: ExercisePR | undefined): SetPRFlags {
  const p = prior ?? empty();
  return {
    weight: set.weight > 0 && set.weight > p.bestWeight,
    reps: set.reps > 0 && set.reps > p.bestReps,
    volume: set.weight * set.reps > 0 && set.weight * set.reps > p.bestSetVolume,
  };
}
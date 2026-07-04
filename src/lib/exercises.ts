export interface ExerciseInfo {
  name: string;
  muscles: string[];
  equipment: string;
  difficulty: string;
  type: string;
  description: string;
  setup: string;
  execution: string;
  tips: string;
  mistakes: string;
  /** Base key for the exercise image (without extension). */
  imageKey: string;
}

const EXERCISES: Record<string, ExerciseInfo> = {
  "barbell bench press": {
    name: "Barbell Bench Press",
    muscles: ["Chest", "Front delts", "Triceps"],
    equipment: "Barbell, bench",
    difficulty: "Intermediate",
    type: "Compound",
    description:
      "The barbell bench press is the gold standard for building upper-body pressing strength and chest mass. It trains the pectorals, anterior deltoids and triceps through a stable, loaded range of motion.",
    setup:
      "Lie flat on a bench with your eyes directly under the bar. Plant your feet firmly on the floor, squeeze your shoulder blades together and set your upper back into the bench. Grip the bar slightly wider than shoulder-width with your wrists stacked over your elbows.",
    execution:
      "Unrack the bar by straightening your arms and moving it over your mid-chest. Lower it in a controlled arc to the bottom of your sternum, tucking your elbows about 45–75 degrees from your torso. Pause lightly, then press the bar back up and slightly toward your face until your elbows lock out.",
    tips:
      "Keep your butt on the bench and your feet still. Brace your core as if you were about to be punched. Use a controlled tempo — especially on the way down — and never bounce the bar off your chest.",
    mistakes:
      "Flaring the elbows out to 90 degrees strains the shoulders. Lifting the hips off the bench turns the press into a decline. Bouncing the bar or using a too-narrow grip can limit chest involvement and stress the wrists.",
    imageKey: "bench-press",
  },
};

export function getExerciseInfo(name: string): ExerciseInfo {
  const key = name.toLowerCase().trim();
  return (
    EXERCISES[key] ?? {
      name,
      muscles: ["Strength"],
      equipment: "Varies",
      difficulty: "Any",
      type: "Strength",
      description: `${name} is a strength training movement. Focus on controlled form, full range of motion and progressive overload over time.`,
      setup:
        "Set up according to the equipment you are using. Warm up with light weight or bodyweight before loading heavier.",
      execution:
        "Perform the movement with control, keep your core engaged and breathe steadily throughout the set.",
      tips: "Start light, master the form, then add weight or reps gradually.",
      mistakes:
        "Rushing reps, using momentum and sacrificing range of motion for heavier loads are the most common mistakes.",
      imageKey: "bench-press",
    }
  );
}

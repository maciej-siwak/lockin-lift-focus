import { ArrowLeft, Dumbbell } from "lucide-react";
import { AppShell } from "./AppShell";

interface Props {
  onBack: () => void;
  onViewExercise?: (exerciseName: string) => void;
}

type Suggestion = { name: string; note: string };
type Group = { muscle: string; blurb: string; items: Suggestion[] };

const GROUPS: Group[] = [
  {
    muscle: "Chest",
    blurb: "Press, dip, fly.",
    items: [
      { name: "Barbell Bench Press", note: "Overall chest mass and strength." },
      { name: "Incline Dumbbell Press", note: "Upper chest emphasis." },
      { name: "Chest Dip", note: "Lower chest and triceps." },
      { name: "Cable Fly", note: "Constant tension and chest isolation." },
      { name: "Machine Chest Press", note: "Safe, controlled hypertrophy work." },
    ],
  },
  {
    muscle: "Triceps",
    blurb: "Extend and lock out.",
    items: [
      { name: "Close-Grip Bench Press", note: "Heavy compound for overall size." },
      { name: "Overhead Cable Triceps Extension", note: "Targets the long head." },
      { name: "Cable Triceps Pushdown", note: "Great for overall development." },
      { name: "Skull Crusher", note: "Excellent mass builder." },
      { name: "Bench Dip", note: "Bodyweight finisher." },
    ],
  },
  {
    muscle: "Biceps",
    blurb: "Curl every angle.",
    items: [
      { name: "Barbell Curl", note: "Overall mass." },
      { name: "Incline Dumbbell Curl", note: "Stretches the long head." },
      { name: "Hammer Curl", note: "Builds the brachialis and forearms." },
      { name: "Preacher Curl", note: "Strict isolation." },
      { name: "Cable Curl", note: "Constant tension." },
    ],
  },
  {
    muscle: "Back",
    blurb: "Pull wide, pull heavy.",
    items: [
      { name: "Deadlift", note: "Overall posterior chain strength." },
      { name: "Pull-Up", note: "Best for lat width." },
      { name: "Barbell Row", note: "Thickness." },
      { name: "Lat Pulldown", note: "Great pull-up alternative." },
      { name: "Seated Cable Row", note: "Mid-back development." },
    ],
  },
  {
    muscle: "Shoulders",
    blurb: "Press and raise.",
    items: [
      { name: "Overhead Press", note: "Overall shoulder strength." },
      { name: "Dumbbell Lateral Raise", note: "Side delts for width." },
      { name: "Rear Delt Fly", note: "Rear delts." },
      { name: "Face Pull", note: "Rear delts and shoulder health." },
      { name: "Arnold Press", note: "Front and side delts." },
    ],
  },
  {
    muscle: "Legs",
    blurb: "Squat, hinge, drive.",
    items: [
      { name: "Back Squat", note: "King of leg exercises." },
      { name: "Romanian Deadlift", note: "Hamstrings and glutes." },
      { name: "Leg Press", note: "Heavy quad builder." },
      { name: "Bulgarian Split Squat", note: "Single-leg strength and stability." },
      { name: "Standing Calf Raise", note: "Gastrocnemius development." },
    ],
  },
];

export const ExerciseSuggestions = ({ onBack, onViewExercise }: Props) => {
  return (
    <AppShell
      title="Suggestions"
      subtitle="Proven lifts by muscle group"
      left={
        <button
          onClick={onBack}
          aria-label="Back"
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-base"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      }
    >
      {/* Muscle group nav */}
      <nav className="pt-6 pb-5 -mx-5 px-5 overflow-x-auto scrollbar-none">
        <ul className="flex gap-3 min-w-max">
          {GROUPS.map((g) => (
            <li key={g.muscle}>
              <a
                href={`#g-${g.muscle}`}
                className="inline-flex items-center h-9 px-4 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold tracking-tight hover:bg-primary hover:text-primary-foreground transition-base"
              >
                {g.muscle}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-12 pt-4 pb-8 animate-fade-in">
        {GROUPS.map((g, gi) => (
          <section key={g.muscle} id={`g-${g.muscle}`} className="scroll-mt-24">
            <header className="flex items-baseline justify-between mb-5 px-1">
              <div className="flex items-baseline gap-4">
                <span className="text-[11px] font-bold text-primary tabular-nums tracking-[0.25em]">
                  {String(gi + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-xl font-black tracking-tight leading-none">{g.muscle}</h2>
                  <p className="text-xs text-muted-foreground mt-2">{g.blurb}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">{g.items.length}</span>
            </header>

            <ol className="space-y-3">
              {g.items.map((it, i) => (
                <li
                  key={it.name}
                  className="group relative rounded-2xl bg-card border border-border p-5 shadow-card transition-base hover:border-primary/40"
                >
                  <button
                    onClick={() => onViewExercise?.(it.name)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-base tabular-nums">
                        {i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[15px] leading-tight truncate">{it.name}</h3>
                        <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">{it.note}</p>
                      </div>
                      <Dumbbell className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-1" />
                    </div>
                  </button>
                </li>
              ))}
            </ol>
          </section>
        ))}

        <p className="text-center text-xs text-muted-foreground/70 pt-8">
          Pick 4–6 per session. Lock in.
        </p>
      </div>
    </AppShell>
  );
};
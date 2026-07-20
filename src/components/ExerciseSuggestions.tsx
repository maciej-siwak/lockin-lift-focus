import { ArrowLeft, Dumbbell } from "lucide-react";
import { AppShell } from "./AppShell";
import { useT } from "@/lib/i18n";

interface Props {
  onBack: () => void;
  onViewExercise?: (exerciseName: string) => void;
}

type Suggestion = { name: string; nameKey: string; noteKey: string };
type Group = { key: string; muscleKey: string; blurbKey: string; items: Suggestion[] };

const GROUPS: Group[] = [
  {
    key: "chest",
    muscleKey: "muscle.chest",
    blurbKey: "muscle.chestBlurb",
    items: [
      { name: "Barbell Bench Press", nameKey: "ex.barbellBenchPress", noteKey: "note.barbellBenchPress" },
      { name: "Incline Dumbbell Press", nameKey: "ex.inclineDumbbellPress", noteKey: "note.inclineDumbbellPress" },
      { name: "Chest Dip", nameKey: "ex.chestDip", noteKey: "note.chestDip" },
      { name: "Cable Fly", nameKey: "ex.cableFly", noteKey: "note.cableFly" },
      { name: "Machine Chest Press", nameKey: "ex.machineChestPress", noteKey: "note.machineChestPress" },
    ],
  },
  {
    key: "triceps",
    muscleKey: "muscle.triceps",
    blurbKey: "muscle.tricepsBlurb",
    items: [
      { name: "Close-Grip Bench Press", nameKey: "ex.closeGripBenchPress", noteKey: "note.closeGripBench" },
      { name: "Overhead Cable Triceps Extension", nameKey: "ex.overheadCableTricepsExtension", noteKey: "note.overheadCableTri" },
      { name: "Cable Triceps Pushdown", nameKey: "ex.cableTricepsPushdown", noteKey: "note.cablePushdown" },
      { name: "Skull Crusher", nameKey: "ex.skullCrusher", noteKey: "note.skullCrusher" },
      { name: "Bench Dip", nameKey: "ex.benchDip", noteKey: "note.benchDip" },
    ],
  },
  {
    key: "biceps",
    muscleKey: "muscle.biceps",
    blurbKey: "muscle.bicepsBlurb",
    items: [
      { name: "Barbell Curl", nameKey: "ex.barbellCurl", noteKey: "note.barbellCurl" },
      { name: "Incline Dumbbell Curl", nameKey: "ex.inclineDumbbellCurl", noteKey: "note.inclineDumbbellCurl" },
      { name: "Hammer Curl", nameKey: "ex.hammerCurl", noteKey: "note.hammerCurl" },
      { name: "Preacher Curl", nameKey: "ex.preacherCurl", noteKey: "note.preacherCurl" },
      { name: "Cable Curl", nameKey: "ex.cableCurl", noteKey: "note.cableCurl" },
    ],
  },
  {
    key: "back",
    muscleKey: "muscle.back",
    blurbKey: "muscle.backBlurb",
    items: [
      { name: "Deadlift", nameKey: "ex.deadlift", noteKey: "note.deadlift" },
      { name: "Pull-Up", nameKey: "ex.pullUp", noteKey: "note.pullUp" },
      { name: "Barbell Row", nameKey: "ex.barbellRow", noteKey: "note.barbellRow" },
      { name: "Lat Pulldown", nameKey: "ex.latPulldown", noteKey: "note.latPulldown" },
      { name: "Seated Cable Row", nameKey: "ex.seatedCableRow", noteKey: "note.seatedCableRow" },
    ],
  },
  {
    key: "shoulders",
    muscleKey: "muscle.shoulders",
    blurbKey: "muscle.shouldersBlurb",
    items: [
      { name: "Overhead Press", nameKey: "ex.overheadPress", noteKey: "note.overheadPress" },
      { name: "Dumbbell Lateral Raise", nameKey: "ex.dumbbellLateralRaise", noteKey: "note.lateralRaise" },
      { name: "Rear Delt Fly", nameKey: "ex.rearDeltFly", noteKey: "note.rearDeltFly" },
      { name: "Face Pull", nameKey: "ex.facePull", noteKey: "note.facePull" },
      { name: "Arnold Press", nameKey: "ex.arnoldPress", noteKey: "note.arnoldPress" },
    ],
  },
  {
    key: "legs",
    muscleKey: "muscle.legs",
    blurbKey: "muscle.legsBlurb",
    items: [
      { name: "Back Squat", nameKey: "ex.backSquat", noteKey: "note.backSquat" },
      { name: "Romanian Deadlift", nameKey: "ex.romanianDeadlift", noteKey: "note.rdl" },
      { name: "Leg Press", nameKey: "ex.legPress", noteKey: "note.legPress" },
      { name: "Bulgarian Split Squat", nameKey: "ex.bulgarianSplitSquat", noteKey: "note.bulgarianSplit" },
      { name: "Standing Calf Raise", nameKey: "ex.standingCalfRaise", noteKey: "note.calfRaise" },
    ],
  },
];

export const ExerciseSuggestions = ({ onBack, onViewExercise }: Props) => {
  const t = useT();
  return (
    <AppShell
      title={t("suggestions.title")}
      subtitle={t("suggestions.subtitle")}
      left={
        <button
          onClick={onBack}
          aria-label={t("common.back")}
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
            <li key={g.key}>
              <a
                href={`#g-${g.key}`}
                className="inline-flex items-center h-9 px-4 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold tracking-tight hover:bg-primary hover:text-primary-foreground transition-base"
              >
                {t(g.muscleKey)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-12 pt-4 pb-8 animate-fade-in">
        {GROUPS.map((g, gi) => (
          <section key={g.key} id={`g-${g.key}`} className="scroll-mt-24">
            <header className="flex items-baseline justify-between mb-5 px-1">
              <div className="flex items-baseline gap-4">
                <span className="text-[11px] font-bold text-primary tabular-nums tracking-[0.25em]">
                  {String(gi + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-xl font-black tracking-tight leading-none">{t(g.muscleKey)}</h2>
                  <p className="text-xs text-muted-foreground mt-2">{t(g.blurbKey)}</p>
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
                        <h3 className="font-bold text-[15px] leading-tight truncate">{t(it.nameKey)}</h3>
                        <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">{t(it.noteKey)}</p>
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
          {t("suggestions.footer")}
        </p>
      </div>
    </AppShell>
  );
};
import { ArrowLeft, Dumbbell, Play, Target, Clock, AlertTriangle, CheckCircle2, Info, Lightbulb } from "lucide-react";
import { AppShell } from "./AppShell";
import { Button } from "@/components/ui/button";
import { getExerciseInfo } from "@/lib/exercises";
import { useT } from "@/lib/i18n";
import benchPressImg from "@/assets/bench-press.png";
import inclineDumbbellPressImg from "@/assets/exercises/incline-dumbbell-press.png";
import chestDipImg from "@/assets/exercises/chest-dip.png";
import cableFlyImg from "@/assets/exercises/cable-fly.png";
import machineChestPressImg from "@/assets/exercises/machine-chest-press.png";
import closeGripBenchPressImg from "@/assets/exercises/close-grip-bench-press.png";
import overheadCableTricepsExtensionImg from "@/assets/exercises/overhead-cable-triceps-extension.png";
import cableTricepsPushdownImg from "@/assets/exercises/cable-triceps-pushdown.png";
import skullCrusherImg from "@/assets/exercises/skull-crusher.png";
import benchDipImg from "@/assets/exercises/bench-dip.png";
import barbellCurlImg from "@/assets/exercises/barbell-curl.png";
import inclineDumbbellCurlImg from "@/assets/exercises/incline-dumbbell-curl.png";
import hammerCurlImg from "@/assets/exercises/hammer-curl.png";
import preacherCurlImg from "@/assets/exercises/preacher-curl.png";
import cableCurlImg from "@/assets/exercises/cable-curl.png";
import deadliftImg from "@/assets/exercises/deadlift.png";
import pullUpImg from "@/assets/exercises/pull-up.png";
import barbellRowImg from "@/assets/exercises/barbell-row.png";
import latPulldownImg from "@/assets/exercises/lat-pulldown.png";
import seatedCableRowImg from "@/assets/exercises/seated-cable-row.png";
import overheadPressImg from "@/assets/exercises/overhead-press.png";
import dumbbellLateralRaiseImg from "@/assets/exercises/dumbbell-lateral-raise.png";
import rearDeltFlyImg from "@/assets/exercises/rear-delt-fly.png";
import facePullImg from "@/assets/exercises/face-pull.png";
import arnoldPressImg from "@/assets/exercises/arnold-press.png";
import backSquatImg from "@/assets/exercises/back-squat.png";
import romanianDeadliftImg from "@/assets/exercises/romanian-deadlift.png";
import legPressImg from "@/assets/exercises/leg-press.png";
import bulgarianSplitSquatImg from "@/assets/exercises/bulgarian-split-squat.png";
import standingCalfRaiseImg from "@/assets/exercises/standing-calf-raise.png";

interface Props {
  exerciseName: string;
  onBack: () => void;
  onStart?: () => void;
}

const IMAGES: Record<string, string> = {
  "bench-press": benchPressImg,
  "barbell-bench-press": benchPressImg,
  "incline-dumbbell-press": inclineDumbbellPressImg,
  "chest-dip": chestDipImg,
  "cable-fly": cableFlyImg,
  "machine-chest-press": machineChestPressImg,
  "close-grip-bench-press": closeGripBenchPressImg,
  "overhead-cable-triceps-extension": overheadCableTricepsExtensionImg,
  "cable-triceps-pushdown": cableTricepsPushdownImg,
  "skull-crusher": skullCrusherImg,
  "bench-dip": benchDipImg,
  "barbell-curl": barbellCurlImg,
  "incline-dumbbell-curl": inclineDumbbellCurlImg,
  "hammer-curl": hammerCurlImg,
  "preacher-curl": preacherCurlImg,
  "cable-curl": cableCurlImg,
  "deadlift": deadliftImg,
  "pull-up": pullUpImg,
  "barbell-row": barbellRowImg,
  "lat-pulldown": latPulldownImg,
  "seated-cable-row": seatedCableRowImg,
  "overhead-press": overheadPressImg,
  "dumbbell-lateral-raise": dumbbellLateralRaiseImg,
  "rear-delt-fly": rearDeltFlyImg,
  "face-pull": facePullImg,
  "arnold-press": arnoldPressImg,
  "back-squat": backSquatImg,
  "romanian-deadlift": romanianDeadliftImg,
  "leg-press": legPressImg,
  "bulgarian-split-squat": bulgarianSplitSquatImg,
  "standing-calf-raise": standingCalfRaiseImg,
};

export const ExerciseDetail = ({ exerciseName, onBack, onStart }: Props) => {
  const t = useT();
  const info = getExerciseInfo(exerciseName);
  const image = IMAGES[info.imageKey] ?? benchPressImg;

  return (
    <AppShell
      title={t("exercise.title")}
      subtitle={info.name}
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
      <div className="pt-5 pb-8 space-y-8 animate-fade-in">
        {/* Hero card */}
        <div className="relative rounded-3xl bg-gradient-dark border border-border overflow-hidden shadow-card">
          <div className="aspect-[4/3] flex items-center justify-center p-8">
            <img
              src={image}
              alt={info.name}
              className="w-full h-full object-contain drop-shadow-lg"
              width={1024}
              height={1024}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-[0.2em]">
              <Dumbbell className="w-3.5 h-3.5" /> {info.type}
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight leading-tight">{info.name}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {info.muscles.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-semibold"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={<Dumbbell className="w-4 h-4" />} label={t("exercise.equipment")} value={info.equipment} />
          <StatCard icon={<Target className="w-4 h-4" />} label={t("exercise.level")} value={info.difficulty} />
          <StatCard icon={<Clock className="w-4 h-4" />} label={t("exercise.focus")} value={info.type} />
        </div>

        {/* Info sections */}
        <div className="space-y-4">
          <InfoSection icon={<Info className="w-4 h-4" />} title={t("exercise.overview")} text={info.description} />
          <InfoSection icon={<CheckCircle2 className="w-4 h-4" />} title={t("exercise.setup")} text={info.setup} />
          <InfoSection icon={<Target className="w-4 h-4" />} title={t("exercise.execution")} text={info.execution} />
          <InfoSection icon={<Lightbulb className="w-4 h-4" />} title={t("exercise.tips")} text={info.tips} />
          <InfoSection icon={<AlertTriangle className="w-4 h-4" />} title={t("exercise.mistakes")} text={info.mistakes} variant="warning" />
        </div>

        {/* CTA */}
        {onStart && (
          <Button
            onClick={onStart}
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-extrabold text-base shadow-glow"
          >
            <Play className="w-4 h-4 mr-2 fill-current" /> {t("exercise.start")}
          </Button>
        )}
      </div>
    </AppShell>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-2xl bg-card border border-border p-4 text-center shadow-card">
    <div className="w-9 h-9 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-primary">
      {icon}
    </div>
    <p className="mt-2 text-sm font-bold leading-tight">{value}</p>
    <p className="mt-1 text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
  </div>
);

const InfoSection = ({
  icon,
  title,
  text,
  variant = "default",
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  variant?: "default" | "warning";
}) => (
  <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
    <div className="flex items-center gap-2.5">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${variant === "warning" ? "bg-warning/15 text-warning" : "bg-primary/10 text-primary"}`}>
        {icon}
      </div>
      <h3 className="font-bold text-base tracking-tight">{title}</h3>
    </div>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
  </div>
);

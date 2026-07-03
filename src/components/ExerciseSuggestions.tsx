import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { AppShell } from "./AppShell";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

type BodyPart =
  | "chest"
  | "shoulders"
  | "biceps"
  | "forearms"
  | "abs"
  | "quads"
  | "calves"
  | "traps"
  | "upperBack"
  | "lats"
  | "lowerBack"
  | "triceps"
  | "glutes"
  | "hamstrings";

interface Exercise { name: string; description: string; }

const DATA: Record<BodyPart, { label: string; exercises: Exercise[] }> = {
  chest: {
    label: "Chest",
    exercises: [
      { name: "Bench Press", description: "Lie flat on a bench, grip the bar slightly wider than shoulder width, lower it to mid-chest with control, then press back up until arms are fully extended." },
      { name: "Incline Dumbbell Press", description: "On a 30–45° incline, press two dumbbells from shoulder height to lockout, targeting the upper chest and front delts." },
      { name: "Push-Up", description: "Hands under shoulders, body in a straight line. Lower chest to floor, then press back up. Elbows track ~45° from torso." },
      { name: "Cable Fly", description: "Stand between two cable stacks, arms slightly bent. Bring handles together in front of chest in a wide arc, squeezing at the end." },
    ],
  },
  shoulders: {
    label: "Shoulders",
    exercises: [
      { name: "Overhead Press", description: "From shoulders, press a barbell overhead to lockout while keeping ribs down and glutes braced. Head moves through at the top." },
      { name: "Dumbbell Lateral Raise", description: "Slight forward lean, elbows soft. Raise dumbbells out to the sides to shoulder height leading with the elbows." },
      { name: "Arnold Press", description: "Start with palms facing you at shoulder height, rotate outward as you press overhead. Great for full deltoid activation." },
      { name: "Face Pull", description: "Rope at eye level, pull toward the face flaring elbows wide. Trains rear delts and improves shoulder health." },
    ],
  },
  biceps: {
    label: "Biceps",
    exercises: [
      { name: "Barbell Curl", description: "Stand tall, elbows pinned. Curl the bar up without swinging, squeeze at the top, lower with control." },
      { name: "Dumbbell Hammer Curl", description: "Neutral grip (palms facing each other). Curl dumbbells to shoulders. Hits biceps and brachialis." },
      { name: "Incline Dumbbell Curl", description: "On an incline bench with arms hanging back, curl dumbbells up. Stretches the long head for more growth." },
      { name: "Chin-Up", description: "Underhand grip, shoulder-width. Pull chest toward the bar, then lower under control. Biceps + back." },
    ],
  },
  forearms: {
    label: "Forearms",
    exercises: [
      { name: "Wrist Curl", description: "Forearms on thighs, palms up. Curl the wrist up and down through full range with a light barbell or dumbbells." },
      { name: "Reverse Curl", description: "Overhand grip curl with a straight or EZ bar. Targets brachioradialis and forearm extensors." },
      { name: "Farmer's Carry", description: "Hold heavy dumbbells or trap-bar and walk with a tall posture. Massive grip and forearm builder." },
    ],
  },
  abs: {
    label: "Abs",
    exercises: [
      { name: "Plank", description: "Forearms and toes on the ground, body in a straight line. Brace the core and hold — no sagging or piking." },
      { name: "Hanging Leg Raise", description: "Hang from a bar, raise straight legs to horizontal (or higher). Control the descent — no swinging." },
      { name: "Cable Crunch", description: "Kneel under a rope, curl the spine down driving elbows toward hips. Keep hips fixed." },
      { name: "Ab Wheel Rollout", description: "From knees, roll the wheel forward keeping the core braced, then pull back without arching the low back." },
    ],
  },
  quads: {
    label: "Quads",
    exercises: [
      { name: "Back Squat", description: "Bar on upper traps, feet shoulder-width. Sit down and back to at least parallel, drive through mid-foot to stand." },
      { name: "Front Squat", description: "Bar on front delts, elbows high. Upright torso, deep squat. Heavy quad emphasis." },
      { name: "Leg Press", description: "Feet mid-platform, lower until knees track over toes to ~90°, press back without locking out hard." },
      { name: "Bulgarian Split Squat", description: "Rear foot elevated, front foot forward. Lower straight down until back knee grazes the floor." },
    ],
  },
  calves: {
    label: "Calves",
    exercises: [
      { name: "Standing Calf Raise", description: "Balls of feet on a step, rise as high as possible, pause, then lower into a deep stretch." },
      { name: "Seated Calf Raise", description: "Pad on the knees, feet on the platform. Drive up onto the toes — targets soleus." },
      { name: "Jump Rope", description: "Continuous small hops on the balls of the feet. Excellent for calf endurance and springiness." },
    ],
  },
  traps: {
    label: "Traps",
    exercises: [
      { name: "Barbell Shrug", description: "Hold a heavy bar, shrug shoulders straight up toward the ears without rolling. Pause, then lower." },
      { name: "Dumbbell Shrug", description: "Neutral grip with dumbbells at your sides. Slightly greater range of motion than the barbell version." },
      { name: "Rack Pull", description: "Deadlift from just below the knees. Overloads the upper back and traps." },
    ],
  },
  upperBack: {
    label: "Upper Back",
    exercises: [
      { name: "Barbell Row", description: "Hinge to ~45°, pull the bar to the lower ribs squeezing the shoulder blades. Control the negative." },
      { name: "Chest-Supported Row", description: "Chest on a bench pad, row dumbbells or a bar. Removes lower-back fatigue — pure back work." },
      { name: "Seated Cable Row", description: "Tall chest, pull the handle to the abdomen driving elbows back. Pause and squeeze." },
      { name: "Face Pull", description: "Rope at eye level, pull toward the face with elbows high. Rear delts and mid-back." },
    ],
  },
  lats: {
    label: "Lats",
    exercises: [
      { name: "Pull-Up", description: "Overhand grip, slightly wider than shoulders. Pull chest to the bar, control the descent." },
      { name: "Lat Pulldown", description: "Slight backward lean, pull the bar to the upper chest driving elbows down and back." },
      { name: "Single-Arm Dumbbell Row", description: "One knee on a bench, pull the dumbbell to the hip. Long stretch, hard squeeze." },
      { name: "Straight-Arm Pulldown", description: "Standing, arms nearly straight, pull the bar down to the thighs. Great lat isolation." },
    ],
  },
  lowerBack: {
    label: "Lower Back",
    exercises: [
      { name: "Deadlift", description: "Bar over mid-foot, hinge with a neutral spine, drive the floor away. Lock out with hips and knees together." },
      { name: "Back Extension", description: "On a hyperextension bench, hinge at the hips and return to a straight line — no over-extending." },
      { name: "Good Morning", description: "Bar on upper back, soft knees, hinge forward keeping the spine neutral, then return." },
    ],
  },
  triceps: {
    label: "Triceps",
    exercises: [
      { name: "Close-Grip Bench Press", description: "Grip inside shoulder-width, elbows tucked. Lower to lower chest and press. Heavy triceps compound." },
      { name: "Tricep Rope Pushdown", description: "Elbows pinned to sides, push the rope down and apart at the bottom to fully lock out." },
      { name: "Overhead Tricep Extension", description: "Dumbbell or rope overhead, lower behind the head, extend back up. Strong long-head stretch." },
      { name: "Dip", description: "On parallel bars, slight forward lean for chest bias or upright for triceps. Lower until shoulders are just below elbows." },
    ],
  },
  glutes: {
    label: "Glutes",
    exercises: [
      { name: "Hip Thrust", description: "Upper back on a bench, bar over the hips. Drive hips up to a straight line, squeeze glutes hard at the top." },
      { name: "Romanian Deadlift", description: "Soft knees, hinge back pushing hips away. Feel the hamstring stretch, then drive hips forward." },
      { name: "Bulgarian Split Squat", description: "Rear foot elevated. A slight forward lean shifts the emphasis to the glutes." },
      { name: "Cable Kickback", description: "Cable at the ankle, drive the leg back and up keeping the pelvis stable." },
    ],
  },
  hamstrings: {
    label: "Hamstrings",
    exercises: [
      { name: "Romanian Deadlift", description: "Soft knees, hinge with a neutral spine feeling the hamstring stretch, then drive hips forward." },
      { name: "Lying Leg Curl", description: "Face-down on the machine, curl heels to the glutes. Slow eccentric for hypertrophy." },
      { name: "Nordic Curl", description: "Kneel with feet anchored. Lower under control as slowly as possible, then push back up." },
      { name: "Stiff-Leg Deadlift", description: "Straighter legs than RDL. Emphasizes the hamstring stretch — go only as low as your hips allow." },
    ],
  },
};

const HIGHLIGHT = "hsl(var(--primary))";
const BASE = "hsl(var(--muted))";
const STROKE = "hsl(var(--border))";

interface RegionProps {
  part: BodyPart;
  selected: BodyPart | null;
  onSelect: (p: BodyPart) => void;
  d?: string;
  cx?: number; cy?: number; rx?: number; ry?: number;
  x?: number; y?: number; w?: number; h?: number; r?: number;
}

const Region = ({ part, selected, onSelect, d, cx, cy, rx, ry, x, y, w, h, r }: RegionProps) => {
  const active = selected === part;
  const fill = active ? HIGHLIGHT : BASE;
  const props = {
    fill,
    stroke: STROKE,
    strokeWidth: 1,
    onClick: () => onSelect(part),
    style: { cursor: "pointer", transition: "fill 200ms" },
    className: active ? "drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]" : "",
  } as const;
  if (d) return <path d={d} {...props} />;
  if (cx != null && cy != null && rx != null && ry != null) return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} {...props} />;
  if (x != null && y != null && w != null && h != null) return <rect x={x} y={y} width={w} height={h} rx={r ?? 4} {...props} />;
  return null;
};

interface Props { onBack: () => void; }

export const ExerciseSuggestions = ({ onBack }: Props) => {
  const [view, setView] = useState<"front" | "back">("front");
  const [selected, setSelected] = useState<BodyPart | null>("chest");

  const info = selected ? DATA[selected] : null;

  return (
    <AppShell
      title="Exercise Suggestions"
      left={<button onClick={onBack} aria-label="Back" className="p-2 -ml-2"><ArrowLeft className="w-5 h-5" /></button>}
    >
      <div className="pt-4 space-y-4">
        {/* View toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-secondary rounded-xl">
          <button
            onClick={() => setView("front")}
            className={`h-9 rounded-lg text-sm font-semibold transition-base ${
              view === "front" ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
            }`}
          >Front</button>
          <button
            onClick={() => setView("back")}
            className={`h-9 rounded-lg text-sm font-semibold transition-base ${
              view === "back" ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
            }`}
          >Back</button>
        </div>

        {/* Human figure */}
        <div className="rounded-2xl bg-gradient-dark border border-border p-4 shadow-card flex justify-center">
          <svg viewBox="0 0 200 400" className="w-full max-w-[240px] h-auto" aria-label={`${view} body`}>
            {/* Head */}
            <ellipse cx="100" cy="30" rx="20" ry="24" fill={BASE} stroke={STROKE} strokeWidth={1} />
            {/* Neck */}
            <rect x="93" y="52" width="14" height="10" fill={BASE} stroke={STROKE} strokeWidth={1} />

            {view === "front" ? (
              <>
                {/* Torso outline (non-interactive base for arms/legs joints) */}
                {/* Shoulders (deltoids) */}
                <Region part="shoulders" selected={selected} onSelect={setSelected}
                  d="M60,66 Q55,80 62,95 L80,90 L80,68 Z" />
                <Region part="shoulders" selected={selected} onSelect={setSelected}
                  d="M140,66 Q145,80 138,95 L120,90 L120,68 Z" />
                {/* Chest */}
                <Region part="chest" selected={selected} onSelect={setSelected}
                  d="M80,68 L120,68 L120,110 Q100,120 80,110 Z" />
                {/* Abs */}
                <Region part="abs" selected={selected} onSelect={setSelected}
                  d="M82,112 L118,112 L116,165 Q100,172 84,165 Z" />
                {/* Biceps */}
                <Region part="biceps" selected={selected} onSelect={setSelected}
                  d="M55,96 Q48,120 52,145 L68,142 L68,98 Z" />
                <Region part="biceps" selected={selected} onSelect={setSelected}
                  d="M145,96 Q152,120 148,145 L132,142 L132,98 Z" />
                {/* Forearms */}
                <Region part="forearms" selected={selected} onSelect={setSelected}
                  d="M52,146 Q48,175 50,200 L66,198 L68,146 Z" />
                <Region part="forearms" selected={selected} onSelect={setSelected}
                  d="M148,146 Q152,175 150,200 L134,198 L132,146 Z" />
                {/* Quads */}
                <Region part="quads" selected={selected} onSelect={setSelected}
                  d="M84,175 L98,175 L96,270 L78,268 Z" />
                <Region part="quads" selected={selected} onSelect={setSelected}
                  d="M116,175 L102,175 L104,270 L122,268 Z" />
                {/* Calves */}
                <Region part="calves" selected={selected} onSelect={setSelected}
                  d="M80,275 L96,275 Q94,330 90,360 L82,360 Q78,330 80,275 Z" />
                <Region part="calves" selected={selected} onSelect={setSelected}
                  d="M120,275 L104,275 Q106,330 110,360 L118,360 Q122,330 120,275 Z" />
                {/* Feet */}
                <ellipse cx="86" cy="372" rx="8" ry="6" fill={BASE} stroke={STROKE} strokeWidth={1} />
                <ellipse cx="114" cy="372" rx="8" ry="6" fill={BASE} stroke={STROKE} strokeWidth={1} />
              </>
            ) : (
              <>
                {/* Traps */}
                <Region part="traps" selected={selected} onSelect={setSelected}
                  d="M80,62 L120,62 L128,88 L100,80 L72,88 Z" />
                {/* Shoulders (rear delts) */}
                <Region part="shoulders" selected={selected} onSelect={setSelected}
                  d="M60,68 Q55,82 62,96 L78,90 L72,70 Z" />
                <Region part="shoulders" selected={selected} onSelect={setSelected}
                  d="M140,68 Q145,82 138,96 L122,90 L128,70 Z" />
                {/* Upper back */}
                <Region part="upperBack" selected={selected} onSelect={setSelected}
                  d="M72,90 L128,90 L124,120 L76,120 Z" />
                {/* Lats */}
                <Region part="lats" selected={selected} onSelect={setSelected}
                  d="M76,122 L100,128 L96,160 L78,155 Z" />
                <Region part="lats" selected={selected} onSelect={setSelected}
                  d="M124,122 L100,128 L104,160 L122,155 Z" />
                {/* Lower back */}
                <Region part="lowerBack" selected={selected} onSelect={setSelected}
                  d="M82,162 L118,162 L116,190 L84,190 Z" />
                {/* Triceps */}
                <Region part="triceps" selected={selected} onSelect={setSelected}
                  d="M55,98 Q48,122 52,146 L68,144 L68,100 Z" />
                <Region part="triceps" selected={selected} onSelect={setSelected}
                  d="M145,98 Q152,122 148,146 L132,144 L132,100 Z" />
                {/* Forearms */}
                <Region part="forearms" selected={selected} onSelect={setSelected}
                  d="M52,148 Q48,178 50,202 L66,200 L68,148 Z" />
                <Region part="forearms" selected={selected} onSelect={setSelected}
                  d="M148,148 Q152,178 150,202 L134,200 L132,148 Z" />
                {/* Glutes */}
                <Region part="glutes" selected={selected} onSelect={setSelected}
                  d="M82,192 Q100,205 118,192 L120,225 Q100,235 80,225 Z" />
                {/* Hamstrings */}
                <Region part="hamstrings" selected={selected} onSelect={setSelected}
                  d="M82,228 L100,232 L98,275 L80,272 Z" />
                <Region part="hamstrings" selected={selected} onSelect={setSelected}
                  d="M118,228 L100,232 L102,275 L120,272 Z" />
                {/* Calves */}
                <Region part="calves" selected={selected} onSelect={setSelected}
                  d="M80,280 L96,280 Q94,335 90,362 L82,362 Q78,335 80,280 Z" />
                <Region part="calves" selected={selected} onSelect={setSelected}
                  d="M120,280 L104,280 Q106,335 110,362 L118,362 Q122,335 120,280 Z" />
                {/* Feet */}
                <ellipse cx="86" cy="374" rx="8" ry="6" fill={BASE} stroke={STROKE} strokeWidth={1} />
                <ellipse cx="114" cy="374" rx="8" ry="6" fill={BASE} stroke={STROKE} strokeWidth={1} />
              </>
            )}
          </svg>
        </div>

        {/* Selected body part exercises */}
        {info && (
          <section className="rounded-2xl bg-gradient-dark border border-border p-4 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {info.label}
              </h3>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {info.exercises.length} popular
              </span>
            </div>
            <div className="space-y-2">
              {info.exercises.map((ex) => (
                <Collapsible key={ex.name} className="rounded-xl border border-border bg-card">
                  <CollapsibleTrigger className="group w-full flex items-center justify-between gap-2 p-3 text-left">
                    <span className="text-sm font-semibold truncate">{ex.name}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <p className="px-3 pb-3 text-xs text-muted-foreground leading-relaxed">
                      {ex.description}
                    </p>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </section>
        )}

        {!info && (
          <p className="text-center text-sm text-muted-foreground py-8">
            Tap a body part to see popular exercises.
          </p>
        )}
      </div>
    </AppShell>
  );
};
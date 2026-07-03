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
          <svg
            viewBox="0 0 220 480"
            className="w-full max-w-[260px] h-auto"
            aria-label={`${view} body`}
          >
            <defs>
              <linearGradient id="bodyShade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="hsl(var(--muted))" stopOpacity="0.55" />
                <stop offset="0.5" stopColor="hsl(var(--muted))" stopOpacity="0.9" />
                <stop offset="1" stopColor="hsl(var(--muted))" stopOpacity="0.55" />
              </linearGradient>
            </defs>

            {/* Full body silhouette — sits behind muscle regions, gives a clean outline */}
            <path
              d="M110,18
                 C 96,18 84,30 84,48
                 C 84,60 88,68 92,74
                 C 88,78 84,82 82,88
                 C 68,90 52,100 46,118
                 C 42,132 44,150 50,178
                 C 54,200 56,220 58,244
                 C 60,262 60,272 58,282
                 C 56,290 58,294 66,294
                 C 74,294 78,286 80,272
                 C 82,258 82,240 86,220
                 L 88,232
                 C 90,258 90,290 92,320
                 C 92,346 90,382 92,412
                 C 92,432 92,450 96,462
                 C 98,470 106,470 108,462
                 C 110,448 110,430 110,412
                 C 110,430 110,448 112,462
                 C 114,470 122,470 124,462
                 C 128,450 128,432 128,412
                 C 130,382 128,346 128,320
                 C 130,290 130,258 132,232
                 L 134,220
                 C 138,240 138,258 140,272
                 C 142,286 146,294 154,294
                 C 162,294 164,290 162,282
                 C 160,272 160,262 162,244
                 C 164,220 166,200 170,178
                 C 176,150 178,132 174,118
                 C 168,100 152,90 138,88
                 C 136,82 132,78 128,74
                 C 132,68 136,60 136,48
                 C 136,30 124,18 110,18 Z"
              fill="url(#bodyShade)"
              stroke={STROKE}
              strokeWidth={1.2}
            />

            {view === "front" ? (
              <>
                {/* Shoulders (front delts) */}
                <Region part="shoulders" selected={selected} onSelect={setSelected}
                  d="M84,90 C 70,92 58,102 54,118 C 62,120 74,116 84,108 C 88,102 88,96 84,90 Z" />
                <Region part="shoulders" selected={selected} onSelect={setSelected}
                  d="M136,90 C 150,92 162,102 166,118 C 158,120 146,116 136,108 C 132,102 132,96 136,90 Z" />

                {/* Chest — two pecs */}
                <Region part="chest" selected={selected} onSelect={setSelected}
                  d="M108,94 C 100,94 92,96 86,102 C 82,110 82,124 88,134 C 96,140 104,140 108,134 C 110,120 110,106 108,94 Z" />
                <Region part="chest" selected={selected} onSelect={setSelected}
                  d="M112,94 C 120,94 128,96 134,102 C 138,110 138,124 132,134 C 124,140 116,140 112,134 C 110,120 110,106 112,94 Z" />

                {/* Abs — stacked blocks */}
                <Region part="abs" selected={selected} onSelect={setSelected}
                  d="M96,140 C 104,144 116,144 124,140 C 126,150 126,156 124,160 C 116,164 104,164 96,160 C 94,156 94,150 96,140 Z" />
                <Region part="abs" selected={selected} onSelect={setSelected}
                  d="M96,164 C 104,168 116,168 124,164 C 126,172 126,178 124,182 C 116,186 104,186 96,182 C 94,178 94,172 96,164 Z" />
                <Region part="abs" selected={selected} onSelect={setSelected}
                  d="M97,186 C 105,190 115,190 123,186 C 124,196 122,204 118,210 C 110,214 104,212 100,208 C 96,202 96,194 97,186 Z" />

                {/* Biceps */}
                <Region part="biceps" selected={selected} onSelect={setSelected}
                  d="M52,122 C 46,140 44,164 50,184 C 62,184 72,172 74,152 C 74,138 66,124 58,122 Z" />
                <Region part="biceps" selected={selected} onSelect={setSelected}
                  d="M168,122 C 174,140 176,164 170,184 C 158,184 148,172 146,152 C 146,138 154,124 162,122 Z" />

                {/* Forearms */}
                <Region part="forearms" selected={selected} onSelect={setSelected}
                  d="M50,188 C 46,208 48,232 54,252 C 64,254 72,242 74,224 C 74,210 68,196 60,190 Z" />
                <Region part="forearms" selected={selected} onSelect={setSelected}
                  d="M170,188 C 174,208 172,232 166,252 C 156,254 148,242 146,224 C 146,210 152,196 160,190 Z" />

                {/* Quads */}
                <Region part="quads" selected={selected} onSelect={setSelected}
                  d="M92,222 C 88,246 88,282 92,320 C 100,322 108,320 108,312 C 108,286 106,254 104,224 C 100,220 96,220 92,222 Z" />
                <Region part="quads" selected={selected} onSelect={setSelected}
                  d="M128,222 C 132,246 132,282 128,320 C 120,322 112,320 112,312 C 112,286 114,254 116,224 C 120,220 124,220 128,222 Z" />

                {/* Calves (front = shins/lower leg silhouette shape, still labeled calves for consistency) */}
                <Region part="calves" selected={selected} onSelect={setSelected}
                  d="M94,332 C 90,360 90,400 96,438 C 102,440 108,436 108,428 C 108,398 106,362 104,334 C 100,330 96,330 94,332 Z" />
                <Region part="calves" selected={selected} onSelect={setSelected}
                  d="M126,332 C 130,360 130,400 124,438 C 118,440 112,436 112,428 C 112,398 114,362 116,334 C 120,330 124,330 126,332 Z" />
              </>
            ) : (
              <>
                {/* Traps */}
                <Region part="traps" selected={selected} onSelect={setSelected}
                  d="M90,78 C 100,74 120,74 130,78 C 138,84 142,94 138,104 C 128,100 118,98 110,98 C 102,98 92,100 82,104 C 78,94 82,84 90,78 Z" />

                {/* Shoulders (rear delts) */}
                <Region part="shoulders" selected={selected} onSelect={setSelected}
                  d="M82,106 C 70,110 60,120 56,132 C 64,134 76,130 84,122 C 88,116 88,110 82,106 Z" />
                <Region part="shoulders" selected={selected} onSelect={setSelected}
                  d="M138,106 C 150,110 160,120 164,132 C 156,134 144,130 136,122 C 132,116 132,110 138,106 Z" />

                {/* Upper back */}
                <Region part="upperBack" selected={selected} onSelect={setSelected}
                  d="M86,108 C 100,106 120,106 134,108 C 138,124 138,140 132,150 C 116,148 104,148 88,150 C 82,140 82,124 86,108 Z" />

                {/* Lats */}
                <Region part="lats" selected={selected} onSelect={setSelected}
                  d="M86,152 C 96,154 106,156 108,164 C 108,182 104,196 96,204 C 88,204 84,196 82,184 C 80,172 82,160 86,152 Z" />
                <Region part="lats" selected={selected} onSelect={setSelected}
                  d="M134,152 C 124,154 114,156 112,164 C 112,182 116,196 124,204 C 132,204 136,196 138,184 C 140,172 138,160 134,152 Z" />

                {/* Lower back */}
                <Region part="lowerBack" selected={selected} onSelect={setSelected}
                  d="M96,206 C 104,208 116,208 124,206 C 126,216 126,226 124,232 C 116,234 104,234 96,232 C 94,226 94,216 96,206 Z" />

                {/* Triceps */}
                <Region part="triceps" selected={selected} onSelect={setSelected}
                  d="M52,122 C 46,140 44,164 50,184 C 62,184 72,172 74,152 C 74,138 66,124 58,122 Z" />
                <Region part="triceps" selected={selected} onSelect={setSelected}
                  d="M168,122 C 174,140 176,164 170,184 C 158,184 148,172 146,152 C 146,138 154,124 162,122 Z" />

                {/* Forearms */}
                <Region part="forearms" selected={selected} onSelect={setSelected}
                  d="M50,188 C 46,208 48,232 54,252 C 64,254 72,242 74,224 C 74,210 68,196 60,190 Z" />
                <Region part="forearms" selected={selected} onSelect={setSelected}
                  d="M170,188 C 174,208 172,232 166,252 C 156,254 148,242 146,224 C 146,210 152,196 160,190 Z" />

                {/* Glutes */}
                <Region part="glutes" selected={selected} onSelect={setSelected}
                  d="M88,234 C 100,242 120,242 132,234 C 136,246 136,262 130,272 C 118,278 102,278 90,272 C 84,262 84,246 88,234 Z" />

                {/* Hamstrings */}
                <Region part="hamstrings" selected={selected} onSelect={setSelected}
                  d="M92,276 C 88,296 88,316 92,332 C 100,334 108,332 108,324 C 108,308 106,290 104,278 C 100,274 96,274 92,276 Z" />
                <Region part="hamstrings" selected={selected} onSelect={setSelected}
                  d="M128,276 C 132,296 132,316 128,332 C 120,334 112,332 112,324 C 112,308 114,290 116,278 C 120,274 124,274 128,276 Z" />

                {/* Calves */}
                <Region part="calves" selected={selected} onSelect={setSelected}
                  d="M92,338 C 88,362 90,394 96,420 C 104,422 110,416 108,406 C 108,384 106,364 104,340 C 100,336 96,336 92,338 Z" />
                <Region part="calves" selected={selected} onSelect={setSelected}
                  d="M128,338 C 132,362 130,394 124,420 C 116,422 110,416 112,406 C 112,384 114,364 116,340 C 120,336 124,336 128,338 Z" />
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
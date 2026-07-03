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
            viewBox="0 0 200 380"
            className="w-full max-w-[210px] h-auto"
            aria-label={`${view} body`}
          >
            <defs>
              <linearGradient id="bodyShade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="hsl(var(--muted))" stopOpacity="0.55" />
                <stop offset="0.5" stopColor="hsl(var(--muted))" stopOpacity="0.9" />
                <stop offset="1" stopColor="hsl(var(--muted))" stopOpacity="0.55" />
              </linearGradient>
            </defs>

            {/* Head */}
            <circle cx="100" cy="34" r="15" fill="url(#bodyShade)" stroke={STROKE} strokeWidth={1.2} />
            {/* Neck */}
            <path
              d="M 88,48 L 112,48 L 110,60 L 90,60 Z"
              fill="url(#bodyShade)"
              stroke={STROKE}
              strokeWidth={1.2}
            />

            {/* Bodybuilder silhouette — broad shoulders, narrow waist, thick limbs */}
            <path
              d="M 90,60
                 C 68,62 34,70 28,86
                 C 24,100 28,118 30,136
                 C 30,154 28,174 28,192
                 C 28,206 34,214 42,212
                 C 50,208 52,198 52,186
                 C 52,168 54,148 58,130
                 C 62,114 72,104 78,102
                 C 78,118 80,136 78,154
                 C 78,168 76,178 80,186
                 C 78,210 76,238 80,260
                 C 82,278 84,294 84,310
                 C 84,322 88,330 94,330
                 C 98,330 98,326 98,310
                 C 96,280 96,240 98,200
                 C 98,192 98,188 98,186
                 L 102,186
                 C 102,188 102,192 102,200
                 C 104,240 104,280 102,310
                 C 102,326 102,330 106,330
                 C 112,330 116,322 116,310
                 C 116,294 118,278 120,260
                 C 124,238 122,210 120,186
                 C 124,178 122,168 122,154
                 C 120,136 122,118 122,102
                 C 128,104 138,114 142,130
                 C 146,148 148,168 148,186
                 C 148,198 150,208 158,212
                 C 166,214 172,206 172,192
                 C 172,174 170,154 170,136
                 C 172,118 176,100 172,86
                 C 166,70 132,62 110,60
                 Z"
              fill="url(#bodyShade)"
              stroke={STROKE}
              strokeWidth={1.2}
            />

            {view === "front" ? (
              <>
                {/* Shoulders (front delts) */}
                <Region part="shoulders" selected={selected} onSelect={setSelected}
                  d="M 88,66 C 68,68 46,78 38,92 C 48,98 66,94 78,86 C 84,78 84,70 88,66 Z" />
                <Region part="shoulders" selected={selected} onSelect={setSelected}
                  d="M 112,66 C 132,68 154,78 162,92 C 152,98 134,94 122,86 C 116,78 116,70 112,66 Z" />

                {/* Chest — two full pecs */}
                <Region part="chest" selected={selected} onSelect={setSelected}
                  d="M 100,80 C 88,80 78,86 74,96 C 72,110 76,124 84,132 C 92,136 98,132 100,124 C 100,110 100,94 100,80 Z" />
                <Region part="chest" selected={selected} onSelect={setSelected}
                  d="M 100,80 C 112,80 122,86 126,96 C 128,110 124,124 116,132 C 108,136 102,132 100,124 C 100,110 100,94 100,80 Z" />

                {/* Abs */}
                <Region part="abs" selected={selected} onSelect={setSelected}
                  d="M 82,134 C 100,138 118,138 118,134 C 120,146 120,158 118,168 C 100,172 82,168 82,168 C 80,158 80,146 82,134 Z" />

                {/* Biceps */}
                <Region part="biceps" selected={selected} onSelect={setSelected}
                  d="M 60,104 C 44,112 38,130 40,148 C 50,156 66,150 72,132 C 72,118 68,106 60,104 Z" />
                <Region part="biceps" selected={selected} onSelect={setSelected}
                  d="M 140,104 C 156,112 162,130 160,148 C 150,156 134,150 128,132 C 128,118 132,106 140,104 Z" />

                {/* Forearms */}
                <Region part="forearms" selected={selected} onSelect={setSelected}
                  d="M 46,152 C 40,168 40,188 46,204 C 56,206 64,196 64,180 C 64,166 56,154 48,152 Z" />
                <Region part="forearms" selected={selected} onSelect={setSelected}
                  d="M 154,152 C 160,168 160,188 154,204 C 144,206 136,196 136,180 C 136,166 144,154 152,152 Z" />

                {/* Quads */}
                <Region part="quads" selected={selected} onSelect={setSelected}
                  d="M 82,188 C 74,210 72,234 78,254 C 88,260 98,252 98,238 C 98,220 94,200 90,188 C 86,184 84,184 82,188 Z" />
                <Region part="quads" selected={selected} onSelect={setSelected}
                  d="M 118,188 C 126,210 128,234 122,254 C 112,260 102,252 102,238 C 102,220 106,200 110,188 C 114,184 116,184 118,188 Z" />

                {/* Calves */}
                <Region part="calves" selected={selected} onSelect={setSelected}
                  d="M 86,260 C 78,276 78,298 86,314 C 96,316 100,306 100,290 C 100,274 94,262 88,260 Z" />
                <Region part="calves" selected={selected} onSelect={setSelected}
                  d="M 114,260 C 122,276 122,298 114,314 C 104,316 100,306 100,290 C 100,274 106,262 112,260 Z" />
              </>
            ) : (
              <>
                {/* Traps */}
                <Region part="traps" selected={selected} onSelect={setSelected}
                  d="M 88,62 C 100,58 112,58 112,62 C 126,68 134,80 132,92 C 112,84 88,84 68,92 C 66,80 74,68 88,62 Z" />

                {/* Shoulders (rear delts) */}
                <Region part="shoulders" selected={selected} onSelect={setSelected}
                  d="M 74,92 C 56,98 44,110 42,124 C 52,126 66,120 74,110 C 78,102 76,96 74,92 Z" />
                <Region part="shoulders" selected={selected} onSelect={setSelected}
                  d="M 126,92 C 144,98 156,110 158,124 C 148,126 134,120 126,110 C 122,102 124,96 126,92 Z" />

                {/* Upper back */}
                <Region part="upperBack" selected={selected} onSelect={setSelected}
                  d="M 78,98 C 100,94 122,98 122,98 C 126,112 126,126 120,136 C 100,134 80,136 80,136 C 74,126 74,112 78,98 Z" />

                {/* Lats */}
                <Region part="lats" selected={selected} onSelect={setSelected}
                  d="M 80,138 C 92,140 100,146 100,156 C 98,174 92,188 82,194 C 74,192 70,182 70,168 C 70,152 74,140 80,138 Z" />
                <Region part="lats" selected={selected} onSelect={setSelected}
                  d="M 120,138 C 108,140 100,146 100,156 C 102,174 108,188 118,194 C 126,192 130,182 130,168 C 130,152 126,140 120,138 Z" />

                {/* Lower back */}
                <Region part="lowerBack" selected={selected} onSelect={setSelected}
                  d="M 84,196 C 100,198 116,196 116,196 C 118,206 116,214 112,220 C 100,222 88,222 88,220 C 84,214 82,206 84,196 Z" />

                {/* Triceps */}
                <Region part="triceps" selected={selected} onSelect={setSelected}
                  d="M 60,104 C 44,112 38,130 40,148 C 50,156 66,150 72,132 C 72,118 68,106 60,104 Z" />
                <Region part="triceps" selected={selected} onSelect={setSelected}
                  d="M 140,104 C 156,112 162,130 160,148 C 150,156 134,150 128,132 C 128,118 132,106 140,104 Z" />

                {/* Forearms */}
                <Region part="forearms" selected={selected} onSelect={setSelected}
                  d="M 46,152 C 40,168 40,188 46,204 C 56,206 64,196 64,180 C 64,166 56,154 48,152 Z" />
                <Region part="forearms" selected={selected} onSelect={setSelected}
                  d="M 154,152 C 160,168 160,188 154,204 C 144,206 136,196 136,180 C 136,166 144,154 152,152 Z" />

                {/* Glutes */}
                <Region part="glutes" selected={selected} onSelect={setSelected}
                  d="M 78,222 C 100,228 122,228 122,222 C 130,232 130,248 124,258 C 100,266 78,258 78,258 C 70,248 70,232 78,222 Z" />

                {/* Hamstrings */}
                <Region part="hamstrings" selected={selected} onSelect={setSelected}
                  d="M 82,260 C 76,276 76,296 82,312 C 90,314 96,306 96,292 C 96,278 92,264 86,260 Z" />
                <Region part="hamstrings" selected={selected} onSelect={setSelected}
                  d="M 118,260 C 124,276 124,296 118,312 C 110,314 104,306 104,292 C 104,278 108,264 114,260 Z" />

                {/* Calves */}
                <Region part="calves" selected={selected} onSelect={setSelected}
                  d="M 86,260 C 78,276 78,298 86,314 C 96,316 100,306 100,290 C 100,274 94,262 88,260 Z" />
                <Region part="calves" selected={selected} onSelect={setSelected}
                  d="M 114,260 C 122,276 122,298 114,314 C 104,316 100,306 100,290 C 100,274 106,262 112,260 Z" />
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
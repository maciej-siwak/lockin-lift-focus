import { useState, type KeyboardEvent } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { AppShell } from "./AppShell";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import frontFigure from "@/assets/fitness-figure-front.png";
import backFigure from "@/assets/fitness-figure-back.png";

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
const BASE = "transparent";
const STROKE = "transparent";
const ACTIVE_STROKE = "hsl(var(--primary))";

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
  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(part);
    }
  };
  const props = {
    fill,
    stroke: active ? ACTIVE_STROKE : STROKE,
    strokeWidth: active ? 3 : 0,
    vectorEffect: "non-scaling-stroke",
    opacity: active ? 0.52 : 1,
    style: {
      cursor: "pointer",
      filter: active ? "drop-shadow(0 0 12px hsl(var(--primary) / 0.78))" : "none",
      transition: "fill 180ms ease, stroke 180ms ease, filter 180ms ease, opacity 180ms ease",
    },
  } as const;

  let shape = null;
  if (d) shape = <path d={d} {...props} />;
  if (cx != null && cy != null && rx != null && ry != null) shape = <ellipse cx={cx} cy={cy} rx={rx} ry={ry} {...props} />;
  if (x != null && y != null && w != null && h != null) shape = <rect x={x} y={y} width={w} height={h} rx={r ?? 4} {...props} />;
  if (!shape) return null;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={DATA[part].label}
      onClick={() => onSelect(part)}
      onKeyDown={handleKeyDown}
      className="outline-none"
    >
      <title>{DATA[part].label}</title>
      {shape}
    </g>
  );
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
            viewBox="0 0 240 430"
            className="w-full max-w-[188px] h-auto"
            aria-label={`${view} body`}
          >
            <defs>
              <linearGradient id="bodyShade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={FIGURE_FILL} stopOpacity="0.72" />
                <stop offset="0.5" stopColor="hsl(var(--muted))" stopOpacity="1" />
                <stop offset="1" stopColor={FIGURE_FILL} stopOpacity="0.72" />
              </linearGradient>
              <linearGradient id="limbShade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="hsl(var(--muted))" stopOpacity="0.98" />
                <stop offset="1" stopColor={FIGURE_FILL} stopOpacity="0.76" />
              </linearGradient>
            </defs>

            <g fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
              <ellipse cx="120" cy="37" rx="17" ry="22" fill="url(#bodyShade)" stroke={FIGURE_STROKE} strokeWidth="1.1" />
              <path d="M 107 57 C 111 66 129 66 133 57 L 137 81 C 129 86 111 86 103 81 Z" fill="url(#bodyShade)" stroke={FIGURE_STROKE} strokeWidth="1.1" />
              <path d="M 112 47 C 117 51 123 51 128 47" stroke={DETAIL_STROKE} strokeWidth="0.9" opacity="0.7" />

              {/* Balanced bodybuilder base silhouette */}
              <path
                d="M 103 79
                   C 87 80 66 86 53 101
                   C 42 114 34 139 29 167
                   C 25 191 25 220 32 240
                   C 36 251 48 251 54 240
                   C 61 226 60 200 65 172
                   C 70 142 81 128 94 121
                   C 88 147 88 175 92 197
                   C 94 208 97 220 95 234
                   C 91 258 86 284 82 310
                   C 78 336 75 365 80 391
                   C 83 405 96 407 101 393
                   C 108 371 110 337 114 306
                   C 116 286 117 264 119 242
                   C 120 238 120 238 121 242
                   C 123 264 124 286 126 306
                   C 130 337 132 371 139 393
                   C 144 407 157 405 160 391
                   C 165 365 162 336 158 310
                   C 154 284 149 258 145 234
                   C 143 220 146 208 148 197
                   C 152 175 152 147 146 121
                   C 159 128 170 142 175 172
                   C 180 200 179 226 186 240
                   C 192 251 204 251 208 240
                   C 215 220 215 191 211 167
                   C 206 139 198 114 187 101
                   C 174 86 153 80 137 79
                   C 133 91 107 91 103 79 Z"
                fill="url(#bodyShade)"
                stroke={FIGURE_STROKE}
                strokeWidth="1.25"
              />
              <path d="M 95 219 C 107 226 133 226 145 219" stroke={DETAIL_STROKE} strokeWidth="0.9" opacity="0.55" />
              <path d="M 111 241 C 114 263 113 288 110 308" stroke={DETAIL_STROKE} strokeWidth="0.85" opacity="0.55" />
              <path d="M 129 241 C 126 263 127 288 130 308" stroke={DETAIL_STROKE} strokeWidth="0.85" opacity="0.55" />
              <path d="M 101 310 C 107 316 113 318 119 316" stroke={DETAIL_STROKE} strokeWidth="0.8" opacity="0.5" />
              <path d="M 139 316 C 133 318 127 316 121 310" stroke={DETAIL_STROKE} strokeWidth="0.8" opacity="0.5" />
            </g>

            {view === "front" ? (
              <>
                <Region part="shoulders" selected={selected} onSelect={setSelected}
                  d="M 100 84 C 82 82 61 91 50 105 C 44 113 43 123 48 131 C 63 130 81 121 91 107 C 97 99 99 91 100 84 Z" />
                <Region part="shoulders" selected={selected} onSelect={setSelected}
                  d="M 140 84 C 158 82 179 91 190 105 C 196 113 197 123 192 131 C 177 130 159 121 149 107 C 143 99 141 91 140 84 Z" />

                <Region part="chest" selected={selected} onSelect={setSelected}
                  d="M 118 96 C 106 89 90 91 80 101 C 72 109 70 123 74 137 C 86 144 103 142 116 130 C 119 118 120 106 118 96 Z" />
                <Region part="chest" selected={selected} onSelect={setSelected}
                  d="M 122 96 C 134 89 150 91 160 101 C 168 109 170 123 166 137 C 154 144 137 142 124 130 C 121 118 120 106 122 96 Z" />

                <Region part="abs" selected={selected} onSelect={setSelected}
                  d="M 102 140 C 113 145 127 145 138 140 C 143 160 144 183 137 206 C 129 212 111 212 103 206 C 96 183 97 160 102 140 Z" />

                <Region part="biceps" selected={selected} onSelect={setSelected}
                  d="M 69 119 C 54 129 47 149 48 169 C 52 181 65 184 74 174 C 83 162 86 140 81 126 C 78 120 74 118 69 119 Z" />
                <Region part="biceps" selected={selected} onSelect={setSelected}
                  d="M 171 119 C 186 129 193 149 192 169 C 188 181 175 184 166 174 C 157 162 154 140 159 126 C 162 120 166 118 171 119 Z" />

                <Region part="forearms" selected={selected} onSelect={setSelected}
                  d="M 49 174 C 39 191 39 220 47 239 C 55 246 65 241 68 229 C 70 209 68 189 60 177 C 56 173 52 172 49 174 Z" />
                <Region part="forearms" selected={selected} onSelect={setSelected}
                  d="M 191 174 C 201 191 201 220 193 239 C 185 246 175 241 172 229 C 170 209 172 189 180 177 C 184 173 188 172 191 174 Z" />

                <Region part="quads" selected={selected} onSelect={setSelected}
                  d="M 96 235 C 87 259 82 285 84 313 C 89 329 102 329 110 314 C 116 290 115 259 109 238 C 105 233 100 232 96 235 Z" />
                <Region part="quads" selected={selected} onSelect={setSelected}
                  d="M 144 235 C 153 259 158 285 156 313 C 151 329 138 329 130 314 C 124 290 125 259 131 238 C 135 233 140 232 144 235 Z" />

                <Region part="calves" selected={selected} onSelect={setSelected}
                  d="M 86 315 C 79 339 78 367 84 391 C 91 401 101 397 104 382 C 108 358 105 334 96 318 C 93 314 89 313 86 315 Z" />
                <Region part="calves" selected={selected} onSelect={setSelected}
                  d="M 154 315 C 161 339 162 367 156 391 C 149 401 139 397 136 382 C 132 358 135 334 144 318 C 147 314 151 313 154 315 Z" />

                <g fill="none" stroke={SEPARATOR} strokeLinecap="round" strokeWidth="0.8" opacity="0.72" pointerEvents="none">
                  <path d="M 120 98 L 120 132" />
                  <path d="M 84 116 C 98 120 106 123 116 130" />
                  <path d="M 156 116 C 142 120 134 123 124 130" />
                  <path d="M 104 157 L 136 157" />
                  <path d="M 101 176 L 139 176" />
                  <path d="M 104 195 L 136 195" />
                  <path d="M 120 146 L 120 207" />
                  <path d="M 97 251 C 104 263 109 279 110 301" />
                  <path d="M 143 251 C 136 263 131 279 130 301" />
                </g>
              </>
            ) : (
              <>
                <Region part="traps" selected={selected} onSelect={setSelected}
                  d="M 104 78 C 112 86 128 86 136 78 C 148 84 158 96 160 110 C 145 111 131 105 120 95 C 109 105 95 111 80 110 C 82 96 92 84 104 78 Z" />

                <Region part="shoulders" selected={selected} onSelect={setSelected}
                  d="M 80 103 C 62 107 49 120 46 136 C 58 141 77 134 88 120 C 90 112 87 106 80 103 Z" />
                <Region part="shoulders" selected={selected} onSelect={setSelected}
                  d="M 160 103 C 178 107 191 120 194 136 C 182 141 163 134 152 120 C 150 112 153 106 160 103 Z" />

                <Region part="upperBack" selected={selected} onSelect={setSelected}
                  d="M 86 108 C 103 101 137 101 154 108 C 158 124 154 143 145 155 C 129 151 111 151 95 155 C 86 143 82 124 86 108 Z" />

                <Region part="lats" selected={selected} onSelect={setSelected}
                  d="M 88 151 C 105 157 116 170 116 186 C 113 205 103 220 91 225 C 80 219 75 202 77 181 C 78 167 82 156 88 151 Z" />
                <Region part="lats" selected={selected} onSelect={setSelected}
                  d="M 152 151 C 135 157 124 170 124 186 C 127 205 137 220 149 225 C 160 219 165 202 163 181 C 162 167 158 156 152 151 Z" />

                <Region part="lowerBack" selected={selected} onSelect={setSelected}
                  d="M 100 218 C 111 222 129 222 140 218 C 143 232 139 245 131 254 C 123 258 117 258 109 254 C 101 245 97 232 100 218 Z" />

                <Region part="triceps" selected={selected} onSelect={setSelected}
                  d="M 68 123 C 55 135 49 154 50 174 C 54 185 66 187 74 177 C 82 163 83 141 78 128 C 75 123 72 122 68 123 Z" />
                <Region part="triceps" selected={selected} onSelect={setSelected}
                  d="M 172 123 C 185 135 191 154 190 174 C 186 185 174 187 166 177 C 158 163 157 141 162 128 C 165 123 168 122 172 123 Z" />

                <Region part="forearms" selected={selected} onSelect={setSelected}
                  d="M 50 178 C 40 195 40 221 48 239 C 56 246 65 240 68 228 C 70 209 68 192 60 181 C 57 177 53 176 50 178 Z" />
                <Region part="forearms" selected={selected} onSelect={setSelected}
                  d="M 190 178 C 200 195 200 221 192 239 C 184 246 175 240 172 228 C 170 209 172 192 180 181 C 183 177 187 176 190 178 Z" />

                <Region part="glutes" selected={selected} onSelect={setSelected}
                  d="M 93 253 C 109 245 131 245 147 253 C 155 269 153 287 142 299 C 129 301 111 301 98 299 C 87 287 85 269 93 253 Z" />

                <Region part="hamstrings" selected={selected} onSelect={setSelected}
                  d="M 91 299 C 84 324 82 352 87 378 C 93 390 104 388 109 374 C 115 349 114 324 105 304 C 101 299 96 297 91 299 Z" />
                <Region part="hamstrings" selected={selected} onSelect={setSelected}
                  d="M 149 299 C 156 324 158 352 153 378 C 147 390 136 388 131 374 C 125 349 126 324 135 304 C 139 299 144 297 149 299 Z" />

                <Region part="calves" selected={selected} onSelect={setSelected}
                  d="M 86 334 C 79 353 79 376 84 392 C 91 401 101 397 104 382 C 106 362 102 343 95 335 C 92 332 89 332 86 334 Z" />
                <Region part="calves" selected={selected} onSelect={setSelected}
                  d="M 154 334 C 161 353 161 376 156 392 C 149 401 139 397 136 382 C 134 362 138 343 145 335 C 148 332 151 332 154 334 Z" />

                <g fill="none" stroke={SEPARATOR} strokeLinecap="round" strokeWidth="0.8" opacity="0.72" pointerEvents="none">
                  <path d="M 120 99 L 120 254" />
                  <path d="M 91 127 C 107 134 133 134 149 127" />
                  <path d="M 92 151 C 110 161 130 161 148 151" />
                  <path d="M 91 223 C 111 231 129 231 149 223" />
                  <path d="M 120 251 C 113 265 111 281 113 296" />
                  <path d="M 120 251 C 127 265 129 281 127 296" />
                  <path d="M 97 319 C 103 335 106 352 106 370" />
                  <path d="M 143 319 C 137 335 134 352 134 370" />
                </g>
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
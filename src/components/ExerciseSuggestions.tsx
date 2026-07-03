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
          <div className="relative w-full max-w-[190px] aspect-[3/5]">
            <img
              src={view === "front" ? frontFigure : backFigure}
              alt={`${view} anatomy figure`}
              width={768}
              height={1280}
              className="absolute inset-0 h-full w-full object-contain select-none pointer-events-none drop-shadow-2xl"
              loading="lazy"
            />
            <svg
              viewBox="0 0 768 1280"
              className="absolute inset-0 h-full w-full"
              aria-label={`${view} body`}
            >
              {view === "front" ? (
                <>
                  <Region part="shoulders" selected={selected} onSelect={setSelected}
                    d="M 204 238 C 241 214 293 218 314 253 C 289 296 237 319 190 298 C 178 278 184 251 204 238 Z" />
                  <Region part="shoulders" selected={selected} onSelect={setSelected}
                    d="M 564 238 C 527 214 475 218 454 253 C 479 296 531 319 578 298 C 590 278 584 251 564 238 Z" />

                  <Region part="chest" selected={selected} onSelect={setSelected}
                    d="M 374 284 C 325 259 264 270 236 312 C 214 346 225 404 265 428 C 312 451 357 426 376 392 C 385 352 385 314 374 284 Z" />
                  <Region part="chest" selected={selected} onSelect={setSelected}
                    d="M 394 284 C 443 259 504 270 532 312 C 554 346 543 404 503 428 C 456 451 411 426 392 392 C 383 352 383 314 394 284 Z" />

                  <Region part="abs" selected={selected} onSelect={setSelected}
                    d="M 306 432 C 356 452 412 452 462 432 C 489 502 485 607 446 673 C 403 696 365 696 322 673 C 283 607 279 502 306 432 Z" />

                  <Region part="biceps" selected={selected} onSelect={setSelected}
                    d="M 190 337 C 143 373 124 460 139 529 C 158 570 207 564 232 523 C 264 460 256 376 222 342 C 211 333 199 331 190 337 Z" />
                  <Region part="biceps" selected={selected} onSelect={setSelected}
                    d="M 578 337 C 625 373 644 460 629 529 C 610 570 561 564 536 523 C 504 460 512 376 546 342 C 557 333 569 331 578 337 Z" />

                  <Region part="forearms" selected={selected} onSelect={setSelected}
                    d="M 153 542 C 115 604 104 712 138 787 C 166 827 217 802 227 742 C 238 658 217 574 180 543 C 170 536 160 535 153 542 Z" />
                  <Region part="forearms" selected={selected} onSelect={setSelected}
                    d="M 615 542 C 653 604 664 712 630 787 C 602 827 551 802 541 742 C 530 658 551 574 588 543 C 598 536 608 535 615 542 Z" />

                  <Region part="quads" selected={selected} onSelect={setSelected}
                    d="M 265 724 C 224 814 226 931 267 1013 C 304 1051 359 1023 369 950 C 382 853 356 753 312 716 C 292 708 275 711 265 724 Z" />
                  <Region part="quads" selected={selected} onSelect={setSelected}
                    d="M 503 724 C 544 814 542 931 501 1013 C 464 1051 409 1023 399 950 C 386 853 412 753 456 716 C 476 708 493 711 503 724 Z" />

                  <Region part="calves" selected={selected} onSelect={setSelected}
                    d="M 274 964 C 235 1039 242 1145 279 1202 C 316 1230 357 1190 358 1118 C 360 1048 331 988 298 963 C 289 958 281 958 274 964 Z" />
                  <Region part="calves" selected={selected} onSelect={setSelected}
                    d="M 494 964 C 533 1039 526 1145 489 1202 C 452 1230 411 1190 410 1118 C 408 1048 437 988 470 963 C 479 958 487 958 494 964 Z" />
                </>
              ) : (
                <>
                  <Region part="traps" selected={selected} onSelect={setSelected}
                    d="M 312 244 C 356 285 412 285 456 244 C 499 274 512 329 492 371 C 451 367 414 340 384 304 C 354 340 317 367 276 371 C 256 329 269 274 312 244 Z" />

                  <Region part="shoulders" selected={selected} onSelect={setSelected}
                    d="M 261 333 C 218 344 181 382 173 429 C 202 459 270 441 305 389 C 306 359 290 338 261 333 Z" />
                  <Region part="shoulders" selected={selected} onSelect={setSelected}
                    d="M 507 333 C 550 344 587 382 595 429 C 566 459 498 441 463 389 C 462 359 478 338 507 333 Z" />

                  <Region part="upperBack" selected={selected} onSelect={setSelected}
                    d="M 281 352 C 338 310 430 310 487 352 C 499 430 471 507 425 552 C 395 543 373 543 343 552 C 297 507 269 430 281 352 Z" />

                  <Region part="lats" selected={selected} onSelect={setSelected}
                    d="M 279 488 C 333 520 365 578 361 648 C 348 718 302 760 255 746 C 217 689 220 576 249 510 C 258 494 268 486 279 488 Z" />
                  <Region part="lats" selected={selected} onSelect={setSelected}
                    d="M 489 488 C 435 520 403 578 407 648 C 420 718 466 760 513 746 C 551 689 548 576 519 510 C 510 494 500 486 489 488 Z" />

                  <Region part="lowerBack" selected={selected} onSelect={setSelected}
                    d="M 319 671 C 356 688 412 688 449 671 C 459 727 438 779 405 804 C 391 810 377 810 363 804 C 330 779 309 727 319 671 Z" />

                  <Region part="triceps" selected={selected} onSelect={setSelected}
                    d="M 204 429 C 162 476 151 558 176 619 C 198 647 237 626 251 576 C 269 506 259 448 230 425 C 220 419 211 420 204 429 Z" />
                  <Region part="triceps" selected={selected} onSelect={setSelected}
                    d="M 564 429 C 606 476 617 558 592 619 C 570 647 531 626 517 576 C 499 506 509 448 538 425 C 548 419 557 420 564 429 Z" />

                  <Region part="forearms" selected={selected} onSelect={setSelected}
                    d="M 179 606 C 145 655 146 727 179 771 C 204 789 239 760 240 707 C 242 654 218 616 193 603 C 188 601 183 602 179 606 Z" />
                  <Region part="forearms" selected={selected} onSelect={setSelected}
                    d="M 589 606 C 623 655 622 727 589 771 C 564 789 529 760 528 707 C 526 654 550 616 575 603 C 580 601 585 602 589 606 Z" />

                  <Region part="glutes" selected={selected} onSelect={setSelected}
                    d="M 300 754 C 353 720 415 720 468 754 C 494 818 473 881 427 909 C 398 912 370 912 341 909 C 295 881 274 818 300 754 Z" />

                  <Region part="hamstrings" selected={selected} onSelect={setSelected}
                    d="M 280 878 C 240 954 245 1051 286 1112 C 322 1137 363 1098 365 1025 C 365 956 338 899 305 876 C 295 871 287 872 280 878 Z" />
                  <Region part="hamstrings" selected={selected} onSelect={setSelected}
                    d="M 488 878 C 528 954 523 1051 482 1112 C 446 1137 405 1098 403 1025 C 403 956 430 899 463 876 C 473 871 481 872 488 878 Z" />

                  <Region part="calves" selected={selected} onSelect={setSelected}
                    d="M 259 1006 C 222 1060 221 1141 258 1194 C 291 1210 326 1175 326 1112 C 327 1059 302 1015 276 1002 C 269 1000 263 1001 259 1006 Z" />
                  <Region part="calves" selected={selected} onSelect={setSelected}
                    d="M 509 1006 C 546 1060 547 1141 510 1194 C 477 1210 442 1175 442 1112 C 441 1059 466 1015 492 1002 C 499 1000 505 1001 509 1006 Z" />
                </>
              )}
            </svg>
          </div>
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
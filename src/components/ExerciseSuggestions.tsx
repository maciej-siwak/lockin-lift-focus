import { useState, type KeyboardEvent, type SVGProps } from "react";
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

const HIGHLIGHT_FILL = "hsl(var(--primary))";
const HIT_FILL = "rgba(0,0,0,0.001)"; // invisible but hit-testable

const FRONT_PARTS: BodyPart[] = ["chest", "shoulders", "biceps", "forearms", "abs", "quads", "calves"];
const BACK_PARTS: BodyPart[] = ["traps", "shoulders", "upperBack", "lats", "lowerBack", "triceps", "forearms", "glutes", "hamstrings", "calves"];

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
  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(part);
    }
  };
  const makeShape = (shapeProps: SVGProps<SVGElement>) => {
    if (d) return <path d={d} {...(shapeProps as SVGProps<SVGPathElement>)} />;
    if (cx != null && cy != null && rx != null && ry != null)
      return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} {...(shapeProps as SVGProps<SVGEllipseElement>)} />;
    if (x != null && y != null && w != null && h != null)
      return <rect x={x} y={y} width={w} height={h} rx={r ?? 4} {...(shapeProps as SVGProps<SVGRectElement>)} />;
    return null;
  };

  // Hit target: invisible but captures pointer events over full region.
  const hit = makeShape({
    fill: HIT_FILL,
    style: { cursor: "pointer" },
  });

  // Highlight: layered green paint over the muscle. `screen` blend mode makes it feel
  // like light on skin instead of a flat sticker. Outer wide blur = soft glow halo;
  // inner tight blur = the core muscle shape with feathered edges.
  const highlight = active ? (
    <g style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
      {makeShape({
        fill: HIGHLIGHT_FILL,
        filter: "url(#muscleGlow)",
        opacity: 0.55,
      })}
      {makeShape({
        fill: HIGHLIGHT_FILL,
        filter: "url(#muscleCore)",
        opacity: 0.85,
      })}
    </g>
  ) : null;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={DATA[part].label}
      onClick={() => onSelect(part)}
      onKeyDown={handleKeyDown}
      className="outline-none transition-opacity"
    >
      <title>{DATA[part].label}</title>
      {hit}
      {highlight}
    </g>
  );
};

interface Props { onBack: () => void; }

export const ExerciseSuggestions = ({ onBack }: Props) => {
  const [view, setView] = useState<"front" | "back">("front");
  const [selected, setSelected] = useState<BodyPart | null>("chest");

  const info = selected ? DATA[selected] : null;
  const setFigureView = (nextView: "front" | "back") => {
    setView(nextView);
    const validParts = nextView === "front" ? FRONT_PARTS : BACK_PARTS;
    if (!selected || !validParts.includes(selected)) {
      setSelected(nextView === "front" ? "chest" : "upperBack");
    }
  };

  return (
    <AppShell
      title="Exercise Suggestions"
      left={<button onClick={onBack} aria-label="Back" className="p-2 -ml-2"><ArrowLeft className="w-5 h-5" /></button>}
    >
      <div className="pt-4 space-y-4">
        {/* View toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-secondary rounded-xl">
          <button
            onClick={() => setFigureView("front")}
            className={`h-9 rounded-lg text-sm font-semibold transition-base ${
              view === "front" ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
            }`}
          >Front</button>
          <button
            onClick={() => setFigureView("back")}
            className={`h-9 rounded-lg text-sm font-semibold transition-base ${
              view === "back" ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
            }`}
          >Back</button>
        </div>

        {/* Human figure */}
        <div className="rounded-2xl bg-gradient-dark border border-border p-4 shadow-card flex justify-center">
          <div className="relative w-full max-w-[215px] aspect-[3/5]">
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
              <defs>
                <radialGradient id="muscleGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
                  <stop offset="55%" stopColor="hsl(var(--primary))" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </radialGradient>
                <filter id="muscleBlur" x="-25%" y="-25%" width="150%" height="150%">
                  <feGaussianBlur stdDeviation="10" />
                </filter>
                <filter id="muscleBlurTight" x="-25%" y="-25%" width="150%" height="150%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
              </defs>
              {view === "front" ? (
                <>
                  <Region part="shoulders" selected={selected} onSelect={setSelected}
                    cx={258} cy={310} rx={50} ry={44} />
                  <Region part="shoulders" selected={selected} onSelect={setSelected}
                    cx={510} cy={310} rx={50} ry={44} />

                  <Region part="chest" selected={selected} onSelect={setSelected}
                    d="M 380 296 C 340 286 296 296 292 336 C 292 380 314 416 352 428 C 380 432 384 414 384 388 C 386 356 386 322 380 296 Z" />
                  <Region part="chest" selected={selected} onSelect={setSelected}
                    d="M 388 296 C 428 286 472 296 476 336 C 476 380 454 416 416 428 C 388 432 384 414 384 388 C 382 356 382 322 388 296 Z" />

                  <Region part="abs" selected={selected} onSelect={setSelected}
                    d="M 320 448 C 356 456 412 456 448 448 C 460 512 460 600 444 660 C 412 676 356 676 324 660 C 308 600 308 512 320 448 Z" />

                  <Region part="biceps" selected={selected} onSelect={setSelected}
                    cx={228} cy={400} rx={40} ry={80} />
                  <Region part="biceps" selected={selected} onSelect={setSelected}
                    cx={540} cy={400} rx={40} ry={80} />

                  <Region part="forearms" selected={selected} onSelect={setSelected}
                    cx={210} cy={600} rx={36} ry={90} />
                  <Region part="forearms" selected={selected} onSelect={setSelected}
                    cx={558} cy={600} rx={36} ry={90} />

                  <Region part="quads" selected={selected} onSelect={setSelected}
                    cx={322} cy={840} rx={48} ry={95} />
                  <Region part="quads" selected={selected} onSelect={setSelected}
                    cx={450} cy={840} rx={48} ry={95} />

                  <Region part="calves" selected={selected} onSelect={setSelected}
                    cx={320} cy={1100} rx={32} ry={72} />
                  <Region part="calves" selected={selected} onSelect={setSelected}
                    cx={452} cy={1100} rx={32} ry={72} />
                </>
              ) : (
                <>
                  <Region part="traps" selected={selected} onSelect={setSelected}
                    d="M 384 336 C 356 340 336 360 328 388 C 348 400 372 406 384 424 C 396 406 420 400 440 388 C 432 360 412 340 384 336 Z" />

                  <Region part="shoulders" selected={selected} onSelect={setSelected}
                    d="M 260 358 C 236 366 220 388 224 414 C 244 430 280 428 302 414 C 316 400 314 380 300 366 C 288 358 274 356 260 358 Z" />
                  <Region part="shoulders" selected={selected} onSelect={setSelected}
                    d="M 508 358 C 532 366 548 388 544 414 C 524 430 488 428 466 414 C 452 400 454 380 468 366 C 480 358 494 356 508 358 Z" />

                  <Region part="upperBack" selected={selected} onSelect={setSelected}
                    d="M 340 428 C 368 424 400 424 428 428 C 442 452 442 484 428 508 C 400 516 368 516 340 508 C 326 484 326 452 340 428 Z" />

                  <Region part="lats" selected={selected} onSelect={setSelected}
                    d="M 306 456 C 282 468 264 500 260 540 C 258 580 272 612 296 626 C 320 630 344 622 356 604 C 366 578 366 540 358 500 C 350 472 336 458 320 454 C 314 452 310 452 306 456 Z" />
                  <Region part="lats" selected={selected} onSelect={setSelected}
                    d="M 462 456 C 486 468 504 500 508 540 C 510 580 496 612 472 626 C 448 630 424 622 412 604 C 402 578 402 540 410 500 C 418 472 432 458 448 454 C 454 452 458 452 462 456 Z" />

                  <Region part="lowerBack" selected={selected} onSelect={setSelected}
                    d="M 356 588 C 372 594 396 594 412 588 C 420 606 420 632 412 652 C 396 660 372 660 356 652 C 348 632 348 606 356 588 Z" />

                  <Region part="triceps" selected={selected} onSelect={setSelected}
                    d="M 240 412 C 220 424 208 460 208 500 C 210 532 226 552 246 550 C 262 544 274 520 278 484 C 280 452 272 424 258 412 C 252 408 246 408 240 412 Z" />
                  <Region part="triceps" selected={selected} onSelect={setSelected}
                    d="M 528 412 C 548 424 560 460 560 500 C 558 532 542 552 522 550 C 506 544 494 520 490 484 C 488 452 496 424 510 412 C 516 408 522 408 528 412 Z" />

                  <Region part="forearms" selected={selected} onSelect={setSelected}
                    d="M 228 552 C 214 570 208 604 214 632 C 224 654 244 656 256 640 C 266 620 268 590 258 566 C 250 552 240 548 234 550 C 231 550 229 551 228 552 Z" />
                  <Region part="forearms" selected={selected} onSelect={setSelected}
                    d="M 540 552 C 554 570 560 604 554 632 C 544 654 524 656 512 640 C 502 620 500 590 510 566 C 518 552 528 548 534 550 C 537 550 539 551 540 552 Z" />

                  <Region part="glutes" selected={selected} onSelect={setSelected}
                    d="M 306 654 C 336 644 372 640 384 668 C 396 640 432 644 462 654 C 484 674 486 714 468 744 C 432 762 384 758 384 720 C 384 758 336 762 300 744 C 282 714 284 674 306 654 Z" />

                  <Region part="hamstrings" selected={selected} onSelect={setSelected}
                    d="M 336 720 C 306 736 294 790 302 850 C 312 892 336 906 356 890 C 372 858 374 806 362 758 C 354 728 344 716 336 720 Z" />
                  <Region part="hamstrings" selected={selected} onSelect={setSelected}
                    d="M 432 720 C 462 736 474 790 466 850 C 456 892 432 906 412 890 C 396 858 394 806 406 758 C 414 728 424 716 432 720 Z" />

                  <Region part="calves" selected={selected} onSelect={setSelected}
                    d="M 300 908 C 274 924 258 970 262 1020 C 272 1056 292 1064 308 1044 C 320 1010 320 962 312 926 C 308 912 304 906 300 908 Z" />
                  <Region part="calves" selected={selected} onSelect={setSelected}
                    d="M 468 908 C 494 924 510 970 506 1020 C 496 1056 476 1064 460 1044 C 448 1010 448 962 456 926 C 460 912 464 906 468 908 Z" />
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
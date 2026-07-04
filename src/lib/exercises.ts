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
  /** Alternative names that should resolve to this exercise. */
  aliases?: string[];
}

const EXERCISES: ExerciseInfo[] = [
  {
    name: "Barbell Bench Press",
    muscles: ["Chest", "Front delts", "Triceps"],
    equipment: "Barbell, flat bench",
    difficulty: "Intermediate",
    type: "Horizontal press",
    description:
      "The gold standard for upper-body pressing strength. Loads the pecs, front delts and triceps through a stable barbell path you can add weight to for years.",
    setup:
      "Lie flat with eyes under the bar. Plant your feet, arch slightly, and pull your shoulder blades together and down into the bench. Grip roughly 1.5× shoulder width with straight wrists.",
    execution:
      "Unrack over your shoulders, then lower the bar under control to the bottom of your sternum with elbows tucked 45–75°. Pause on the chest, then drive up and slightly back toward your face until lockout.",
    tips:
      "Keep your upper back tight through every rep. Press your feet into the floor for leg drive without lifting your hips. Slow the eccentric — 2–3 seconds down builds far more chest than a rushed rep.",
    mistakes:
      "Flaring elbows to 90° hammers the shoulders. Bouncing the bar off the chest cheats the hardest part of the lift. Losing the arch mid-set puts the pecs in a weak, stretched-out position.",
    imageKey: "bench-press",
    aliases: ["bench press"],
  },
  {
    name: "Incline Dumbbell Press",
    muscles: ["Upper chest", "Front delts", "Triceps"],
    equipment: "Dumbbells, incline bench",
    difficulty: "Intermediate",
    type: "Incline press",
    description:
      "The best builder for the clavicular (upper) chest — the shelf that separates a full chest from a flat one. Dumbbells free each arm to travel its natural pressing arc.",
    setup:
      "Set the bench to 30°. Kick the dumbbells up to your shoulders as you lie back, palms facing forward, wrists stacked over elbows.",
    execution:
      "Lower the bells until they line up with your upper chest and you feel a stretch. Press up and slightly in, stopping just short of the dumbbells clanging together at the top.",
    tips:
      "Keep the bench at 30° — steeper turns it into a shoulder press. Squeeze the pecs hard at the top rather than resting at lockout.",
    mistakes:
      "Using a 45–60° incline shifts the load to the front delts. Bouncing the dumbbells off the shoulders robs the stretch that drives upper-chest growth.",
    imageKey: "incline-dumbbell-press",
  },
  {
    name: "Chest Dip",
    muscles: ["Lower chest", "Triceps", "Front delts"],
    equipment: "Parallel bars",
    difficulty: "Intermediate",
    type: "Bodyweight press",
    description:
      "A brutal bodyweight builder for the lower chest and triceps. The forward lean is what turns a triceps dip into a chest dip.",
    setup:
      "Grip parallel bars slightly wider than shoulders. Lock out arms, lean your torso 30° forward and cross your ankles behind you.",
    execution:
      "Lower under control until your shoulders drop just below your elbows and you feel a stretch across the chest. Press back to lockout keeping the forward lean.",
    tips:
      "Add weight with a belt once bodyweight reps get easy. Keep the shoulders pulled down away from the ears throughout.",
    mistakes:
      "Staying upright turns it into a triceps-only lift. Dropping below a 90° elbow bend without control puts serious stress on the shoulder joint.",
    imageKey: "chest-dip",
  },
  {
    name: "Cable Fly",
    muscles: ["Chest"],
    equipment: "Cable stack, D-handles",
    difficulty: "Beginner",
    type: "Isolation",
    description:
      "Pure chest isolation with constant tension the whole range of motion — impossible to replicate with dumbbells.",
    setup:
      "Set both pulleys slightly above shoulder height. Take a staggered stance, arms slightly bent and locked at that angle.",
    execution:
      "With a soft elbow bend, sweep the handles down and together in front of your hips as if hugging a barrel. Squeeze for a beat, then let the arms open until you feel a deep stretch.",
    tips:
      "Think 'elbows to elbows,' not 'hands to hands.' Cross the handles slightly at the bottom to fully contract the inner chest.",
    mistakes:
      "Bending and straightening the elbows turns the fly into a press. Going too heavy pulls the shoulders forward and out of the socket.",
    imageKey: "cable-fly",
  },
  {
    name: "Machine Chest Press",
    muscles: ["Chest", "Triceps", "Front delts"],
    equipment: "Chest press machine",
    difficulty: "Beginner",
    type: "Machine press",
    description:
      "A fixed pressing path lets you push close to failure safely — perfect for high-volume hypertrophy work or when you're fried from a heavy bench.",
    setup:
      "Adjust the seat so the handles line up with the middle of your chest. Plant your feet, keep the shoulder blades pinned back into the pad.",
    execution:
      "Press the handles forward without fully locking out at the top. Lower slowly until your hands are level with your chest and you feel a stretch.",
    tips:
      "Pause the negative for a full second. Stopping just short of lockout keeps constant tension on the pecs across every rep.",
    mistakes:
      "Setting the seat too low points the press upward and steals chest work. Letting the shoulders roll forward reduces chest activation.",
    imageKey: "machine-chest-press",
  },
  {
    name: "Close-Grip Bench Press",
    muscles: ["Triceps", "Chest", "Front delts"],
    equipment: "Barbell, flat bench",
    difficulty: "Intermediate",
    type: "Compound press",
    description:
      "The heaviest triceps movement you can load. Uses a bench-press pattern but shifts the work onto the long head and medial triceps.",
    setup:
      "Set up like a bench press but grip the bar at shoulder width — never narrower, or the wrists suffer.",
    execution:
      "Lower the bar to your lower sternum with elbows tucked tight to your ribs. Drive back up in a straight line, locking out hard.",
    tips:
      "Keep elbows glued to your sides — flaring turns it back into a chest press. Focus on the lockout portion where the triceps do the most work.",
    mistakes:
      "Going too narrow (thumbs touching) collapses the wrists and pinches the shoulders. Bouncing off the chest wastes the tension in the triceps.",
    imageKey: "close-grip-bench-press",
  },
  {
    name: "Overhead Cable Triceps Extension",
    muscles: ["Triceps (long head)"],
    equipment: "Cable, rope attachment",
    difficulty: "Beginner",
    type: "Isolation",
    description:
      "Puts the long head of the triceps in a fully stretched position, which is where it grows fastest.",
    setup:
      "Set the pulley low, grab the rope and face away. Split stance, torso leaned slightly forward, elbows framing your head.",
    execution:
      "Extend the rope forward and up until your arms lock out overhead. Slowly reverse until your hands drop behind your head and you feel a deep triceps stretch.",
    tips:
      "Keep the upper arms perfectly still — only the forearms move. Split the rope apart at lockout for a stronger contraction.",
    mistakes:
      "Letting the elbows flare wide reduces long-head recruitment. Rushing out of the stretch skips the most productive part of the rep.",
    imageKey: "overhead-cable-triceps-extension",
  },
  {
    name: "Cable Triceps Pushdown",
    muscles: ["Triceps"],
    equipment: "Cable, rope or bar",
    difficulty: "Beginner",
    type: "Isolation",
    description:
      "The staple triceps finisher. High reps under constant cable tension for a savage pump and long-head lockout strength.",
    setup:
      "Set the pulley at head height. Take a shoulder-width stance with a slight forward lean, elbows pinned tight to your ribs.",
    execution:
      "Push the handle straight down until the elbows fully lock out. Squeeze for a beat, then let the weight travel back up just past 90° at the elbow.",
    tips:
      "Keep the elbows nailed to your sides for the whole set. Flare the rope apart at the bottom to hammer the outer head.",
    mistakes:
      "Leaning forward and driving with the shoulders turns it into a partial press. Letting the elbows drift forward on the way up kills the tension.",
    imageKey: "cable-triceps-pushdown",
  },
  {
    name: "Skull Crusher",
    muscles: ["Triceps"],
    equipment: "EZ-bar or dumbbells, bench",
    difficulty: "Intermediate",
    type: "Isolation",
    description:
      "A classic lying triceps extension that overloads the long head from a stretched position. Great mass builder when done strict.",
    setup:
      "Lie flat holding an EZ-bar with a narrow grip. Press it up and angle your upper arms slightly back toward your head — not straight up.",
    execution:
      "Bend only at the elbows, lowering the bar to just above the forehead or behind the head. Reverse the motion by squeezing the triceps to extend the arms.",
    tips:
      "Angling the upper arms back keeps tension on the triceps at lockout instead of dumping it into the joint. Use an EZ-bar to spare your wrists.",
    mistakes:
      "Letting the elbows flare out reduces triceps work. Bringing the upper arms perpendicular turns it into a pullover with no tension at the top.",
    imageKey: "skull-crusher",
  },
  {
    name: "Bench Dip",
    muscles: ["Triceps"],
    equipment: "Bench",
    difficulty: "Beginner",
    type: "Bodyweight isolation",
    description:
      "A no-equipment triceps finisher — pump work after your heavy pressing is done.",
    setup:
      "Sit on a bench, place hands next to your hips gripping the edge. Walk feet out and slide your hips off the bench.",
    execution:
      "Lower yourself by bending only at the elbows until upper arms are parallel to the floor. Press back up hard through your palms.",
    tips:
      "Keep your back close to the bench so the load stays on the triceps, not the shoulders. Add a plate on your lap for progression.",
    mistakes:
      "Dropping too deep pinches the shoulder joint. Hips drifting away from the bench overloads the anterior delts.",
    imageKey: "bench-dip",
  },
  {
    name: "Barbell Curl",
    muscles: ["Biceps", "Forearms"],
    equipment: "Barbell",
    difficulty: "Beginner",
    type: "Isolation",
    description:
      "The heaviest curl variation. Uses both arms symmetrically so you can push real weight and build overall biceps mass.",
    setup:
      "Stand with feet hip-width, grip the bar shoulder-width with a supinated (palms-up) grip. Elbows tight to your ribs.",
    execution:
      "Curl the bar up in a tight arc without swinging the torso. Squeeze hard at the top, then lower under control until arms are almost — but not quite — straight.",
    tips:
      "Keep the elbows pinned in place. Slow the lowering phase — the eccentric is where most biceps damage happens.",
    mistakes:
      "Swinging with the hips turns it into a power clean. Letting the elbows drift forward turns it into a front raise and steals biceps tension.",
    imageKey: "barbell-curl",
  },
  {
    name: "Incline Dumbbell Curl",
    muscles: ["Biceps (long head)"],
    equipment: "Dumbbells, incline bench",
    difficulty: "Beginner",
    type: "Isolation",
    description:
      "Places the biceps in a deep stretch behind the body — the fastest way to grow the long head and lengthen the biceps peak.",
    setup:
      "Set the bench to 60°. Sit back with dumbbells hanging straight down, palms facing forward, shoulders pinned back.",
    execution:
      "Curl the dumbbells up without letting the elbows shift forward. Squeeze at the top, then lower slowly until the arms are fully extended and stretched.",
    tips:
      "Own the stretch at the bottom — pausing there for a beat drives the most growth. Keep the pinky higher than the thumb at the top to fully supinate.",
    mistakes:
      "Shrugging the shoulders forward cheats the stretch. Half-repping the bottom skips the whole reason to do this exercise.",
    imageKey: "incline-dumbbell-curl",
  },
  {
    name: "Hammer Curl",
    muscles: ["Brachialis", "Forearms", "Biceps"],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    type: "Isolation",
    description:
      "The best builder for the brachialis — the muscle that sits under the biceps and pushes the peak up when it grows.",
    setup:
      "Stand upright, dumbbells at your sides with a neutral (palms facing each other) grip.",
    execution:
      "Curl both dumbbells up keeping the wrists neutral like you're swinging a hammer. Squeeze at the top, then lower with control.",
    tips:
      "Alternate arms if you want more focus per side. A cable rope pushed up mimics this movement with constant tension.",
    mistakes:
      "Rotating the wrists on the way up turns it into a normal curl. Swinging the torso ruins the isolation.",
    imageKey: "hammer-curl",
  },
  {
    name: "Preacher Curl",
    muscles: ["Biceps (short head)"],
    equipment: "Preacher bench, EZ-bar",
    difficulty: "Beginner",
    type: "Isolation",
    description:
      "The pad kills all cheating and forces the biceps to do 100% of the work — the strictest curl variation there is.",
    setup:
      "Sit at the preacher bench with your armpits over the top of the pad and elbows shoulder-width apart on the pad.",
    execution:
      "Curl the bar up to shoulder height, squeezing hard at the top. Lower under strict control until arms are nearly straight — never fully locked.",
    tips:
      "Stop one degree short of full extension to protect the elbow tendons. Use an EZ-bar to keep the wrists happy.",
    mistakes:
      "Bouncing out of the bottom position stresses the biceps tendon. Standing up or lifting off the pad completely defeats the point.",
    imageKey: "preacher-curl",
  },
  {
    name: "Cable Curl",
    muscles: ["Biceps"],
    equipment: "Cable, straight bar",
    difficulty: "Beginner",
    type: "Isolation",
    description:
      "Constant tension from bottom to top makes cables ideal for high-rep pump work at the end of an arm day.",
    setup:
      "Set the pulley to the lowest position, attach a straight or EZ-bar, and stand a foot away with elbows glued to your sides.",
    execution:
      "Curl the bar up, squeeze at the top, then resist the cable all the way back down — feel the tension the whole way.",
    tips:
      "Step back slightly so the cable pulls forward and down at the top of the rep, keeping tension where dumbbells lose it.",
    mistakes:
      "Standing too close makes the tension vanish at the top. Rocking the torso back turns it into a full-body movement.",
    imageKey: "cable-curl",
  },
  {
    name: "Deadlift",
    muscles: ["Hamstrings", "Glutes", "Back", "Traps", "Forearms"],
    equipment: "Barbell, plates",
    difficulty: "Advanced",
    type: "Hip hinge",
    description:
      "The single best full-body strength builder. Loads the entire posterior chain from calves to traps in one movement.",
    setup:
      "Stand with feet hip-width, bar over mid-foot. Hinge at the hips, grip just outside the shins, shins vertical, chest proud, lats packed down.",
    execution:
      "Drive the floor away with your legs, keeping the bar dragging up your shins. Once past the knees, snap the hips through to lockout. Reverse the pattern to return the bar.",
    tips:
      "Take a huge breath and brace before every rep. Reset your grip and stance between reps for heavy singles — no touch-and-go.",
    mistakes:
      "Yanking the bar off the floor spikes the lower back. Rounding the upper back is fine at high weights, but rounding the lower back is a ticket to injury.",
    imageKey: "deadlift",
  },
  {
    name: "Pull-Up",
    muscles: ["Lats", "Biceps", "Mid-back"],
    equipment: "Pull-up bar",
    difficulty: "Intermediate",
    type: "Vertical pull",
    description:
      "The king of back-width builders. Nothing else stretches and contracts the lats through as full a range of motion.",
    setup:
      "Grip the bar slightly wider than shoulders, palms forward. Hang with active shoulders — pull the shoulder blades down away from the ears.",
    execution:
      "Pull your chest toward the bar by driving the elbows down and back. Pause at the top with the bar around chin height, then lower slowly to a full dead hang.",
    tips:
      "Think 'elbows to hips' rather than 'chin over bar' to feel the lats. Add weight with a belt once you hit 10 clean reps.",
    mistakes:
      "Kipping and using leg swing turns it into a CrossFit movement, not a back builder. Stopping short of full extension cheats the lats.",
    imageKey: "pull-up",
  },
  {
    name: "Barbell Row",
    muscles: ["Mid-back", "Lats", "Rear delts", "Biceps"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    type: "Horizontal pull",
    description:
      "The heaviest back-thickness builder. Rowing barbell weight is the single fastest way to fill in the middle of your back.",
    setup:
      "Hinge at the hips to a 45° torso angle, knees soft, bar hanging at arms length. Overhand grip just outside shoulder width, chest up, lats packed.",
    execution:
      "Pull the bar into your lower ribs by driving the elbows behind you. Squeeze the shoulder blades together, then lower under control without changing torso angle.",
    tips:
      "Keep the torso angle rock-solid throughout the set. A slight underhand grip lets you row heavier and hit the lats harder.",
    mistakes:
      "Standing up as you pull turns it into a shrug. Pulling to the chest instead of the belly recruits the traps more than the lats.",
    imageKey: "barbell-row",
  },
  {
    name: "Lat Pulldown",
    muscles: ["Lats", "Biceps", "Mid-back"],
    equipment: "Cable, lat pulldown bar",
    difficulty: "Beginner",
    type: "Vertical pull",
    description:
      "The best pull-up alternative — you can dial in exactly the load your lats can handle, from stretch to contraction.",
    setup:
      "Sit with thighs snug under the pads. Grip the bar slightly wider than shoulders with palms forward, arms fully extended overhead.",
    execution:
      "Pull the bar down to your upper chest by driving the elbows down and back. Squeeze, then let the bar travel all the way back up until you feel a stretch in the lats.",
    tips:
      "Lean back only slightly (5–10°). Initiate every rep by depressing the scapula before the elbows move.",
    mistakes:
      "Pulling the bar behind the neck cranks the shoulders in a compromised position. Leaning way back turns it into a row.",
    imageKey: "lat-pulldown",
  },
  {
    name: "Seated Cable Row",
    muscles: ["Mid-back", "Lats", "Rear delts"],
    equipment: "Cable, V-handle",
    difficulty: "Beginner",
    type: "Horizontal pull",
    description:
      "Targets mid-back thickness with a smooth, controllable load and none of the lower-back stress of a barbell row.",
    setup:
      "Sit tall, feet braced, knees slightly bent. Grab the V-handle with arms extended, chest up.",
    execution:
      "Pull the handle to your belly by driving the elbows straight back and squeezing the shoulder blades together. Extend the arms fully to stretch the lats between reps.",
    tips:
      "Keep the torso nearly vertical — don't row with your body. Pause with the elbows tight to the ribs for a full contraction.",
    mistakes:
      "Rocking back and forth turns the row into momentum work. Rounding the shoulders at the stretch dumps the load onto the low back.",
    imageKey: "seated-cable-row",
  },
  {
    name: "Overhead Press",
    muscles: ["Front delts", "Side delts", "Triceps", "Upper chest"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    type: "Vertical press",
    description:
      "The truest test of upper-body strength — pressing weight overhead with the whole body braced. Builds boulder shoulders and traps.",
    setup:
      "Stand with feet hip-width, bar racked on the front delts, elbows slightly in front of the bar, forearms vertical. Brace the abs and glutes hard.",
    execution:
      "Press the bar straight up, moving the head back so the bar clears the chin. Once past the forehead, push the head 'through the window' and lock out with the bar over mid-foot.",
    tips:
      "Squeeze the glutes to keep from leaning back. Take a fresh breath and brace before every single rep.",
    mistakes:
      "Pressing in front of the face instead of straight up wastes force. Layback into a decline bench press hammers the low back.",
    imageKey: "overhead-press",
  },
  {
    name: "Dumbbell Lateral Raise",
    muscles: ["Side delts"],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    type: "Isolation",
    description:
      "The single best exercise for shoulder width. Grow the side delts and your frame changes overnight.",
    setup:
      "Stand with a slight forward lean, dumbbells at your sides, a soft bend in the elbows that stays locked the whole set.",
    execution:
      "Raise the dumbbells out to the sides in a wide arc until they reach shoulder height. Lead with the elbows, not the hands, then lower slowly.",
    tips:
      "Think of pouring water out of a jug at the top — pinky slightly higher than thumb — to bias the side delts. Use lighter weight than your ego wants.",
    mistakes:
      "Swinging and heaving with the traps just makes your traps grow. Bringing the hands above the shoulders shifts the load to the traps.",
    imageKey: "dumbbell-lateral-raise",
  },
  {
    name: "Rear Delt Fly",
    muscles: ["Rear delts", "Upper back"],
    equipment: "Dumbbells or reverse pec-deck",
    difficulty: "Beginner",
    type: "Isolation",
    description:
      "Hits the rear delts, the most under-trained head of the shoulder. Non-negotiable for balanced 3D shoulders and healthy posture.",
    setup:
      "Hinge forward until the torso is nearly parallel to the floor, dumbbells hanging straight down with palms facing each other, soft elbow bend.",
    execution:
      "Raise the dumbbells out to your sides in a wide arc until they reach shoulder height. Squeeze the rear delts hard, then lower under control.",
    tips:
      "Lead with the elbows and keep the thumbs pointing down slightly to bias the rear delts over the traps. Go light — form is everything here.",
    mistakes:
      "Bending and straightening the elbows turns the fly into a row. Shrugging as you raise recruits the traps and skips the rear delts entirely.",
    imageKey: "rear-delt-fly",
  },
  {
    name: "Face Pull",
    muscles: ["Rear delts", "External rotators", "Traps"],
    equipment: "Cable, rope",
    difficulty: "Beginner",
    type: "Prehab pull",
    description:
      "The best shoulder-health movement there is. Strengthens the rear delts and rotator cuff — pull rich, benchpress-heavy lifters need this weekly.",
    setup:
      "Set a rope at upper-chest height. Grip with thumbs on top of the rope, step back with a slight lean, arms extended.",
    execution:
      "Pull the rope toward your face by flaring the elbows out wide and rotating the hands so the knuckles end up beside your ears. Squeeze, then reverse slowly.",
    tips:
      "High reps (15–25) with a squeeze at the top gives the best results. Cue: 'show me your biceps' at the peak position.",
    mistakes:
      "Pulling to the chest turns it into a row. Not rotating externally skips the rotator-cuff benefit entirely.",
    imageKey: "face-pull",
  },
  {
    name: "Arnold Press",
    muscles: ["Front delts", "Side delts", "Triceps"],
    equipment: "Dumbbells, bench",
    difficulty: "Intermediate",
    type: "Vertical press",
    description:
      "A rotating dumbbell press invented by Arnold. The twist recruits both front and side delts through a longer range of motion than a normal press.",
    setup:
      "Sit on a bench with back support. Start with dumbbells in front of the shoulders, palms facing you, elbows tucked.",
    execution:
      "Press the dumbbells overhead while rotating the palms to face forward, ending fully extended with the palms out. Reverse the motion smoothly back to the start.",
    tips:
      "Keep the rotation slow and deliberate. Use moderate weight — chasing PRs breaks the twist and turns it into a normal press.",
    mistakes:
      "Rushing the rotation cheats the range of motion. Locking the elbows aggressively at the top stresses the joints.",
    imageKey: "arnold-press",
  },
  {
    name: "Back Squat",
    muscles: ["Quads", "Glutes", "Hamstrings", "Core"],
    equipment: "Barbell, squat rack",
    difficulty: "Advanced",
    type: "Squat",
    description:
      "The king of lower-body strength. Nothing else loads the legs, hips and core in one movement the way a heavy back squat does.",
    setup:
      "Bar high on the traps (not the neck), grip narrow to lock the upper back tight. Unrack, step back, feet shoulder-width, toes turned out ~15°.",
    execution:
      "Sit back and down between the hips, keeping the chest up and knees tracking over the toes. Descend until the hip crease drops below the knee, then drive up through the whole foot.",
    tips:
      "Take a huge breath, brace, then descend. Push the knees out on the way down to keep them tracking over the feet.",
    mistakes:
      "Letting the knees cave inward loads the ligaments instead of the muscles. Rounding the low back at the bottom is the classic injury pattern.",
    imageKey: "back-squat",
  },
  {
    name: "Romanian Deadlift",
    muscles: ["Hamstrings", "Glutes", "Lower back"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    type: "Hip hinge",
    description:
      "A pure hip hinge that builds the hamstrings from origin to insertion. The best exercise for hamstring hypertrophy — period.",
    setup:
      "Stand tall holding a barbell at hip level, feet hip-width, soft bend in the knees that stays locked the whole rep.",
    execution:
      "Push the hips straight back, keeping the bar dragging down the thighs. Lower until you feel a deep stretch in the hamstrings — usually mid-shin — then drive the hips forward to stand.",
    tips:
      "Range is limited by your hamstring flexibility, not the floor. Keep the bar in contact with the legs the whole way down.",
    mistakes:
      "Bending the knees more turns it into a Romanian squat. Rounding the low back at the stretch is the #1 way to hurt yourself here.",
    imageKey: "romanian-deadlift",
  },
  {
    name: "Leg Press",
    muscles: ["Quads", "Glutes", "Hamstrings"],
    equipment: "Leg press machine",
    difficulty: "Beginner",
    type: "Machine squat",
    description:
      "Lets you overload the quads with heavy weight and zero balance demand — perfect for high volume after squats.",
    setup:
      "Sit deep in the seat, low back pressed into the pad. Place feet shoulder-width in the middle of the platform.",
    execution:
      "Unlock the safeties, lower the platform by bending the knees until your thighs come close to your chest. Press back up without locking out the knees.",
    tips:
      "Foot position matters: low = more quads, high = more glutes and hams. Never let the hips lift off the pad at the bottom.",
    mistakes:
      "Locking out fully at the top hyperextends the knees under load. Hips curling under (butt wink) at the bottom loads the lower back.",
    imageKey: "leg-press",
  },
  {
    name: "Bulgarian Split Squat",
    muscles: ["Quads", "Glutes", "Adductors", "Core"],
    equipment: "Dumbbells, bench",
    difficulty: "Intermediate",
    type: "Unilateral squat",
    description:
      "The hardest single-leg exercise. Fixes strength imbalances, builds serious quad and glute size and torches the stabilisers.",
    setup:
      "Stand a stride's length in front of a bench, rest the top of the back foot on it. Front foot flat, torso tall, dumbbells at your sides.",
    execution:
      "Lower the back knee toward the floor by bending the front leg until the back knee kisses the ground. Drive up through the front heel.",
    tips:
      "Torso upright = quad focus. Slight forward lean = glute focus. Stride length changes everything — experiment.",
    mistakes:
      "Placing the front foot too close pushes the knee way past the toes and hammers the joint. Balancing on the back foot instead of using it as a kickstand steals load from the front leg.",
    imageKey: "bulgarian-split-squat",
  },
  {
    name: "Standing Calf Raise",
    muscles: ["Gastrocnemius"],
    equipment: "Calf raise machine or Smith machine",
    difficulty: "Beginner",
    type: "Isolation",
    description:
      "The only way to grow the gastrocnemius — the two-headed calf muscle that gives the calf its diamond shape. Straight-leg is non-negotiable.",
    setup:
      "Stand with the balls of the feet on the platform, heels hanging off. Legs completely straight, hips and shoulders stacked.",
    execution:
      "Drop the heels below the platform until you feel a deep stretch, then push through the balls of the feet to rise all the way onto the toes. Pause at the top.",
    tips:
      "Pause 1 second at the top and 1 second at the bottom. High reps (15–30) with strict form beats heavy jerky reps.",
    mistakes:
      "Bouncing out of the stretch shortcuts the growth. Bending the knees during the raise turns it into a seated calf pattern that skips the gastroc.",
    imageKey: "standing-calf-raise",
  },
];

const EXERCISE_MAP: Map<string, ExerciseInfo> = new Map();
for (const ex of EXERCISES) {
  EXERCISE_MAP.set(ex.name.toLowerCase(), ex);
  for (const alias of ex.aliases ?? []) {
    EXERCISE_MAP.set(alias.toLowerCase(), ex);
  }
}

/** Convert an exercise name to a slug matching the image filename. */
export function slugifyExercise(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getExerciseInfo(name: string): ExerciseInfo {
  const key = name.toLowerCase().trim();
  return (
    EXERCISE_MAP.get(key) ?? {
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
      imageKey: slugifyExercise(name),
    }
  );
}


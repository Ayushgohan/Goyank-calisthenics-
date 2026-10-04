import { Exercise, SkillNode, WorkoutProgram, UserFitnessProfile } from '../types/calisthenics';

export const INSTRUCTOR_GOYANK = {
  name: "Goyank Singh",
  title: "Head Calisthenics & Bodyweight Coach",
  avatar: "/src/assets/images/instructor_goyank_avatar_1791104877544.jpg",
  heroImage: "/src/assets/images/calisthenics_pullup_hero_1791104796872.jpg",
  bio: "Passionate calisthenics athlete and street workout instructor dedicated to helping athletes unlock their true bodyweight strength. Goyank emphasizes zero momentum, bulletproof joints, scapular control, and step-by-step progressions from basic push-ups to gravity-defying planches.",
  quote: "Calisthenics isn't about lifting external weights—it's about absolute mastery over your own gravity.",
  disciplines: ["Bar Aesthetics", "Static Holds", "Explosive Dynamics", "Joint Resilience"],
  dailyTips: [
    "Always depress your shoulders before you pull. Active hang protects your rotator cuff!",
    "Tuck your pelvis into posterior pelvic tilt during push-ups. Your core is half the movement.",
    "Elbows at 45 degrees, never flared 90 degrees outward. Protect your anterior deltoids.",
    "Straight arm strength takes months for tendons to adapt. Never rush planche or lever progressions.",
    "Point your toes and lock your knees. Calisthenics body tension starts from your feet."
  ]
};

export const INITIAL_USER_PROFILE: UserFitnessProfile = {
  name: "Athlete",
  level: "novice",
  levelScore: 28,
  goal: "muscle_up",
  experienceMonths: 4,
  prs: {
    maxPushups: 18,
    maxPullups: 5,
    maxDips: 8,
    maxPlankSeconds: 65,
    maxHandstandSeconds: 10,
    maxLsitSeconds: 8,
    muscleUpReps: 0
  },
  weeklyTargetSessions: 4,
  voiceCoachEnabled: true,
  soundEffectsEnabled: true
};

export const EXERCISES: Exercise[] = [
  {
    id: "strict_pullup",
    name: "Strict Pull-Up",
    category: "pull",
    difficulty: "novice",
    primaryMuscles: ["back", "biceps"],
    secondaryMuscles: ["shoulders", "core"],
    description: "The crown jewel of upper-body pulling strength. Full dead hang to chin clearly cleared over the bar without swinging or kicking.",
    thumbnail: "/src/assets/images/calisthenics_pullup_hero_1791104796872.jpg",
    videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g", // Clean Pull-up form tutorial
    goyankTips: [
      "Initiate with a scapular pull down before your elbows bend.",
      "Drive elbows down and back toward your hip pockets.",
      "Squeeze your glutes and keep feet together in a hollow body position."
    ],
    commonMistakes: [
      "Kicking legs or kipping to bounce over the bar.",
      "Partial range of motion without full dead hang lockout at the bottom.",
      "Craning neck forward instead of bringing upper chest toward the bar."
    ],
    jointAngles: [
      { name: "Scapula", targetAngle: "Full depression & retraction", cue: "Pull shoulder blades down and back" },
      { name: "Elbow at bottom", targetAngle: "180° full extension", cue: "Dead hang stretch every rep" },
      { name: "Elbow at top", targetAngle: "45° acute angle", cue: "Elbows pinned to sides" }
    ],
    defaultSets: 4,
    defaultRepsOrSeconds: "6 - 8 reps"
  },
  {
    id: "muscle_up",
    name: "Bar Muscle-Up",
    category: "pull",
    difficulty: "advanced",
    primaryMuscles: ["back", "triceps", "chest"],
    secondaryMuscles: ["shoulders", "core"],
    description: "The ultimate transition move in calisthenics, moving explosively from below the bar into a straight-bar dip above the bar.",
    thumbnail: "/src/assets/images/calisthenics_muscleup_demo_1791104808409.jpg",
    videoUrl: "https://www.youtube.com/embed/n4p7_hLz2qA", // Muscle-up technique guide
    goyankTips: [
      "Use false grip or overhand grip with knuckles rotated forward on top of the bar.",
      "Think high pull: pull the bar to your lower ribs or sternum, not just chin.",
      "Snap your head and torso forward over the bar simultaneously as you reach the apex."
    ],
    commonMistakes: [
      "The 'chicken wing' (one arm going over before the other—destroys shoulder joints).",
      "Pulling straight up instead of pulling around the bar path.",
      "Attempting without at least 12 clean chest-to-bar pullups foundation."
    ],
    jointAngles: [
      { name: "Apex Transition", targetAngle: "Chest 90° forward tilt", cue: "Throw shoulders aggressively over the pipe" },
      { name: "Top Lockout", targetAngle: "180° elbow extension", cue: "Full straight-bar dip lockout" }
    ],
    defaultSets: 5,
    defaultRepsOrSeconds: "2 - 4 reps"
  },
  {
    id: "planche_lean",
    name: "Planche Lean & Tuck Hold",
    category: "push",
    difficulty: "intermediate",
    primaryMuscles: ["shoulders", "chest", "core"],
    secondaryMuscles: ["triceps"],
    description: "The fundamental straight-arm conditioning drill for the full planche. Heavy anterior deltoid and bicep tendon load.",
    thumbnail: "/src/assets/images/calisthenics_planche_demo_1791104820945.jpg",
    videoUrl: "https://www.youtube.com/embed/o0k8tQ69W0I", // Planche progressions
    goyankTips: [
      "Maximum scapular protraction (push floor away to round upper back).",
      "Turn hands slightly outward (45 degrees) to spare wrist strain.",
      "Lock elbows completely with bicep tendons facing forward."
    ],
    commonMistakes: [
      "Allowing shoulder blades to collapse or wing together.",
      "Soft bent elbows—this defeats straight-arm tendon conditioning.",
      "Arching lower back into anterior pelvic tilt."
    ],
    jointAngles: [
      { name: "Shoulder Lean", targetAngle: "60° forward lean past hands", cue: "Lean center of mass past wrist joint" },
      { name: "Elbow", targetAngle: "180° dead lock", cue: "Straight arm structural column" }
    ],
    defaultSets: 4,
    defaultRepsOrSeconds: "15 - 20 sec hold",
    isTimed: true
  },
  {
    id: "freestanding_handstand",
    name: "Freestanding Handstand",
    category: "inversion",
    difficulty: "intermediate",
    primaryMuscles: ["shoulders", "triceps", "core"],
    secondaryMuscles: ["chest"],
    description: "The cornerstone of inverted balance. Perfect straight-line alignment stacking wrists, elbows, shoulders, hips, and toes.",
    thumbnail: "/src/assets/images/calisthenics_handstand_demo_1791104836147.jpg",
    videoUrl: "https://www.youtube.com/embed/5U_w2sZzC2w", // Handstand alignment & balance
    goyankTips: [
      "Grip the floor or parallettes with your fingertips like eagle claws for micro-corrections.",
      "Active shoulder elevation: push the earth down and shrug shoulders to ears.",
      "Squeeze glutes and tuck ribcage in; avoid the banana back arch."
    ],
    commonMistakes: [
      "Looking straight down with hyperextended neck which arches spine.",
      "Inactive shoulders causing dead weight collapse on joints.",
      "Kicking up too hard instead of controlled float to balance."
    ],
    jointAngles: [
      { name: "Shoulder Flexion", targetAngle: "180° open shoulder line", cue: "Open armpits completely toward wall" },
      { name: "Pelvis", targetAngle: "Neutral to Posterior Pelvic Tilt", cue: "Ribs tucked flat to abs" }
    ],
    defaultSets: 5,
    defaultRepsOrSeconds: "20 - 30 sec hold",
    isTimed: true
  },
  {
    id: "parallel_bar_dips",
    name: "Parallel Bar Dips",
    category: "dip",
    difficulty: "novice",
    primaryMuscles: ["chest", "triceps", "shoulders"],
    secondaryMuscles: ["core"],
    description: "The king of upper body pushing volume. Builds massive triceps, lower chest, and shoulder stability.",
    thumbnail: "/src/assets/images/calisthenics_pullup_hero_1791104796872.jpg",
    videoUrl: "https://www.youtube.com/embed/2z8JmcrW-As", // Dips tutorial
    goyankTips: [
      "Depress shoulders at the top support hold before bending elbows.",
      "Lean torso slightly forward (15-20 degrees) to load the chest.",
      "Go to at least 90 degrees elbow bend, then drive straight through the triceps."
    ],
    commonMistakes: [
      "Allowing shoulders to roll forward (internal rotation) at bottom.",
      "Flaring elbows wide sideways instead of tucking backwards.",
      "Incomplete lockout at top."
    ],
    jointAngles: [
      { name: "Elbow Bottom", targetAngle: "90° deep stretch", cue: "Elbow at right angle with forearm vertical" },
      { name: "Top Lockout", targetAngle: "180° lock with scapular depression", cue: "Push bars through the floor" }
    ],
    defaultSets: 4,
    defaultRepsOrSeconds: "10 - 12 reps"
  },
  {
    id: "diamond_pushups",
    name: "Diamond / Tricep Push-Ups",
    category: "push",
    difficulty: "beginner",
    primaryMuscles: ["triceps", "chest"],
    secondaryMuscles: ["shoulders", "core"],
    description: "Close grip push-up creating a diamond shape between index fingers and thumbs for intense tricep load.",
    thumbnail: "/src/assets/images/calisthenics_pullup_hero_1791104796872.jpg",
    videoUrl: "https://www.youtube.com/embed/J0DnG1_S92I", // Pushups masterclass
    goyankTips: [
      "Keep hands beneath mid-chest, not under your chin.",
      "Lock your core in a rigid plank from ankles to back of head.",
      "Lower yourself controlled for a 2-second negative."
    ],
    commonMistakes: [
      "Sagging hips or piking glutes up into the air.",
      "Bouncing off the floor instead of pausing briefly at bottom."
    ],
    jointAngles: [
      { name: "Elbow Tracking", targetAngle: "30° to 45° close to ribs", cue: "Rub ribs with your elbows" }
    ],
    defaultSets: 3,
    defaultRepsOrSeconds: "12 - 15 reps"
  },
  {
    id: "front_lever_tuck",
    name: "Tuck Front Lever Hold",
    category: "core_static",
    difficulty: "intermediate",
    primaryMuscles: ["back", "core"],
    secondaryMuscles: ["biceps", "shoulders"],
    description: "Straight-arm horizontal body suspension beneath the bar, pulling bar down like a straight-arm lat pulldown.",
    thumbnail: "/src/assets/images/calisthenics_muscleup_demo_1791104808409.jpg",
    videoUrl: "https://www.youtube.com/embed/h0i53t59E9g", // Front lever progression
    goyankTips: [
      "Retract and depress scapulae with tremendous lat engagement.",
      "Tuck knees tight to chest to reduce the lever arm.",
      "Lock elbows 100% straight; do not turn it into a row hold."
    ],
    commonMistakes: [
      "Bending elbows to cheat leverage.",
      "Hips sagging below shoulder line."
    ],
    jointAngles: [
      { name: "Torso to Ground", targetAngle: "0° perfectly horizontal", cue: "Back level like a tabletop" },
      { name: "Elbow", targetAngle: "180° locked column", cue: "Straight arm power" }
    ],
    defaultSets: 4,
    defaultRepsOrSeconds: "10 - 15 sec hold",
    isTimed: true
  },
  {
    id: "pistol_squat",
    name: "Single-Leg Pistol Squat",
    category: "legs",
    difficulty: "intermediate",
    primaryMuscles: ["legs", "core"],
    secondaryMuscles: [],
    description: "The gold standard of bodyweight leg strength, mobility, and single-leg balance.",
    thumbnail: "/src/assets/images/calisthenics_handstand_demo_1791104836147.jpg",
    videoUrl: "https://www.youtube.com/embed/qDcniqddTeE", // Pistol squats tutorial
    goyankTips: [
      "Keep heel flat on the ground at all times; do not rise onto toes.",
      "Reach arms forward for counter-balance.",
      "Contract the quad of the extended leg so it doesn't drag."
    ],
    commonMistakes: [
      "Collapsing knee inward (knee valgus).",
      "Heel lifting off ground due to tight ankle dorsiflexion."
    ],
    jointAngles: [
      { name: "Knee Flexion", targetAngle: "Full deep compression <45°", cue: "Hamstring kisses calf" },
      { name: "Forward Foot", targetAngle: "Flat 0° heel contact", cue: "Tripod foot balance" }
    ],
    defaultSets: 3,
    defaultRepsOrSeconds: "6 - 8 reps per leg"
  },
  {
    id: "full_planche",
    name: "Full & Straddle Planche",
    category: "push",
    difficulty: "advanced",
    primaryMuscles: ["shoulders", "chest", "core"],
    secondaryMuscles: ["triceps", "biceps"],
    description: "The crown jewel of straight-arm horizontal pressing. Requires suspending your entire body horizontal and parallel to the ground with locked arms.",
    thumbnail: "/src/assets/images/full_planche_demo_1791107861692.jpg",
    videoUrl: "https://www.youtube.com/embed/o0k8tQ69W0I", // Planche tutorial
    goyankTips: [
      "Maximum scapular protraction: push the earth away until your upper back domes like an armor plate.",
      "Turn wrists outward 45 degrees to protect the median nerve and distribute radial pressure.",
      "Lean shoulders forward until center of mass perfectly counterbalances your lower body.",
      "Lock knees completely, point your toes, and clamp glutes into an aggressive posterior pelvic tilt."
    ],
    commonMistakes: [
      "Soft bent elbows—turns a tendon-strengthening planche into an inefficient bent-arm hold.",
      "Banana back arching caused by inactive abs and sagging hip flexors.",
      "Rushing past the tuck and advanced tuck milestones before bicep tendons are dense."
    ],
    jointAngles: [
      { name: "Shoulder Lean", targetAngle: "45° forward lean past hands", cue: "Clavicle well in front of wrists" },
      { name: "Elbow Joint", targetAngle: "180° dead lock", cue: "Bone-stacked structural column" },
      { name: "Scapula", targetAngle: "Maximum Protraction & Depression", cue: "Puff thoracic spine to ceiling" },
      { name: "Pelvis", targetAngle: "Posterior Pelvic Tilt (PPT)", cue: "Glutes squeezed and hips tucked under" }
    ],
    defaultSets: 5,
    defaultRepsOrSeconds: "5 - 10 sec hold",
    isTimed: true
  },
  {
    id: "maltese_cross",
    name: "Maltese Cross (Floor & Rings)",
    category: "push",
    difficulty: "elite",
    primaryMuscles: ["chest", "shoulders", "biceps"],
    secondaryMuscles: ["core", "back"],
    description: "An elite FIG Level E gymnastic skill and legendary street workout feat. The body is suspended parallel to the floor with arms spread wide at waist/shoulder level.",
    thumbnail: "/src/assets/images/maltese_cross_demo_1791107838084.jpg",
    videoUrl: "https://www.youtube.com/embed/9w_Y29G7e7w", // Maltese cross tutorial
    goyankTips: [
      "Widen hand placement outward: hands must sit wide near your hips, not tucked under shoulders.",
      "Engage the pectoralis major and coracobrachialis isometrically to keep the chest elevated.",
      "Keep bicep tendons rotated forward and up to withstand extreme lever arm torque.",
      "Build the foundation through ring Maltese flyes and band-assisted floor holds."
    ],
    commonMistakes: [
      "Attempting without at least a solid 10-second Straddle Planche and heavy ring dips foundation.",
      "Bending the elbows inward—causes destructive shear stress on the medial epicondyle.",
      "Piking at the hips to reduce leverage instead of staying in a straight horizontal line."
    ],
    jointAngles: [
      { name: "Shoulder Abduction", targetAngle: "65° - 75° wide arm spread", cue: "Arms spread wide with hands aligned at waist" },
      { name: "Torso Plane", targetAngle: "0° perfectly horizontal", cue: "Spine parallel to ground plane" },
      { name: "Elbow Extension", targetAngle: "180° locked extension", cue: "Tendon column braced against torque" }
    ],
    defaultSets: 4,
    defaultRepsOrSeconds: "3 - 6 sec hold",
    isTimed: true
  },
  {
    id: "zanetti_press",
    name: "Zanetti Press (Maltese to Handstand)",
    category: "push",
    difficulty: "elite",
    primaryMuscles: ["shoulders", "chest", "triceps"],
    secondaryMuscles: ["core", "back", "biceps"],
    description: "Named after Olympic rings champion Arthur Zanetti. A supreme test of straight-arm pressing power, transitioning dynamically from a horizontal Maltese cross all the way up into a Handstand with locked elbows.",
    thumbnail: "/src/assets/images/zanetti_press_demo_1791107850095.jpg",
    videoUrl: "https://www.youtube.com/embed/5U_w2sZzC2w", // Zanetti press tutorial
    goyankTips: [
      "Zero elbow bend throughout the press arc. The rotation occurs strictly through the glenohumeral joint.",
      "Initiate the press with upper pectorals and anterior deltoids while maintaining tight core hollow.",
      "Drive steadily through the 45-degree sticking point, then shrug shoulders into active elevation at the top.",
      "Train slow 6-second eccentric negatives from Handstand down to Maltese before attempting the concentric press."
    ],
    commonMistakes: [
      "Kipping or kicking legs to generate vertical momentum.",
      "Micro-bending elbows when passing through the horizontal-to-incline transition.",
      "Losing scapular control causing the shoulder to dump forward."
    ],
    jointAngles: [
      { name: "Press Arc", targetAngle: "0° horizontal to 180° vertical", cue: "Smooth continuous straight-arm sweep" },
      { name: "Elbow Joint", targetAngle: "180° rigid locked column", cue: "Zero flex from start to finish" },
      { name: "Body Cylinder", targetAngle: "180° hollow body alignment", cue: "Rigid iron rod from toes to wrists" }
    ],
    defaultSets: 4,
    defaultRepsOrSeconds: "2 - 3 reps (or 5s negatives)",
    isTimed: false
  }
];

export const SKILL_NODES: SkillNode[] = [
  // Pull discipline
  {
    id: "skill_dead_hang",
    name: "Active Dead Hang",
    category: "pull",
    level: 1,
    status: "mastered",
    exerciseId: "strict_pullup",
    requirement: "60-second active hang with scapular depression",
    description: "Grip endurance, shoulder decompression, and lat tendon strength.",
    goyankSecret: "Squeeze the bar like you're trying to bend it with your knuckles."
  },
  {
    id: "skill_strict_pullup",
    name: "10 Strict Pull-Ups",
    category: "pull",
    level: 2,
    status: "practicing",
    exerciseId: "strict_pullup",
    requirement: "10 dead-hang strict chin-over-bar pull-ups",
    description: "Foundation for all advanced aerial bar dynamics.",
    goyankSecret: "Pause at dead hang for 1 full second on each rep to kill all momentum."
  },
  {
    id: "skill_chest_to_bar",
    name: "Explosive Chest-to-Bar",
    category: "pull",
    level: 3,
    status: "practicing",
    exerciseId: "strict_pullup",
    requirement: "5 explosive pull-ups with nipples/sternum contacting bar",
    description: "Essential speed and pull height needed for the muscle-up transition.",
    goyankSecret: "Pull with maximum velocity from the very first millimeter."
  },
  {
    id: "skill_bar_muscle_up",
    name: "Clean Bar Muscle-Up",
    category: "pull",
    level: 4,
    status: "practicing",
    exerciseId: "muscle_up",
    requirement: "Strict muscle-up with zero chicken-wing and minimal swing",
    description: "The coveted badge of street workout mastery.",
    goyankSecret: "Think 'around the bar', not 'straight into the bar'."
  },
  // Push discipline
  {
    id: "skill_pushups_25",
    name: "25 Strict Form Push-Ups",
    category: "push",
    level: 1,
    status: "mastered",
    exerciseId: "diamond_pushups",
    requirement: "25 chest-to-deck reps in solid plank",
    description: "Base horizontal pushing strength and serratus activation.",
    goyankSecret: "Tuck hips under. No arched back allowed in my camp!"
  },
  {
    id: "skill_dips_15",
    name: "15 Deep Parallel Dips",
    category: "dip",
    level: 2,
    status: "practicing",
    exerciseId: "parallel_bar_dips",
    requirement: "15 reps below 90 degrees with locked top lockout",
    description: "Vertical pushing foundation and lower chest builder.",
    goyankSecret: "Never drop fast into the bottom. Control the eccentric like a coil."
  },
  {
    id: "skill_planche_lean",
    name: "45° Planche Lean",
    category: "push",
    level: 3,
    status: "practicing",
    exerciseId: "planche_lean",
    requirement: "25-second lean with shoulders past fingers and protracted scapula",
    description: "Straight arm tendon conditioning for planche.",
    goyankSecret: "Protraction is non-negotiable. Push your spine up to the ceiling."
  },
  {
    id: "skill_tuck_planche",
    name: "Tuck Planche Hold",
    category: "push",
    level: 4,
    status: "locked",
    exerciseId: "planche_lean",
    requirement: "15-second horizontal tuck planche with feet fully off ground",
    description: "Gravity-defying straight arm horizontal press.",
    goyankSecret: "Elevate your hips to shoulder level, not lower!"
  },
  {
    id: "skill_straddle_planche",
    name: "Straddle Planche Hold",
    category: "push",
    level: 4,
    status: "locked",
    exerciseId: "full_planche",
    requirement: "10-second horizontal straddle planche with locked elbows",
    description: "Wide leg leverage that unlocks full horizontal straight-arm suspension.",
    goyankSecret: "Lean your clavicle 4 inches further past your palms. Leverage obeys geometry."
  },
  {
    id: "skill_full_planche",
    name: "Full Planche Mastery",
    category: "push",
    level: 5,
    status: "locked",
    exerciseId: "full_planche",
    requirement: "8-second clean full planche with legs glued together and locked knees",
    description: "The crown jewel of street workout and gymnastics floor strength.",
    goyankSecret: "Lock knees, point toes, clamp glutes. Absolute whole-body irradiation."
  },
  {
    id: "skill_maltese_prep",
    name: "Wide-Arm Maltese Lean",
    category: "push",
    level: 4,
    status: "locked",
    exerciseId: "maltese_cross",
    requirement: "15-second wide lean or 8 controlled ring Maltese flyes",
    description: "Tendon conditioning to prepare bicep tenocytes for extreme horizontal torque.",
    goyankSecret: "Never rush into Maltese. Build tensile strength in the inner bicep over 6+ months."
  },
  {
    id: "skill_maltese_cross",
    name: "Maltese Cross Hold",
    category: "push",
    level: 5,
    status: "locked",
    exerciseId: "maltese_cross",
    requirement: "5-second FIG Grade horizontal Maltese cross hold on rings or floor",
    description: "Legendary gymnastic & street workout element. Wide horizontal pectoral majesty.",
    goyankSecret: "Hands wide at the waist line. Rotate inner elbows upward and lock the shoulder girdle."
  },
  {
    id: "skill_zanetti_negative",
    name: "Zanetti Press Negative",
    category: "push",
    level: 5,
    status: "locked",
    exerciseId: "zanetti_press",
    requirement: "3 reps of 8-second slow eccentrics from Handstand to Maltese",
    description: "Builds the superhuman straight-arm deceleration control needed for the press.",
    goyankSecret: "Fight every single millimeter of the descent. Time under tension is king."
  },
  {
    id: "skill_zanetti_press",
    name: "Zanetti Press Mastery",
    category: "push",
    level: 5,
    status: "locked",
    exerciseId: "zanetti_press",
    requirement: "Full straight-arm press from horizontal Maltese / Planche to vertical Handstand",
    description: "The holy grail of dynamic straight-arm pushing power. Olympic-grade dominance.",
    goyankSecret: "Zero elbow bend. Sweep through the 45-degree horizon and elevate your traps to lock the handstand."
  },
  // Inversion discipline
  {
    id: "skill_wall_handstand",
    name: "Chest-to-Wall Handstand",
    category: "inversion",
    level: 2,
    status: "mastered",
    exerciseId: "freestanding_handstand",
    requirement: "60-second hold with nose and toes touching wall",
    description: "Instills the perfect shoulder line and hollow body.",
    goyankSecret: "Face the wall, never back to wall. Back-to-wall teaches banana spine."
  },
  {
    id: "skill_freestanding_handstand",
    name: "30s Freestanding Handstand",
    category: "inversion",
    level: 3,
    status: "practicing",
    exerciseId: "freestanding_handstand",
    requirement: "30-second motionless balance in open room",
    description: "Neurological balance control using fingers and wrists.",
    goyankSecret: "Breathe through your nose. Holding your breath ruins balance."
  },
  // Core & Legs
  {
    id: "skill_lsit",
    name: "20-Second L-Sit",
    category: "core_static",
    level: 2,
    status: "practicing",
    exerciseId: "front_lever_tuck",
    requirement: "20 seconds on floor or parallettes with legs parallel to earth",
    description: "Scapular depression, hip flexor endurance, and compression.",
    goyankSecret: "Lock knees tight and point toes forward."
  },
  {
    id: "skill_pistol_squat",
    name: "Full Pistol Squat",
    category: "legs",
    level: 3,
    status: "practicing",
    exerciseId: "pistol_squat",
    requirement: "8 consecutive reps on each leg with full bottom control",
    description: "Bodyweight leg mastery and ankle mobility.",
    goyankSecret: "Warm up your ankles with calf raises and deep dorsiflexion rocks."
  }
];

export const WORKOUT_PROGRAMS: WorkoutProgram[] = [
  {
    id: "first_muscle_up",
    title: "The Clean Muscle-Up Blueprint",
    tagline: "Explosive pull power & straight-bar transition coached by Goyank",
    durationWeeks: 6,
    frequencyDaysPerWeek: 4,
    difficulty: "advanced",
    coverImage: "/src/assets/images/calisthenics_muscleup_demo_1791104808409.jpg",
    description: "A methodical 6-week explosive program designed by Goyank Singh to take you from strict pull-ups to your first seamless, clean bar muscle-up without chicken-winging.",
    goyankFocus: "Explosive pull height to sternum + deep straight-bar dip transitions + core hollow snap.",
    days: [
      {
        dayNumber: 1,
        title: "Day 1: Explosive Pull & Height",
        focus: "High velocity pulling power",
        exercises: [
          { exerciseId: "strict_pullup", sets: 5, repsOrSeconds: "5 explosive reps", restSeconds: 90, notes: "Pull as high as humanly possible, chest to bar" },
          { exerciseId: "parallel_bar_dips", sets: 4, repsOrSeconds: "10 reps", restSeconds: 75, notes: "Deep dip stretch with explosive press" },
          { exerciseId: "diamond_pushups", sets: 3, repsOrSeconds: "15 reps", restSeconds: 60, notes: "Burn out triceps" }
        ]
      },
      {
        dayNumber: 2,
        title: "Day 2: Straight-Bar Dip & Transition Mechanics",
        focus: "Shoulder rotation over bar",
        exercises: [
          { exerciseId: "muscle_up", sets: 5, repsOrSeconds: "3 negative muscle-ups", restSeconds: 120, notes: "Jump to top of bar, slow 5s transition down" },
          { exerciseId: "parallel_bar_dips", sets: 4, repsOrSeconds: "12 reps", restSeconds: 60, notes: "Strict lockout" },
          { exerciseId: "front_lever_tuck", sets: 4, repsOrSeconds: "12s hold", restSeconds: 60, notes: "Lockout arms" }
        ]
      },
      {
        dayNumber: 3,
        title: "Day 3: Rest & Mobility",
        focus: "Shoulder and wrist recovery",
        exercises: []
      },
      {
        dayNumber: 4,
        title: "Day 4: Peak Power & Volume",
        focus: "Chest to bar & hollow body tension",
        exercises: [
          { exerciseId: "strict_pullup", sets: 4, repsOrSeconds: "8 reps", restSeconds: 90, notes: "Strict dead hang" },
          { exerciseId: "parallel_bar_dips", sets: 4, repsOrSeconds: "12 reps", restSeconds: 75, notes: "Tricep pump" },
          { exerciseId: "pistol_squat", sets: 3, repsOrSeconds: "6 reps / leg", restSeconds: 60, notes: "Deep mobility" }
        ]
      }
    ]
  },
  {
    id: "pullup_mastery_zero_to_ten",
    title: "Zero to 10 Strict Pull-Ups",
    tagline: "Build a bulletproof back and conquer your bodyweight",
    durationWeeks: 4,
    frequencyDaysPerWeek: 3,
    difficulty: "novice",
    coverImage: "/src/assets/images/calisthenics_pullup_hero_1791104796872.jpg",
    description: "Goyank's signature foundation program. Perfect for beginners and novices stuck at 2-5 pullups who want strict, effortless double-digit pullups.",
    goyankFocus: "Dead hang discipline, active scapula sets, negative eccentrics, and zero momentum.",
    days: [
      {
        dayNumber: 1,
        title: "Day 1: Scapular Pulls & Controlled Negatives",
        focus: "Neurological activation & eccentric strength",
        exercises: [
          { exerciseId: "strict_pullup", sets: 5, repsOrSeconds: "4 - 6 reps", restSeconds: 90, notes: "3-second descent on every single rep" },
          { exerciseId: "diamond_pushups", sets: 3, repsOrSeconds: "10 - 12 reps", restSeconds: 60, notes: "Counter-balance pushing" },
          { exerciseId: "front_lever_tuck", sets: 3, repsOrSeconds: "10s hold", restSeconds: 60, notes: "Straight arm lat recruitment" }
        ]
      },
      {
        dayNumber: 2,
        title: "Day 2: Pushing Balance & Core",
        focus: "Anterior strength",
        exercises: [
          { exerciseId: "parallel_bar_dips", sets: 4, repsOrSeconds: "8 - 10 reps", restSeconds: 75, notes: "Control the stretch" },
          { exerciseId: "diamond_pushups", sets: 3, repsOrSeconds: "12 reps", restSeconds: 60, notes: "Focus on lockout" },
          { exerciseId: "pistol_squat", sets: 3, repsOrSeconds: "6 reps / leg", restSeconds: 60, notes: "Balance" }
        ]
      },
      {
        dayNumber: 3,
        title: "Day 3: Pull-Up Volume Pyramid",
        focus: "Endurance & stamina",
        exercises: [
          { exerciseId: "strict_pullup", sets: 5, repsOrSeconds: "Max clean reps", restSeconds: 120, notes: "Leave 1 rep in reserve" },
          { exerciseId: "parallel_bar_dips", sets: 3, repsOrSeconds: "10 reps", restSeconds: 60, notes: "Chest focus" }
        ]
      }
    ]
  },
  {
    id: "handstand_balance_art",
    title: "Handstand Alignment & Balance",
    tagline: "Stack your joints, master the float, conquer inversions",
    durationWeeks: 4,
    frequencyDaysPerWeek: 4,
    difficulty: "intermediate",
    coverImage: "/src/assets/images/calisthenics_handstand_demo_1791104836147.jpg",
    description: "Learn to balance upside down like a gymnast. Goyank breaks down finger wrist-bail mechanics, shoulder shrugs, and alignment.",
    goyankFocus: "Wrist conditioning, hollow body dish, finger-tip steering, and fear-free bailing.",
    days: [
      {
        dayNumber: 1,
        title: "Day 1: Alignment & Wall Holds",
        focus: "Straight line discipline",
        exercises: [
          { exerciseId: "freestanding_handstand", sets: 6, repsOrSeconds: "25s hold", restSeconds: 90, notes: "Focus on shrugging shoulders up to ears" },
          { exerciseId: "planche_lean", sets: 4, repsOrSeconds: "20s hold", restSeconds: 60, notes: "Protraction and straight elbows" },
          { exerciseId: "parallel_bar_dips", sets: 3, repsOrSeconds: "10 reps", restSeconds: 60, notes: "Shoulder depression balance" }
        ]
      },
      {
        dayNumber: 2,
        title: "Day 2: Kick-up Float & Fingertip Control",
        focus: "Dynamic entry",
        exercises: [
          { exerciseId: "freestanding_handstand", sets: 8, repsOrSeconds: "5 kick-up attempts", restSeconds: 75, notes: "Catch the balance point gently" },
          { exerciseId: "strict_pullup", sets: 4, repsOrSeconds: "6 - 8 reps", restSeconds: 90, notes: "Antagonist upper back pull" }
        ]
      }
    ]
  },
  {
    id: "planche_conditioning",
    title: "Planche & Straight-Arm Power",
    tagline: "Extreme tendon resilience and gravity-defying horizontal push",
    durationWeeks: 8,
    frequencyDaysPerWeek: 3,
    difficulty: "advanced",
    coverImage: "/src/assets/images/calisthenics_planche_demo_1791104820945.jpg",
    description: "Straight arm static strength takes time and smart periodization. Goyank guides your bicep tendon conditioning and scapular protraction safely.",
    goyankFocus: "Bicep tendon resilience, wrist warmups, pseudo-planche push-ups, and tuck holds.",
    days: [
      {
        dayNumber: 1,
        title: "Day 1: Heavy Planche Leans & Protraction",
        focus: "Anterior deltoid load",
        exercises: [
          { exerciseId: "planche_lean", sets: 5, repsOrSeconds: "20s max lean", restSeconds: 90, notes: "Feet on ground, lean shoulders way past wrists" },
          { exerciseId: "full_planche", sets: 4, repsOrSeconds: "8s straddle hold", restSeconds: 90, notes: "Locked straight elbows" },
          { exerciseId: "diamond_pushups", sets: 4, repsOrSeconds: "12 reps", restSeconds: 60, notes: "Slow negative" },
          { exerciseId: "strict_pullup", sets: 4, repsOrSeconds: "8 reps", restSeconds: 90, notes: "Maintain pull balance" }
        ]
      }
    ]
  },
  {
    id: "elite_maltese_and_zanetti",
    title: "Maltese, Planche & Zanetti Press Mastery",
    tagline: "Olympic-grade straight-arm power and horizontal ring suspension",
    durationWeeks: 10,
    frequencyDaysPerWeek: 4,
    difficulty: "elite",
    coverImage: "/src/assets/images/zanetti_press_demo_1791107850095.jpg",
    description: "Designed by Coach Goyank for athletes pursuing FIG Level E strength: the horizontal Maltese cross, Full Planche, and the straight-arm Zanetti press with locked elbows.",
    goyankFocus: "Scapular protraction, bicep tendon resilience, wide-arm leverage conditioning, and slow eccentric press negatives.",
    days: [
      {
        dayNumber: 1,
        title: "Day 1: Planche & Maltese Horizontal Levers",
        focus: "Horizontal torque & bicep tendon loading",
        exercises: [
          { exerciseId: "full_planche", sets: 5, repsOrSeconds: "8s straddle/full hold", restSeconds: 120, notes: "Max protraction, locked knees" },
          { exerciseId: "maltese_cross", sets: 4, repsOrSeconds: "5s wide hold / lean", restSeconds: 120, notes: "Hands wide at hip level, bicep tendons up" },
          { exerciseId: "parallel_bar_dips", sets: 4, repsOrSeconds: "12 deep reps", restSeconds: 90, notes: "Chest and tricep support foundation" }
        ]
      },
      {
        dayNumber: 2,
        title: "Day 2: Zanetti Press Eccentrics & Handstand Stack",
        focus: "Dynamic press rotation and inverted stability",
        exercises: [
          { exerciseId: "zanetti_press", sets: 5, repsOrSeconds: "3 reps (6s negatives)", restSeconds: 120, notes: "Controlled straight-arm descent from handstand" },
          { exerciseId: "freestanding_handstand", sets: 5, repsOrSeconds: "30s alignment hold", restSeconds: 90, notes: "Active trap elevation" },
          { exerciseId: "strict_pullup", sets: 4, repsOrSeconds: "10 dead hang reps", restSeconds: 90, notes: "Antagonist lat balance" }
        ]
      },
      {
        dayNumber: 3,
        title: "Day 3: Connective Tissue Active Recovery",
        focus: "Forearm, wrist, and glenohumeral decompression",
        exercises: []
      },
      {
        dayNumber: 4,
        title: "Day 4: Peak Straight-Arm Power & Volume",
        focus: "Full sequence integration",
        exercises: [
          { exerciseId: "full_planche", sets: 4, repsOrSeconds: "6s hold", restSeconds: 120, notes: "Zero micro-bend" },
          { exerciseId: "maltese_cross", sets: 4, repsOrSeconds: "4s hold", restSeconds: 120, notes: "Wide chest drive" },
          { exerciseId: "zanetti_press", sets: 4, repsOrSeconds: "2 full presses / negatives", restSeconds: 120, notes: "Clean pivot through shoulder joint" }
        ]
      }
    ]
  }
];

export const INITIAL_LOGS = [
  {
    id: "log_101",
    date: new Date(Date.now() - 86400000 * 1).toISOString(), // yesterday
    routineName: "Upper Body Pull Power",
    durationMinutes: 38,
    exercises: [
      {
        exerciseId: "strict_pullup",
        exerciseName: "Strict Pull-Up",
        sets: [
          { setNumber: 1, repsOrSeconds: 8, completed: true, rpe: 7 },
          { setNumber: 2, repsOrSeconds: 8, completed: true, rpe: 8 },
          { setNumber: 3, repsOrSeconds: 7, completed: true, rpe: 9 },
          { setNumber: 4, repsOrSeconds: 6, completed: true, rpe: 9 }
        ]
      },
      {
        exerciseId: "parallel_bar_dips",
        exerciseName: "Parallel Bar Dips",
        sets: [
          { setNumber: 1, repsOrSeconds: 14, completed: true, rpe: 7 },
          { setNumber: 2, repsOrSeconds: 12, completed: true, rpe: 8 },
          { setNumber: 3, repsOrSeconds: 12, completed: true, rpe: 9 }
        ]
      }
    ],
    feelingRating: 4 as const,
    sessionRpe: 8,
    subjectiveFeeling: "strong",
    postWorkoutNote: "Pull-ups felt very crisp at the top. Chest reached the bar easily on sets 1-2.",
    coachFeedback: "Goyank: Outstanding form on set 1 and 2. Notice your chin reached with zero swing! Consistency is compounding."
  },
  {
    id: "log_102",
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    routineName: "Planche & Inversion Skills",
    durationMinutes: 42,
    exercises: [
      {
        exerciseId: "planche_lean",
        exerciseName: "Planche Lean & Tuck Hold",
        sets: [
          { setNumber: 1, repsOrSeconds: 20, completed: true, rpe: 8 },
          { setNumber: 2, repsOrSeconds: 18, completed: true, rpe: 8 },
          { setNumber: 3, repsOrSeconds: 16, completed: true, rpe: 9 }
        ]
      },
      {
        exerciseId: "freestanding_handstand",
        exerciseName: "Freestanding Handstand",
        sets: [
          { setNumber: 1, repsOrSeconds: 15, completed: true, rpe: 7 },
          { setNumber: 2, repsOrSeconds: 15, completed: true, rpe: 8 }
        ]
      }
    ],
    feelingRating: 5 as const,
    sessionRpe: 8,
    subjectiveFeeling: "superb",
    postWorkoutNote: "Shoulder protraction felt rock solid on planche leans.",
    coachFeedback: "Goyank: Great balance session! Your shoulder protraction on the planche leans was locked in. You are ready to start testing tuck planche liftoffs!"
  },
  {
    id: "log_103",
    date: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    routineName: "Chest & Triceps Calisthenics",
    durationMinutes: 35,
    exercises: [
      {
        exerciseId: "diamond_pushups",
        exerciseName: "Diamond Push-Ups",
        sets: [
          { setNumber: 1, repsOrSeconds: 18, completed: true, rpe: 7 },
          { setNumber: 2, repsOrSeconds: 16, completed: true, rpe: 8 },
          { setNumber: 3, repsOrSeconds: 15, completed: true, rpe: 8 }
        ]
      },
      {
        exerciseId: "parallel_bar_dips",
        exerciseName: "Parallel Bar Dips",
        sets: [
          { setNumber: 1, repsOrSeconds: 12, completed: true, rpe: 8 },
          { setNumber: 2, repsOrSeconds: 12, completed: true, rpe: 8 }
        ]
      }
    ],
    feelingRating: 4 as const,
    sessionRpe: 8,
    coachFeedback: "Goyank: Strong pushing volume! Full elbow lockout on diamond push-ups is what builds the tricep power for muscle-ups."
  },
  {
    id: "log_104",
    date: new Date(Date.now() - 86400000 * 9).toISOString(), // Last week
    routineName: "Volume Back & Core",
    durationMinutes: 40,
    exercises: [
      {
        exerciseId: "strict_pullup",
        exerciseName: "Strict Pull-Up",
        sets: [
          { setNumber: 1, repsOrSeconds: 7, completed: true, rpe: 7 },
          { setNumber: 2, repsOrSeconds: 7, completed: true, rpe: 8 },
          { setNumber: 3, repsOrSeconds: 6, completed: true, rpe: 8 }
        ]
      },
      {
        exerciseId: "diamond_pushups",
        exerciseName: "Diamond Push-Ups",
        sets: [
          { setNumber: 1, repsOrSeconds: 15, completed: true, rpe: 7 },
          { setNumber: 2, repsOrSeconds: 15, completed: true, rpe: 8 }
        ]
      }
    ],
    feelingRating: 4 as const,
    sessionRpe: 7,
    coachFeedback: "Goyank: Consistent repetitions. Good control through the hollow body position."
  },
  {
    id: "log_105",
    date: new Date(Date.now() - 86400000 * 12).toISOString(), // ~2 weeks ago
    routineName: "Bar Routine Progression",
    durationMinutes: 38,
    exercises: [
      {
        exerciseId: "parallel_bar_dips",
        exerciseName: "Parallel Bar Dips",
        sets: [
          { setNumber: 1, repsOrSeconds: 12, completed: true, rpe: 7 },
          { setNumber: 2, repsOrSeconds: 10, completed: true, rpe: 8 },
          { setNumber: 3, repsOrSeconds: 10, completed: true, rpe: 8 }
        ]
      },
      {
        exerciseId: "strict_pullup",
        exerciseName: "Strict Pull-Up",
        sets: [
          { setNumber: 1, repsOrSeconds: 6, completed: true, rpe: 8 },
          { setNumber: 2, repsOrSeconds: 6, completed: true, rpe: 8 }
        ]
      }
    ],
    feelingRating: 4 as const,
    sessionRpe: 8,
    coachFeedback: "Goyank: Solid session. Scapular depression on dips was noticeably cleaner."
  },
  {
    id: "log_106",
    date: new Date(Date.now() - 86400000 * 16).toISOString(), // ~2.5 weeks ago
    routineName: "Foundation Bodyweight Drills",
    durationMinutes: 36,
    exercises: [
      {
        exerciseId: "diamond_pushups",
        exerciseName: "Diamond Push-Ups",
        sets: [
          { setNumber: 1, repsOrSeconds: 14, completed: true, rpe: 7 },
          { setNumber: 2, repsOrSeconds: 14, completed: true, rpe: 7 },
          { setNumber: 3, repsOrSeconds: 12, completed: true, rpe: 8 }
        ]
      },
      {
        exerciseId: "strict_pullup",
        exerciseName: "Strict Pull-Up",
        sets: [
          { setNumber: 1, repsOrSeconds: 6, completed: true, rpe: 7 },
          { setNumber: 2, repsOrSeconds: 5, completed: true, rpe: 8 }
        ]
      }
    ],
    feelingRating: 4 as const,
    sessionRpe: 7,
    coachFeedback: "Goyank: Great base building. Clean repetitions compound into tendon strength."
  },
  {
    id: "log_107",
    date: new Date(Date.now() - 86400000 * 22).toISOString(), // ~3 weeks ago
    routineName: "Pull & Push Intro",
    durationMinutes: 32,
    exercises: [
      {
        exerciseId: "strict_pullup",
        exerciseName: "Strict Pull-Up",
        sets: [
          { setNumber: 1, repsOrSeconds: 5, completed: true, rpe: 8 },
          { setNumber: 2, repsOrSeconds: 5, completed: true, rpe: 8 }
        ]
      },
      {
        exerciseId: "parallel_bar_dips",
        exerciseName: "Parallel Bar Dips",
        sets: [
          { setNumber: 1, repsOrSeconds: 8, completed: true, rpe: 7 },
          { setNumber: 2, repsOrSeconds: 8, completed: true, rpe: 8 }
        ]
      }
    ],
    feelingRating: 4 as const,
    sessionRpe: 7,
    coachFeedback: "Goyank: Early phase foundation. Learning the dead-hang transition."
  },
  {
    id: "log_108",
    date: new Date(Date.now() - 86400000 * 29).toISOString(), // ~4 weeks ago
    routineName: "Introductory Bodyweight Session",
    durationMinutes: 30,
    exercises: [
      {
        exerciseId: "diamond_pushups",
        exerciseName: "Diamond Push-Ups",
        sets: [
          { setNumber: 1, repsOrSeconds: 10, completed: true, rpe: 7 },
          { setNumber: 2, repsOrSeconds: 10, completed: true, rpe: 7 }
        ]
      },
      {
        exerciseId: "strict_pullup",
        exerciseName: "Strict Pull-Up",
        sets: [
          { setNumber: 1, repsOrSeconds: 4, completed: true, rpe: 8 }
        ]
      }
    ],
    feelingRating: 3 as const,
    sessionRpe: 7,
    coachFeedback: "Goyank: Welcome to the bars! First step on the path to bodyweight mastery."
  }
];

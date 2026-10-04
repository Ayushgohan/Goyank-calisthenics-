export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'triceps' | 'biceps' | 'core' | 'legs';

export type SkillCategory = 'push' | 'pull' | 'dip' | 'core_static' | 'inversion' | 'legs';

export type DifficultyLevel = 'beginner' | 'novice' | 'intermediate' | 'advanced' | 'elite';

export interface Exercise {
  id: string;
  name: string;
  category: SkillCategory;
  difficulty: DifficultyLevel;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  description: string;
  thumbnail: string;
  videoUrl: string; // YouTube embed or video resource
  goyankTips: string[];
  commonMistakes: string[];
  jointAngles: {
    name: string;
    targetAngle: string;
    cue: string;
  }[];
  prerequisites?: string[];
  progressionNext?: string;
  defaultSets: number;
  defaultRepsOrSeconds: string;
  isTimed?: boolean;
}

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 1 to 5
  status: 'locked' | 'practicing' | 'mastered';
  exerciseId: string;
  requirement: string;
  description: string;
  goyankSecret: string;
}

export interface WorkoutSetLog {
  setNumber: number;
  repsOrSeconds: number;
  completed: boolean;
  rpe?: number; // 1-10
  notes?: string;
}

export interface ExerciseSession {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSetLog[];
}

export interface WorkoutSessionLog {
  id: string;
  date: string; // ISO date string
  routineName: string;
  durationMinutes: number;
  exercises: ExerciseSession[];
  feelingRating: 1 | 2 | 3 | 4 | 5;
  coachFeedback?: string;
  sessionRpe?: number; // 1-10 overall session intensity
  postWorkoutNote?: string;
  subjectiveFeeling?: string;
}

export interface PersonalRecords {
  maxPushups: number;
  maxPullups: number;
  maxDips: number;
  maxPlankSeconds: number;
  maxHandstandSeconds: number;
  maxLsitSeconds: number;
  muscleUpReps: number;
}

export interface ReminderSettings {
  enabled: boolean;
  time: string; // "17:30"
  activeDays: number[]; // 1 = Mon, 7 = Sun
  coachingTone: 'motivational' | 'strict' | 'gentle';
  soundEnabled: boolean;
  webPushPermission: 'default' | 'granted' | 'denied' | 'unsupported';
  lastNotifiedDate?: string;
}

export interface UserFitnessProfile {
  name: string;
  level: DifficultyLevel;
  levelScore: number; // 1 to 100
  goal: 'first_pullup' | 'muscle_up' | 'planche' | 'handstand' | 'strength_hypertrophy';
  experienceMonths: number;
  prs: PersonalRecords;
  weeklyTargetSessions: number;
  voiceCoachEnabled: boolean;
  soundEffectsEnabled: boolean;
  reminders?: ReminderSettings;
}

export interface WorkoutProgram {
  id: string;
  title: string;
  tagline: string;
  durationWeeks: number;
  frequencyDaysPerWeek: number;
  difficulty: DifficultyLevel;
  coverImage: string;
  description: string;
  goyankFocus: string;
  days: {
    dayNumber: number;
    title: string;
    focus: string;
    exercises: {
      exerciseId: string;
      sets: number;
      repsOrSeconds: string;
      restSeconds: number;
      notes?: string;
    }[];
  }[];
}

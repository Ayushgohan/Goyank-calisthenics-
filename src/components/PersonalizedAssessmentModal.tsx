import React, { useState } from 'react';
import { X, Award, CheckCircle2, Dumbbell, Sparkles, ArrowRight } from 'lucide-react';
import { UserFitnessProfile, DifficultyLevel } from '../types/calisthenics';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';
import { speechCoach } from '../utils/speechCoach';

interface AssessmentModalProps {
  currentProfile: UserFitnessProfile;
  onClose: () => void;
  onSaveProfile: (updated: UserFitnessProfile) => void;
}

export const PersonalizedAssessmentModal: React.FC<AssessmentModalProps> = ({
  currentProfile,
  onClose,
  onSaveProfile,
}) => {
  const [pushups, setPushups] = useState<number>(currentProfile.prs.maxPushups);
  const [pullups, setPullups] = useState<number>(currentProfile.prs.maxPullups);
  const [dips, setDips] = useState<number>(currentProfile.prs.maxDips);
  const [plank, setPlank] = useState<number>(currentProfile.prs.maxPlankSeconds);
  const [handstand, setHandstand] = useState<number>(currentProfile.prs.maxHandstandSeconds);
  const [goal, setGoal] = useState<UserFitnessProfile['goal']>(currentProfile.goal);
  const [athleteName, setAthleteName] = useState<string>(currentProfile.name);

  // Compute calculated level
  const computeLevel = (): { level: DifficultyLevel; score: number; verdict: string } => {
    let score = 0;
    // Pull-up weight: 35 points
    score += Math.min(35, pullups * 3.5);
    // Push-up weight: 25 points
    score += Math.min(25, pushups * 0.8);
    // Dips weight: 25 points
    score += Math.min(25, dips * 1.5);
    // Plank weight: 15 points
    score += Math.min(15, (plank / 60) * 10);

    const roundedScore = Math.min(100, Math.round(score));

    if (pullups >= 12 && dips >= 15 && pushups >= 30) {
      return {
        level: 'advanced',
        score: roundedScore,
        verdict: 'You have solid pulling power and pushing endurance. You are in prime condition to unlock the Muscle-Up and Front Lever!'
      };
    } else if (pullups >= 6 && dips >= 8 && pushups >= 20) {
      return {
        level: 'intermediate',
        score: roundedScore,
        verdict: 'Great foundation! Your joints are adapting. Focus on explosive pulling power and straight-arm static balance.'
      };
    } else if (pullups >= 2 || pushups >= 10) {
      return {
        level: 'novice',
        score: roundedScore,
        verdict: 'Strong starting point. We need to solidify your scapular depression and build clean 8-10 strict pull-ups.'
      };
    } else {
      return {
        level: 'beginner',
        score: roundedScore,
        verdict: 'Welcome to calisthenics! We will start with Australian rows, knee push-ups, and active hangs to bulletproof your joints.'
      };
    }
  };

  const assessmentResult = computeLevel();

  const handleSave = () => {
    const updated: UserFitnessProfile = {
      ...currentProfile,
      name: athleteName.trim() || 'Athlete',
      level: assessmentResult.level,
      levelScore: assessmentResult.score,
      goal: goal,
      prs: {
        ...currentProfile.prs,
        maxPushups: pushups,
        maxPullups: pullups,
        maxDips: dips,
        maxPlankSeconds: plank,
        maxHandstandSeconds: handstand,
      }
    };

    speechCoach.speak(
      `Assessment updated! Coach Goyank evaluated you as ${assessmentResult.level} level with a score of ${assessmentResult.score}. Let's train!`
    );
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-amber-400/40 shrink-0">
              <img
                src={INSTRUCTOR_GOYANK.avatar}
                alt={INSTRUCTOR_GOYANK.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                Goyank&apos;s Calisthenics Assessment
              </h2>
              <p className="text-xs text-slate-400">
                Personalized strength evaluation and program prescription
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          {/* Athlete Name & Target Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Athlete Name</label>
              <input
                type="text"
                value={athleteName}
                onChange={(e) => setAthleteName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Primary Calisthenics Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as UserFitnessProfile['goal'])}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="first_pullup">Conquer First 10 Pull-Ups</option>
                <option value="muscle_up">Unlock Bar Muscle-Up</option>
                <option value="planche">Planche & Straight-Arm Power</option>
                <option value="handstand">Freestanding Handstand Balance</option>
                <option value="strength_hypertrophy">Full Body Hypertrophy & Shred</option>
              </select>
            </div>
          </div>

          {/* Max Reps Assessment Sliders */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Enter Your Strict Rep Capacities
            </h3>

            {/* Pull-ups */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Strict Dead-Hang Pull-Ups</span>
                <span className="font-mono text-amber-400 font-bold text-sm tabular-nums">
                  {pullups} reps
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={pullups}
                onChange={(e) => setPullups(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Dips */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Parallel Bar Dips</span>
                <span className="font-mono text-amber-400 font-bold text-sm tabular-nums">
                  {dips} reps
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={dips}
                onChange={(e) => setDips(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Push-ups */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Strict Push-Ups</span>
                <span className="font-mono text-amber-400 font-bold text-sm tabular-nums">
                  {pushups} reps
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={pushups}
                onChange={(e) => setPushups(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Plank Hold */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Plank / Core Hold</span>
                <span className="font-mono text-amber-400 font-bold text-sm tabular-nums">
                  {plank} seconds
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={plank}
                onChange={(e) => setPlank(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Coach Goyank Real-Time Level Prescription */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Coach Goyank&apos;s Evaluation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Score:</span>
                <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
                  {assessmentResult.score}/100
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Prescribed Calisthenics Level:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs capitalize">
                {assessmentResult.level}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              &ldquo;{assessmentResult.verdict}&rdquo;
            </p>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
          >
            <span>Update Profile & Program</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

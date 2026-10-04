import React, { useState } from 'react';
import { Sparkles, X, Brain, Dumbbell, Calendar, ShieldCheck, ChevronRight, Check, RefreshCw, Flame, ArrowRight, Zap, Target } from 'lucide-react';
import { UserFitnessProfile, SkillNode, WorkoutProgram, Exercise } from '../types/calisthenics';
import { INSTRUCTOR_GOYANK, EXERCISES } from '../data/instructorData';
import { speechCoach } from '../utils/speechCoach';

interface AIWorkoutPlanModalProps {
  profile: UserFitnessProfile;
  skills: SkillNode[];
  onClose: () => void;
  onSaveProgram: (newProgram: WorkoutProgram) => void;
}

interface GeneratedExercise {
  name: string;
  sets: number;
  repsOrSeconds: string;
  restSeconds: number;
  notes?: string;
}

interface GeneratedDay {
  dayNumber: number;
  title: string;
  focus: string;
  isRestDay?: boolean;
  recoveryActivity?: string;
  exercises?: GeneratedExercise[];
}

interface GeneratedPlan {
  title: string;
  tagline: string;
  frequencyDaysPerWeek: number;
  durationWeeks: number;
  goyankRationale: string;
  tendonRecoveryAdvice: string;
  days: GeneratedDay[];
}

export const AIWorkoutPlanModal: React.FC<AIWorkoutPlanModalProps> = ({
  profile,
  skills,
  onClose,
  onSaveProgram,
}) => {
  const [preferredDays, setPreferredDays] = useState<number>(profile.weeklyTargetSessions || 4);
  const [customFocus, setCustomFocus] = useState<string>(
    profile.goal === 'muscle_up'
      ? 'Explosive High Pull-Ups & Dip Transition'
      : profile.goal === 'planche'
      ? 'Shoulder Protraction & Straight-Arm Levers'
      : profile.goal === 'handstand'
      ? 'Inverted Scapular Elevation & Core Hollow'
      : 'Strict Form Bodyweight Hypertrophy'
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const practicingSkills = skills.filter((s) => s.status === 'practicing');
  const masteredSkills = skills.filter((s) => s.status === 'mastered');

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    speechCoach.speak("Coach Goyank AI is analyzing your biomechanics, skill tree, and personal records to engineer your custom split.");

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            ...profile,
            goal: profile.goal,
          },
          skills,
          preferredDays,
          customFocus,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.plan) {
        setGeneratedPlan(data.plan);
        speechCoach.playBeep('finish');
        speechCoach.speak("Your personalized weekly training split is ready! Strict form only.");
      } else {
        throw new Error('Could not parse workout plan from response');
      }
    } catch (err: any) {
      console.error('Failed to generate AI plan:', err);
      setErrorMsg(err?.message || 'Failed to connect to plan generator. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToPrograms = () => {
    if (!generatedPlan) return;

    // Convert GeneratedPlan to WorkoutProgram structure
    const newProgram: WorkoutProgram = {
      id: `ai_plan_${Date.now()}`,
      title: generatedPlan.title,
      tagline: generatedPlan.tagline,
      durationWeeks: generatedPlan.durationWeeks || 6,
      frequencyDaysPerWeek: generatedPlan.frequencyDaysPerWeek || preferredDays,
      difficulty: profile.level,
      coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
      description: generatedPlan.goyankRationale,
      goyankFocus: generatedPlan.tendonRecoveryAdvice,
      days: generatedPlan.days
        .filter((d) => !d.isRestDay && d.exercises && d.exercises.length > 0)
        .map((d, index) => ({
          dayNumber: index + 1,
          title: d.title,
          focus: d.focus,
          exercises: (d.exercises || []).map((ex, exIdx) => {
            // Find existing matching exercise ID or fallback
            const matchedEx = EXERCISES.find((e) =>
              e.name.toLowerCase().includes(ex.name.toLowerCase().split(' ')[0])
            );
            return {
              exerciseId: matchedEx ? matchedEx.id : `custom_ex_${exIdx}`,
              sets: ex.sets || 3,
              repsOrSeconds: ex.repsOrSeconds || '8-10 reps',
              restSeconds: ex.restSeconds || 75,
              notes: ex.notes,
            };
          }),
        })),
    };

    onSaveProgram(newProgram);
    speechCoach.speak("Custom workout split added to your training programs!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  AI WORKOUT SPLIT GENERATOR
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[10px] border border-amber-500/20">
                  Gemini 3.8 Flash
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                Personalized Calisthenics Training Split
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          {!generatedPlan ? (
            /* Configuration & Input Screen */
            <div className="space-y-6">
              {/* Profile Context Banner */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-amber-400/40 shrink-0">
                    <img
                      src={INSTRUCTOR_GOYANK.avatar}
                      alt={INSTRUCTOR_GOYANK.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">
                      Coach Goyank&apos;s Biomechanical Profile Synthesis
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Targeting <span className="capitalize text-amber-400 font-semibold">{profile.level}</span> level ({profile.levelScore}/100) with strict bodyweight volume.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block">Strict Pulls</span>
                    <span className="font-mono text-white font-bold">{profile.prs.maxPullups}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block">Dips</span>
                    <span className="font-mono text-white font-bold">{profile.prs.maxDips}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block">Handstand</span>
                    <span className="font-mono text-white font-bold">{profile.prs.maxHandstandSeconds}s</span>
                  </div>
                </div>
              </div>

              {/* Active Skill Tree Status */}
              <div className="space-y-2">
                <label className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  Your Active Skill Tree Priorities
                </label>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {practicingSkills.length > 0 ? (
                      practicingSkills.map((s) => (
                        <span
                          key={s.id}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-medium text-xs flex items-center gap-1"
                        >
                          <Zap className="w-3 h-3 text-amber-400" />
                          Practicing: {s.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">Strict Pull-Up & Dip Foundation</span>
                    )}

                    {masteredSkills.map((s) => (
                      <span
                        key={s.id}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-xs flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Mastered: {s.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    The AI calibrates volume so your practicing skills receive fresh neuromuscular energy before fatigue sets in.
                  </p>
                </div>
              </div>

              {/* Frequency Selector */}
              <div className="space-y-2">
                <label className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Preferred Weekly Training Frequency
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { days: 3, label: '3 Days / Week', sub: 'Full Body Push/Pull' },
                    { days: 4, label: '4 Days / Week', sub: 'Upper / Lower Split' },
                    { days: 5, label: '5 Days / Week', sub: 'Push / Pull / Skill / Legs' },
                  ].map((item) => (
                    <button
                      key={item.days}
                      onClick={() => setPreferredDays(item.days)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        preferredDays === item.days
                          ? 'bg-amber-500/15 border-amber-500 text-white ring-1 ring-amber-500/40'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-sm text-slate-200">{item.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Focus Preset */}
              <div className="space-y-2">
                <label className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
                  Specialized Training Focus
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Explosive High Pull-Ups & Dip Transition',
                    'Shoulder Protraction & Straight-Arm Levers',
                    'Inverted Scapular Elevation & Core Hollow',
                    'Strict Form Bodyweight Hypertrophy',
                  ].map((focus) => (
                    <button
                      key={focus}
                      onClick={() => setCustomFocus(focus)}
                      className={`p-3 rounded-xl border text-left font-medium transition-colors ${
                        customFocus === focus
                          ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {focus}
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}
            </div>
          ) : (
            /* Generated Plan Presentation Screen */
            <div className="space-y-6">
              {/* Plan Title & Tagline Banner */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      COACH GOYANK&apos;S CUSTOM BLUEPRINT
                    </span>
                    <h3 className="text-xl font-bold text-white font-display mt-0.5">
                      {generatedPlan.title}
                    </h3>
                    <p className="text-xs text-amber-300/90 italic mt-0.5">
                      &ldquo;{generatedPlan.tagline}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-mono font-bold text-xs">
                      {generatedPlan.frequencyDaysPerWeek}x / week
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono font-bold text-xs">
                      {generatedPlan.durationWeeks} weeks
                    </span>
                  </div>
                </div>

                {/* Goyank's Coaching Rationale */}
                <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5" />
                    Biomechanical Architecture & Rationale:
                  </div>
                  <p>{generatedPlan.goyankRationale}</p>
                </div>

                {/* Tendon Recovery Advice */}
                {generatedPlan.tendonRecoveryAdvice && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-200">
                    <span className="font-bold text-amber-400">Tendon Protocol: </span>
                    {generatedPlan.tendonRecoveryAdvice}
                  </div>
                )}
              </div>

              {/* Weekly Day-by-Day Routines */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Weekly Training Split Breakdown
                </h4>

                <div className="space-y-3">
                  {generatedPlan.days.map((day) => (
                    <div
                      key={day.dayNumber}
                      className={`p-4 rounded-2xl border transition-all ${
                        day.isRestDay
                          ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                          : 'bg-slate-950 border-slate-800/90'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
                            D{day.dayNumber}
                          </span>
                          <div>
                            <h5 className="font-bold text-white text-sm font-display">
                              {day.title}
                            </h5>
                            <span className="text-[11px] text-slate-400">{day.focus}</span>
                          </div>
                        </div>

                        {day.isRestDay && (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-semibold text-[11px]">
                            Rest & Recovery
                          </span>
                        )}
                      </div>

                      {day.isRestDay ? (
                        <p className="text-xs text-slate-400 italic">
                          {day.recoveryActivity || 'Active recovery, light mobility, and deep tendon rest.'}
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {(day.exercises || []).map((ex, exIdx) => (
                            <div
                              key={exIdx}
                              className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white">{ex.name}</span>
                                <span className="font-mono text-amber-400 font-semibold">
                                  {ex.sets} × {ex.repsOrSeconds}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-slate-400">
                                <span>Rest: {ex.restSeconds}s</span>
                                {ex.notes && (
                                  <span className="text-slate-400 italic truncate max-w-[180px]">
                                    {ex.notes}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          {!generatedPlan ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleGeneratePlan}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Synthesizing with Coach Goyank AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>Generate Personalized Split</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setGeneratedPlan(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Adjust Parameters</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={handleApplyToPrograms}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Save & Add to My Programs</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Play, Calendar, Flame, Clock, Award, ChevronRight, Sparkles, Dumbbell, ShieldCheck } from 'lucide-react';
import { WorkoutProgram, Exercise, UserFitnessProfile } from '../types/calisthenics';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';
import { WarmupGenerator } from './WarmupGenerator';

interface WorkoutsViewProps {
  programs: WorkoutProgram[];
  exercises: Exercise[];
  profile: UserFitnessProfile;
  onStartProgramDay: (programTitle: string, exercises: Exercise[]) => void;
  onOpenTutorial: (exerciseId: string) => void;
  onOpenAssessment: () => void;
  onOpenAIGenerator?: () => void;
}

export const WorkoutsView: React.FC<WorkoutsViewProps> = ({
  programs,
  exercises,
  profile,
  onStartProgramDay,
  onOpenTutorial,
  onOpenAssessment,
  onOpenAIGenerator,
}) => {
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram>(programs[0]);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Map day's exercise IDs to actual Exercise objects
  const activeDay = selectedProgram.days[selectedDayIndex] || selectedProgram.days[0];
  const activeExercises = (activeDay?.exercises || [])
    .map((e) => exercises.find((ex) => ex.id === e.exerciseId))
    .filter((ex): ex is Exercise => ex !== undefined);

  // Personalized Recommended Program based on user goal
  const recommendedProgram =
    programs.find((p) => {
      if (profile.goal === 'muscle_up') return p.id === 'first_muscle_up';
      if (profile.goal === 'first_pullup') return p.id === 'pullup_mastery_zero_to_ten';
      if (profile.goal === 'handstand') return p.id === 'handstand_balance_art';
      if (profile.goal === 'planche') return p.id === 'planche_conditioning';
      return true;
    }) || programs[0];

  return (
    <div className="space-y-8">
      {/* Hero: Coach Goyank's Daily Recommendation Banner */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Hero Banner Text */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              COACH GOYANK&apos;S PRESCRIPTION FOR {profile.name.toUpperCase()}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-display leading-tight">
              {recommendedProgram.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {recommendedProgram.description}
            </p>

            {/* Program Specs */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 py-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{recommendedProgram.durationWeeks} Weeks</span>
              </div>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{recommendedProgram.frequencyDaysPerWeek} Days / Week</span>
              </div>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5 capitalize text-amber-400 font-semibold">
                <Flame className="w-4 h-4" />
                <span>{recommendedProgram.difficulty} Level</span>
              </div>
            </div>

            {/* Goyank Coach Note */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-200">
              <span className="font-bold text-amber-300">Goyank&apos;s Focus: </span>
              {recommendedProgram.goyankFocus}
            </div>

            {/* Launch Recommended Program Day CTA */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const firstDay = recommendedProgram.days[0];
                  const exList = (firstDay?.exercises || [])
                    .map((e) => exercises.find((ex) => ex.id === e.exerciseId))
                    .filter((ex): ex is Exercise => ex !== undefined);
                  onStartProgramDay(`${recommendedProgram.title} - ${firstDay.title}`, exList);
                }}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Start Today&apos;s Workout</span>
              </button>

              {onOpenAIGenerator && (
                <button
                  onClick={onOpenAIGenerator}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center gap-2 shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>AI Custom Split Generator</span>
                </button>
              )}

              <button
                onClick={onOpenAssessment}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
              >
                Adjust My Level Assessment
              </button>
            </div>
          </div>

          {/* Hero Banner Media */}
          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[300px] overflow-hidden bg-slate-950">
            <img
              src={recommendedProgram.coverImage}
              alt={recommendedProgram.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:bg-gradient-to-r lg:from-slate-900 lg:to-transparent" />
            <div className="absolute bottom-4 right-4 flex items-center gap-2.5 p-2 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800">
              <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-amber-400/40">
                <img
                  src={INSTRUCTOR_GOYANK.avatar}
                  alt={INSTRUCTOR_GOYANK.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left pr-2">
                <div className="text-xs font-bold text-white">{INSTRUCTOR_GOYANK.name}</div>
                <div className="text-[10px] text-amber-400">Head Calisthenics Coach</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Custom Split Generator Feature Banner */}
      {onOpenAIGenerator && (
        <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  AI-POWERED WORKOUT PLAN GENERATOR
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-mono text-[10px] border border-amber-500/25">
                  Adaptive Split
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-display mt-0.5">
                Generate a 100% Customized Weekly Calisthenics Split
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Coach Goyank&apos;s AI synthesizes your fitness profile ({profile.level}), current PR benchmarks (Pull-Ups: {profile.prs.maxPullups}, Dips: {profile.prs.maxDips}), and active skill tree status to engineer your optimal weekly frequency and volume.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAIGenerator}
            className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Generate My Split</span>
          </button>
        </div>
      )}

      {/* Program Selector Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-display">
            Curated Calisthenics Programs
          </h2>
          <span className="text-xs text-slate-400">Coached by Goyank Singh</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {programs.map((program) => {
            const isSelected = selectedProgram.id === program.id;
            return (
              <div
                key={program.id}
                onClick={() => {
                  setSelectedProgram(program);
                  setSelectedDayIndex(0);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500 ring-1 ring-amber-500/50 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 capitalize mb-1">
                    <span>{program.durationWeeks} Weeks</span>
                    <span className="text-amber-400 font-semibold">{program.difficulty}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white font-display line-clamp-1">
                    {program.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {program.tagline}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{program.days.length} Workout Days</span>
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                    {isSelected ? 'ACTIVE' : 'SELECT'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Selected Program Schedule Breakdown */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              PROGRAM SCHEDULE · {selectedProgram.title}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white font-display mt-0.5">
              Select Training Day Routine
            </h2>
          </div>

          {/* Day selection tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {selectedProgram.days.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors border ${
                  selectedDayIndex === idx
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Day Details */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                {activeDay?.title}
              </h3>
              <p className="text-xs text-amber-300 font-medium">
                Focus: {activeDay?.focus}
              </p>
            </div>

            {activeExercises.length > 0 && (
              <button
                onClick={() =>
                  onStartProgramDay(
                    `${selectedProgram.title} - ${activeDay.title}`,
                    activeExercises
                  )
                }
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all shrink-0"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Launch Day {activeDay.dayNumber} Workout</span>
              </button>
            )}
          </div>

          {/* Automated Warm-up Generator Component */}
          {activeExercises.length > 0 && (
            <WarmupGenerator
              exercises={activeExercises}
              routineTitle={`${selectedProgram.title} - ${activeDay.title}`}
              onStartMainWorkout={() =>
                onStartProgramDay(
                  `${selectedProgram.title} - ${activeDay.title}`,
                  activeExercises
                )
              }
            />
          )}

          {/* Exercises in this Day */}
          {activeExercises.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-400 text-sm">
              Rest & Active Mobility Day. Hydrate, stretch your lats and wrists, and let your nervous system recover!
            </div>
          ) : (
            <div className="space-y-3">
              {activeDay.exercises.map((dayEx, idx) => {
                const exerciseObj = exercises.find((e) => e.id === dayEx.exerciseId);
                if (!exerciseObj) return null;

                return (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-slate-800">
                        <img
                          src={exerciseObj.thumbnail}
                          alt={exerciseObj.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            Order {idx + 1}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-xs text-amber-400 capitalize">{exerciseObj.category.replace('_', ' ')}</span>
                        </div>
                        <h4 className="text-base font-bold text-white font-display mt-0.5">
                          {exerciseObj.name}
                        </h4>
                        {dayEx.notes && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            Goyank&apos;s note: {dayEx.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <div className="text-left sm:text-right">
                        <span className="text-xs font-mono font-bold text-white block">
                          {dayEx.sets} sets × {dayEx.repsOrSeconds}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {dayEx.restSeconds}s rest
                        </span>
                      </div>

                      <button
                        onClick={() => onOpenTutorial(exerciseObj.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                      >
                        Form Tutorial
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Flame, Award, CheckCircle2, Lock, Sparkles, ChevronRight, Zap, Trophy } from 'lucide-react';
import { WorkoutSessionLog } from '../types/calisthenics';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';

export interface StreakMilestone {
  id: string;
  daysRequired: number;
  title: string;
  subtitle: string;
  iconName: string;
  goyankQuote: string;
}

export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    id: 'streak_3',
    daysRequired: 3,
    title: 'The Spark',
    subtitle: '3 Days Consecutive',
    iconName: 'Zap',
    goyankQuote: 'Showing up 3 days in a row teaches your nervous system that this is serious business.'
  },
  {
    id: 'streak_7',
    daysRequired: 7,
    title: 'Iron Week',
    subtitle: '7 Days Unbroken',
    iconName: 'Award',
    goyankQuote: 'A full week without skipping! Your scapulae and tendon resilience are adapting.'
  },
  {
    id: 'streak_14',
    daysRequired: 14,
    title: 'Street Warrior',
    subtitle: '14 Days Unbroken',
    iconName: 'Flame',
    goyankQuote: 'Two full weeks! You have built the unstoppable rhythm of an authentic calisthenics athlete.'
  },
  {
    id: 'streak_21',
    daysRequired: 21,
    title: 'Habit Master',
    subtitle: '21 Days Habit Formed',
    iconName: 'Trophy',
    goyankQuote: '21 days turns workouts into second nature. Bodyweight control is now part of your identity.'
  },
  {
    id: 'streak_30',
    daysRequired: 30,
    title: "Goyank's Elite Circle",
    subtitle: '30 Days of Mastery',
    iconName: 'Sparkles',
    goyankQuote: 'A full month of absolute gravity mastery. You belong in the top 1% of street workout discipline.'
  }
];

interface DailyStreakCounterProps {
  logs: WorkoutSessionLog[];
  onQuickLogToday?: () => void;
}

export const DailyStreakCounter: React.FC<DailyStreakCounterProps> = ({ logs, onQuickLogToday }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<StreakMilestone | null>(null);

  // Helper to format Date to YYYY-MM-DD in local time
  const formatLocalDate = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Set of dates with at least one workout
  const workoutDatesSet = new Set<string>();
  logs.forEach((log) => {
    try {
      const d = new Date(log.date);
      if (!isNaN(d.getTime())) {
        workoutDatesSet.add(formatLocalDate(d));
      }
    } catch {
      // ignore
    }
  });

  const now = new Date();
  const todayStr = formatLocalDate(now);

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = formatLocalDate(yesterdayDate);

  const completedToday = workoutDatesSet.has(todayStr);
  const completedYesterday = workoutDatesSet.has(yesterdayStr);

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date();

  if (completedToday) {
    // Start counting backwards from today
    while (workoutDatesSet.has(formatLocalDate(checkDate))) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else if (completedYesterday) {
    // Streak is still active from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    while (workoutDatesSet.has(formatLocalDate(checkDate))) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else {
    currentStreak = 0;
  }

  // Calculate longest streak across history
  let longestStreak = currentStreak;
  const sortedDates = Array.from(workoutDatesSet).sort();
  if (sortedDates.length > 0) {
    let tempStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffTime = curr.getTime() - prev.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
      if (diffDays === 1) {
        tempStreak += 1;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  // Generate the last 7 calendar days for visual week strip
  const pastSevenDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateKey = formatLocalDate(d);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' }); // M, T, W...
    const dayNum = d.getDate();
    const isCompleted = workoutDatesSet.has(dateKey);
    const isToday = dateKey === todayStr;

    return {
      dateKey,
      dayName,
      dayNum,
      isCompleted,
      isToday,
    };
  });

  // Find next milestone to unlock
  const nextMilestone = STREAK_MILESTONES.find((m) => currentStreak < m.daysRequired) || STREAK_MILESTONES[STREAK_MILESTONES.length - 1];
  const unlockedMilestonesCount = STREAK_MILESTONES.filter((m) => currentStreak >= m.daysRequired).length;

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6">
      {/* Top Header: Streak Flame & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-4">
          {/* Flame Badge */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
              currentStreak > 0
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/20'
                : 'bg-slate-800/70 border-slate-700 text-slate-500'
            }`}
          >
            <Flame className={`w-8 h-8 ${currentStreak > 0 ? 'animate-bounce duration-1000' : ''}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                DAILY WORKOUT STREAK
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-mono">
                Best: {longestStreak} {longestStreak === 1 ? 'day' : 'days'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tabular-nums">
                {currentStreak}
              </span>
              <span className="text-sm font-semibold text-slate-300">
                {currentStreak === 1 ? 'Day Streak' : 'Days Streak'}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1">
              {completedToday ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Workout completed today! Your streak is locked in.
                </span>
              ) : currentStreak > 0 ? (
                <span className="text-amber-300 font-medium">
                  Streak active from yesterday! Train today to extend to {currentStreak + 1} days.
                </span>
              ) : (
                <span className="text-slate-400">
                  No active streak today. Complete a session with Coach Goyank to ignite day 1!
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action button if not completed today */}
        {!completedToday && onQuickLogToday && (
          <button
            onClick={onQuickLogToday}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all shrink-0"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Complete Today&apos;s Session</span>
          </button>
        )}
      </div>

      {/* Visual Past 7 Days Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300">7-Day Consistency Tracker</span>
          <span className="font-mono text-slate-400">
            {pastSevenDays.filter((d) => d.isCompleted).length}/7 days active
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {pastSevenDays.map((day) => (
            <div
              key={day.dateKey}
              className={`p-2.5 sm:p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all ${
                day.isCompleted
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                  : day.isToday
                  ? 'bg-slate-950 border-amber-500/50 ring-1 ring-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-500'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-tight">
                {day.dayName}
              </span>

              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                  day.isCompleted
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : day.isToday
                    ? 'border-2 border-dashed border-amber-400 text-amber-300'
                    : 'bg-slate-900 text-slate-500'
                }`}
              >
                {day.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                ) : (
                  day.dayNum
                )}
              </div>

              <span className="text-[10px] text-slate-400 font-medium">
                {day.isToday ? 'Today' : day.isCompleted ? 'Done' : 'Rest'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Badge Milestones Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Streak Milestone Badges
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Unlock prestige badges by maintaining consecutive daily calisthenics training
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 font-semibold">
            {unlockedMilestonesCount}/{STREAK_MILESTONES.length} Unlocked
          </span>
        </div>

        {/* Milestone Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {STREAK_MILESTONES.map((milestone) => {
            const isUnlocked = currentStreak >= milestone.daysRequired;
            const progressRatio = Math.min(1, currentStreak / milestone.daysRequired);
            const percent = Math.round(progressRatio * 100);

            return (
              <div
                key={milestone.id}
                onClick={() => setSelectedMilestone(milestone)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-slate-950 border-amber-500/50 hover:border-amber-400 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-900 text-slate-600 border border-slate-800'
                      }`}
                    >
                      {isUnlocked ? (
                        <Award className="w-5 h-5 text-amber-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isUnlocked ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    >
                      {milestone.daysRequired}D
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white font-display line-clamp-1">
                    {milestone.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {milestone.subtitle}
                  </p>
                </div>

                {/* Progress Mini Bar */}
                <div className="pt-3 mt-3 border-t border-slate-900 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className={isUnlocked ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                      {isUnlocked ? 'UNLOCKED' : `${currentStreak}/${milestone.daysRequired} days`}
                    </span>
                    <span className="font-mono text-slate-500">{percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked
                          ? 'bg-emerald-400'
                          : 'bg-gradient-to-r from-amber-500 to-amber-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Milestone Detail Popover / Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                  currentStreak >= selectedMilestone.daysRequired
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-lg'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                {currentStreak >= selectedMilestone.daysRequired ? (
                  <Trophy className="w-7 h-7 text-amber-400" />
                ) : (
                  <Lock className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  MILESTONE BADGE · {selectedMilestone.daysRequired} DAYS
                </span>
                <h3 className="text-lg font-bold text-white font-display mt-0.5">
                  {selectedMilestone.title}
                </h3>
                <p className="text-xs text-slate-400">{selectedMilestone.subtitle}</p>
              </div>
            </div>

            {/* Goyank Insight */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-amber-400/40 shrink-0">
                <img
                  src={INSTRUCTOR_GOYANK.avatar}
                  alt={INSTRUCTOR_GOYANK.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-xs sm:text-sm text-slate-200">
                <span className="font-bold text-amber-300">Coach Goyank on this Milestone: </span>
                <p className="mt-1 leading-relaxed">&ldquo;{selectedMilestone.goyankQuote}&rdquo;</p>
              </div>
            </div>

            {/* Status & Progress */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Status:</span>
              {currentStreak >= selectedMilestone.daysRequired ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Unlocked & Active
                </span>
              ) : (
                <span className="text-amber-400 font-mono font-bold">
                  {selectedMilestone.daysRequired - currentStreak} days remaining
                </span>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setSelectedMilestone(null)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Close Milestone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

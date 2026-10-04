import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Flame, Clock, Award, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { WorkoutSessionLog } from '../types/calisthenics';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';

interface WorkoutHistoryCalendarProps {
  logs: WorkoutSessionLog[];
  onSelectDateLogs?: (logs: WorkoutSessionLog[], dateStr: string) => void;
  onQuickLogForDate?: (dateStr: string) => void;
}

interface DayData {
  date: Date;
  dateKey: string; // YYYY-MM-DD
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ...
  logs: WorkoutSessionLog[];
  totalMinutes: number;
  totalExercises: number;
  intensityLevel: 0 | 1 | 2 | 3;
  isToday: boolean;
  isFuture: boolean;
}

export const WorkoutHistoryCalendar: React.FC<WorkoutHistoryCalendarProps> = ({
  logs,
  onSelectDateLogs,
  onQuickLogForDate,
}) => {
  // Configurable weeks range: 16 weeks (~4 months) or 24 weeks (~6 months)
  const [rangeWeeks, setRangeWeeks] = useState<16 | 24>(16);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  // Helper to format Date to YYYY-MM-DD in local time
  const formatLocalDate = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = useMemo(() => formatLocalDate(new Date()), []);

  // Map of dateKey -> logs[]
  const dateLogsMap = useMemo(() => {
    const map = new Map<string, WorkoutSessionLog[]>();
    logs.forEach((log) => {
      try {
        const d = new Date(log.date);
        if (!isNaN(d.getTime())) {
          const key = formatLocalDate(d);
          const current = map.get(key) || [];
          current.push(log);
          map.set(key, current);
        }
      } catch {
        // ignore
      }
    });
    return map;
  }, [logs]);

  // Generate grid columns (weeks) and rows (7 days: Mon=0 to Sun=6)
  const { weeks, monthLabels, stats } = useMemo(() => {
    const now = new Date();
    // End date is upcoming Saturday / end of current week
    const currentDayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
    // Convert so Monday = 0, Sunday = 6
    const adjustedDay = (currentDayOfWeek + 6) % 7;

    const totalDays = rangeWeeks * 7;
    // Start date is totalDays - (6 - adjustedDay) days ago
    const startDate = new Date();
    startDate.setDate(now.getDate() - adjustedDay - (rangeWeeks - 1) * 7);
    startDate.setHours(0, 0, 0, 0);

    const generatedWeeks: DayData[][] = [];
    let currentWeek: DayData[] = [];
    const months: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    let totalWorkoutsInRange = 0;
    let totalMinutesInRange = 0;
    let activeDaysInRange = 0;

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateKey = formatLocalDate(d);
      const dayLogs = dateLogsMap.get(dateKey) || [];

      const totalMins = dayLogs.reduce((acc, l) => acc + l.durationMinutes, 0);
      const totalExs = dayLogs.reduce((acc, l) => acc + l.exercises.length, 0);

      let intensity: 0 | 1 | 2 | 3 = 0;
      if (dayLogs.length > 0) {
        if (totalMins >= 45 || dayLogs.length >= 2) {
          intensity = 3;
        } else if (totalMins >= 25) {
          intensity = 2;
        } else {
          intensity = 1;
        }
        totalWorkoutsInRange += dayLogs.length;
        totalMinutesInRange += totalMins;
        activeDaysInRange += 1;
      }

      const isToday = dateKey === todayStr;
      const isFuture = d.getTime() > now.getTime() && !isToday;

      const dayObj: DayData = {
        date: d,
        dateKey,
        dayOfWeek: (d.getDay() + 6) % 7, // 0 = Mon, ..., 6 = Sun
        logs: dayLogs,
        totalMinutes: totalMins,
        totalExercises: totalExs,
        intensityLevel: intensity,
        isToday,
        isFuture,
      };

      currentWeek.push(dayObj);

      // Check month boundary on Sundays or start
      const m = d.getMonth();
      if (m !== lastMonth && currentWeek.length === 1) {
        months.push({
          label: d.toLocaleDateString('en-US', { month: 'short' }),
          weekIndex: generatedWeeks.length,
        });
        lastMonth = m;
      }

      if (currentWeek.length === 7) {
        generatedWeeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      generatedWeeks.push(currentWeek);
    }

    const consistencyRate = Math.round((activeDaysInRange / (rangeWeeks * 7)) * 100);

    return {
      weeks: generatedWeeks,
      monthLabels: months,
      stats: {
        totalWorkouts: totalWorkoutsInRange,
        totalMinutes: totalMinutesInRange,
        activeDays: activeDaysInRange,
        consistencyRate,
      },
    };
  }, [rangeWeeks, dateLogsMap, todayStr]);

  const activeSelectedDay = useMemo(() => {
    if (!selectedDayKey) return null;
    const dayLogs = dateLogsMap.get(selectedDayKey) || [];
    const dateParts = selectedDayKey.split('-');
    const dateObj = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
    return {
      dateKey: selectedDayKey,
      date: dateObj,
      logs: dayLogs,
      totalMinutes: dayLogs.reduce((acc, l) => acc + l.durationMinutes, 0),
    };
  }, [selectedDayKey, dateLogsMap]);

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            WORKOUT HISTORY HEATMAP
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-display mt-0.5">
            Calisthenics Activity & Volume
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize your daily bar sessions, intensity distribution, and consistency over time
          </p>
        </div>

        {/* Range Selector & Summary Chips */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setRangeWeeks(16)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                rangeWeeks === 16
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              16 Weeks
            </button>
            <button
              onClick={() => setRangeWeeks(24)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                rangeWeeks === 24
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              24 Weeks
            </button>
          </div>
        </div>
      </div>

      {/* Heatmap Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-slate-400">Total Workouts</span>
          <div className="text-xl font-bold font-mono text-white mt-0.5 tabular-nums">
            {stats.totalWorkouts}
          </div>
          <span className="text-[10px] text-slate-500">In past {rangeWeeks} weeks</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-slate-400">Time on Bars</span>
          <div className="text-xl font-bold font-mono text-amber-400 mt-0.5 tabular-nums">
            {stats.totalMinutes}m
          </div>
          <span className="text-[10px] text-slate-500">Total volume</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-slate-400">Active Days</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
            {stats.activeDays}
          </div>
          <span className="text-[10px] text-slate-500">Training sessions</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-slate-400">Consistency Rate</span>
          <div className="text-xl font-bold font-mono text-white mt-0.5 tabular-nums">
            {stats.consistencyRate}%
          </div>
          <span className="text-[10px] text-slate-500">Overall adherence</span>
        </div>
      </div>

      {/* Heatmap Matrix Display */}
      <div className="space-y-2">
        <div className="overflow-x-auto pb-3 pt-1 scrollbar-thin">
          <div className="min-w-[620px] select-none">
            {/* Month labels header */}
            <div className="flex text-[11px] text-slate-400 font-semibold mb-1 pl-7">
              {weeks.map((week, idx) => {
                const monthEntry = monthLabels.find((m) => m.weekIndex === idx);
                return (
                  <div key={idx} className="w-4 sm:w-4.5 text-center shrink-0 mr-1 sm:mr-1.5">
                    {monthEntry ? monthEntry.label : ''}
                  </div>
                );
              })}
            </div>

            {/* Matrix Body: Weekday Labels + Grid of Cells */}
            <div className="flex items-start">
              {/* Day of Week Labels (Mon, Wed, Fri) */}
              <div className="flex flex-col justify-between text-[10px] text-slate-500 font-semibold pr-2 h-[122px] sm:h-[136px] shrink-0">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun</span>
              </div>

              {/* Columns of Weeks */}
              <div className="flex gap-1 sm:gap-1.5">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1 sm:gap-1.5 shrink-0">
                    {week.map((day) => {
                      const isSelected = selectedDayKey === day.dateKey;
                      const hasLogs = day.logs.length > 0;

                      // Color based on intensity
                      let cellClass = 'bg-slate-950/80 border-slate-800/80 text-transparent';
                      if (day.intensityLevel === 1) {
                        cellClass = 'bg-amber-500/30 border-amber-500/50 hover:bg-amber-500/40 text-amber-200';
                      } else if (day.intensityLevel === 2) {
                        cellClass = 'bg-amber-500/70 border-amber-500 hover:bg-amber-500/80 text-slate-950';
                      } else if (day.intensityLevel === 3) {
                        cellClass = 'bg-amber-400 border-amber-300 hover:bg-amber-300 shadow-sm shadow-amber-500/30 text-slate-950';
                      }

                      if (day.isToday) {
                        cellClass += ' ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900';
                      }

                      if (isSelected) {
                        cellClass += ' ring-2 ring-white ring-offset-1 ring-offset-slate-900 scale-110 z-10';
                      }

                      return (
                        <div
                          key={day.dateKey}
                          onClick={() => setSelectedDayKey(isSelected ? null : day.dateKey)}
                          onMouseEnter={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3.5px] border cursor-pointer transition-all duration-150 relative ${cellClass} ${
                            day.isFuture ? 'opacity-20 cursor-default' : ''
                          }`}
                          title={`${day.date.toDateString()}: ${
                            hasLogs ? `${day.logs.length} workout(s), ${day.totalMinutes}m` : 'No workout'
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap Footer: Legend & Dynamic Hover Tooltip Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-slate-800/80">
          {/* Hover Status Readout */}
          <div className="text-slate-300 flex items-center gap-2">
            {hoveredDay ? (
              <span className="flex items-center gap-1.5 font-medium">
                <span className="text-amber-400 font-semibold">{hoveredDay.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}:</span>
                {hoveredDay.logs.length > 0 ? (
                  <span className="text-white">
                    {hoveredDay.logs.length} session ({hoveredDay.totalMinutes}m) · {hoveredDay.logs[0].routineName}
                  </span>
                ) : (
                  <span className="text-slate-400">Rest / Recovery Day</span>
                )}
              </span>
            ) : (
              <span className="text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                Tap any cell to inspect workouts & Coach Goyank debrief
              </span>
            )}
          </div>

          {/* Intensity Legend */}
          <div className="flex items-center gap-2 text-slate-400 text-[11px] self-end sm:self-auto shrink-0">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-[3px] bg-slate-950 border border-slate-800" title="0 min (Rest)" />
              <div className="w-3 h-3 rounded-[3px] bg-amber-500/30 border border-amber-500/50" title="1-24 min (Light)" />
              <div className="w-3 h-3 rounded-[3px] bg-amber-500/70 border border-amber-500" title="25-44 min (Moderate)" />
              <div className="w-3 h-3 rounded-[3px] bg-amber-400 border border-amber-300" title="45+ min (Intense)" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Selected Day Drill-down Drawer */}
      {activeSelectedDay && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
                <Calendar className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  ACTIVITY INSPECTOR
                </span>
                <h3 className="text-base font-bold text-white font-display">
                  {activeSelectedDay.date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h3>
              </div>
            </div>

            <button
              onClick={() => setSelectedDayKey(null)}
              className="px-3 py-1 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
            >
              Close
            </button>
          </div>

          {activeSelectedDay.logs.length > 0 ? (
            <div className="space-y-3">
              {activeSelectedDay.logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-display">
                      {log.routineName}
                    </h4>
                    <span className="text-xs font-mono text-amber-400 font-semibold">
                      {log.durationMinutes} mins
                    </span>
                  </div>

                  {log.coachFeedback && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-slate-200">
                      <span className="font-semibold text-amber-300">Goyank: </span>
                      {log.coachFeedback}
                    </div>
                  )}

                  <div className="text-xs text-slate-400">
                    Exercises:{' '}
                    {log.exercises.map((e) => e.exerciseName).join(' · ') || 'Circuit Training'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-slate-300">
                <span className="font-semibold text-white block">Rest & Recovery Day</span>
                Coach Goyank: &ldquo;Connective tissue repairs when you rest. Sleeping well and staying hydrated prepares your tendons for next day tension.&rdquo;
              </div>

              {onQuickLogForDate && (
                <button
                  onClick={() => onQuickLogForDate(activeSelectedDay.dateKey)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap self-start sm:self-auto transition-colors"
                >
                  Log Workout For This Day
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

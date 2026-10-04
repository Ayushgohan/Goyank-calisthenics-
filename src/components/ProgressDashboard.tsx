import React, { useState } from 'react';
import { Award, Flame, Calendar, Dumbbell, TrendingUp, Download, Upload, Plus, Trash2, Sparkles, ChevronDown, ChevronUp, Bell, Clock, Share2 } from 'lucide-react';
import { UserFitnessProfile, WorkoutSessionLog, PersonalRecords } from '../types/calisthenics';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';
import { DailyStreakCounter } from './DailyStreakCounter';
import { WorkoutHistoryCalendar } from './WorkoutHistoryCalendar';
import { VolumeTrendChart } from './VolumeTrendChart';
import { SocialShareModal } from './SocialShareModal';
import { speechCoach } from '../utils/speechCoach';
import { notificationService } from '../utils/notificationService';

interface ProgressDashboardProps {
  profile: UserFitnessProfile;
  logs: WorkoutSessionLog[];
  onUpdatePRs: (prs: PersonalRecords) => void;
  onAddManualLog: (log: WorkoutSessionLog) => void;
  onDeleteLog: (id: string) => void;
  onOpenAssessment: () => void;
  onImportLogs: (logs: WorkoutSessionLog[]) => void;
  onOpenReminders?: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  profile,
  logs,
  onUpdatePRs,
  onAddManualLog,
  onDeleteLog,
  onOpenAssessment,
  onImportLogs,
  onOpenReminders,
}) => {
  const [editingPRs, setEditingPRs] = useState<boolean>(false);
  const [tempPRs, setTempPRs] = useState<PersonalRecords>(profile.prs);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(logs[0]?.id || null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Manual log state
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [manualTitle, setManualTitle] = useState('Outdoor Bar Session');
  const [manualMins, setManualMins] = useState(45);
  const [manualReps, setManualReps] = useState(50);

  const totalMinutesTrained = logs.reduce((acc, l) => acc + l.durationMinutes, 0);
  const totalSessions = logs.length;

  const handleSavePRs = () => {
    onUpdatePRs(tempPRs);
    setEditingPRs(false);
  };

  const handleExportJSON = () => {
    const data = {
      profile,
      logs,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goyank_calisthenics_progress_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.logs && Array.isArray(parsed.logs)) {
          onImportLogs(parsed.logs);
        }
      } catch {
        alert('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
  };

  const submitManualWorkout = () => {
    const newLog: WorkoutSessionLog = {
      id: `manual_${Date.now()}`,
      date: new Date().toISOString(),
      routineName: manualTitle,
      durationMinutes: manualMins,
      exercises: [
        {
          exerciseId: 'strict_pullup',
          exerciseName: 'Bodyweight Street Session',
          sets: [
            { setNumber: 1, repsOrSeconds: manualReps, completed: true, rpe: 8 }
          ]
        }
      ],
      feelingRating: 5,
      coachFeedback: `Coach Goyank: Strong independent street workout logged! ${manualReps} total reps across ${manualMins} minutes. High work capacity.`
    };
    onAddManualLog(newLog);
    setShowManualModal(false);
  };

  const handleQuickLogToday = () => {
    const quickLog: WorkoutSessionLog = {
      id: `streak_${Date.now()}`,
      date: new Date().toISOString(),
      routineName: "Goyank's Daily Bodyweight Habit Routine",
      durationMinutes: 25,
      exercises: [
        {
          exerciseId: 'strict_pullup',
          exerciseName: 'Strict Pull-Ups & Dips Daily Primer',
          sets: [
            { setNumber: 1, repsOrSeconds: 8, completed: true, rpe: 8 },
            { setNumber: 2, repsOrSeconds: 8, completed: true, rpe: 8 },
            { setNumber: 3, repsOrSeconds: 12, completed: true, rpe: 9 },
          ]
        }
      ],
      feelingRating: 5,
      coachFeedback: "Coach Goyank: Boom! Daily streak locked in! Showing up day after day is what turns ordinary strength into superhuman street workout control."
    };
    onAddManualLog(quickLog);
    speechCoach.playBeep('finish');
    speechCoach.speak("Streak extended! Great job locking in today's calisthenics session!");
  };

  const handleQuickLogForDate = (dateStr: string) => {
    const targetDate = new Date(`${dateStr}T10:00:00.000Z`);
    const dateLog: WorkoutSessionLog = {
      id: `date_log_${Date.now()}`,
      date: targetDate.toISOString(),
      routineName: "Outdoor Calisthenics Strength Session",
      durationMinutes: 35,
      exercises: [
        {
          exerciseId: 'strict_pullup',
          exerciseName: 'Strict Pull-Ups & Parallel Bar Dips',
          sets: [
            { setNumber: 1, repsOrSeconds: 8, completed: true, rpe: 8 },
            { setNumber: 2, repsOrSeconds: 8, completed: true, rpe: 8 },
            { setNumber: 3, repsOrSeconds: 10, completed: true, rpe: 9 },
          ]
        }
      ],
      feelingRating: 5,
      coachFeedback: `Coach Goyank: Great session logged for ${dateStr}! Strict form builds bulletproof tendons.`
    };
    onAddManualLog(dateLog);
    speechCoach.playBeep('finish');
    speechCoach.speak(`Workout session recorded!`);
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header & Profile Banner */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-amber-400/40 shrink-0 bg-slate-950">
            <img
              src={INSTRUCTOR_GOYANK.avatar}
              alt="Coach Goyank"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                PERSONALIZED ATHLETE RECORD
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400 capitalize">{profile.level} Level</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-display mt-0.5">
              {profile.name}&apos;s Training Journey
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Under direct guidance of Coach Goyank Singh · Target: <span className="text-slate-200 capitalize">{profile.goal.replace('_', ' ')}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => {
              setShowShareModal(true);
              speechCoach.speak("Opening your calisthenics performance and streak brag card.");
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Share Progress Card</span>
          </button>
          <button
            onClick={onOpenAssessment}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>
          <button
            onClick={() => setShowManualModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Log Session</span>
          </button>
        </div>
      </div>

      {/* Metrics Row: 4 key overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Workouts Logged</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
            {totalSessions}
          </div>
          <div className="text-[11px] text-slate-500">Sessions recorded</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Minutes on the Bar</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
            {totalMinutesTrained}
          </div>
          <div className="text-[11px] text-slate-500">Total volume time</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Strength Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 tabular-nums">
            {profile.levelScore}
            <span className="text-xs text-slate-500 font-normal">/100</span>
          </div>
          <div className="text-[11px] text-slate-500">Goyank rating index</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Weekly Target</span>
            <Dumbbell className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
            {profile.weeklyTargetSessions}x
          </div>
          <div className="text-[11px] text-slate-500">Optimal recovery pace</div>
        </div>
      </div>

      {/* Visual Daily Workout Streak Counter & Milestone Badges */}
      <DailyStreakCounter logs={logs} onQuickLogToday={handleQuickLogToday} />

      {/* Gentle Workout Reminder Schedule Card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                DAILY PUSH REMINDER
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-300 font-mono font-bold">
                {notificationService.getSettings().enabled ? `${notificationService.getSettings().time} Daily` : 'Paused'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Coach Goyank sends a gentle push notification to keep your daily streak alive. Tone: <span className="capitalize text-slate-200">{notificationService.getSettings().coachingTone}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={() => {
              notificationService.triggerNotification();
              speechCoach.speak("Testing your gentle workout reminder from Coach Goyank!");
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
          >
            Test Push
          </button>
          {onOpenReminders && (
            <button
              onClick={onOpenReminders}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-colors"
            >
              Configure Schedule
            </button>
          )}
        </div>
      </div>

      {/* Volume Trend Chart (D3 Progressive Overload Analyzer) */}
      <VolumeTrendChart logs={logs} onOpenShare={() => setShowShareModal(true)} />

      {/* Personal Records (PR) Board */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Personal Records (Strict Form Standards)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              All benchmarks verified by Coach Goyank (zero kipping, locked lockouts)
            </p>
          </div>
          <button
            onClick={() => setEditingPRs(!editingPRs)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors"
          >
            {editingPRs ? 'Cancel' : 'Edit PRs'}
          </button>
        </div>

        {editingPRs ? (
          <div className="space-y-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Max Pull-Ups</label>
                <input
                  type="number"
                  value={tempPRs.maxPullups}
                  onChange={(e) => setTempPRs({ ...tempPRs, maxPullups: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Max Dips</label>
                <input
                  type="number"
                  value={tempPRs.maxDips}
                  onChange={(e) => setTempPRs({ ...tempPRs, maxDips: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Max Push-Ups</label>
                <input
                  type="number"
                  value={tempPRs.maxPushups}
                  onChange={(e) => setTempPRs({ ...tempPRs, maxPushups: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Plank (sec)</label>
                <input
                  type="number"
                  value={tempPRs.maxPlankSeconds}
                  onChange={(e) => setTempPRs({ ...tempPRs, maxPlankSeconds: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Handstand Hold (sec)</label>
                <input
                  type="number"
                  value={tempPRs.maxHandstandSeconds}
                  onChange={(e) => setTempPRs({ ...tempPRs, maxHandstandSeconds: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Muscle-Up Reps</label>
                <input
                  type="number"
                  value={tempPRs.muscleUpReps}
                  onChange={(e) => setTempPRs({ ...tempPRs, muscleUpReps: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSavePRs}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                Save Updated PRs
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center">
              <span className="text-[11px] font-semibold text-slate-400">Strict Pull-Ups</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                {profile.prs.maxPullups}
              </div>
              <span className="text-[10px] text-slate-500">reps</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center">
              <span className="text-[11px] font-semibold text-slate-400">Parallel Dips</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                {profile.prs.maxDips}
              </div>
              <span className="text-[10px] text-slate-500">reps</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center">
              <span className="text-[11px] font-semibold text-slate-400">Push-Ups</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                {profile.prs.maxPushups}
              </div>
              <span className="text-[10px] text-slate-500">reps</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center">
              <span className="text-[11px] font-semibold text-slate-400">Plank Hold</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                {profile.prs.maxPlankSeconds}s
              </div>
              <span className="text-[10px] text-slate-500">seconds</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center">
              <span className="text-[11px] font-semibold text-slate-400">Handstand Balance</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                {profile.prs.maxHandstandSeconds}s
              </div>
              <span className="text-[10px] text-slate-500">seconds</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center">
              <span className="text-[11px] font-semibold text-slate-400">Bar Muscle-Up</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                {profile.prs.muscleUpReps}
              </div>
              <span className="text-[10px] text-slate-500">reps</span>
            </div>
          </div>
        )}
      </div>

      {/* Workout History Calendar (Heatmap Visualization) */}
      <WorkoutHistoryCalendar
        logs={logs}
        onQuickLogForDate={handleQuickLogForDate}
      />

      {/* Workout History Log */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              Training Session Log
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological workout sessions with Coach Goyank&apos;s feedback
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Export training history as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Sessions list */}
        {logs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-950/50 border border-slate-800 text-slate-400 text-sm">
            No workouts logged yet. Complete a workout routine or tap &quot;Log Session&quot; to begin!
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              const dateStr = new Date(log.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={log.id}
                  className="rounded-2xl bg-slate-950/80 border border-slate-800/80 overflow-hidden transition-all"
                >
                  <div
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-950 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-500/20">
                        {log.durationMinutes}m
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{dateStr}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-xs text-emerald-400 font-medium">Completed</span>
                        </div>
                        <h3 className="text-base font-bold text-white font-display mt-0.5">
                          {log.routineName}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <span className="text-xs text-slate-400">
                          {log.exercises.length} exercise{log.exercises.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="p-5 border-t border-slate-800/70 bg-slate-900/40 space-y-4">
                      {/* Athlete Post-Workout Notes & RPE if logged */}
                      {(log.sessionRpe || log.postWorkoutNote || log.subjectiveFeeling) && (
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
                          <div className="flex items-center justify-between text-xs border-b border-slate-900 pb-2">
                            <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">
                              Athlete Post-Session Reflections
                            </span>
                            <div className="flex items-center gap-3 text-xs">
                              {log.sessionRpe && (
                                <span className="font-mono text-amber-300 font-bold">
                                  RPE {log.sessionRpe}/10
                                </span>
                              )}
                              {log.subjectiveFeeling && (
                                <span className="capitalize text-slate-300 font-medium">
                                  {log.subjectiveFeeling === 'superb' ? '⚡ Superb' :
                                   log.subjectiveFeeling === 'strong' ? '💪 Strong' :
                                   log.subjectiveFeeling === 'good' ? '👍 Solid' :
                                   log.subjectiveFeeling === 'fatigued' ? '😴 Fatigued' :
                                   '🧘 Stiff'}
                                </span>
                              )}
                            </div>
                          </div>
                          {log.postWorkoutNote && (
                            <p className="text-xs text-slate-200 italic pt-1 leading-relaxed">
                              &ldquo;{log.postWorkoutNote}&rdquo;
                            </p>
                          )}
                        </div>
                      )}

                      {/* Coach Goyank Feedback */}
                      {log.coachFeedback && (
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-amber-400/40 shrink-0">
                            <img
                              src={INSTRUCTOR_GOYANK.avatar}
                              alt={INSTRUCTOR_GOYANK.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="text-xs sm:text-sm text-slate-200">
                            <span className="font-bold text-amber-300">Goyank&apos;s Debrief: </span>
                            {log.coachFeedback}
                          </div>
                        </div>
                      )}

                      {/* Exercise Sets Detail */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Exercise Breakdown
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {log.exercises.map((ex, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                              <div className="font-semibold text-white">{ex.exerciseName}</div>
                              <div className="text-slate-400 text-[11px] mt-1">
                                Sets: {ex.sets.map((s) => `${s.repsOrSeconds} reps (RPE ${s.rpe || 8})`).join(', ') || 'Completed'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delete Option */}
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => onDeleteLog(log.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Log</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Workout Log Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-lg font-bold text-white font-display">
              Log Outdoor or Bar Workout
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Session Title</label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={manualMins}
                  onChange={(e) => setManualMins(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Total Reps Completed</label>
                <input
                  type="number"
                  value={manualReps}
                  onChange={(e) => setManualReps(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowManualModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={submitManualWorkout}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Save Workout Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Progress & Volume Trend Share Modal */}
      {showShareModal && (
        <SocialShareModal
          profile={profile}
          logs={logs}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

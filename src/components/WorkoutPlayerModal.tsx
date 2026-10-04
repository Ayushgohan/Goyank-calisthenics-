import React, { useState, useEffect } from 'react';
import { X, Play, Pause, CheckCircle2, ChevronRight, RotateCcw, Volume2, VolumeX, ShieldAlert, Award, Sparkles, FileText, Activity, Heart } from 'lucide-react';
import { Exercise, WorkoutSessionLog, WorkoutSetLog } from '../types/calisthenics';
import { speechCoach } from '../utils/speechCoach';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';

interface WorkoutPlayerProps {
  routineName: string;
  exercises: Exercise[];
  onClose: () => void;
  onFinishWorkout: (log: WorkoutSessionLog) => void;
}

export const WorkoutPlayerModal: React.FC<WorkoutPlayerProps> = ({
  routineName,
  exercises,
  onClose,
  onFinishWorkout,
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(1);
  const [targetSets] = useState(4);
  const [repsInput, setRepsInput] = useState<number>(8);
  const [rpe, setRpe] = useState<number>(8);
  const [state, setState] = useState<'ready' | 'active' | 'resting' | 'summary'>('ready');

  // Post-workout evaluation state
  const [overallRpe, setOverallRpe] = useState<number>(8);
  const [subjectiveFeeling, setSubjectiveFeeling] = useState<string>('strong');
  const [postWorkoutNote, setPostWorkoutNote] = useState<string>('');

  // Timers
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number>(60);
  const [activeTimerSeconds, setActiveTimerSeconds] = useState<number>(0);
  const [totalWorkoutSeconds, setTotalWorkoutSeconds] = useState<number>(0);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);

  // Completed logs during this session
  const [sessionCompletedSets, setSessionCompletedSets] = useState<{
    [exerciseId: string]: WorkoutSetLog[];
  }>({});

  const currentExercise = exercises[currentExerciseIndex] || exercises[0];

  // Total session clock
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalWorkoutSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Active or Rest Timer Clock
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (state === 'active') {
      timer = setInterval(() => {
        setActiveTimerSeconds((s) => s + 1);
      }, 1000);
    } else if (state === 'resting') {
      timer = setInterval(() => {
        setRestSecondsRemaining((prev) => {
          if (prev <= 1) {
            speechCoach.playBeep('go');
            speechCoach.speak(`Rest over! Set ${currentSetIndex} is up! Let's go!`);
            setState('ready');
            return 60;
          }
          if (prev === 10) {
            speechCoach.playBeep('countdown');
            speechCoach.speak('10 seconds remaining, get in position!');
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state, currentSetIndex]);

  const handleStartSet = () => {
    setState('active');
    setActiveTimerSeconds(0);
    speechCoach.playBeep('go');
    speechCoach.speak(`Set ${currentSetIndex}! Remember: ${currentExercise.goyankTips[0]}!`);
  };

  const handleCompleteSet = () => {
    speechCoach.playBeep('finish');
    const newSet: WorkoutSetLog = {
      setNumber: currentSetIndex,
      repsOrSeconds: repsInput,
      completed: true,
      rpe: rpe,
    };

    const exId = currentExercise.id;
    const existing = sessionCompletedSets[exId] || [];
    const updatedSets = [...existing, newSet];

    setSessionCompletedSets({
      ...sessionCompletedSets,
      [exId]: updatedSets,
    });

    if (currentSetIndex < targetSets) {
      setCurrentSetIndex((prev) => prev + 1);
      setRestSecondsRemaining(60);
      setState('resting');
      speechCoach.speak(`Good work! 60 seconds rest. Shake your arms.`);
    } else {
      // Last set of this exercise
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSetIndex(1);
        setRestSecondsRemaining(90);
        setState('resting');
        speechCoach.speak(`Exercise finished! Moving to ${exercises[currentExerciseIndex + 1].name} next. Take 90 seconds.`);
      } else {
        // Complete Workout
        setState('summary');
        speechCoach.playBeep('finish');
        speechCoach.speak(`Outstanding session! You conquered the routine with Goyank discipline!`);
      }
    }
  };

  const handleSkipRest = () => {
    setState('ready');
    speechCoach.speak(`Rest skipped! Ready for Set ${currentSetIndex}!`);
  };

  const handleAddRestTime = (seconds: number) => {
    setRestSecondsRemaining((prev) => prev + seconds);
  };

  const handleFinalSave = () => {
    const exerciseSessions = exercises.map((ex) => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      sets: sessionCompletedSets[ex.id] || [],
    }));

    const feelingLabel =
      subjectiveFeeling === 'superb' ? 'Feeling fully energized and powerful' :
      subjectiveFeeling === 'strong' ? 'Feeling locked-in and strict' :
      subjectiveFeeling === 'good' ? 'Steady, solid progress' :
      subjectiveFeeling === 'fatigued' ? 'Pushed hard with high muscle fatigue' :
      'Joints & tendons need rest';

    const feedback = `Coach Goyank: Outstanding dedication today on ${routineName}! Rated RPE ${overallRpe}/10 (${feelingLabel}). You logged ${Math.round(
      totalWorkoutSeconds / 60
    )} minutes of strict bodyweight tension.${
      postWorkoutNote.trim() ? ` Goyank noted your debrief: "${postWorkoutNote.trim()}".` : ''
    } Consistency is compounding. Rest well and hydrate!`;

    const feelingRatingNum =
      subjectiveFeeling === 'superb' ? 5 :
      subjectiveFeeling === 'strong' ? 4 :
      subjectiveFeeling === 'good' ? 4 :
      subjectiveFeeling === 'fatigued' ? 3 : 3;

    const log: WorkoutSessionLog = {
      id: `session_${Date.now()}`,
      date: new Date().toISOString(),
      routineName: routineName,
      durationMinutes: Math.max(1, Math.round(totalWorkoutSeconds / 60)),
      exercises: exerciseSessions,
      feelingRating: feelingRatingNum as 1 | 2 | 3 | 4 | 5,
      sessionRpe: overallRpe,
      subjectiveFeeling: subjectiveFeeling,
      postWorkoutNote: postWorkoutNote.trim() || undefined,
      coachFeedback: feedback,
    };

    onFinishWorkout(log);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Workout Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/70 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              LIVE TRAINING SESSION
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white font-display truncate">
              {routineName}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const nextMuted = !audioMuted;
                setAudioMuted(nextMuted);
                speechCoach.setMuted(nextMuted);
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Voice coach sound"
            >
              {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
            <div className="font-mono text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg tabular-nums">
              {formatTime(totalWorkoutSeconds)}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workout Body */}
        {state !== 'summary' ? (
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {/* Exercise progress indicator */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Exercise {currentExerciseIndex + 1} of {exercises.length}
              </span>
              <span>
                Set {currentSetIndex} of {targetSets}
              </span>
            </div>

            {/* Exercise Hero Card */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <div className="h-44 sm:h-52 w-full relative">
                <img
                  src={currentExercise.thumbnail}
                  alt={currentExercise.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                    {currentExercise.category.replace('_', ' ')}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                    {currentExercise.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Goyank Coach Guidance Card */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-amber-400/50 shrink-0">
                <img
                  src={INSTRUCTOR_GOYANK.avatar}
                  alt={INSTRUCTOR_GOYANK.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-xs sm:text-sm">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Coach Goyank Singh Cues:
                </div>
                <p className="text-slate-200 mt-1 leading-relaxed">
                  &ldquo;{currentExercise.goyankTips[0]}&rdquo;
                </p>
              </div>
            </div>

            {/* Main Interactive Stage: Active vs Resting vs Ready */}
            {state === 'resting' ? (
              <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-4">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                  REST INTERVAL
                </span>
                <div className="font-mono text-5xl font-extrabold text-white tracking-tight tabular-nums animate-pulse">
                  {formatTime(restSecondsRemaining)}
                </div>
                <p className="text-xs text-slate-400">
                  Inhale deep, let your heart rate settle. Next is Set {currentSetIndex} of {currentExercise.name}.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleAddRestTime(30)}
                    className="px-3.5 py-1.5 text-xs rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    +30s Rest
                  </button>
                  <button
                    onClick={handleSkipRest}
                    className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
                  >
                    Skip Rest & Go
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Set Performance Logger</span>
                  <span className="text-xs text-amber-400 font-mono">
                    Target: {currentExercise.defaultRepsOrSeconds}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Reps / Sec Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-medium">
                      {currentExercise.isTimed ? 'Seconds Held' : 'Reps Completed'}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setRepsInput((r) => Math.max(1, r - 1))}
                        className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-lg font-bold text-white flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={repsInput}
                        onChange={(e) => setRepsInput(Number(e.target.value))}
                        className="w-full h-10 bg-slate-900 border border-slate-700 rounded-xl text-center font-mono text-lg font-bold text-white focus:outline-none focus:border-amber-400"
                      />
                      <button
                        onClick={() => setRepsInput((r) => r + 1)}
                        className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-lg font-bold text-white flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* RPE Effort */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-medium">
                      Perceived Effort (RPE {rpe}/10)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="10"
                      value={rpe}
                      onChange={(e) => setRpe(Number(e.target.value))}
                      className="w-full mt-3 h-2 bg-slate-800 rounded-lg accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>RPE 5 (Easy)</span>
                      <span>RPE 10 (Failure)</span>
                    </div>
                  </div>
                </div>

                {state === 'ready' ? (
                  <button
                    onClick={handleStartSet}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Start Set {currentSetIndex}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleCompleteSet}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Set ({activeTimerSeconds}s)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Workout Summary Screen */
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto ring-4 ring-amber-500/20">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white font-display">Workout Completed!</h3>
              <p className="text-sm text-slate-400">
                Coached by Goyank Singh · {formatTime(totalWorkoutSeconds)} duration
              </p>
            </div>

            {/* Goyank's Personal Assessment Note */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 text-left space-y-3">
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
                  <h4 className="text-sm font-bold text-amber-300">Coach Goyank Singh&apos;s Review</h4>
                  <span className="text-[11px] text-slate-400">Lead Calisthenics Master</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                &ldquo;Remarkable effort! You maintained high discipline and stayed strict with zero kipping. Your bodyweight control is compounding day by day. Rest well, hydrate, and prepare for our next session!&rdquo;
              </p>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-xs text-slate-400">Total Exercises</span>
                <div className="text-lg font-bold font-mono text-white mt-0.5">
                  {exercises.length}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-xs text-slate-400">Workout Time</span>
                <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                  {Math.round(totalWorkoutSeconds / 60)} mins
                </div>
              </div>
            </div>

            {/* Post-Workout Evaluation: RPE & Subjective Feelings */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Session Exertion & Feelings
                  </span>
                </div>
                <span className="text-xs text-slate-400">Rate your fatigue & effort</span>
              </div>

              {/* RPE Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Overall Session RPE</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-base font-extrabold text-amber-400 tabular-nums">
                      RPE {overallRpe}
                    </span>
                    <span className="text-slate-500 font-mono text-xs">/10</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={overallRpe}
                  onChange={(e) => setOverallRpe(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg accent-amber-500 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    {overallRpe <= 4
                      ? 'Light / Recovery'
                      : overallRpe <= 6
                      ? 'Moderate / Form Focus'
                      : overallRpe <= 8
                      ? 'Hard / 1-2 Reps in Reserve'
                      : overallRpe === 9
                      ? 'Near Failure'
                      : 'Max Effort / Limit'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">1 (Easy) - 10 (Failure)</span>
                </div>
              </div>

              {/* Subjective Feelings Selector */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  How does your body feel right now?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {[
                    { id: 'superb', label: 'Superb', icon: '⚡', desc: 'High energy' },
                    { id: 'strong', label: 'Strong', icon: '💪', desc: 'Locked in' },
                    { id: 'good', label: 'Solid', icon: '👍', desc: 'Steady' },
                    { id: 'fatigued', label: 'Fatigued', icon: '😴', desc: 'Heavy load' },
                    { id: 'stiff', label: 'Stiff', icon: '🧘', desc: 'Needs stretch' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSubjectiveFeeling(item.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        subjectiveFeeling === item.id
                          ? 'bg-amber-500/20 border-amber-500 text-white ring-1 ring-amber-500/40 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <div className="text-base">{item.icon}</div>
                      <div className="font-bold text-[11px] mt-0.5">{item.label}</div>
                      <div className="text-[10px] text-slate-500">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Post-Workout Note Field */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Post-Workout Reflections & Notes
                </label>
                <textarea
                  value={postWorkoutNote}
                  onChange={(e) => setPostWorkoutNote(e.target.value)}
                  placeholder="How did your grip, tendons, and lockouts feel? Any PR breakthroughs or notes for Coach Goyank..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
                <span className="text-[10px] text-slate-500 block">
                  Saved with this session in your Progress History & visible to Coach Goyank.
                </span>
              </div>
            </div>

            <button
              onClick={handleFinalSave}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 active:scale-[0.98] transition-all"
            >
              Save to Progress Tracker
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

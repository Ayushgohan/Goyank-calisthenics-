import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Flame,
  Clock,
  Play,
  RotateCcw,
  Pause,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  X,
  Zap,
  Activity,
} from 'lucide-react';
import { Exercise, MuscleGroup, SkillCategory } from '../types/calisthenics';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';
import { speechCoach } from '../utils/speechCoach';

export interface WarmupStep {
  id: string;
  name: string;
  durationSeconds: number;
  targetJoints: string;
  category: 'synovial' | 'wrist' | 'scapula' | 'core' | 'primer' | 'explosive';
  goyankCue: string;
  movementDescription: string;
}

interface WarmupGeneratorProps {
  exercises: Exercise[];
  routineTitle: string;
  onStartMainWorkout?: () => void;
}

export const WarmupGenerator: React.FC<WarmupGeneratorProps> = ({
  exercises,
  routineTitle,
  onStartMainWorkout,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isRunningModal, setIsRunningModal] = useState<boolean>(false);

  // Analyze day's exercises to dynamically generate tailored 5-min sequence
  const warmupSteps = useMemo<WarmupStep[]>(() => {
    const categories = new Set<SkillCategory>(exercises.map((e) => e.category));
    const allMuscles = new Set<MuscleGroup>(
      exercises.flatMap((e) => [...e.primaryMuscles, ...e.secondaryMuscles])
    );

    const hasPull = categories.has('pull') || allMuscles.has('back') || allMuscles.has('biceps');
    const hasPush = categories.has('push') || categories.has('dip') || allMuscles.has('chest') || allMuscles.has('triceps');
    const hasInversion = categories.has('inversion') || exercises.some((e) => e.id.includes('handstand'));
    const hasLegs = categories.has('legs') || allMuscles.has('legs');

    const steps: WarmupStep[] = [];

    // Step 1: Synovial Fluid & Full Body Cardio Temperature (50s)
    steps.push({
      id: 'step_1_synovial',
      name: 'Dynamic Arm Swings & Light Boxer Bounce',
      durationSeconds: 50,
      targetJoints: 'Cardiovascular & Synovial Fluid',
      category: 'synovial',
      goyankCue: 'Shake out the limbs! Breathe rhythmically through your nose to oxygenate muscle fibers.',
      movementDescription: 'Alternate forward/backward arm crosses across chest while bouncing lightly on the balls of your feet.',
    });

    // Step 2: Wrist & Connective Tissue (50s)
    if (hasInversion || hasPush) {
      steps.push({
        id: 'step_2_wrist_push',
        name: 'Quadruped Wrist Rocks & Knuckle Extensions',
        durationSeconds: 50,
        targetJoints: 'Carpal Ligaments & Flexor Tendons',
        category: 'wrist',
        goyankCue: 'Never hit the bars or floor with cold wrists. Lean over the knuckles gradually.',
        movementDescription: 'On hands and knees, rotate palms inward and backward. Gently pulse hips back to open the flexors.',
      });
    } else {
      steps.push({
        id: 'step_2_wrist_pull',
        name: 'Forearm Supination & Radial Nerve Flossing',
        durationSeconds: 50,
        targetJoints: 'Radial Nerve & Brachioradialis',
        category: 'wrist',
        goyankCue: 'Pulling requires immense grip stamina. Floss your nerves before grabbing the high bar.',
        movementDescription: 'Extend arms straight out, rotate thumbs down and back, then flex wrists forward and back dynamically.',
      });
    }

    // Step 3: Scapular Calibration (50s)
    if (hasPull) {
      steps.push({
        id: 'step_3_scap_pull',
        name: 'Standing Scapular Retraction & Wall Slides',
        durationSeconds: 50,
        targetJoints: 'Lower Trapezius & Rhomboids',
        category: 'scapula',
        goyankCue: 'Lock your elbows straight! Pull your shoulder blades down into your back pockets.',
        movementDescription: 'Keep back flat against wall or upright, pinch shoulder blades together, and slide arms in a W-to-Y pattern.',
      });
    } else if (hasInversion) {
      steps.push({
        id: 'step_3_scap_inversion',
        name: 'Pike Scapular Elevation Shrugs',
        durationSeconds: 50,
        targetJoints: 'Serratus Anterior & Upper Traps',
        category: 'scapula',
        goyankCue: 'Push the ground away with maximum shoulder elevation. Make your neck disappear.',
        movementDescription: 'In downward dog/pike position, shrug shoulders up toward ears without bending elbows.',
      });
    } else {
      steps.push({
        id: 'step_3_scap_push',
        name: 'Prone Scapular Push-Up Protraction Pulses',
        durationSeconds: 50,
        targetJoints: 'Serratus Anterior & Anterior Deltoids',
        category: 'scapula',
        goyankCue: 'Puff out your upper back like an angry cat at the top of each protraction.',
        movementDescription: 'In plank position, keep arms locked straight and squeeze shoulder blades together, then push ceiling away.',
      });
    }

    // Step 4: Core & Pelvic Alignment (50s)
    if (hasLegs) {
      steps.push({
        id: 'step_4_hip_opener',
        name: "World's Greatest Stretch & Deep Squat Pry",
        durationSeconds: 50,
        targetJoints: 'Hip Flexors, Adductors & Ankles',
        category: 'core',
        goyankCue: 'Sink deep into the hip socket. Keep your torso tall and pry knees outward with elbows.',
        movementDescription: 'Deep lunge with thoracic twist toward front knee, transitioning into a deep bottom squat pry.',
      });
    } else {
      steps.push({
        id: 'step_4_hollow_body',
        name: 'Hollow Body Hold & Rocking Activation',
        durationSeconds: 50,
        targetJoints: 'Transverse Abdominis & Pelvic Tilt',
        category: 'core',
        goyankCue: 'Glue your lumbar spine to the floor. Zero daylight under your lower back!',
        movementDescription: 'Lie on back, posterior pelvic tilt, arms overhead, legs hovered 6 inches off ground, rocking gently.',
      });
    }

    // Step 5: Movement Pattern Specific Bar Primer (50s)
    if (hasPull) {
      steps.push({
        id: 'step_5_bar_pull',
        name: 'Passive-to-Active Dead Hang Transitions',
        durationSeconds: 50,
        targetJoints: 'Glenohumeral Joint & Lats',
        category: 'primer',
        goyankCue: 'Hang loose for 2 seconds, then actively engage lats and pull ears away from shoulders for 3 seconds.',
        movementDescription: 'Hang from pull-up bar, alternate relaxing into dead hang and pulling down into active hollow hang.',
      });
    } else if (hasPush) {
      steps.push({
        id: 'step_5_bar_push',
        name: 'Planche Lean Isometric Pulses',
        durationSeconds: 50,
        targetJoints: 'Biceps Tendons & Anterior Delts',
        category: 'primer',
        goyankCue: 'Lean forward until your shoulders pass your wrists. Hold the protraction with locked elbows.',
        movementDescription: 'From push-up plank, lean shoulders forward 2-3 inches past wrist line, hold 3s, and pulse.',
      });
    } else {
      steps.push({
        id: 'step_5_inversion_kick',
        name: 'Wall Mountain Climbers to Hollow Plank',
        durationSeconds: 50,
        targetJoints: 'Full Anterior Kinetic Chain',
        category: 'primer',
        goyankCue: 'Total body tension. Squeeze glutes and press through toes.',
        movementDescription: 'Alternate driving knees to elbows slowly with 2-second isometric holds in hollow plank.',
      });
    }

    // Step 6: Neuromuscular Fire & Readiness (50s)
    steps.push({
      id: 'step_6_explosive',
      name: 'Explosive High Knees to Sprawl Readiness',
      durationSeconds: 50,
      targetJoints: 'Central Nervous System (CNS) Ignition',
      category: 'explosive',
      goyankCue: 'Final gear! Prime your central nervous system for maximal motor unit recruitment.',
      movementDescription: 'High frequency fast-feet marching into light bodyweight sprawls every 10 seconds.',
    });

    return steps;
  }, [exercises]);

  const totalSeconds = warmupSteps.reduce((acc, s) => acc + s.durationSeconds, 0); // 300 seconds = 5 min

  return (
    <>
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              <Flame className="w-6 h-6 text-amber-400 fill-amber-400/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  AUTOMATED WARM-UP GENERATOR
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono text-[10px] border border-amber-500/20">
                  5-Min Biomechanical Prep
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display mt-0.5">
                Dynamic Joint & Tendon Warm-Up
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically adapted for <span className="text-slate-200 font-medium">{routineTitle}</span> ({exercises.length} exercises)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>{isExpanded ? 'Hide Routine' : 'View 6 Steps'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                setIsRunningModal(true);
                speechCoach.speak('Starting your 5-minute dynamic warm-up. First move: Dynamic Arm Swings and Boxer Bounce.');
              }}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Start 5-Min Warm-Up</span>
            </button>
          </div>
        </div>

        {/* Dynamic Warmup Steps Preview List */}
        {isExpanded && (
          <div className="pt-3 border-t border-slate-800/80 space-y-2.5 animate-in fade-in duration-200 text-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1">
              <span>Target Sequence (300s Total)</span>
              <span className="text-amber-400 font-mono font-semibold">6 Intervals × 50s</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {warmupSteps.map((step, idx) => (
                <div
                  key={step.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      <span>{step.name}</span>
                    </div>
                    <span className="font-mono text-amber-400 font-semibold">{step.durationSeconds}s</span>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    <span className="text-slate-500">Joints: </span>
                    <span className="text-slate-300 font-medium">{step.targetJoints}</span>
                  </div>

                  <p className="text-[11px] text-amber-300/90 italic pt-0.5 leading-relaxed">
                    &ldquo;{step.goyankCue}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Guided 5-Minute Warmup Runner Modal */}
      {isRunningModal && (
        <WarmupRunnerModal
          steps={warmupSteps}
          routineTitle={routineTitle}
          onClose={() => setIsRunningModal(false)}
          onFinish={() => {
            setIsRunningModal(false);
            if (onStartMainWorkout) {
              onStartMainWorkout();
            }
          }}
        />
      )}
    </>
  );
};

interface WarmupRunnerModalProps {
  steps: WarmupStep[];
  routineTitle: string;
  onClose: () => void;
  onFinish: () => void;
}

const WarmupRunnerModal: React.FC<WarmupRunnerModalProps> = ({
  steps,
  routineTitle,
  onClose,
  onFinish,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(steps[0].durationSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentStep = steps[currentStepIndex];
  const totalWarmupSeconds = 300;

  // Calculate elapsed seconds across all finished steps + current
  const elapsedSeconds = useMemo(() => {
    let elapsed = 0;
    for (let i = 0; i < currentStepIndex; i++) {
      elapsed += steps[i].durationSeconds;
    }
    elapsed += (currentStep?.durationSeconds || 50) - secondsRemaining;
    return elapsed;
  }, [steps, currentStepIndex, secondsRemaining, currentStep]);

  // Main countdown timer interval
  useEffect(() => {
    if (isPaused || isCompleted) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Time for this step is up!
          if (currentStepIndex < steps.length - 1) {
            const nextIdx = currentStepIndex + 1;
            setCurrentStepIndex(nextIdx);
            const nextStep = steps[nextIdx];
            speechCoach.playBeep('finish');
            if (!isMuted) {
              speechCoach.speak(`Next move: ${nextStep.name}. ${nextStep.goyankCue}`);
            }
            return nextStep.durationSeconds;
          } else {
            // All 5 minutes completed!
            setIsCompleted(true);
            speechCoach.playBeep('finish');
            if (!isMuted) {
              speechCoach.speak('Warm-up complete! Your joints and nervous system are fully primed.');
            }
            return 0;
          }
        }

        // Voice countdown for final 3 seconds
        if (prev === 4 && !isMuted) {
          speechCoach.playBeep('countdown');
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isCompleted, currentStepIndex, steps, isMuted]);

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setSecondsRemaining(steps[nextIdx].durationSeconds);
      if (!isMuted) {
        speechCoach.speak(steps[nextIdx].name);
      }
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      setSecondsRemaining(steps[prevIdx].durationSeconds);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setSecondsRemaining(steps[0].durationSeconds);
    setIsCompleted(false);
    setIsPaused(false);
  };

  const progressPercent = Math.min(100, Math.round((elapsedSeconds / totalWarmupSeconds) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  GUIDED 5-MIN WARM-UP RUNNER
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[10px] border border-amber-500/20">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                {routineTitle} Warm-Up
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isMuted ? 'Unmute Audio Voice Cues' : 'Mute Voice Cues'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global 5-Min Warmup Progress Bar */}
        <div className="w-full bg-slate-950 h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          {!isCompleted ? (
            <div className="space-y-6">
              {/* Giant Countdown & Action Card */}
              <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800/90 text-center space-y-4 relative overflow-hidden">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 font-bold uppercase tracking-wider text-[11px]">
                  <Activity className="w-3.5 h-3.5" />
                  Target: {currentStep.targetJoints}
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display max-w-lg mx-auto">
                  {currentStep.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  {currentStep.movementDescription}
                </p>

                {/* Big Timer Display */}
                <div className="py-4">
                  <div className="text-6xl sm:text-7xl font-mono font-black text-amber-400 tracking-tight tabular-nums">
                    0:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
                  </div>
                  <span className="text-slate-500 text-xs block mt-1 font-mono">
                    Total session time: {Math.floor(elapsedSeconds / 60)}:
                    {elapsedSeconds % 60 < 10 ? `0${elapsedSeconds % 60}` : elapsedSeconds % 60} / 5:00
                  </span>
                </div>

                {/* Coach Goyank Cue Box */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-left max-w-lg mx-auto">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-amber-400/40 shrink-0">
                    <img
                      src={INSTRUCTOR_GOYANK.avatar}
                      alt={INSTRUCTOR_GOYANK.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-xs text-slate-200">
                    <span className="font-bold text-amber-300">Coach Goyank Cue: </span>
                    {currentStep.goyankCue}
                  </div>
                </div>
              </div>

              {/* Next Up Preview */}
              {currentStepIndex < steps.length - 1 && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Next Up:</span>
                  <span className="font-bold text-slate-200">
                    {steps[currentStepIndex + 1].name} ({steps[currentStepIndex + 1].durationSeconds}s)
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Warm-Up Completed Screen */
            <div className="py-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  5-MINUTE WARM-UP COMPLETED
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  Body Primed & Synovial Fluid Warm!
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Your wrists, scapular stabilizers, and central nervous system are fully activated. You are ready to execute your sets with strict lockouts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 max-w-md mx-auto text-left text-xs text-slate-200">
                <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-amber-400/40 shrink-0">
                  <img
                    src={INSTRUCTOR_GOYANK.avatar}
                    alt={INSTRUCTOR_GOYANK.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="font-bold text-amber-300">Goyank: </span>
                  &ldquo;Connective tissues are prepared. Take a deep breath and start your first set with strict form!&rdquo;
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          {!isCompleted ? (
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
                  title="Previous Step"
                >
                  <Rewind className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>

                <button
                  onClick={handleNextStep}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Skip to Next Step"
                >
                  <FastForward className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRestart}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Restart 5-Min Warm-up"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={onFinish}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Launch Main Workout Now</span>
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>

              <button
                onClick={onFinish}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Start Main Workout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

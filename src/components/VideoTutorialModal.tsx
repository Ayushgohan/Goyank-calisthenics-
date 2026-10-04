import React, { useState } from 'react';
import { X, Play, CheckCircle2, AlertTriangle, Sparkles, Layers, Volume2 } from 'lucide-react';
import { Exercise } from '../types/calisthenics';
import { BiomechanicsVisualizer } from './BiomechanicsVisualizer';
import { speechCoach } from '../utils/speechCoach';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';

interface VideoTutorialModalProps {
  exercise: Exercise;
  onClose: () => void;
  onStartExerciseSession: (exercise: Exercise) => void;
}

export const VideoTutorialModal: React.FC<VideoTutorialModalProps> = ({
  exercise,
  onClose,
  onStartExerciseSession,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'biomechanics'>('video');

  const speakCoachingTips = () => {
    const tipText = `Coach Goyank here. For the ${exercise.name}: ${exercise.goyankTips[0]} ${exercise.goyankTips[1] || ''}`;
    speechCoach.speak(tipText, true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-amber-500/40 shrink-0">
              <img
                src={INSTRUCTOR_GOYANK.avatar}
                alt={INSTRUCTOR_GOYANK.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display flex items-center gap-2">
                {exercise.name}
              </h2>
              <p className="text-xs text-slate-400 capitalize">
                {exercise.category.replace('_', ' ')} · {exercise.difficulty} Level · Guided by Goyank Singh
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
          {/* View Mode Toggle: Video vs Biomechanics */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('video')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'video'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                Video Tutorial
              </button>
              <button
                onClick={() => setActiveTab('biomechanics')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'biomechanics'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Form & Angles
              </button>
            </div>

            <button
              onClick={speakCoachingTips}
              className="px-3 py-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl flex items-center gap-1.5 transition-colors"
              title="Listen to Goyank voice cue"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Goyank Audio Cue</span>
            </button>
          </div>

          {/* Media Player Area */}
          {activeTab === 'video' ? (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
              <iframe
                src={`${exercise.videoUrl}?autoplay=0&rel=0&modestbranding=1`}
                title={`${exercise.name} Tutorial`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <BiomechanicsVisualizer exerciseId={exercise.id} exerciseName={exercise.name} />
          )}

          {/* Description & Target Muscles */}
          <div className="space-y-3">
            <p className="text-sm text-slate-300 leading-relaxed">{exercise.description}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400">Primary Muscles:</span>
              {exercise.primaryMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-medium capitalize"
                >
                  {muscle}
                </span>
              ))}
              {exercise.secondaryMuscles.length > 0 && (
                <>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-400">Secondary:</span>
                  {exercise.secondaryMuscles.map((muscle) => (
                    <span
                      key={muscle}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 capitalize"
                    >
                      {muscle}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Goyank Singh's Pro Coaching Cues */}
          <div className="rounded-2xl bg-amber-500/5 border border-amber-500/20 p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <h3>Coach Goyank&apos;s Non-Negotiable Cues</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
              {exercise.goyankTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes to Avoid */}
          <div className="rounded-2xl bg-rose-500/5 border border-rose-500/20 p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <h3>Common Mistakes to Avoid</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {exercise.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Joint Angles Reference */}
          {exercise.jointAngles && exercise.jointAngles.length > 0 && (
            <div className="border border-slate-800 rounded-2xl p-4 space-y-3 bg-slate-950/40">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Precision Joint Targets
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {exercise.jointAngles.map((joint, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-semibold text-white">{joint.name}</div>
                    <div className="text-amber-400 font-mono mt-0.5">{joint.targetAngle}</div>
                    <div className="text-slate-400 text-[11px] mt-1">{joint.cue}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom CTA */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-400 hidden sm:block">
            Target: <span className="text-white font-medium">{exercise.defaultSets} sets × {exercise.defaultRepsOrSeconds}</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onStartExerciseSession(exercise);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Launch Workout Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};

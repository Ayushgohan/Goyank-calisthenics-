import React, { useState } from 'react';
import { Lock, CheckCircle2, Play, Sparkles, Filter, ChevronRight, Target } from 'lucide-react';
import { SkillNode, SkillCategory, Exercise } from '../types/calisthenics';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';

interface SkillTreeProps {
  skills: SkillNode[];
  onUpdateSkillStatus: (skillId: string, status: 'locked' | 'practicing' | 'mastered') => void;
  onOpenTutorial: (exerciseId: string) => void;
  onStartExercise: (exerciseId: string) => void;
}

export const SkillTreeView: React.FC<SkillTreeProps> = ({
  skills,
  onUpdateSkillStatus,
  onOpenTutorial,
  onStartExercise,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(skills[1] || skills[0]);

  const categories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'pull', label: 'Pull Mastery' },
    { id: 'push', label: 'Push & Planche' },
    { id: 'dip', label: 'Bar Dips' },
    { id: 'inversion', label: 'Handstand & Inversions' },
    { id: 'core_static', label: 'Static Holds' },
    { id: 'legs', label: 'Legs & Mobility' },
  ];

  const filteredSkills = skills.filter((skill) => {
    if (selectedCategory === 'all') return true;
    return skill.category === selectedCategory;
  });

  const masteredCount = skills.filter((s) => s.status === 'mastered').length;
  const practicingCount = skills.filter((s) => s.status === 'practicing').length;
  const totalCount = skills.length;
  const progressPercent = Math.round((masteredCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Skill Tree Header & Progress Tracker */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Target className="w-4 h-4" />
            GOYANK&apos;S PROGRESSION ROADMAP
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-display">
            Calisthenics Skill Tree
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every elite skill in calisthenics—from 10 clean pull-ups to the bar muscle-up and planche—is built on strict prerequisites. Unlock each milestone stage by stage.
          </p>
        </div>

        {/* Level Progression Stats */}
        <div className="flex flex-col gap-3 min-w-[240px] p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Overall Tree Mastery</span>
            <span className="text-amber-400 font-bold font-mono tabular-nums">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {masteredCount} Mastered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {practicingCount} In Training
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors border ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-sm'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid: Skill Nodes List + Interactive Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Skill Nodes */}
        <div className="lg:col-span-7 space-y-3">
          {filteredSkills.map((skill) => {
            const isSelected = selectedSkill?.id === skill.id;
            const isMastered = skill.status === 'mastered';
            const isPracticing = skill.status === 'practicing';

            return (
              <div
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500/80 ring-1 ring-amber-500/40 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Status Indicator Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isMastered
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : isPracticing
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {isMastered ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isPracticing ? (
                      <Target className="w-5 h-5" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Level {skill.level} · {skill.category.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white font-display mt-0.5">
                      {skill.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      Requirement: {skill.requirement}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                      isMastered
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : isPracticing
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-slate-500 bg-slate-800'
                    }`}
                  >
                    {skill.status.toUpperCase()}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-slate-500 ${isSelected ? 'text-amber-400' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Skill Deep-Dive Inspector */}
        <div className="lg:col-span-5 sticky top-20">
          {selectedSkill ? (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    SKILL DETAILS · LEVEL {selectedSkill.level}
                  </span>
                  <span className="text-xs text-slate-400 capitalize">
                    {selectedSkill.category.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white font-display mt-1">
                  {selectedSkill.name}
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {selectedSkill.description}
                </p>
              </div>

              {/* Requirement Checkpoint */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Mastery Standard
                </span>
                <p className="text-sm font-medium text-slate-200">
                  {selectedSkill.requirement}
                </p>
              </div>

              {/* Goyank's Secret Tip */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-amber-400/40 shrink-0">
                  <img
                    src={INSTRUCTOR_GOYANK.avatar}
                    alt={INSTRUCTOR_GOYANK.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Coach Goyank&apos;s Key Insight
                  </h4>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                    &ldquo;{selectedSkill.goyankSecret}&rdquo;
                  </p>
                </div>
              </div>

              {/* Status Selector */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-medium">Your Current Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['locked', 'practicing', 'mastered'] as const).map((statusVal) => (
                    <button
                      key={statusVal}
                      onClick={() => onUpdateSkillStatus(selectedSkill.id, statusVal)}
                      className={`py-2 px-1 text-xs font-semibold rounded-xl capitalize transition-colors border ${
                        selectedSkill.status === statusVal
                          ? statusVal === 'mastered'
                            ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                            : statusVal === 'practicing'
                            ? 'bg-amber-500 text-slate-950 border-amber-500'
                            : 'bg-slate-700 text-white border-slate-600'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {statusVal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Video Tutorial & Practice */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onOpenTutorial(selectedSkill.exerciseId)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-amber-400" />
                  <span>View Form Tutorial & Biomechanics</span>
                </button>
                <button
                  onClick={() => onStartExercise(selectedSkill.exerciseId)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-colors"
                >
                  <span>Practice This Skill Now</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
              Select a skill node from the left to view requirements & Goyank&apos;s cues.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

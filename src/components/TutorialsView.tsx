import React, { useState } from 'react';
import { Search, Play, Layers, Eye, Dumbbell } from 'lucide-react';
import { Exercise, SkillCategory, DifficultyLevel } from '../types/calisthenics';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';

interface TutorialsViewProps {
  exercises: Exercise[];
  onOpenTutorial: (exercise: Exercise) => void;
  onStartExercise: (exercise: Exercise) => void;
}

export const TutorialsView: React.FC<TutorialsViewProps> = ({
  exercises,
  onOpenTutorial,
  onStartExercise,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'pull', label: 'Pull' },
    { id: 'push', label: 'Push' },
    { id: 'dip', label: 'Dips' },
    { id: 'inversion', label: 'Inversions' },
    { id: 'core_static', label: 'Static & Core' },
    { id: 'legs', label: 'Legs' },
  ];

  const filtered = exercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.description.toLowerCase().includes(search.toLowerCase()) ||
      ex.primaryMuscles.some((m) => m.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || ex.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Eye className="w-4 h-4" />
            GOYANK&apos;S MASTERCLASS ARCHIVE
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-display">
            Video Tutorials & Form Breakdowns
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every movement recorded with step-by-step cueing, joint biomechanics, and common injury pitfalls to ensure strict, injury-free bodyweight progression.
          </p>
        </div>

        {/* Coach Goyank badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 shrink-0">
          <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-amber-400/40 shrink-0">
            <img
              src={INSTRUCTOR_GOYANK.avatar}
              alt={INSTRUCTOR_GOYANK.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="text-xs font-bold text-white">{INSTRUCTOR_GOYANK.name}</div>
            <div className="text-[11px] text-amber-400">Head Calisthenics Coach</div>
            <div className="text-[10px] text-slate-400">{exercises.length} Master Classes</div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search exercises (e.g. Muscle-Up, Planche, Pull-Up)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Categories Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors border ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((exercise) => (
          <div
            key={exercise.id}
            className="rounded-3xl bg-slate-900 border border-slate-800/90 overflow-hidden flex flex-col group hover:border-slate-700 transition-all shadow-md"
          >
            {/* Image Preview & Video Play Overlay */}
            <div
              onClick={() => onOpenTutorial(exercise)}
              className="relative aspect-video w-full overflow-hidden bg-slate-950 cursor-pointer"
            >
              <img
                src={exercise.thumbnail}
                alt={exercise.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Play Button Trigger */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                </div>
              </div>

              {/* Unboxed Metadata on Card */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-300">
                <span className="capitalize font-semibold text-amber-400">{exercise.category.replace('_', ' ')}</span>
                <span className="capitalize text-slate-300 font-medium">{exercise.difficulty}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3
                  onClick={() => onOpenTutorial(exercise)}
                  className="text-lg font-bold text-white font-display hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {exercise.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {exercise.description}
                </p>

                {/* Goyank Coach Cue Callout */}
                <div className="mt-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px]">
                  <span className="font-semibold text-amber-300">Goyank&apos;s Pro Cue: </span>
                  <span className="text-slate-300">&ldquo;{exercise.goyankTips[0]}&rdquo;</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenTutorial(exercise)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tutorial & Form</span>
                </button>
                <button
                  onClick={() => onStartExercise(exercise)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all"
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>Train</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

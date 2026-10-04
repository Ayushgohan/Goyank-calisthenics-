import React from 'react';
import { Volume2, VolumeX, Award, Bell } from 'lucide-react';
import { UserFitnessProfile } from '../types/calisthenics';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';

interface TopNavigationProps {
  activeTab: 'workouts' | 'skills' | 'tutorials' | 'progress' | 'coach';
  setActiveTab: (tab: 'workouts' | 'skills' | 'tutorials' | 'progress' | 'coach') => void;
  profile: UserFitnessProfile;
  toggleAudio: () => void;
  audioMuted: boolean;
  onOpenAssessment: () => void;
  onOpenReminders?: () => void;
  remindersEnabled?: boolean;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  setActiveTab,
  profile,
  toggleAudio,
  audioMuted,
  onOpenAssessment,
  onOpenReminders,
  remindersEnabled = true,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Zone 1: Brand Wordmark (Single text element in display face) */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setActiveTab('workouts');
        }}
        className="text-lg md:text-xl font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors"
      >
        Goyank Calisthenics
      </a>

      {/* Zone 2: 4-5 Clean Text Nav Links with subtle hover underlines */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
        <button
          onClick={() => setActiveTab('workouts')}
          className={`transition-colors whitespace-nowrap ${
            activeTab === 'workouts'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Workouts
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`transition-colors whitespace-nowrap ${
            activeTab === 'skills'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Skill Tree
        </button>

        <button
          onClick={() => setActiveTab('tutorials')}
          className={`transition-colors whitespace-nowrap ${
            activeTab === 'tutorials'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Tutorials
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          className={`transition-colors whitespace-nowrap ${
            activeTab === 'progress'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Progress
        </button>

        <button
          onClick={() => setActiveTab('coach')}
          className={`transition-colors whitespace-nowrap ${
            activeTab === 'coach'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Coach Goyank
        </button>
      </nav>

      {/* Zone 3: Primary Actions (Audio, Reminders, Assessment CTA, Avatar) */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={toggleAudio}
          title={audioMuted ? 'Unmute Coach Goyank Audio Cues' : 'Mute Voice Coach'}
          className={`p-2 rounded-xl border transition-colors ${
            audioMuted
              ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
          }`}
        >
          {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {onOpenReminders && (
          <button
            onClick={onOpenReminders}
            title="Configure Workout Reminders & Push Notifications"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {remindersEnabled && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-950" />
            )}
          </button>
        )}

        <button
          onClick={onOpenAssessment}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors"
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Level:</span>
          <span className="capitalize text-amber-400 font-semibold">{profile.level}</span>
        </button>

        <button
          onClick={() => setActiveTab('coach')}
          className="relative rounded-full overflow-hidden w-8 h-8 ring-2 ring-amber-500/40 hover:ring-amber-400 transition-all shrink-0"
          title="Coach Goyank Singh"
        >
          <img
            src={INSTRUCTOR_GOYANK.avatar}
            alt="Coach Goyank Singh"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </button>
      </div>
    </header>
  );
};

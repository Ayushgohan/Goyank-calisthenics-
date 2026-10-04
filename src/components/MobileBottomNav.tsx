import React from 'react';
import { Dumbbell, GitFork, Video, LineChart, User } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'workouts' | 'skills' | 'tutorials' | 'progress' | 'coach';
  setActiveTab: (tab: 'workouts' | 'skills' | 'tutorials' | 'progress' | 'coach') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'skills', label: 'Skills', icon: GitFork },
    { id: 'tutorials', label: 'Tutorials', icon: Video },
    { id: 'progress', label: 'Progress', icon: LineChart },
    { id: 'coach', label: 'Goyank', icon: User },
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-2 pb-safe">
      <div className="grid grid-cols-5 items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors"
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'text-amber-400 scale-110' : 'text-slate-500'}`} />
              <span className={`text-[10px] font-medium tracking-tight mt-1 ${isActive ? 'text-amber-400 font-semibold' : 'text-slate-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

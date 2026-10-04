import React, { useState, useEffect } from 'react';
import { TopNavigation } from './components/TopNavigation';
import { MobileBottomNav } from './components/MobileBottomNav';
import { WorkoutsView } from './components/WorkoutsView';
import { SkillTreeView } from './components/SkillTreeView';
import { TutorialsView } from './components/TutorialsView';
import { ProgressDashboard } from './components/ProgressDashboard';
import { CoachProfileView } from './components/CoachProfileView';
import { VideoTutorialModal } from './components/VideoTutorialModal';
import { WorkoutPlayerModal } from './components/WorkoutPlayerModal';
import { PersonalizedAssessmentModal } from './components/PersonalizedAssessmentModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { InAppPushBanner } from './components/InAppPushBanner';
import { AIWorkoutPlanModal } from './components/AIWorkoutPlanModal';
import { notificationService, PushNotificationPayload } from './utils/notificationService';
import {
  EXERCISES,
  SKILL_NODES,
  WORKOUT_PROGRAMS,
  INITIAL_LOGS,
  INITIAL_USER_PROFILE,
  INSTRUCTOR_GOYANK,
} from './data/instructorData';
import {
  Exercise,
  SkillNode,
  WorkoutSessionLog,
  UserFitnessProfile,
  PersonalRecords,
  WorkoutProgram,
} from './types/calisthenics';
import { speechCoach } from './utils/speechCoach';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'workouts' | 'skills' | 'tutorials' | 'progress' | 'coach'>('workouts');

  // Programs State (allows adding AI-generated custom programs)
  const [programs, setPrograms] = useState<WorkoutProgram[]>(() => {
    try {
      const saved = localStorage.getItem('goyank_programs');
      if (saved) {
        const parsed: WorkoutProgram[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((p) => p.id));
        const missing = WORKOUT_PROGRAMS.filter((p) => !existingIds.has(p.id));
        return [...parsed, ...missing];
      }
      return WORKOUT_PROGRAMS;
    } catch {
      return WORKOUT_PROGRAMS;
    }
  });

  // Local Storage Loaded State
  const [profile, setProfile] = useState<UserFitnessProfile>(() => {
    try {
      const saved = localStorage.getItem('goyank_user_profile');
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [skills, setSkills] = useState<SkillNode[]>(() => {
    try {
      const saved = localStorage.getItem('goyank_skills');
      if (saved) {
        const parsed: SkillNode[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((s) => s.id));
        const missing = SKILL_NODES.filter((s) => !existingIds.has(s.id));
        return [...parsed, ...missing];
      }
      return SKILL_NODES;
    } catch {
      return SKILL_NODES;
    }
  });

  const [logs, setLogs] = useState<WorkoutSessionLog[]>(() => {
    try {
      const saved = localStorage.getItem('goyank_workout_logs');
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  });

  // Modals & Interactive Overlays
  const [selectedTutorialExercise, setSelectedTutorialExercise] = useState<Exercise | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<{ title: string; exercises: Exercise[] } | null>(null);
  const [showAssessment, setShowAssessment] = useState<boolean>(false);
  const [showRemindersModal, setShowRemindersModal] = useState<boolean>(false);
  const [showAIPlanModal, setShowAIPlanModal] = useState<boolean>(false);
  const [activePushNotification, setActivePushNotification] = useState<PushNotificationPayload | null>(null);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);

  // Subscribe to Push Notification Service
  useEffect(() => {
    const unsubscribe = notificationService.subscribe((payload) => {
      setActivePushNotification(payload);
    });
    return unsubscribe;
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('goyank_programs', JSON.stringify(programs));
    } catch {
      // storage quota
    }
  }, [programs]);

  useEffect(() => {
    try {
      localStorage.setItem('goyank_user_profile', JSON.stringify(profile));
    } catch {
      // storage quota
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('goyank_skills', JSON.stringify(skills));
    } catch {
      // storage quota
    }
  }, [skills]);

  useEffect(() => {
    try {
      localStorage.setItem('goyank_workout_logs', JSON.stringify(logs));
    } catch {
      // storage quota
    }
  }, [logs]);

  // Audio Toggle
  const toggleAudio = () => {
    const nextMuted = !audioMuted;
    setAudioMuted(nextMuted);
    speechCoach.setMuted(nextMuted);
  };

  // Skill status update
  const handleUpdateSkillStatus = (skillId: string, status: 'locked' | 'practicing' | 'mastered') => {
    setSkills((prev) =>
      prev.map((s) => (s.id === skillId ? { ...s, status } : s))
    );
    if (status === 'mastered') {
      speechCoach.playBeep('finish');
      speechCoach.speak(`Congratulations! You unlocked and mastered a new calisthenics skill!`);
    }
  };

  // Open Tutorial by exercise ID
  const handleOpenTutorialById = (exerciseId: string) => {
    const ex = EXERCISES.find((e) => e.id === exerciseId);
    if (ex) {
      setSelectedTutorialExercise(ex);
    }
  };

  // Start Workout with specific exercise
  const handleStartExercise = (exerciseOrId: Exercise | string) => {
    const ex = typeof exerciseOrId === 'string'
      ? EXERCISES.find((e) => e.id === exerciseOrId)
      : exerciseOrId;
    if (ex) {
      setActiveWorkout({
        title: `${ex.name} Focused Training`,
        exercises: [ex],
      });
    }
  };

  // Start Program Day Routine
  const handleStartProgramDay = (routineTitle: string, programExercises: Exercise[]) => {
    setActiveWorkout({
      title: routineTitle,
      exercises: programExercises,
    });
  };

  // Workout Session Finished
  const handleFinishWorkout = (newLog: WorkoutSessionLog) => {
    setLogs((prev) => [newLog, ...prev]);
    setActiveWorkout(null);
    setActiveTab('progress');
  };

  // PR Updates
  const handleUpdatePRs = (updatedPRs: PersonalRecords) => {
    setProfile((prev) => ({
      ...prev,
      prs: updatedPRs,
    }));
  };

  // Add Manual Log
  const handleAddManualLog = (manualLog: WorkoutSessionLog) => {
    setLogs((prev) => [manualLog, ...prev]);
  };

  // Delete Log
  const handleDeleteLog = (logId: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== logId));
  };

  // Import JSON logs
  const handleImportLogs = (imported: WorkoutSessionLog[]) => {
    setLogs(imported);
  };

  // Add AI-Generated Custom Program
  const handleSaveAIProgram = (newProgram: WorkoutProgram) => {
    setPrograms((prev) => [newProgram, ...prev]);
    setActiveTab('workouts');
    speechCoach.playBeep('finish');
    speechCoach.speak("Custom AI workout split activated! Let's conquer the bar.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20 md:pb-8">
      {/* Universal Top Bar */}
      <TopNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        toggleAudio={toggleAudio}
        audioMuted={audioMuted}
        onOpenAssessment={() => setShowAssessment(true)}
        onOpenReminders={() => setShowRemindersModal(true)}
        remindersEnabled={notificationService.getSettings().enabled}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'workouts' && (
          <WorkoutsView
            programs={programs}
            exercises={EXERCISES}
            profile={profile}
            onStartProgramDay={handleStartProgramDay}
            onOpenTutorial={handleOpenTutorialById}
            onOpenAssessment={() => setShowAssessment(true)}
            onOpenAIGenerator={() => setShowAIPlanModal(true)}
          />
        )}

        {activeTab === 'skills' && (
          <SkillTreeView
            skills={skills}
            onUpdateSkillStatus={handleUpdateSkillStatus}
            onOpenTutorial={handleOpenTutorialById}
            onStartExercise={handleStartExercise}
          />
        )}

        {activeTab === 'tutorials' && (
          <TutorialsView
            exercises={EXERCISES}
            onOpenTutorial={(ex) => setSelectedTutorialExercise(ex)}
            onStartExercise={(ex) => handleStartExercise(ex)}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressDashboard
            profile={profile}
            logs={logs}
            onUpdatePRs={handleUpdatePRs}
            onAddManualLog={handleAddManualLog}
            onDeleteLog={handleDeleteLog}
            onOpenAssessment={() => setShowAssessment(true)}
            onImportLogs={handleImportLogs}
            onOpenReminders={() => setShowRemindersModal(true)}
          />
        )}

        {activeTab === 'coach' && (
          <CoachProfileView
            profile={profile}
            onOpenAssessment={() => setShowAssessment(true)}
            onExplorePrograms={() => setActiveTab('workouts')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 py-8 text-center text-xs text-slate-500 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-amber-400/40">
            <img
              src={INSTRUCTOR_GOYANK.avatar}
              alt={INSTRUCTOR_GOYANK.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span>Goyank Calisthenics · Head Coach Goyank Singh</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Strict form bodyweight training & personalized skill progression
        </p>
      </footer>

      {/* Mobile Bottom Navigation (Ergonomic thumb-zone) */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Local Push Notification Floating Banner */}
      <InAppPushBanner
        notification={activePushNotification}
        onDismiss={() => setActivePushNotification(null)}
        onStartWorkout={() => {
          setActivePushNotification(null);
          handleStartProgramDay("Coach Goyank's Scheduled Daily Calisthenics", [EXERCISES[0], EXERCISES[4]]);
        }}
      />

      {/* Workout Reminders & Push Notification Settings Modal */}
      {showRemindersModal && (
        <NotificationSettingsModal
          onClose={() => setShowRemindersModal(false)}
        />
      )}

      {/* Video & Biomechanics Tutorial Modal */}
      {selectedTutorialExercise && (
        <VideoTutorialModal
          exercise={selectedTutorialExercise}
          onClose={() => setSelectedTutorialExercise(null)}
          onStartExerciseSession={(ex) => {
            setSelectedTutorialExercise(null);
            handleStartExercise(ex);
          }}
        />
      )}

      {/* Live Interactive Workout Session Runner */}
      {activeWorkout && (
        <WorkoutPlayerModal
          routineName={activeWorkout.title}
          exercises={activeWorkout.exercises}
          onClose={() => setActiveWorkout(null)}
          onFinishWorkout={handleFinishWorkout}
        />
      )}

      {/* Personalized Level Assessment Modal */}
      {showAssessment && (
        <PersonalizedAssessmentModal
          currentProfile={profile}
          onClose={() => setShowAssessment(false)}
          onSaveProfile={(updated) => setProfile(updated)}
        />
      )}

      {/* AI Personalized Workout Plan Generator Modal */}
      {showAIPlanModal && (
        <AIWorkoutPlanModal
          profile={profile}
          skills={skills}
          onClose={() => setShowAIPlanModal(false)}
          onSaveProgram={handleSaveAIProgram}
        />
      )}
    </div>
  );
}

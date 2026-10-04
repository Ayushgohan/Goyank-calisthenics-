import React, { useState } from 'react';
import { Bell, X, Check, Volume2, VolumeX, Sparkles, Send, ShieldCheck, Clock, Calendar } from 'lucide-react';
import { ReminderSettings } from '../types/calisthenics';
import { notificationService } from '../utils/notificationService';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';

interface NotificationSettingsModalProps {
  onClose: () => void;
  onSettingsSaved?: (settings: ReminderSettings) => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  onClose,
  onSettingsSaved,
}) => {
  const [settings, setSettings] = useState<ReminderSettings>(() => notificationService.getSettings());
  const [permissionStatus, setPermissionStatus] = useState<ReminderSettings['webPushPermission']>(() =>
    notificationService.checkWebPermission()
  );
  const [testSent, setTestSent] = useState(false);

  const daysOfWeek = [
    { id: 1, label: 'Mon' },
    { id: 2, label: 'Tue' },
    { id: 3, label: 'Wed' },
    { id: 4, label: 'Thu' },
    { id: 5, label: 'Fri' },
    { id: 6, label: 'Sat' },
    { id: 7, label: 'Sun' },
  ];

  const timePresets = [
    { label: 'Morning (07:00)', value: '07:00' },
    { label: 'Midday (12:30)', value: '12:30' },
    { label: 'Sunset (17:30)', value: '17:30' },
    { label: 'Evening (19:30)', value: '19:30' },
  ];

  const handleToggleDay = (dayId: number) => {
    const active = settings.activeDays.includes(dayId);
    let updatedDays: number[];
    if (active) {
      if (settings.activeDays.length === 1) return; // keep at least 1 day
      updatedDays = settings.activeDays.filter((d) => d !== dayId);
    } else {
      updatedDays = [...settings.activeDays, dayId].sort();
    }
    setSettings({ ...settings, activeDays: updatedDays });
  };

  const handleRequestWebPermission = async () => {
    const res = await notificationService.requestWebPermission();
    setPermissionStatus(res);
    setSettings((prev) => ({ ...prev, webPushPermission: res }));
  };

  const handleTestNotification = () => {
    // Save current settings first so test uses current tone/sound
    notificationService.saveSettings(settings);
    notificationService.triggerNotification({
      title: `Coach Goyank: Reminder Test (${settings.coachingTone})`,
      message: `Your push reminders are configured! Goyank will remind you at ${settings.time} on scheduled training days.`
    });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleSave = () => {
    notificationService.saveSettings(settings);
    if (onSettingsSaved) {
      onSettingsSaved(settings);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                Workout Reminders & Push Alerts
              </h2>
              <p className="text-xs text-slate-400">
                Gentle nudges from Coach Goyank Singh to protect your streak
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

        {/* Scrollable Settings Form */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1 text-xs">
          {/* Main Toggle */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-white font-display block">
                Enable Daily Workout Reminders
              </span>
              <span className="text-slate-400 text-xs">
                Receive notifications when your scheduled workout time arrives
              </span>
            </div>
            <button
              onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.enabled ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${
                  settings.enabled ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Preferred Workout Time */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Preferred Workout Time
              </label>
              <span className="font-mono text-amber-400 font-bold">{settings.time}</span>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {timePresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setSettings({ ...settings, time: preset.value })}
                  className={`p-2.5 rounded-xl border text-center font-medium transition-colors ${
                    settings.time === preset.value
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Time Input */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-slate-400 text-xs">Or select exact time:</span>
              <input
                type="time"
                value={settings.time}
                onChange={(e) => setSettings({ ...settings, time: e.target.value })}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Active Training Days */}
          <div className="space-y-3">
            <label className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Active Reminder Days
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {daysOfWeek.map((day) => {
                const isActive = settings.activeDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    onClick={() => handleToggleDay(day.id)}
                    className={`py-2.5 rounded-xl border font-bold text-center transition-colors ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                        : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Goyank's Coaching Tone */}
          <div className="space-y-3">
            <label className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Coach Goyank&apos;s Notification Tone
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'motivational',
                  title: 'Motivational',
                  sample: 'Conquer gravity! Your pull-ups are waiting.',
                },
                {
                  id: 'strict',
                  title: 'Strict Street',
                  sample: 'No excuses. The bars don’t pull themselves.',
                },
                {
                  id: 'gentle',
                  title: 'Gentle & Mindful',
                  sample: 'A light 15-minute bodyweight flow for your joints.',
                },
              ].map((tone) => (
                <div
                  key={tone.id}
                  onClick={() =>
                    setSettings({ ...settings, coachingTone: tone.id as ReminderSettings['coachingTone'] })
                  }
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    settings.coachingTone === tone.id
                      ? 'bg-amber-500/15 border-amber-500 text-white ring-1 ring-amber-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-slate-200 capitalize">{tone.title}</div>
                  <p className="text-[11px] text-slate-400 mt-1 italic">&ldquo;{tone.sample}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sound & Web Notification Permission Options */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            {/* Audio chime toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-amber-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <span>Play Goyank Audio Chime on Reminder</span>
              </div>
              <button
                onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  settings.soundEnabled ? 'bg-amber-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${
                    settings.soundEnabled ? 'left-5.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Web Push Notification Permission */}
            <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-3">
              <div>
                <span className="text-slate-300 font-medium block">
                  Browser Desktop Notifications
                </span>
                <span className="text-[11px] text-slate-500">
                  Status:{' '}
                  <span className="capitalize text-amber-400 font-semibold">{permissionStatus}</span>
                </span>
              </div>

              {permissionStatus !== 'granted' && (
                <button
                  onClick={handleRequestWebPermission}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Enable Browser Push
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleTestNotification}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-amber-400" />
            <span>{testSent ? 'Reminder Fired!' : 'Test Reminder Now'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all"
            >
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Bell, X, Play, Clock, Sparkles } from 'lucide-react';
import { PushNotificationPayload } from '../utils/notificationService';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';

interface InAppPushBannerProps {
  notification: PushNotificationPayload | null;
  onDismiss: () => void;
  onStartWorkout: () => void;
}

export const InAppPushBanner: React.FC<InAppPushBannerProps> = ({
  notification,
  onDismiss,
  onStartWorkout,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setVisible(true);
      // Auto-hide after 14 seconds if unaddressed
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, 14000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [notification, onDismiss]);

  if (!notification || !visible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-6 md:w-[420px] z-50 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl p-4 sm:p-5 text-white ring-1 ring-amber-500/20">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Coach Goyank Avatar with pulsing notification ring */}
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-amber-400 shrink-0 bg-slate-950">
              <img
                src={INSTRUCTOR_GOYANK.avatar}
                alt="Coach Goyank"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                <Bell className="w-2.5 h-2.5 fill-slate-950" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  GOYANK PUSH REMINDER
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-[10px] text-slate-400">Just now</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-display mt-0.5">
                {notification.title}
              </h4>
            </div>
          </div>

          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onDismiss, 300);
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notification Body Text */}
        <p className="text-xs text-slate-300 mt-2.5 leading-relaxed pl-1">
          {notification.message}
        </p>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2 pt-3.5 mt-3 border-t border-slate-800/80">
          <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Scheduled workout time
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setVisible(false);
                setTimeout(onDismiss, 300);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Later
            </button>
            <button
              onClick={() => {
                setVisible(false);
                setTimeout(onDismiss, 300);
                onStartWorkout();
              }}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Start Workout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

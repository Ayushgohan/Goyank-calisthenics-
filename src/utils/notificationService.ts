import { ReminderSettings } from '../types/calisthenics';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';
import { speechCoach } from './speechCoach';

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: true,
  time: '17:30', // 5:30 PM
  activeDays: [1, 2, 3, 4, 5], // Monday through Friday
  coachingTone: 'motivational',
  soundEnabled: true,
  webPushPermission: typeof window !== 'undefined' && 'Notification' in window
    ? (Notification.permission as ReminderSettings['webPushPermission'])
    : 'unsupported',
};

export interface PushNotificationPayload {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  tone: ReminderSettings['coachingTone'];
}

type NotificationListener = (payload: PushNotificationPayload) => void;

class NotificationService {
  private settings: ReminderSettings = DEFAULT_REMINDER_SETTINGS;
  private listeners: Set<NotificationListener> = new Set();
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.loadSettings();
    this.startScheduler();
  }

  public loadSettings(): ReminderSettings {
    if (typeof window === 'undefined') return DEFAULT_REMINDER_SETTINGS;
    try {
      const stored = localStorage.getItem('goyank_reminder_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.settings = {
          ...DEFAULT_REMINDER_SETTINGS,
          ...parsed,
          webPushPermission: this.checkWebPermission(),
        };
      } else {
        this.settings = {
          ...DEFAULT_REMINDER_SETTINGS,
          webPushPermission: this.checkWebPermission(),
        };
      }
    } catch {
      this.settings = DEFAULT_REMINDER_SETTINGS;
    }
    return this.settings;
  }

  public saveSettings(newSettings: ReminderSettings) {
    this.settings = { ...newSettings };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('goyank_reminder_settings', JSON.stringify(this.settings));
      } catch {
        // storage quota
      }
    }
  }

  public getSettings(): ReminderSettings {
    return { ...this.settings };
  }

  public checkWebPermission(): ReminderSettings['webPushPermission'] {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission as ReminderSettings['webPushPermission'];
  }

  public async requestWebPermission(): Promise<ReminderSettings['webPushPermission']> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    try {
      const result = await Notification.requestPermission();
      this.settings.webPushPermission = result as ReminderSettings['webPushPermission'];
      this.saveSettings(this.settings);
      return this.settings.webPushPermission;
    } catch {
      return 'denied';
    }
  }

  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getRandomMessage(tone: ReminderSettings['coachingTone']): { title: string; body: string } {
    if (tone === 'strict') {
      const messages = [
        {
          title: "Coach Goyank: No Excuses Today",
          body: "The bars don't pull themselves. 20 minutes of strict form keeps your progress unbroken."
        },
        {
          title: "Goyank's Roll Call: Time to Train",
          body: "Zero kipping, full dead-hang lockouts. Step up to the bars and log your sets."
        },
        {
          title: "Daily Calisthenics Invariant",
          body: "Momentum is built by showing up daily. Your bodyweight workout starts now."
        }
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    } else if (tone === 'gentle') {
      const messages = [
        {
          title: "Coach Goyank: Gentle Workout Reminder",
          body: "A short 15-minute bodyweight mobility & pull session will keep your joints feeling light and energetic."
        },
        {
          title: "Mindful Movement with Goyank",
          body: "Take a deep breath and connect with your body. Ready for today's gentle calisthenics practice?"
        },
        {
          title: "Time for Pure Bodyweight Flow",
          body: "Listen to your tendons, enjoy the movement, and take pride in each clean repetition."
        }
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    } else {
      // motivational
      const messages = [
        {
          title: "Coach Goyank: Ready to Conquer Gravity?",
          body: "Your daily calisthenics workout is waiting! Let's build that tendon resilience and protect your streak."
        },
        {
          title: "Goyank Singh: Time to Shine on the Bar",
          body: "Every strict pull-up compounds into your future muscle-up. Let's get in the zone today!"
        },
        {
          title: "Daily Street Workout Check-In",
          body: "Consistency is what separates dreamers from masters. 25 minutes of bodyweight power today!"
        }
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
  }

  public triggerNotification(customPayload?: Partial<PushNotificationPayload>) {
    const { title, body } = this.getRandomMessage(this.settings.coachingTone);

    const payload: PushNotificationPayload = {
      id: `push_${Date.now()}`,
      title: customPayload?.title || title,
      message: customPayload?.message || body,
      timestamp: new Date(),
      tone: this.settings.coachingTone,
    };

    // Play subtle audio alert if sound is enabled
    if (this.settings.soundEnabled) {
      speechCoach.playBeep('finish');
    }

    // 1. Fire Web Notification if browser allowed
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(payload.title, {
          body: payload.message,
          icon: INSTRUCTOR_GOYANK.avatar,
          badge: INSTRUCTOR_GOYANK.avatar,
        });
      } catch {
        // Fallback to in-app notification silently
      }
    }

    // 2. Broadcast in-app push banner to all listeners
    this.listeners.forEach((listener) => {
      try {
        listener(payload);
      } catch {
        // ignore
      }
    });

    // Mark today as notified
    const today = new Date().toISOString().slice(0, 10);
    this.settings.lastNotifiedDate = today;
    this.saveSettings(this.settings);
  }

  private startScheduler() {
    if (this.intervalId) return;

    // Check every 30 seconds
    this.intervalId = setInterval(() => {
      if (!this.settings.enabled) return;

      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      // Convert day: 1 = Mon, ..., 7 = Sun
      const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
      const todayDateStr = now.toISOString().slice(0, 10);

      // Check if day is active
      if (!this.settings.activeDays.includes(dayOfWeek)) return;

      // Check if time matches
      if (currentTimeStr === this.settings.time) {
        // Ensure we only notify once per day
        if (this.settings.lastNotifiedDate !== todayDateStr) {
          this.triggerNotification();
        }
      }
    }, 30000);
  }

  public stopScheduler() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const notificationService = new NotificationService();

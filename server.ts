import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI with aistudio-build user-agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Route: AI-Powered Calisthenics Workout Plan Generator
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { profile, skills, preferredDays } = req.body;

    const userLevel = profile?.level || 'intermediate';
    const userGoal = profile?.goal || 'muscle_up';
    const levelScore = profile?.levelScore || 65;
    const frequency = preferredDays || profile?.weeklyTargetSessions || 4;
    const prs = profile?.prs || {};

    const practicingSkills = (skills || [])
      .filter((s: { status: string }) => s.status === 'practicing')
      .map((s: { name: string }) => s.name)
      .join(', ') || 'Strict Pull-Ups, Bar Dips';

    const masteredSkills = (skills || [])
      .filter((s: { status: string }) => s.status === 'mastered')
      .map((s: { name: string }) => s.name)
      .join(', ') || 'Push-Ups, Australian Rows';

    const systemPrompt = `You are Coach Goyank Singh, an elite master street workout and calisthenics instructor.
You build strict, zero-kipping, biomechanically sound bodyweight training splits.
The athlete details:
- Current Level: ${userLevel} (Score: ${levelScore}/100)
- Primary Goal: ${userGoal}
- Preferred Frequency: ${frequency} workout days per week
- Personal Records: Pull-ups: ${prs.maxPullups || 8}, Dips: ${prs.maxDips || 12}, Push-ups: ${prs.maxPushups || 25}, Handstand: ${prs.maxHandstandSeconds || 15}s
- Skills Currently Practicing: ${practicingSkills}
- Skills Mastered: ${masteredSkills}

Create a personalized weekly calisthenics training split tailored to this athlete.
Include Coach Goyank's coaching rationale, tendon protection protocol, and day-by-day routines with specific exercises, sets, reps (or hold seconds), rest times, and coaching tips.`;

    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: systemPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Title of the program' },
              tagline: { type: Type.STRING, description: 'Motivational motto or subtitle' },
              frequencyDaysPerWeek: { type: Type.NUMBER, description: 'Number of workout days' },
              durationWeeks: { type: Type.NUMBER, description: 'Recommended program duration' },
              goyankRationale: { type: Type.STRING, description: "Goyank's explanation of why this split fits the athlete" },
              tendonRecoveryAdvice: { type: Type.STRING, description: 'Joint, wrist, and tendon recovery protocols' },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayNumber: { type: Type.NUMBER },
                    title: { type: Type.STRING, description: 'e.g. Day 1: Upper Body Pull & Lever Foundation' },
                    focus: { type: Type.STRING, description: 'Primary muscle or movement focus' },
                    isRestDay: { type: Type.BOOLEAN, description: 'Whether this day is dedicated rest or active recovery' },
                    recoveryActivity: { type: Type.STRING, description: 'Optional mobility/stretching if rest day' },
                    exercises: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING, description: 'Exercise name' },
                          sets: { type: Type.NUMBER },
                          repsOrSeconds: { type: Type.STRING, description: 'e.g. 6-8 reps or 20s hold' },
                          restSeconds: { type: Type.NUMBER, description: 'Rest between sets in seconds' },
                          notes: { type: Type.STRING, description: "Goyank's form cue" },
                        },
                        required: ['name', 'sets', 'repsOrSeconds', 'restSeconds'],
                      },
                    },
                  },
                  required: ['dayNumber', 'title', 'focus'],
                },
              },
            },
            required: ['title', 'tagline', 'frequencyDaysPerWeek', 'goyankRationale', 'days'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, plan: parsed });
    }

    // High quality intelligent fallback if key is not provided in environment
    const fallbackPlan = generateFallbackPlan(userLevel, userGoal, frequency, practicingSkills);
    return res.json({ success: true, plan: fallbackPlan, source: 'coach_rule_engine' });
  } catch (error: any) {
    console.error('Error in /api/generate-plan:', error);
    // Fallback gracefully so user never sees a broken UI
    const fallbackPlan = generateFallbackPlan('intermediate', 'muscle_up', 4, 'Bar Dips & Pull-Ups');
    return res.json({ success: true, plan: fallbackPlan, source: 'fallback_engine', error: error?.message });
  }
});

function generateFallbackPlan(level: string, goal: string, frequency: number, practicingSkills: string) {
  return {
    title: `Goyank's Custom ${level.toUpperCase()} Progressive Split`,
    tagline: `Targeted Calisthenics Blueprint for ${goal.replace('_', ' ').toUpperCase()}`,
    frequencyDaysPerWeek: frequency,
    durationWeeks: 6,
    goyankRationale: `Engineered specifically for your ${level} baseline and active progression on ${practicingSkills}. This split optimizes upper body push-pull leverage balance while giving the biceps tendons and wrists 48 hours between high-stress hanging sessions.`,
    tendonRecoveryAdvice: 'Perform 5 minutes of wrist extension circles and shoulder dislocates with a light band prior to every session. Hydrate well to keep connective tissues supple.',
    days: [
      {
        dayNumber: 1,
        title: 'Day 1: Strict Pull Power & Scapular Control',
        focus: 'Vertical Pulling & Hollow Body Geometry',
        isRestDay: false,
        exercises: [
          { name: 'Strict Dead-Hang Pull-Ups', sets: 4, repsOrSeconds: '6-8 reps', restSeconds: 90, notes: 'Full lock at bottom, collarbone to bar.' },
          { name: 'Scapular Pull-Up Retractions', sets: 3, repsOrSeconds: '10 reps', restSeconds: 60, notes: 'Isolate lats without bending elbows.' },
          { name: 'Hollow Body Hold', sets: 3, repsOrSeconds: '30s hold', restSeconds: 60, notes: 'Lower back pinned to floor.' }
        ]
      },
      {
        dayNumber: 2,
        title: 'Day 2: Parallel Bar Dip & Overhead Pressing',
        focus: 'Horizontal & Vertical Pushing',
        isRestDay: false,
        exercises: [
          { name: 'Strict Parallel Bar Dips', sets: 4, repsOrSeconds: '8-10 reps', restSeconds: 90, notes: '90-degree elbow bend, full lockout.' },
          { name: 'Decline Diamond Push-Ups', sets: 3, repsOrSeconds: '12 reps', restSeconds: 60, notes: 'Focus on triceps extension.' },
          { name: 'Pike Push-Ups', sets: 3, repsOrSeconds: '8 reps', restSeconds: 75, notes: 'Elevate hips over shoulders.' }
        ]
      },
      {
        dayNumber: 3,
        title: 'Day 3: Active Rest & Wrist Mobility',
        focus: 'Connective Tissue Recovery',
        isRestDay: true,
        recoveryActivity: '15 minutes wrist flexor stretching, dead hangs for decompression, and light foam rolling.',
        exercises: []
      },
      {
        dayNumber: 4,
        title: 'Day 4: Skill Progression & Lever Holds',
        focus: 'Isometric Tension & Straight-Arm Strength',
        isRestDay: false,
        exercises: [
          { name: 'Tuck Front Lever Hold', sets: 4, repsOrSeconds: '12-15s hold', restSeconds: 90, notes: 'Retract scapulae, lock elbows.' },
          { name: 'Planche Lean Protraction', sets: 3, repsOrSeconds: '20s hold', restSeconds: 60, notes: 'Lean past wrists, round upper back.' },
          { name: 'L-Sit on Parallettes', sets: 3, repsOrSeconds: '15s hold', restSeconds: 60, notes: 'Toes pointed, depress shoulders.' }
        ]
      },
      {
        dayNumber: 5,
        title: 'Day 5: Full Body Bodyweight Circuit',
        focus: 'Muscular Endurance & Conditioning',
        isRestDay: false,
        exercises: [
          { name: 'Australian Horizontal Rows', sets: 4, repsOrSeconds: '12 reps', restSeconds: 60, notes: 'Chest to low bar, scapular squeeze.' },
          { name: 'Pistol Squat Progressions', sets: 3, repsOrSeconds: '6 reps/leg', restSeconds: 60, notes: 'Controlled eccentric.' },
          { name: 'Walking Plank to Push-Up', sets: 3, repsOrSeconds: '10 reps', restSeconds: 60, notes: 'Keep hips completely stable.' }
        ]
      }
    ]
  };
}

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Goyank Calisthenics Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

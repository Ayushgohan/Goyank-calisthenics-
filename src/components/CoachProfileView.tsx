import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, Award, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';
import { speechCoach } from '../utils/speechCoach';
import { UserFitnessProfile } from '../types/calisthenics';
import { NutritionInsights } from './NutritionInsights';

interface CoachProfileProps {
  profile: UserFitnessProfile;
  onOpenAssessment: () => void;
  onExplorePrograms: () => void;
}

export const CoachProfileView: React.FC<CoachProfileProps> = ({
  profile,
  onOpenAssessment,
  onExplorePrograms,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handlePlayVoice = (text: string) => {
    speechCoach.speak(text, true);
  };

  const faqs = [
    {
      q: "How do I prevent elbow tendinitis / golfer's elbow when training pull-ups & muscle-ups?",
      a: "Elbow pain in calisthenics usually comes from two errors: flaring elbows wide and attempting high-volume straight arm moves before bicep tendons adapt. Always warm up your forearms with wrist push-ups, keep elbows angled at 45 degrees, and use resistance bands to deload early tendon conditioning."
    },
    {
      q: "Why do you ban kipping and swinging in your programs?",
      a: "Kipping uses hip momentum to throw your mass past sticking points. That robs your lats, deltoids, and core of the neuromuscular tension needed to adapt. Strict, slow dead-hang repetitions build bulletproof connective tissue and genuine bodyweight power that translates directly into planche and levers."
    },
    {
      q: "How long does it realistically take to get the first clean muscle-up?",
      a: "If you have a solid foundation of 10 strict dead-hang pull-ups and 15 deep parallel dips, you can unlock the muscle-up in 4 to 8 weeks by drilling high chest-to-bar pulls, straight-bar dip transitions, and negative eccentrics."
    },
    {
      q: "What is the secret to holding a straight planche without back arch?",
      a: "It's all in the scapulae and hips. You must achieve maximum scapular protraction (pushing your upper back to the sky) paired with a posterior pelvic tilt (squeezing your glutes and curling your pelvis under). Straight arm strength is built through progressive planche leans."
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Showcase of Coach Goyank Singh */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          {/* Coach Goyank Photo Column */}
          <div className="md:col-span-5 relative h-72 sm:h-96 md:h-full min-h-[340px] bg-slate-950">
            <img
              src={INSTRUCTOR_GOYANK.avatar}
              alt="Coach Goyank Singh"
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-900" />
            <div className="absolute bottom-4 left-4 right-4 md:hidden">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                HEAD INSTRUCTOR
              </span>
              <h2 className="text-2xl font-bold text-white font-display">
                {INSTRUCTOR_GOYANK.name}
              </h2>
            </div>
          </div>

          {/* Coach Bio & Mission Column */}
          <div className="md:col-span-7 p-6 sm:p-8 md:p-10 space-y-5">
            <div className="hidden md:block">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                HEAD CALISTHENICS INSTRUCTOR
              </span>
              <h1 className="text-3xl font-extrabold text-white font-display mt-1">
                {INSTRUCTOR_GOYANK.name}
              </h1>
              <p className="text-xs text-amber-300/90 font-medium">
                Street Workout & Bodyweight Strength Specialist
              </p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {INSTRUCTOR_GOYANK.bio}
            </p>

            {/* Goyank Quote Box */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Goyank&apos;s Core Philosophy
                </span>
                <button
                  onClick={() => handlePlayVoice(INSTRUCTOR_GOYANK.quote)}
                  className="p-1 rounded-lg text-amber-300 hover:text-white hover:bg-amber-500/20 transition-colors"
                  title="Listen to quote"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 italic leading-relaxed">
                &ldquo;{INSTRUCTOR_GOYANK.quote}&rdquo;
              </p>
            </div>

            {/* Specialties Badges */}
            <div className="flex flex-wrap gap-2 text-xs">
              {INSTRUCTOR_GOYANK.disciplines.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-medium"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onOpenAssessment}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-colors"
              >
                <Award className="w-4 h-4" />
                <span>Get Evaluated by Goyank</span>
              </button>
              <button
                onClick={onExplorePrograms}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
              >
                Explore Training Routines
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Goyank Method */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white font-display">
          The 4 Pillars of the Goyank Bodyweight System
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="text-sm font-bold text-white font-display">Zero Momentum</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every pull-up and dip starts from a dead stop. No kipping, no leg drive. Pure contractile recruitment.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="text-sm font-bold text-white font-display">Scapular Command</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Before your elbows bend, your shoulder blades must actively depress and retract or protract depending on the leverage.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="text-sm font-bold text-white font-display">Tendon Conditioning</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Straight-arm static holds like planche and front lever place heavy torque on bicep tendons. We pace recovery methodically.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="text-sm font-bold text-white font-display">Full-Body Radiance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pencil-straight legs, pointed toes, and posterior pelvic tilt. Neurological irradiation makes your body feel 20% lighter.
            </p>
          </div>
        </div>
      </div>

      {/* Calisthenics Nutrition & Recovery Insights Component */}
      <NutritionInsights profile={profile} />

      {/* Goyank's Daily Coach Cues & Tips */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          Goyank&apos;s Daily Street Workout Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-200">
          {INSTRUCTOR_GOYANK.dailyTips.map((tip, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h2 className="text-lg font-bold text-white font-display">
          Calisthenics Q&A with Coach Goyank
        </h2>
        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 bg-slate-900/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

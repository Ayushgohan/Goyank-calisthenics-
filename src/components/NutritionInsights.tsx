import React, { useState, useMemo } from 'react';
import {
  Utensils,
  Flame,
  Droplets,
  Activity,
  Sparkles,
  Volume2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  Info,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { UserFitnessProfile } from '../types/calisthenics';
import { speechCoach } from '../utils/speechCoach';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';

interface NutritionInsightsProps {
  profile: UserFitnessProfile;
}

type CalisthenicsDietStrategy = 'power_to_weight' | 'tendon_recovery' | 'lean_hypertrophy';

export const NutritionInsights: React.FC<NutritionInsightsProps> = ({ profile }) => {
  // Unit toggle
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  // Estimated default weight based on level and goal (e.g. 72kg / 158 lbs)
  const [weightKg, setWeightKg] = useState<number>(72);

  // Strategy default based on user profile goal
  const defaultStrategy: CalisthenicsDietStrategy = useMemo(() => {
    if (profile.goal === 'muscle_up' || profile.goal === 'first_pullup') return 'power_to_weight';
    if (profile.goal === 'planche' || profile.goal === 'handstand') return 'tendon_recovery';
    return 'lean_hypertrophy';
  }, [profile.goal]);

  const [strategy, setStrategy] = useState<CalisthenicsDietStrategy>(defaultStrategy);

  // Weight display & adjustment
  const currentWeightDisplay = unit === 'kg' ? weightKg : Math.round(weightKg * 2.20462);

  const handleWeightChange = (newVal: number) => {
    if (unit === 'kg') {
      setWeightKg(Math.max(45, Math.min(130, newVal)));
    } else {
      setWeightKg(Math.max(45, Math.min(130, Math.round(newVal / 2.20462))));
    }
  };

  // Calculations based on Calisthenics Biomechanics
  const nutritionData = useMemo(() => {
    const weeklySessions = profile.weeklyTargetSessions || 4;

    // Basal Metabolic Rate estimate (Mifflin-St Jeor avg)
    const bmr = 10 * weightKg + 6.25 * 175 - 5 * 26 + 5; // avg adult male height 175cm, age 26
    // Activity Multiplier for bodyweight calisthenics athletes
    const activityMultiplier = weeklySessions >= 5 ? 1.55 : weeklySessions >= 4 ? 1.45 : 1.35;
    const tdee = Math.round(bmr * activityMultiplier);

    let targetCalories = tdee;
    let proteinPerKg = 2.0;
    let fatPerKg = 0.9;
    let strategyTitle = 'Lean Power-to-Weight';
    let strategyDesc = 'Optimizes strength-to-bodyweight ratio for effortless pull-ups and levers by keeping body fat low and muscle dense.';

    if (strategy === 'power_to_weight') {
      targetCalories = Math.round(tdee * 0.95); // 5% mild deficit / high leanness
      proteinPerKg = 2.2; // higher protein preserves muscle during leanness
      fatPerKg = 0.85;
      strategyTitle = 'Power-to-Weight Ratio Maximizer';
      strategyDesc = 'Calibrated to shred dead ballast without losing explosive vertical pull power. Maximum muscle density with zero superfluous mass.';
    } else if (strategy === 'tendon_recovery') {
      targetCalories = tdee; // Maintenance
      proteinPerKg = 2.0;
      fatPerKg = 1.0; // Higher essential fats for joint lubrication & inflammation reduction
      strategyTitle = 'Tendon & Connective Tissue Fortification';
      strategyDesc = 'Maintenance fueling focused on tenocyte collagen synthesis, joint cartilage turgor, and soothing high-torque bicep stress.';
    } else {
      // lean_hypertrophy
      targetCalories = Math.round(tdee * 1.10); // +10% surplus
      proteinPerKg = 1.9;
      fatPerKg = 0.95;
      strategyTitle = 'Clean Calisthenics Hypertrophy';
      strategyDesc = 'Controlled surplus designed to pack functional lat, delt, and pectoral mass without degrading bar leverage.';
    }

    const proteinGrams = Math.round(weightKg * proteinPerKg);
    const fatGrams = Math.round(weightKg * fatPerKg);

    const proteinCalories = proteinGrams * 4;
    const fatCalories = fatGrams * 9;
    const remainingCaloriesForCarbs = Math.max(400, targetCalories - (proteinCalories + fatCalories));
    const carbGrams = Math.round(remainingCaloriesForCarbs / 4);

    // Hydration calculation: 45ml per kg for active calisthenics
    const waterLiters = (weightKg * 0.045).toFixed(1);

    const proteinPct = Math.round((proteinCalories / targetCalories) * 100);
    const fatPct = Math.round((fatCalories / targetCalories) * 100);
    const carbPct = Math.max(10, 100 - proteinPct - fatPct);

    return {
      tdee,
      targetCalories,
      proteinGrams,
      carbGrams,
      fatGrams,
      waterLiters,
      proteinPct,
      carbPct,
      fatPct,
      strategyTitle,
      strategyDesc,
    };
  }, [weightKg, strategy, profile.weeklyTargetSessions]);

  // Voice narration by Coach Goyank
  const handlePlayVoice = () => {
    const text = `Coach Goyank's nutrition prescription for ${profile.name}: At your current bodyweight of ${currentWeightDisplay} ${unit}, your daily target is ${nutritionData.targetCalories} calories, with ${nutritionData.proteinGrams} grams of protein, ${nutritionData.carbGrams} grams of carbohydrates, and ${nutritionData.fatGrams} grams of healthy fats. Remember, in street workout, extra body fat is just dead weight on the pull-up bar. Keep your nutrition clean and drink at least ${nutritionData.waterLiters} liters of water for joint protection!`;
    speechCoach.speak(text, true);
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0">
            <Utensils className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                CALISTHENICS NUTRITION & RECOVERY BLUEPRINT
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono text-[10px] border border-amber-500/20">
                Personalized
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white font-display mt-0.5">
              Daily Calorie & Macro Target Engine
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tailored for <span className="capitalize text-slate-200 font-semibold">{profile.level}</span> level ({profile.levelScore}/100) · Primary Goal: <span className="text-amber-400 capitalize">{profile.goal.replace('_', ' ')}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handlePlayVoice}
          className="px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-2 transition-all self-start sm:self-auto shrink-0 shadow-sm"
          title="Listen to Coach Goyank's Nutrition Prescription"
        >
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span>Listen to Goyank&apos;s Advice</span>
        </button>
      </div>

      {/* Interactive Controls Row: Strategy Selector & Weight Adjuster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Strategy Selector (8 cols) */}
        <div className="lg:col-span-8 space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Calisthenics Fueling Strategy
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'power_to_weight' as const, label: 'Power-to-Weight', sub: 'Maximum Leanness' },
              { id: 'tendon_recovery' as const, label: 'Tendon Repair', sub: 'Joint & Collagen Prep' },
              { id: 'lean_hypertrophy' as const, label: 'Lean Mass', sub: 'Functional Lat/Chest' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setStrategy(item.id);
                  speechCoach.playBeep('countdown');
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  strategy === item.id
                    ? 'bg-amber-500/15 border-amber-500 text-white ring-1 ring-amber-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-slate-200">{item.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{item.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Bodyweight Adjuster (4 cols) */}
        <div className="lg:col-span-4 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Your Bodyweight:</span>
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[11px]">
              <button
                onClick={() => setUnit('kg')}
                className={`px-2 py-0.5 rounded font-bold ${unit === 'kg' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
              >
                KG
              </button>
              <button
                onClick={() => setUnit('lbs')}
                className={`px-2 py-0.5 rounded font-bold ${unit === 'lbs' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
              >
                LBS
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <input
              type="range"
              min={unit === 'kg' ? 50 : 110}
              max={unit === 'kg' ? 115 : 250}
              value={currentWeightDisplay}
              onChange={(e) => handleWeightChange(Number(e.target.value))}
              className="flex-1 accent-amber-500 cursor-pointer"
            />
            <span className="font-mono text-base font-extrabold text-amber-400 shrink-0">
              {currentWeightDisplay} {unit}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block">
            Used to calibrate exact protein grams and hydration turgor.
          </span>
        </div>
      </div>

      {/* Goyank Strategy Note Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-slate-200 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-amber-400/40 shrink-0 bg-slate-950">
          <img
            src={INSTRUCTOR_GOYANK.avatar}
            alt="Coach Goyank"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <span className="font-bold text-amber-300">{nutritionData.strategyTitle}: </span>
          <span className="text-slate-300">{nutritionData.strategyDesc}</span>
        </div>
      </div>

      {/* Target Metric Cards (4 Cards: Calories, Protein, Carbs, Fats) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Calories Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Daily Calories</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mt-1">
            {nutritionData.targetCalories.toLocaleString()}
          </div>
          <span className="text-[11px] text-amber-400 font-semibold block">
            kcal / day target
          </span>
          <span className="text-[10px] text-slate-500 block">
            TDEE baseline: {nutritionData.tdee} kcal
          </span>
        </div>

        {/* Protein Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Daily Protein</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 mt-1">
            {nutritionData.proteinGrams}g
          </div>
          <span className="text-[11px] text-slate-300 font-medium block">
            {nutritionData.proteinPct}% of total calories
          </span>
          <span className="text-[10px] text-slate-500 block">
            {(nutritionData.proteinGrams / weightKg).toFixed(1)}g / kg bodyweight
          </span>
        </div>

        {/* Carbohydrates Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Carbohydrates</span>
            <Zap className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-400 mt-1">
            {nutritionData.carbGrams}g
          </div>
          <span className="text-[11px] text-slate-300 font-medium block">
            {nutritionData.carbPct}% (Glycogen fuel)
          </span>
          <span className="text-[10px] text-slate-500 block">
            Powers explosive muscle-up pulls
          </span>
        </div>

        {/* Healthy Fats Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Essential Fats</span>
            <Droplets className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300 mt-1">
            {nutritionData.fatGrams}g
          </div>
          <span className="text-[11px] text-slate-300 font-medium block">
            {nutritionData.fatPct}% (Joint lubrication)
          </span>
          <span className="text-[10px] text-slate-500 block">
            Hormonal & tendon health
          </span>
        </div>
      </div>

      {/* Macro Ratio Visual Bar */}
      <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Macronutrient Calorie Distribution</span>
          <span className="text-slate-500">100% Macro Total</span>
        </div>
        <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-900">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${nutritionData.proteinPct}%` }}
            title={`Protein: ${nutritionData.proteinPct}%`}
          />
          <div
            className="h-full bg-sky-500 transition-all duration-300"
            style={{ width: `${nutritionData.carbPct}%` }}
            title={`Carbs: ${nutritionData.carbPct}%`}
          />
          <div
            className="h-full bg-amber-400 transition-all duration-300"
            style={{ width: `${nutritionData.fatPct}%` }}
            title={`Fats: ${nutritionData.fatPct}%`}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] pt-1">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Protein: {nutritionData.proteinGrams}g ({nutritionData.proteinPct}%)
          </span>
          <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            Carbs: {nutritionData.carbGrams}g ({nutritionData.carbPct}%)
          </span>
          <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Fats: {nutritionData.fatGrams}g ({nutritionData.fatPct}%)
          </span>
        </div>
      </div>

      {/* Tendon Fortification & Connective Tissue Protocol */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tendon Protocol Box */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            Coach Goyank&apos;s Tendon Nutrition Protocol
          </div>
          <h3 className="text-base font-bold text-white font-display">
            Connective Tissue & Collagen Matrix
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tendons receive roughly 1/10th the blood flow of muscles. To prevent golfer&apos;s elbow and distal bicep strain during heavy straight-arm levers:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Pre-Workout Collagen (15g): </strong>
                Take hydrolyzed collagen peptides with 50mg Vitamin C 45 minutes prior to pulling sessions to stimulate tenocyte extracellular matrix synthesis.
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Hydration & Cartilage Turgor: </strong>
                Drink a minimum of <span className="text-amber-400 font-mono font-bold">{nutritionData.waterLiters} Liters</span> of water daily. Dehydrated fascia tears under rapid eccentric loads.
              </span>
            </div>
          </div>
        </div>

        {/* Daily Fueling Timing Blueprint */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            Calisthenics Meal Timing Blueprint
          </div>
          <h3 className="text-base font-bold text-white font-display">
            Workout Day Nutrient Timing
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
              <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 font-bold text-[10px] flex items-center justify-center font-mono shrink-0">
                1
              </span>
              <div>
                <strong className="text-white">60-90 Min Pre-Bar: </strong>
                Fast-clearing carbohydrates (banana, oatmeal, rice cake) + 25g whey/plant protein. Zero heavy fats to prevent sluggishness during inversions.
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
              <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 font-bold text-[10px] flex items-center justify-center font-mono shrink-0">
                2
              </span>
              <div>
                <strong className="text-white">Within 45 Min Post-Bar: </strong>
                High-leucine meal with 35-40g protein + complex carbohydrates (sweet potatoes or rice) to immediately halt muscle breakdown.
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
              <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 font-bold text-[10px] flex items-center justify-center font-mono shrink-0">
                3
              </span>
              <div>
                <strong className="text-white">Pre-Sleep Recovery: </strong>
                350mg Magnesium Bisglycinate + slow-digesting protein (cottage cheese/casein) for nocturnal connective tissue cellular repair.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Eye, ShieldCheck, Flame } from 'lucide-react';

interface BiomechanicsProps {
  exerciseId: string;
  exerciseName: string;
}

export const BiomechanicsVisualizer: React.FC<BiomechanicsProps> = ({ exerciseId, exerciseName }) => {
  const [phase, setPhase] = useState<number>(50); // 0 (start) to 100 (peak/lockout)
  const [showTensionMap, setShowTensionMap] = useState<boolean>(true);

  // Derive kinematics based on exercise and phase
  const getKinematics = () => {
    const t = phase / 100; // 0 to 1

    if (exerciseId === 'strict_pullup') {
      // Bar at top y = 40, hang from y = 140 down to y = 70
      const headY = 130 - t * 75;
      const shoulderY = headY + 18;
      const elbowAngle = Math.round(180 - t * 135); // 180 deg to 45 deg
      const scapulaState = t > 0.1 ? 'Active Depressed' : 'Passive Dead Hang';
      const latEngagement = Math.round(40 + t * 60);

      return {
        title: 'Pull-Up Biomechanics',
        scapulaState,
        primaryAngle: `${elbowAngle}°`,
        angleLabel: 'Elbow Joint Angle',
        tension: `${latEngagement}% Lat & Bicep Load`,
        cues: [
          t < 0.2 ? 'Initiate with scapular depression before elbow flexion' : 'Elbows driving down to ribs',
          t > 0.8 ? 'Chin completely cleared over bar, zero leg kick' : 'Hollow body engaged, toes pointed'
        ],
        svg: (
          <svg viewBox="0 0 280 260" className="w-full h-56 select-none">
            {/* Calisthenics Bar */}
            <rect x="20" y="32" width="240" height="6" rx="3" fill="#64748b" />
            <circle cx="100" cy="35" r="4" fill="#f59e0b" />
            <circle cx="180" cy="35" r="4" fill="#f59e0b" />
            <text x="140" y="24" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">STEEL HIGH BAR</text>

            {/* Arms from bar to shoulders */}
            {/* Left Hand: 100, 35 -> Left Shoulder */}
            {/* Right Hand: 180, 35 -> Right Shoulder */}
            {(() => {
              const leftShoulderX = 120 - t * 6;
              const rightShoulderX = 160 + t * 6;
              const leftElbowX = 100 - t * 18;
              const rightElbowX = 180 + t * 18;
              const elbowY = (35 + shoulderY) / 2 + (1 - t) * 10;

              return (
                <g>
                  {/* Tension glow if enabled */}
                  {showTensionMap && (
                    <path
                      d={`M ${leftShoulderX} ${shoulderY} Q 140 ${shoulderY + 30} ${rightShoulderX} ${shoulderY}`}
                      stroke="#f59e0b"
                      strokeWidth="12"
                      strokeOpacity={0.15 + t * 0.35}
                      strokeLinecap="round"
                    />
                  )}

                  {/* Left Arm */}
                  <line x1="100" y1="35" x2={leftElbowX} y2={elbowY} stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                  <line x1={leftElbowX} y1={elbowY} x2={leftShoulderX} y2={shoulderY} stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                  <circle cx={leftElbowX} cy={elbowY} r="4" fill="#0284c7" />

                  {/* Right Arm */}
                  <line x1="180" y1="35" x2={rightElbowX} y2={elbowY} stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                  <line x1={rightElbowX} y1={elbowY} x2={rightShoulderX} y2={shoulderY} stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                  <circle cx={rightElbowX} cy={elbowY} r="4" fill="#0284c7" />

                  {/* Head */}
                  <circle cx="140" cy={headY} r="12" fill="#e2e8f0" />
                  <line x1="140" y1={headY + 12} x2="140" y2={shoulderY} stroke="#e2e8f0" strokeWidth="4" />

                  {/* Torso */}
                  <line x1="140" y1={shoulderY} x2="140" y2={shoulderY + 50} stroke="#f8fafc" strokeWidth="5" strokeLinecap="round" />

                  {/* Pelvis / Hips */}
                  <circle cx="140" cy={shoulderY + 50} r="5" fill="#f59e0b" />

                  {/* Legs in hollow body tilt */}
                  <line x1="140" y1={shoulderY + 50} x2="137" y2={shoulderY + 95} stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
                  <line x1="137" y1={shoulderY + 95} x2="133" y2={shoulderY + 130} stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Angle readout marker at Left Elbow */}
                  <text x={leftElbowX - 12} y={elbowY + 4} fill="#38bdf8" fontSize="10" fontWeight="700" textAnchor="end">
                    {elbowAngle}°
                  </text>
                </g>
              );
            })()}
          </svg>
        )
      };
    } else if (exerciseId === 'freestanding_handstand') {
      // Inverted Handstand
      const wobble = Math.sin(t * Math.PI * 4) * 4 * (1 - t * 0.7);
      const shoulderAngle = Math.round(160 + t * 20); // 160 to 180 locked
      return {
        title: 'Handstand Alignment Biomechanics',
        scapulaState: 'Elevated & Shrugged to Ears',
        primaryAngle: `${shoulderAngle}°`,
        angleLabel: 'Shoulder Flexion Alignment',
        tension: 'Active Finger Claw Tension',
        cues: [
          'Stack wrists, shoulders, hips, and ankles in one plumb line',
          'Shrug shoulders hard into the floor—avoid sinking'
        ],
        svg: (
          <svg viewBox="0 0 280 260" className="w-full h-56 select-none">
            {/* Ground */}
            <line x1="30" y1="230" x2="250" y2="230" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <text x="140" y="248" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">PARALLETTE / FLOOR LINE</text>

            {/* Plumb alignment reference line */}
            <line x1="140" y1="30" x2="140" y2="230" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity={0.4} />

            {/* Hands at 230 */}
            <circle cx="115" cy="230" r="4" fill="#f59e0b" />
            <circle cx="165" cy="230" r="4" fill="#f59e0b" />

            {/* Arms up to shoulders at y=170 */}
            <line x1="115" y1="230" x2="122" y2="175" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <line x1="165" y1="230" x2="158" y2="175" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />

            {/* Head looking slightly between thumbs */}
            <circle cx="140" cy="188" r="10" fill="#e2e8f0" />

            {/* Torso stacked up to hips at y=120 */}
            <line x1="140" y1="175" x2={140 + wobble * 0.5} y2="120" stroke="#f8fafc" strokeWidth="5" strokeLinecap="round" />

            {/* Legs straight up to feet at y=45 */}
            <line x1={140 + wobble * 0.5} y1="120" x2={140 + wobble} y2="45" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
            <circle cx={140 + wobble} cy="45" r="4" fill="#10b981" />

            <text x={140 + wobble + 12} y="48" fill="#10b981" fontSize="9" fontWeight="700">TOES POINTED</text>
            <text x="75" y="175" fill="#38bdf8" fontSize="10" fontWeight="700">{shoulderAngle}° OPEN</text>
          </svg>
        )
      };
    } else if (exerciseId === 'planche_lean') {
      // Planche lean
      const forwardLeanDegrees = Math.round(40 + t * 25); // 40° to 65°
      const leanOffset = t * 35;
      return {
        title: 'Planche Lean Biomechanics',
        scapulaState: 'Maximum Scapular Protraction',
        primaryAngle: `${forwardLeanDegrees}°`,
        angleLabel: 'Shoulder Forward Lean',
        tension: `${Math.round(50 + t * 50)}% Anterior Deltoid Load`,
        cues: [
          'Push the earth away to dome your upper back like a shell',
          'Elbow pits rotated completely forward, straight arm lock'
        ],
        svg: (
          <svg viewBox="0 0 280 260" className="w-full h-56 select-none">
            {/* Ground */}
            <line x1="20" y1="210" x2="260" y2="210" stroke="#475569" strokeWidth="4" />
            <text x="140" y="235" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">HORIZONTAL BASE</text>

            {/* Wrist contact at (120, 210) */}
            <circle cx="120" cy="210" r="5" fill="#f59e0b" />
            <line x1="120" y1="210" x2="120" y2="100" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity={0.3} />

            {/* Straight arm leaning forward to (120 - leanOffset, 140) */}
            <line x1="120" y1="210" x2={120 - leanOffset} y2="140" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
            <circle cx={120 - leanOffset} cy="140" r="5" fill="#0284c7" />

            {/* Head */}
            <circle cx={105 - leanOffset} cy="130" r="10" fill="#e2e8f0" />

            {/* Protracted domed spine to hips at (180 - leanOffset*0.3, 145) */}
            <path
              d={`M ${120 - leanOffset} 140 Q ${150 - leanOffset * 0.6} 128 ${185 - leanOffset * 0.4} 150`}
              stroke="#f8fafc"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Legs extended back to toes at (240, 210) */}
            <line x1={185 - leanOffset * 0.4} y1="150" x2="240" y2="210" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
            <circle cx="240" cy="210" r="4" fill="#94a3b8" />

            <text x={120 - leanOffset - 8} y="120" fill="#38bdf8" fontSize="10" fontWeight="700">
              {forwardLeanDegrees}° LEAN
            </text>
          </svg>
        )
      };
    } else {
      // Parallel Bar Dips or general push
      const elbowAngle = Math.round(180 - t * 90);
      const dipY = 100 + t * 45;
      return {
        title: `${exerciseName} Mechanics`,
        scapulaState: t > 0.8 ? 'Deep Stretch Depression' : 'Active Top Lockout',
        primaryAngle: `${elbowAngle}°`,
        angleLabel: 'Elbow Flexion',
        tension: `${Math.round(45 + t * 55)}% Tricep & Chest Load`,
        cues: [
          'Maintain 15-20° forward torso lean to keep chest loaded',
          'Lock elbows firmly at the top without shrugging shoulders'
        ],
        svg: (
          <svg viewBox="0 0 280 260" className="w-full h-56 select-none">
            {/* Dip Bars */}
            <line x1="60" y1="140" x2="220" y2="140" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
            <text x="140" y="24" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">PARALLEL DIP BARS</text>

            {/* Hands on bars */}
            <circle cx="100" cy="140" r="5" fill="#f59e0b" />
            <circle cx="180" cy="140" r="5" fill="#f59e0b" />

            {/* Upper body descending */}
            <line x1="100" y1="140" x2="85" y2={dipY} stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <line x1="85" y1={dipY} x2="115" y2={dipY - 20} stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />

            <circle cx="140" cy={dipY - 32} r="11" fill="#e2e8f0" />
            <line x1="140" y1={dipY - 20} x2="148" y2={dipY + 35} stroke="#f8fafc" strokeWidth="5" strokeLinecap="round" />
            <line x1="148" y1={dipY + 35} x2="142" y2={dipY + 80} stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />

            <text x="75" y={dipY} fill="#38bdf8" fontSize="10" fontWeight="700">
              {elbowAngle}°
            </text>
          </svg>
        )
      };
    }
  };

  const data = getKinematics();

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            Coach Goyank&apos;s Form & Biomechanics Visualizer
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Drag slider to examine joint angles & tension distribution</p>
        </div>
        <button
          onClick={() => setShowTensionMap(!showTensionMap)}
          className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
            showTensionMap
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            Tension Map
          </span>
        </button>
      </div>

      {/* SVG Canvas */}
      <div className="relative rounded-xl bg-slate-950/80 border border-slate-800/80 overflow-hidden flex items-center justify-center p-2">
        {data.svg}

        {/* Live metric badge overlays */}
        <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs">
          <span className="text-slate-400">{data.angleLabel}: </span>
          <span className="font-mono font-bold text-amber-400 tabular-nums">{data.primaryAngle}</span>
        </div>

        <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300 font-medium">{data.scapulaState}</span>
        </div>
      </div>

      {/* Interactive Phase Scrubber */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Rep Phase:</span>
          <span className="font-mono text-slate-200 tabular-nums font-semibold">
            {phase < 20 ? 'Setup / Dead Hang' : phase > 80 ? 'Peak Contraction / Lockout' : 'Dynamic Transit (50%)'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={phase}
          onChange={(e) => setPhase(Number(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>0% (Extension)</span>
          <span>50% (Transition)</span>
          <span>100% (Apex)</span>
        </div>
      </div>

      {/* Coach Goyank Real-time Cue */}
      <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
        <p className="text-amber-300 font-medium mb-1">Goyank&apos;s Active Biomechanic Cue:</p>
        <p className="text-slate-300 leading-relaxed">{data.cues[phase > 50 ? 1 : 0]}</p>
      </div>
    </div>
  );
};

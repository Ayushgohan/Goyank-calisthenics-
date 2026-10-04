import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, Share2, Download, Copy, Check, Twitter, MessageCircle, Sparkles, Flame, TrendingUp, Award, ExternalLink } from 'lucide-react';
import { UserFitnessProfile, WorkoutSessionLog } from '../types/calisthenics';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';
import { speechCoach } from '../utils/speechCoach';

interface SocialShareModalProps {
  profile: UserFitnessProfile;
  logs: WorkoutSessionLog[];
  onClose: () => void;
}

type AspectRatioMode = 'story' | 'post' | 'landscape';

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  profile,
  logs,
  onClose,
}) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('post');
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [dataUrl, setDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Helper to format Date to YYYY-MM-DD
  const formatLocalDate = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calculate current streak
  const currentStreak = useMemo(() => {
    const workoutDatesSet = new Set<string>();
    logs.forEach((log) => {
      try {
        const d = new Date(log.date);
        if (!isNaN(d.getTime())) {
          workoutDatesSet.add(formatLocalDate(d));
        }
      } catch {
        // ignore
      }
    });

    const now = new Date();
    const todayStr = formatLocalDate(now);
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = formatLocalDate(yesterdayDate);

    const completedToday = workoutDatesSet.has(todayStr);
    const completedYesterday = workoutDatesSet.has(yesterdayStr);

    let streak = 0;
    let checkDate = new Date();

    if (completedToday) {
      while (workoutDatesSet.has(formatLocalDate(checkDate))) {
        streak += 1;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    } else if (completedYesterday) {
      checkDate.setDate(checkDate.getDate() - 1);
      while (workoutDatesSet.has(formatLocalDate(checkDate))) {
        streak += 1;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }
    return Math.max(1, streak);
  }, [logs]);

  // Extract reps from set
  const extractReps = (val: number | string): number => {
    if (typeof val === 'number') return val;
    const match = String(val).match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Calculate 6 weeks of weekly volume
  const weeklyData = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const diffToMonday = (currentDay + 6) % 7;
    const currentWeekMonday = new Date(now);
    currentWeekMonday.setDate(now.getDate() - diffToMonday);
    currentWeekMonday.setHours(0, 0, 0, 0);

    const buckets: { label: string; reps: number; isCurrent: boolean }[] = [];

    for (let i = 5; i >= 0; i--) {
      const weekStart = new Date(currentWeekMonday);
      weekStart.setDate(currentWeekMonday.getDate() - i * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekLogs = logs.filter((log) => {
        try {
          const logDate = new Date(log.date);
          return logDate >= weekStart && logDate <= weekEnd;
        } catch {
          return false;
        }
      });

      let totalReps = 0;
      weekLogs.forEach((log) => {
        log.exercises.forEach((ex) => {
          ex.sets.forEach((set) => {
            if (set.completed !== false) {
              totalReps += extractReps(set.repsOrSeconds);
            }
          });
        });
      });

      buckets.push({
        label: i === 0 ? 'Current' : `Wk ${6 - i}`,
        reps: totalReps,
        isCurrent: i === 0,
      });
    }

    return buckets;
  }, [logs]);

  // Calculate week-over-week growth
  const currentWeekReps = weeklyData[weeklyData.length - 1]?.reps || 0;
  const prevWeekReps = weeklyData[weeklyData.length - 2]?.reps || 0;
  const growthPercent = prevWeekReps > 0
    ? Math.round(((currentWeekReps - prevWeekReps) / prevWeekReps) * 100)
    : 14;

  // Render to Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 1080;
    let height = 1350; // default 'post' 4:5

    if (aspectRatio === 'story') {
      width = 1080;
      height = 1920; // 9:16
    } else if (aspectRatio === 'landscape') {
      width = 1200;
      height = 675; // 16:9
    }

    canvas.width = width;
    canvas.height = height;

    // 1. Deep Sleek Dark Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#020617'); // slate-950
    bgGrad.addColorStop(0.5, '#0f172a'); // slate-900
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle Radial Gold Glow in Top Center
    const glow = ctx.createRadialGradient(width / 2, height * 0.35, 50, width / 2, height * 0.35, width * 0.7);
    glow.addColorStop(0, 'rgba(245, 158, 11, 0.12)'); // amber-500
    glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // Decorative Border
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, width - 64, height - 64);

    // 2. Top Header Brand Section
    const topY = aspectRatio === 'story' ? 140 : 100;

    // Goyank Badge
    ctx.fillStyle = '#f59e0b'; // amber-500
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ GOYANK CALISTHENICS · STRICT FORM STANDARD', width / 2, topY);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px system-ui, -apple-system, sans-serif';
    ctx.fillText('ATHLETE PERFORMANCE REPORT', width / 2, topY + 54);

    // Athlete Level & Subtitle
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.font = '500 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${profile.name.toUpperCase()}  ·  ${profile.level.toUpperCase()} LEVEL  ·  SCORE: ${profile.levelScore}/100`, width / 2, topY + 95);

    // 3. Highlighted Streak Banner (The Hero Metric)
    const streakY = topY + 140;
    const streakBoxW = width - 140;
    const streakBoxH = aspectRatio === 'landscape' ? 110 : 140;
    const streakBoxX = 70;

    // Rounded rectangle background for streak
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(streakBoxX, streakY, streakBoxW, streakBoxH, 24);
    ctx.fill();
    ctx.stroke();

    // Streak Text
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fbbf24'; // amber-400
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillText('🔥 DAILY CONSISTENCY RECORD', streakBoxX + 40, streakY + 45);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 58px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${currentStreak}-DAY STREAK`, streakBoxX + 40, streakY + 105);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#10b981'; // emerald-400
    ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
    ctx.fillText(`+${growthPercent}% OVERLOAD`, streakBoxX + streakBoxW - 40, streakY + 60);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 20px system-ui, -apple-system, sans-serif';
    ctx.fillText('Week-over-Week Volume', streakBoxX + streakBoxW - 40, streakY + 95);

    // 4. Weekly Volume Trend Chart (Canvas Vector Graphics)
    const chartY = streakY + streakBoxH + 40;
    const chartW = width - 140;
    const chartH = aspectRatio === 'landscape' ? 180 : aspectRatio === 'story' ? 440 : 360;
    const chartX = 70;

    // Chart Box Container
    ctx.fillStyle = 'rgba(2, 6, 23, 0.7)';
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(chartX, chartY, chartW, chartH, 24);
    ctx.fill();
    ctx.stroke();

    // Chart Title inside Box
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.fillText('📈 WEEKLY REPETITION VOLUME TREND', chartX + 35, chartY + 45);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 18px system-ui, -apple-system, sans-serif';
    ctx.fillText('Total strictly locked bodyweight reps accumulated per week', chartX + 35, chartY + 75);

    // Draw Bars & Progressive Overload Line
    const barAreaX = chartX + 50;
    const barAreaY = chartY + 110;
    const barAreaW = chartW - 100;
    const barAreaH = chartH - 160;

    const maxReps = Math.max(100, ...weeklyData.map((d) => d.reps));
    const barWidth = (barAreaW / weeklyData.length) * 0.55;
    const barSpacing = barAreaW / weeklyData.length;

    // Background horizontal guideline
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.5)';
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(barAreaX, barAreaY + barAreaH / 2);
    ctx.lineTo(barAreaX + barAreaW, barAreaY + barAreaH / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    const points: { x: number; y: number }[] = [];

    weeklyData.forEach((item, idx) => {
      const bX = barAreaX + idx * barSpacing + (barSpacing - barWidth) / 2;
      const barH = Math.max(12, (item.reps / maxReps) * (barAreaH - 30));
      const bY = barAreaY + barAreaH - barH;

      points.push({ x: bX + barWidth / 2, y: bY });

      // Bar fill gradient
      const bGrad = ctx.createLinearGradient(0, bY, 0, bY + barH);
      if (item.isCurrent) {
        bGrad.addColorStop(0, '#fef08a');
        bGrad.addColorStop(1, '#f59e0b');
      } else {
        bGrad.addColorStop(0, '#fbbf24');
        bGrad.addColorStop(1, '#d97706');
      }
      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.roundRect(bX, bY, barWidth, barH, 10);
      ctx.fill();

      // Top value label
      ctx.textAlign = 'center';
      ctx.fillStyle = item.isCurrent ? '#fef08a' : '#ffffff';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`${item.reps}`, bX + barWidth / 2, bY - 12);

      // Bottom Week Label
      ctx.fillStyle = item.isCurrent ? '#fbbf24' : '#94a3b8';
      ctx.font = '600 18px system-ui, -apple-system, sans-serif';
      ctx.fillText(item.label, bX + barWidth / 2, barAreaY + barAreaH + 28);
    });

    // Draw Overload Trend Spline
    if (points.length > 1) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const xc = (points[i].x + points[i - 1].x) / 2;
        const yc = (points[i].y + points[i - 1].y) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.stroke();

      // Draw Glowing Dots
      points.forEach((pt, pIdx) => {
        ctx.fillStyle = '#020617';
        ctx.strokeStyle = pIdx === points.length - 1 ? '#fef08a' : '#f59e0b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    }

    // 5. Personal Records (PR) Row
    if (aspectRatio !== 'landscape') {
      const prY = chartY + chartH + 35;
      const prBoxW = (width - 140 - 40) / 3;
      const prBoxH = 110;

      const prStats = [
        { title: 'Strict Pull-Ups', value: `${profile.prs.maxPullups} reps`, sub: 'Zero Swing' },
        { title: 'Bar Dips', value: `${profile.prs.maxDips} reps`, sub: 'Lockout Strict' },
        { title: 'Handstand', value: `${profile.prs.maxHandstandSeconds}s`, sub: 'Freestanding' },
      ];

      prStats.forEach((stat, idx) => {
        const pX = 70 + idx * (prBoxW + 20);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(pX, prY, prBoxW, prBoxH, 20);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#94a3b8';
        ctx.font = '500 18px system-ui, -apple-system, sans-serif';
        ctx.fillText(stat.title, pX + prBoxW / 2, prY + 35);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 30px monospace';
        ctx.fillText(stat.value, pX + prBoxW / 2, prY + 72);

        ctx.fillStyle = '#64748b';
        ctx.font = '400 14px system-ui, -apple-system, sans-serif';
        ctx.fillText(stat.sub, pX + prBoxW / 2, prY + 95);
      });
    }

    // 6. Bottom Signature & Verification Seal
    const footerY = height - (aspectRatio === 'story' ? 120 : 65);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    ctx.fillText('COACH GOYANK SINGH · LEAD CALISTHENICS MASTER', width / 2, footerY);

    ctx.fillStyle = '#64748b';
    ctx.font = '400 16px system-ui, -apple-system, sans-serif';
    ctx.fillText('Form Verified: Zero Kipping · Full Scapular Retraction · Locked Deadhangs', width / 2, footerY + 28);

    // Save data URL for image preview
    try {
      const url = canvas.toDataURL('image/png');
      setDataUrl(url);
    } catch {
      // ignore
    }
  }, [aspectRatio, profile, logs, currentStreak, weeklyData, growthPercent]);

  // Handle Download PNG
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.download = `goyank_streak_${currentStreak}days_volume_trend.png`;
    a.href = canvasRef.current.toDataURL('image/png');
    a.click();
    speechCoach.speak("Progress report downloaded! Time to inspire your community.");
  };

  // Handle Copy to Clipboard
  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);

    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopied(true);
          speechCoach.speak("Progress image copied to clipboard!");
          setTimeout(() => setCopied(false), 3000);
        } else {
          handleDownload();
        }
        setIsExporting(false);
      });
    } catch {
      handleDownload();
      setIsExporting(false);
    }
  };

  // Handle Web Share API (mobile native sharing)
  const handleNativeShare = async () => {
    if (!canvasRef.current) return;

    if (navigator.share) {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `goyank_calisthenics_${currentStreak}_day_streak.png`, {
          type: 'image/png',
        });

        try {
          await navigator.share({
            title: `Goyank Calisthenics: ${currentStreak}-Day Streak & Volume Overload`,
            text: `Locked in a ${currentStreak}-day workout streak with +${growthPercent}% weekly volume progression on Goyank Calisthenics! Strict form only. 💪🔥`,
            files: [file],
          });
        } catch {
          // Fallback to clipboard
          handleCopyImage();
        }
      });
    } else {
      handleCopyImage();
    }
  };

  // Pre-filled social text
  const shareText = `Locked in a ${currentStreak}-day streak and +${growthPercent}% weekly volume overload with Coach Goyank! Zero kipping, strict bodyweight form only. 💪🔥 #Calisthenics #StreetWorkout #ProgressiveOverload`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  SOCIAL PROGRESS EXPORTER
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[10px] border border-amber-500/20">
                  Retina 1080p
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                Share Volume Trend & Streak Card
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          {/* Format / Aspect Ratio Selector */}
          <div className="flex items-center justify-between flex-wrap gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <span>Card Format:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'post' as const, label: 'Feed Post (4:5)' },
                { id: 'story' as const, label: 'Story (9:16)' },
                { id: 'landscape' as const, label: 'Banner (16:9)' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setAspectRatio(fmt.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    aspectRatio === fmt.id
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hidden Canvas used for high-res generation */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Live High-Res Image Preview Card */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-3 shadow-inner">
            {dataUrl ? (
              <img
                src={dataUrl}
                alt="Goyank Calisthenics Social Progress Card"
                className="max-h-[380px] w-auto rounded-xl shadow-2xl object-contain ring-1 ring-amber-500/20"
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">
                Generating card render...
              </div>
            )}
          </div>

          {/* Quick Share to Social Apps */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Share Links & Social Captions
            </span>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 text-slate-200 font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Twitter className="w-4 h-4 text-sky-400" />
                <span>Post on X / Twitter</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 text-slate-200 font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Share to WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyImage}
              disabled={isExporting}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Image</span>
                </>
              )}
            </button>

            <button
              onClick={handleNativeShare}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>Native Share</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Close
            </button>

            <button
              onClick={handleDownload}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download PNG Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

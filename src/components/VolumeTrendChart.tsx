import React, { useState, useMemo, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Award, Flame, Dumbbell, Sparkles, Info, Share2 } from 'lucide-react';
import { WorkoutSessionLog } from '../types/calisthenics';
import { INSTRUCTOR_GOYANK } from '../data/instructorData';

interface VolumeTrendChartProps {
  logs: WorkoutSessionLog[];
  onOpenShare?: () => void;
}

interface WeekVolumeData {
  weekIndex: number;
  label: string; // e.g. "Week 1", "This Week"
  dateRange: string; // e.g. "Sep 15 - 21"
  totalReps: number;
  totalMinutes: number;
  sessionsCount: number;
  diffReps: number;
  diffPercent: number; // e.g. +12.5%
  isCurrentWeek: boolean;
}

export const VolumeTrendChart: React.FC<VolumeTrendChartProps> = ({ logs, onOpenShare }) => {
  const [weeksCount, setWeeksCount] = useState<6 | 8>(6);
  const [hoveredWeek, setHoveredWeek] = useState<WeekVolumeData | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Helper to extract numeric reps from a set
  const extractReps = (val: number | string): number => {
    if (typeof val === 'number') return val;
    const match = String(val).match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Group workout logs into weekly buckets
  const weeklyData = useMemo<WeekVolumeData[]>(() => {
    const now = new Date();
    // Monday of current week
    const currentDay = now.getDay();
    const diffToMonday = (currentDay + 6) % 7;
    const currentWeekMonday = new Date(now);
    currentWeekMonday.setDate(now.getDate() - diffToMonday);
    currentWeekMonday.setHours(0, 0, 0, 0);

    const buckets: WeekVolumeData[] = [];

    for (let i = weeksCount - 1; i >= 0; i--) {
      const weekStart = new Date(currentWeekMonday);
      weekStart.setDate(currentWeekMonday.getDate() - i * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      // Find logs belonging to this week
      const weekLogs = logs.filter((log) => {
        try {
          const logDate = new Date(log.date);
          return logDate >= weekStart && logDate <= weekEnd;
        } catch {
          return false;
        }
      });

      // Sum all reps across exercises and sets
      let totalReps = 0;
      let totalMinutes = 0;
      weekLogs.forEach((log) => {
        totalMinutes += log.durationMinutes || 0;
        log.exercises.forEach((ex) => {
          ex.sets.forEach((set) => {
            if (set.completed !== false) {
              totalReps += extractReps(set.repsOrSeconds);
            }
          });
        });
      });

      const isCurrentWeek = i === 0;
      const startStr = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endStr = weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      buckets.push({
        weekIndex: weeksCount - i,
        label: isCurrentWeek ? 'Current' : `Wk ${weeksCount - i}`,
        dateRange: `${startStr} - ${endStr}`,
        totalReps,
        totalMinutes,
        sessionsCount: weekLogs.length,
        diffReps: 0,
        diffPercent: 0,
        isCurrentWeek,
      });
    }

    // Calculate week-over-week progressive overload deltas
    for (let i = 0; i < buckets.length; i++) {
      if (i > 0) {
        const prev = buckets[i - 1].totalReps;
        const curr = buckets[i].totalReps;
        buckets[i].diffReps = curr - prev;
        if (prev > 0) {
          buckets[i].diffPercent = Math.round(((curr - prev) / prev) * 100);
        } else if (curr > 0) {
          buckets[i].diffPercent = 100;
        } else {
          buckets[i].diffPercent = 0;
        }
      }
    }

    return buckets;
  }, [logs, weeksCount]);

  // Overall progressive overload metrics
  const currentWeek = weeklyData[weeklyData.length - 1] || null;
  const previousWeek = weeklyData[weeklyData.length - 2] || null;
  const avgWeeklyReps = Math.round(
    weeklyData.reduce((acc, w) => acc + w.totalReps, 0) / (weeklyData.length || 1)
  );

  const baselineReps = weeklyData[0]?.totalReps || 1;
  const latestReps = currentWeek?.totalReps || 0;
  const overallGrowth = baselineReps > 0 ? Math.round(((latestReps - baselineReps) / baselineReps) * 100) : 0;

  // D3 Chart Rendering
  useEffect(() => {
    if (!svgRef.current || weeklyData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 680;
    const height = 280;
    const margin = { top: 35, right: 30, bottom: 40, left: 48 };

    // Defs & Gradients
    const defs = svg.append('defs');

    // Bar Gradient: Amber Gold
    const barGradient = defs.append('linearGradient')
      .attr('id', 'amberBarGradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    barGradient.append('stop').attr('offset', '0%').attr('stop-color', '#fbbf24').attr('stop-opacity', 0.95);
    barGradient.append('stop').attr('offset', '100%').attr('stop-color', '#d97706').attr('stop-opacity', 0.75);

    // Current Week Bar Gradient: Glowing Gold
    const currentBarGradient = defs.append('linearGradient')
      .attr('id', 'currentBarGradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    currentBarGradient.append('stop').attr('offset', '0%').attr('stop-color', '#fef08a').attr('stop-opacity', 1);
    currentBarGradient.append('stop').attr('offset', '100%').attr('stop-color', '#f59e0b').attr('stop-opacity', 0.9);

    // Area Fill Gradient under the Trend Curve
    const areaGradient = defs.append('linearGradient')
      .attr('id', 'volumeAreaGradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    areaGradient.append('stop').attr('offset', '0%').attr('stop-color', '#f59e0b').attr('stop-opacity', 0.28);
    areaGradient.append('stop').attr('offset', '100%').attr('stop-color', '#f59e0b').attr('stop-opacity', 0.0);

    // Scales
    const maxReps = Math.max(100, d3.max(weeklyData, (d) => d.totalReps) || 100);

    const xScale = d3.scaleBand()
      .domain(weeklyData.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.36);

    const yScale = d3.scaleLinear()
      .domain([0, maxReps * 1.25])
      .range([height - margin.bottom, margin.top]);

    // Background Grid lines
    const yTicks = yScale.ticks(4);
    svg.append('g')
      .attr('class', 'grid-lines')
      .selectAll('line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', '#1e293b') // slate-800
      .attr('stroke-dasharray', '3 3')
      .attr('stroke-width', 1);

    // Y Axis Labels
    svg.append('g')
      .selectAll('text')
      .data(yTicks)
      .enter()
      .append('text')
      .attr('x', margin.left - 10)
      .attr('y', (d) => yScale(d) + 3)
      .attr('text-anchor', 'end')
      .attr('fill', '#64748b') // slate-500
      .attr('font-size', '10px')
      .attr('font-family', 'ui-monospace, monospace')
      .text((d) => d);

    // Area path under trend line
    const areaGenerator = d3.area<WeekVolumeData>()
      .x((d) => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .y0(height - margin.bottom)
      .y1((d) => yScale(d.totalReps))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(weeklyData)
      .attr('fill', 'url(#volumeAreaGradient)')
      .attr('d', areaGenerator);

    // Bars
    const barGroup = svg.append('g').attr('class', 'bars');

    barGroup.selectAll('rect')
      .data(weeklyData)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.label) || 0)
      .attr('y', (d) => yScale(d.totalReps))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => Math.max(2, height - margin.bottom - yScale(d.totalReps)))
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('fill', (d) => (d.isCurrentWeek ? 'url(#currentBarGradient)' : 'url(#amberBarGradient)'))
      .attr('opacity', 0.9)
      .attr('cursor', 'pointer')
      .attr('stroke', (d) => (d.isCurrentWeek ? '#fef08a' : 'transparent'))
      .attr('stroke-width', (d) => (d.isCurrentWeek ? 1.5 : 0))
      .on('mouseenter', (_, d) => setHoveredWeek(d))
      .on('mouseleave', () => setHoveredWeek(null));

    // Overload Trend Line
    const lineGenerator = d3.line<WeekVolumeData>()
      .x((d) => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.totalReps))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(weeklyData)
      .attr('fill', 'none')
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 2.5)
      .attr('d', lineGenerator);

    // Dots on trend line points
    svg.append('g')
      .attr('class', 'points')
      .selectAll('circle')
      .data(weeklyData)
      .enter()
      .append('circle')
      .attr('cx', (d) => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr('cy', (d) => yScale(d.totalReps))
      .attr('r', 4.5)
      .attr('fill', '#020617') // slate-950
      .attr('stroke', (d) => (d.isCurrentWeek ? '#fef08a' : '#f59e0b'))
      .attr('stroke-width', 2.5)
      .attr('cursor', 'pointer')
      .on('mouseenter', (_, d) => setHoveredWeek(d))
      .on('mouseleave', () => setHoveredWeek(null));

    // Value Labels above bars
    svg.append('g')
      .selectAll('text')
      .data(weeklyData)
      .enter()
      .append('text')
      .attr('x', (d) => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d.totalReps) - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => (d.isCurrentWeek ? '#fef08a' : '#f1f5f9'))
      .attr('font-size', '11px')
      .attr('font-weight', '700')
      .attr('font-family', 'ui-monospace, monospace')
      .text((d) => `${d.totalReps}`);

    // X Axis Labels
    svg.append('g')
      .selectAll('text')
      .data(weeklyData)
      .enter()
      .append('text')
      .attr('x', (d) => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr('y', height - margin.bottom + 22)
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => (d.isCurrentWeek ? '#fbbf24' : '#94a3b8'))
      .attr('font-size', '11px')
      .attr('font-weight', (d) => (d.isCurrentWeek ? '700' : '500'))
      .text((d) => d.label);
  }, [weeklyData]);

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            PROGRESSIVE OVERLOAD ANALYZER (D3)
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-display mt-0.5">
            Weekly Repetition Volume Trend
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track total bodyweight repetitions per week to verify progressive overload without overtraining
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Export Volume Trend & Streak Card for Social Media"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Share Card</span>
            </button>
          )}

          {/* Range Selector */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setWeeksCount(6)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                weeksCount === 6
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              6 Weeks
            </button>
            <button
              onClick={() => setWeeksCount(8)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                weeksCount === 8
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              8 Weeks
            </button>
          </div>
        </div>
      </div>

      {/* Progressive Overload Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-slate-400">Current Week Reps</span>
          <div className="text-2xl font-extrabold font-mono text-white mt-0.5 tabular-nums">
            {currentWeek?.totalReps || 0}
          </div>
          <span className="text-[10px] text-slate-500">{currentWeek?.sessionsCount || 0} sessions completed</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-slate-400">Week-over-Week Change</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`text-2xl font-extrabold font-mono tabular-nums ${
                (currentWeek?.diffPercent || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {(currentWeek?.diffPercent || 0) >= 0 ? '+' : ''}
              {currentWeek?.diffPercent || 0}%
            </span>
            {(currentWeek?.diffPercent || 0) >= 0 ? (
              <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-rose-400" />
            )}
          </div>
          <span className="text-[10px] text-slate-500">
            vs previous week ({previousWeek?.totalReps || 0} reps)
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-slate-400">Average Weekly Volume</span>
          <div className="text-2xl font-extrabold font-mono text-amber-400 mt-0.5 tabular-nums">
            {avgWeeklyReps}
          </div>
          <span className="text-[10px] text-slate-500">Reps / week baseline</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-slate-400">Progressive Overload Pace</span>
          <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Optimal Growth</span>
          </div>
          <span className="text-[10px] text-slate-500">+{overallGrowth}% over period</span>
        </div>
      </div>

      {/* D3 SVG Chart Container */}
      <div className="space-y-2">
        <div className="w-full overflow-x-auto pb-2 scrollbar-none">
          <div className="min-w-[580px]">
            <svg
              ref={svgRef}
              viewBox="0 0 680 280"
              className="w-full h-auto select-none"
            />
          </div>
        </div>

        {/* Dynamic Tooltip / Status Readout */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            {hoveredWeek ? (
              <span className="text-slate-200">
                <span className="font-bold text-amber-400">{hoveredWeek.label} ({hoveredWeek.dateRange}):</span>{' '}
                <span className="font-mono font-bold text-white">{hoveredWeek.totalReps} total reps</span> across{' '}
                {hoveredWeek.sessionsCount} sessions ({hoveredWeek.totalMinutes}m).{' '}
                {hoveredWeek.diffReps !== 0 && (
                  <span className={hoveredWeek.diffReps > 0 ? 'text-emerald-400' : 'text-slate-400'}>
                    ({hoveredWeek.diffReps > 0 ? '+' : ''}{hoveredWeek.diffReps} reps vs prev week)
                  </span>
                )}
              </span>
            ) : (
              <span className="text-slate-400">
                Hover or tap any bar in the D3 chart to inspect weekly volume and overload differentials
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 shrink-0 self-end sm:self-auto">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-amber-400 to-amber-600" />
              <span>Completed Week</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-yellow-200 to-amber-500 border border-yellow-200" />
              <span>Current Week</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-amber-500" />
              <span>Overload Curve</span>
            </div>
          </div>
        </div>
      </div>

      {/* Goyank's Progressive Overload Directive */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-amber-400/40 shrink-0">
          <img
            src={INSTRUCTOR_GOYANK.avatar}
            alt={INSTRUCTOR_GOYANK.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          <span className="font-bold text-amber-300">Coach Goyank on Calisthenics Progressive Overload: </span>
          &ldquo;In bodyweight strength, progressive overload isn&apos;t just loading weights onto a bar. It means accumulating strict repetitions, extending time under tension, and mastering deeper leverages. Aiming for 5% to 15% weekly repetition progression ensures steady tendon adaptation while steering clear of elbow tendinitis.&rdquo;
        </div>
      </div>
    </div>
  );
};

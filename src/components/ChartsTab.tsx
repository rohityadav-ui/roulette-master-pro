import React, { useState } from 'react';
import { SpinRecord } from '../types/roulette';
import { LiveStatsData } from '../utils/rouletteAnalytics';
import { BarChart2, PieChart, TrendingUp } from 'lucide-react';
import { getNumberColor } from '../utils/constants';

interface ChartsTabProps {
  spins: SpinRecord[];
  stats: LiveStatsData;
}

export const ChartsTab: React.FC<ChartsTabProps> = ({ spins, stats }) => {
  const [activeChart, setActiveChart] = useState<'bar' | 'pie' | 'line'>('bar');

  const { totalSpins, redCount, blackCount, greenCount, dozens, sectors } = stats;

  // Pie chart calculation
  const total = Math.max(1, totalSpins);
  const redAngle = (redCount / total) * 360;
  const blackAngle = (blackCount / total) * 360;
  const greenAngle = (greenCount / total) * 360;

  // Helper for SVG Pie slice
  const createPieSlice = (startAngle: number, endAngle: number, color: string) => {
    if (startAngle === endAngle) return null;
    const r = 80;
    const cx = 100;
    const cy = 100;

    const rad1 = ((startAngle - 90) * Math.PI) / 180;
    const rad2 = ((endAngle - 90) * Math.PI) / 180;

    const x1 = cx + r * Math.cos(rad1);
    const y1 = cy + r * Math.sin(rad1);
    const x2 = cx + r * Math.cos(rad2);
    const y2 = cy + r * Math.sin(rad2);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    return <path d={d} fill={color} stroke="#10121a" strokeWidth="2" />;
  };

  // Line chart points for last 25 spins
  const last25Spins = spins.slice(-25);

  return (
    <div className="space-y-4">
      {/* Header & Sub-tab selector */}
      <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#D4AF37]">
            Visual Analytics Charts
          </h2>
          <span className="text-xs text-slate-400">
            Graphical representation of spin frequencies and sequence trends
          </span>
        </div>

        <div className="flex items-center bg-[#181a24] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveChart('bar')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
              activeChart === 'bar'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Bar Chart</span>
          </button>
          <button
            onClick={() => setActiveChart('pie')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
              activeChart === 'pie'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Pie Chart</span>
          </button>
          <button
            onClick={() => setActiveChart('line')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
              activeChart === 'line'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Line Trend</span>
          </button>
        </div>
      </div>

      {/* Chart 1: Bar Chart */}
      {activeChart === 'bar' && (
        <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-4 sm:p-5 shadow-xl space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] block mb-3">
              1. Color Frequencies
            </span>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-red-400">Red ({redCount})</span>
                <span>{stats.redPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-[#181a24] h-5 rounded-lg overflow-hidden p-0.5">
                <div
                  style={{ width: `${stats.redPercent}%`, backgroundColor: '#E53935' }}
                  className="h-full rounded-md transition-all"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-1">
                <span className="text-slate-300">Black ({blackCount})</span>
                <span>{stats.blackPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-[#181a24] h-5 rounded-lg overflow-hidden p-0.5">
                <div
                  style={{ width: `${stats.blackPercent}%`, backgroundColor: '#757575' }}
                  className="h-full rounded-md transition-all"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-1">
                <span className="text-emerald-400">Green 0 ({greenCount})</span>
                <span>{stats.greenPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-[#181a24] h-5 rounded-lg overflow-hidden p-0.5">
                <div
                  style={{ width: `${stats.greenPercent}%`, backgroundColor: '#4CAF50' }}
                  className="h-full rounded-md transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] block mb-3">
              2. Dozens Frequencies
            </span>
            <div className="grid grid-cols-3 gap-3">
              {dozens.map((d) => (
                <div key={d.dozen} className="flex flex-col items-center">
                  <div className="h-32 w-12 bg-[#181a24] rounded-t-xl flex items-end p-1 justify-center">
                    <div
                      style={{ height: `${Math.min(100, d.percent * 2.5)}%` }}
                      className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-lg transition-all"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-200 mt-2">D{d.dozen}</span>
                  <span className="text-[11px] text-amber-400 font-semibold">{d.count} ({d.percent.toFixed(0)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chart 2: Pie Chart */}
      {activeChart === 'pie' && (
        <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-4 sm:p-5 shadow-xl flex flex-col items-center">
          <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] block mb-4 text-center">
            Color Split Pie Chart
          </span>

          <div className="relative w-56 h-56">
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
              {createPieSlice(0, redAngle, '#E53935')}
              {createPieSlice(redAngle, redAngle + blackAngle, '#212121')}
              {createPieSlice(redAngle + blackAngle, 360, '#4CAF50')}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[#10121a] border border-amber-900/60 flex flex-col items-center justify-center shadow-inner">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total</span>
                <span className="text-base font-black text-[#D4AF37]">{totalSpins}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#E53935]" />
              <span className="text-slate-300">Red: {stats.redPercent.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#757575]" />
              <span className="text-slate-300">Black: {stats.blackPercent.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#4CAF50]" />
              <span className="text-slate-300">Zero: {stats.greenPercent.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Chart 3: Line Chart */}
      {activeChart === 'line' && (
        <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
              Spin Sequence Trajectory (Recent 25 Spins)
            </span>
            <span className="text-[11px] text-slate-400">Scale: 0 to 36</span>
          </div>

          {last25Spins.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 italic">
              Chart dekhne ke liye kuch spins record karein.
            </div>
          ) : (
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[450px] h-48 bg-[#161822] rounded-xl border border-slate-800 p-3 relative flex items-end justify-between">
                {/* Horizontal reference lines */}
                <div className="absolute inset-x-0 top-3 border-b border-slate-800/60" />
                <div className="absolute inset-x-0 top-1/2 border-b border-slate-800/60" />
                <div className="absolute inset-x-0 bottom-6 border-b border-slate-800/60" />

                {last25Spins.map((s, idx) => {
                  const heightPercent = ((s.value || 0) / 36) * 80 + 10;
                  const color = getNumberColor(s.value);
                  const bgHex = color === 'red' ? '#E53935' : color === 'green' ? '#4CAF50' : '#212121';

                  return (
                    <div
                      key={s.id}
                      className="flex flex-col items-center flex-1 h-full justify-end group relative"
                    >
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-1.5 bg-amber-500/30 rounded-t flex items-start justify-center"
                      >
                        <div
                          style={{ backgroundColor: bgHex }}
                          className="w-3.5 h-3.5 -mt-2 rounded-full border border-white/40 shadow-sm flex items-center justify-center text-[8px] font-black text-white"
                        >
                          {s.value}
                        </div>
                      </div>
                      <span className="text-[8px] text-slate-500 font-bold mt-1">
                        #{s.spinNumber}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

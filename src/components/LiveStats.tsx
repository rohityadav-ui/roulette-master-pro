import React from 'react';
import { LiveStatsData } from '../utils/rouletteAnalytics';
import { Flame, Snowflake, Sparkles } from 'lucide-react';

interface LiveStatsProps {
  stats: LiveStatsData;
}

export const LiveStats: React.FC<LiveStatsProps> = ({ stats }) => {
  const {
    totalSpins,
    redCount,
    blackCount,
    greenCount,
    redPercent,
    blackPercent,
    greenPercent,
    evenCount,
    oddCount,
    evenPercent,
    oddPercent,
    dozens,
    groups6,
    sectors,
    hotTop3,
    coldTop3,
    currentStreak,
  } = stats;

  return (
    <div className="space-y-4">
      {/* Top Summary Banner: Total Spins & Current Streak */}
      <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-3 sm:p-4 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Spins Logged
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#D4AF37]">
            {totalSpins}
          </span>
        </div>

        {currentStreak && (
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Current Streak
            </span>
            <span
              className={`text-sm sm:text-base font-black px-2.5 py-1 rounded-lg border inline-flex items-center gap-1.5 ${
                currentStreak.type === 'Red'
                  ? 'bg-red-950/60 text-red-300 border-red-800'
                  : currentStreak.type === 'Black'
                  ? 'bg-neutral-900 text-slate-200 border-neutral-700'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentStreak.count}× {currentStreak.type}</span>
            </span>
          </div>
        )}
      </div>

      {/* Red / Black / Green & Even / Odd Distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Colors */}
        <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-3.5 shadow-xl">
          <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] block mb-2.5">
            Color Distribution
          </span>

          <div className="space-y-2 text-xs font-bold">
            <div className="flex items-center justify-between text-red-400">
              <span>Red (🔴):</span>
              <span>{redPercent.toFixed(1)}% - {redCount}/{totalSpins}</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                style={{ backgroundColor: '#E53935', width: `${redPercent}%` }}
                className="h-full rounded-full transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-slate-200 pt-1">
              <span>Black (⚫):</span>
              <span>{blackPercent.toFixed(1)}% - {blackCount}/{totalSpins}</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                style={{ backgroundColor: '#757575', width: `${blackPercent}%` }}
                className="h-full rounded-full transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-emerald-400 pt-1">
              <span>Green 0 (🟢):</span>
              <span>{greenPercent.toFixed(1)}% - {greenCount}/{totalSpins}</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                style={{ backgroundColor: '#4CAF50', width: `${greenPercent}%` }}
                className="h-full rounded-full transition-all"
              />
            </div>
          </div>
        </div>

        {/* Even / Odd */}
        <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-3.5 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] block mb-2.5">
              Even / Odd Counts
            </span>

            <div className="space-y-2 text-xs font-bold">
              <div className="flex items-center justify-between text-amber-300">
                <span>Even:</span>
                <span>{evenPercent.toFixed(1)}% - {evenCount}/{totalSpins}</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${evenPercent}%` }}
                  className="bg-amber-500 h-full rounded-full transition-all"
                />
              </div>

              <div className="flex items-center justify-between text-cyan-300 pt-1">
                <span>Odd:</span>
                <span>{oddPercent.toFixed(1)}% - {oddCount}/{totalSpins}</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${oddPercent}%` }}
                  className="bg-cyan-500 h-full rounded-full transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Zero counts are excluded from Even/Odd parity.
          </div>
        </div>
      </div>

      {/* Dozens % and Count */}
      <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-3.5 shadow-xl">
        <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] block mb-2.5">
          Dozens Analysis
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {dozens.map((d) => (
            <div key={d.dozen} className="bg-[#161822] p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-200">{d.name}</span>
                <span className="text-amber-400">{d.percent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-1.5">
                <div
                  style={{ width: `${d.percent}%` }}
                  className="bg-amber-500 h-full rounded-full transition-all"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>({d.range})</span>
                <span className="font-semibold text-slate-300">{d.count} hits</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6 NUMBER GROUPS (1-6, 7-12, 13-18, 19-24, 25-30, 31-36) */}
      <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-3.5 shadow-xl">
        <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] block mb-2.5">
          6 Number Groups (6-Line Stats)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {groups6.map((g) => (
            <div key={g.group} className="bg-[#161822] p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-200">Group {g.group} ({g.range})</span>
                <span className="text-amber-400">{g.percent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-1.5">
                <div
                  style={{ width: `${Math.min(100, g.percent * 2.5)}%` }}
                  className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all"
                />
              </div>
              <div className="text-right text-[11px] font-semibold text-slate-300">
                {g.count} hits
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* French Sectors (Tier / Voisin / Orphelin) */}
      <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-3.5 shadow-xl">
        <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] block mb-2.5">
          Wheel Sectors (Tier / Voisin / Orphelin)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {sectors.map((s) => (
            <div key={s.key} className="bg-[#161822] p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-200">{s.name}</span>
                <span className="text-amber-400">{s.percent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-1.5">
                <div
                  style={{ width: `${s.percent}%` }}
                  className="bg-emerald-500 h-full rounded-full transition-all"
                />
              </div>
              <div className="text-right text-[11px] font-semibold text-slate-300">
                {s.count} hits
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hot (Top 3) & Cold (Top 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Hot */}
        <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-3.5 shadow-xl">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
              Hot Numbers (Top 3)
            </span>
          </div>

          <div className="space-y-2">
            {hotTop3.map((h, i) => (
              <div key={h.value} className="flex items-center justify-between p-2 bg-[#161822] rounded-xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-500 w-4">#{i + 1}</span>
                  <div
                    style={{
                      backgroundColor:
                        h.color === 'red' ? '#E53935' : h.color === 'green' ? '#4CAF50' : '#212121',
                    }}
                    className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs text-white border border-white/20"
                  >
                    {h.value}
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-300">
                  {h.count} hits
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cold */}
        <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-3.5 shadow-xl">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Snowflake className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
              Cold Numbers (Top 3)
            </span>
          </div>

          <div className="space-y-2">
            {coldTop3.map((c, i) => (
              <div key={c.value} className="flex items-center justify-between p-2 bg-[#161822] rounded-xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-500 w-4">#{i + 1}</span>
                  <div
                    style={{
                      backgroundColor:
                        c.color === 'red' ? '#E53935' : c.color === 'green' ? '#4CAF50' : '#212121',
                    }}
                    className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs text-white border border-white/20"
                  >
                    {c.value}
                  </div>
                </div>
                <span className="text-xs font-bold text-cyan-300">
                  {c.count} hits
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

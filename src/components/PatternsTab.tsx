import React, { useState, useMemo } from 'react';
import { SpinItem } from '../types';
import { analyzePatterns } from '../engine/patterns';
import { PatternBox } from './PatternBox';
import { ChevronDown, ChevronUp, Layers, Sparkles } from 'lucide-react';
import { getColor, getColorHex } from '../engine/colorMapper';

interface PatternsTabProps {
  spins: SpinItem[];
  onSelectNumber: (num: number) => void;
}

export const PatternsTab: React.FC<PatternsTabProps> = ({ spins, onSelectNumber }) => {
  const [showComboDetails, setShowComboDetails] = useState(false);
  const [showTripalDetails, setShowTripalDetails] = useState(false);

  const patternData = useMemo(() => {
    return analyzePatterns(spins);
  }, [spins]);

  const totalSpins = spins.length;

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800/90 p-3.5 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-400">
            6 Inside Pattern Monitors
          </h2>
          <p className="text-[11px] text-gray-400">
            Consecutive category differences & combinatorial progressions
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-gray-500 uppercase font-bold block">Spins</span>
          <span className="text-sm font-black text-amber-300">{totalSpins}</span>
        </div>
      </div>

      {/* 6 Inside Pattern Boxes Grid: Mobile 2 cols, Tablet 2 cols, Desktop 3 cols */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
        {/* Box 1: 🔵 Sequence (Blue) */}
        <PatternBox
          title="Sequence"
          icon="🔵"
          count={patternData.sequence}
          totalSpins={totalSpins}
          colorName="blue"
          description="2 consecutive numbers with consecutive categories (diff 1 or 4)"
        />

        {/* Box 2: ✂️ One Cut Sequence (Cyan) */}
        <PatternBox
          title="1-Cut Seq"
          icon="✂️"
          count={patternData.oneCutSequence}
          totalSpins={totalSpins}
          colorName="cyan"
          description="Numbers at i & i+2 with consecutive categories"
        />

        {/* Box 3: 🎯 Combo (Green) */}
        <PatternBox
          title="Combo"
          icon="🎯"
          count={patternData.combo}
          totalSpins={totalSpins}
          colorName="green"
          description="Direct 8-combo match between adjacent spins"
          onClick={() => setShowComboDetails(!showComboDetails)}
          hasDetails
        />

        {/* Box 4: ✂️ One Cut Combo (Yellow) */}
        <PatternBox
          title="1-Cut Combo"
          icon="✂️"
          count={patternData.oneCutCombo}
          totalSpins={totalSpins}
          colorName="yellow"
          description="Same 8 combos with 1 gap in between"
          onClick={() => setShowComboDetails(!showComboDetails)}
          hasDetails
        />

        {/* Box 5: 🔁 Repeating (Purple) */}
        <PatternBox
          title="Repeating"
          icon="🔁"
          count={patternData.repeating}
          totalSpins={totalSpins}
          colorName="purple"
          description="2+ consecutive numbers with identical category"
        />

        {/* Box 6: ✂️ One Cut Repeating (Pink) */}
        <PatternBox
          title="1-Cut Repeat"
          icon="✂️"
          count={patternData.oneCutRepeating}
          totalSpins={totalSpins}
          colorName="pink"
          description="Identical category repeating with 1 gap"
        />
      </div>

      {/* Collapsible Section 1: Combo Details (8 Combos) */}
      <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800/90 overflow-hidden shadow-xl">
        <button
          onClick={() => setShowComboDetails(!showComboDetails)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Combo Details (8 Combos Breakdown)
              </h3>
              <p className="text-[10px] text-gray-400">
                Individual hit counts for all 8 predefined combos
              </p>
            </div>
          </div>
          {showComboDetails ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {showComboDetails && (
          <div className="p-3 pt-0 border-t border-gray-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {patternData.combos.map((cb) => (
              <div
                key={cb.id}
                className="bg-gray-950/70 p-2.5 rounded-xl border border-gray-800"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-amber-300">
                    {cb.id}. {cb.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-black">
                    <span className="text-emerald-400" title="Direct Hits">
                      {cb.count}x
                    </span>
                    <span className="text-gray-500">·</span>
                    <span className="text-yellow-400" title="1-Cut Hits">
                      {cb.oneCutCount} cut
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mb-1.5 leading-tight">
                  {cb.desc}
                </p>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[9px] text-gray-500 font-bold uppercase">Targets:</span>
                  {cb.targets.map((num) => {
                    const c = getColor(num);
                    const bg = getColorHex(c);
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => onSelectNumber(num)}
                        style={{ backgroundColor: bg }}
                        className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] text-white border border-white/20 hover:scale-110 active:scale-95 transition-transform"
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collapsible Section 2: Tripal Details (4 Tripals) */}
      <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800/90 overflow-hidden shadow-xl">
        <button
          onClick={() => setShowTripalDetails(!showTripalDetails)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-purple-400">
                Tripal Details (4 Tripals Breakdown)
              </h3>
              <p className="text-[10px] text-gray-400">
                3-spin combinatorial sequences & triplet cycles
              </p>
            </div>
          </div>
          {showTripalDetails ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {showTripalDetails && (
          <div className="p-3 pt-0 border-t border-gray-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {patternData.tripals.map((tp) => (
              <div
                key={tp.id}
                className="bg-gray-950/70 p-2.5 rounded-xl border border-gray-800 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-black text-purple-300 block mb-0.5">
                    {tp.name}
                  </span>
                  <span className="text-[10px] text-gray-400 leading-tight block">
                    {tp.desc}
                  </span>
                </div>
                <div className="text-right pl-2">
                  <span className="text-sm font-black text-amber-400">
                    {tp.count}
                  </span>
                  <span className="text-[10px] text-gray-500 block">times</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

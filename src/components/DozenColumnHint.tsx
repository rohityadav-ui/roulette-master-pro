import React from 'react';
import { PredictionResult } from '../types';
import { Compass, Sparkles } from 'lucide-react';

interface DozenColumnHintProps {
  prediction: PredictionResult;
}

export const DozenColumnHint: React.FC<DozenColumnHintProps> = ({ prediction }) => {
  const { dozenHint, columnHint } = prediction;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {/* Dozen Hint */}
      <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800/90 p-3.5 shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
              Dozen Target
            </span>
          </div>
          <span className="text-xs font-black text-amber-300 px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30">
            {dozenHint.probability}%
          </span>
        </div>

        <h4 className="text-sm font-black text-white mb-0.5">
          {dozenHint.title}
        </h4>
        <p className="text-[11px] text-gray-400 leading-tight">
          {dozenHint.description}
        </p>

        {/* Progress indicator */}
        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mt-2.5">
          <div
            style={{ width: `${dozenHint.probability}%` }}
            className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
          />
        </div>
      </div>

      {/* Column Hint */}
      <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800/90 p-3.5 shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-all">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">
              Column Target
            </span>
          </div>
          <span className="text-xs font-black text-cyan-300 px-2 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30">
            {columnHint.probability}%
          </span>
        </div>

        <h4 className="text-sm font-black text-white mb-0.5">
          {columnHint.title}
        </h4>
        <p className="text-[11px] text-gray-400 leading-tight">
          {columnHint.description}
        </p>

        {/* Progress indicator */}
        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mt-2.5">
          <div
            style={{ width: `${columnHint.probability}%` }}
            className="bg-gradient-to-r from-cyan-500 to-cyan-300 h-full rounded-full transition-all duration-500"
          />
        </div>
      </div>
    </div>
  );
};

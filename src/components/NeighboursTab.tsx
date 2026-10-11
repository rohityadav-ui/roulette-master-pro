import React, { useState } from 'react';
import { NEIGHBOURS, getNumberColor } from '../utils/constants';
import { Search, X } from 'lucide-react';

interface NeighboursTabProps {
  onSelectNumber: (num: number) => void;
}

export const NeighboursTab: React.FC<NeighboursTabProps> = ({ onSelectNumber }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [animatingNum, setAnimatingNum] = useState<number | null>(null);

  const handleNeighbourClick = (num: number) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // ignore
      }
    }
    setAnimatingNum(num);
    setTimeout(() => {
      setAnimatingNum(null);
    }, 200);

    onSelectNumber(num);
  };

  const allNumbers = Array.from({ length: 37 }, (_, i) => i);

  const filteredNumbers = allNumbers.filter((n) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.trim().toLowerCase();
    // match main number or any neighbour
    if (n.toString() === term) return true;
    const neighs = NEIGHBOURS[n] || [];
    return neighs.some((neigh) => neigh.toString() === term);
  });

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-3 sm:p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#D4AF37]">
              Wheel Neighbours (5-Pocket View)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tap any neighbour number (L2, L1, Center, R1, R2) to immediately add to history
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="number"
            min={0}
            max={36}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by number (0 - 36)..."
            className="w-full bg-[#181a24] border border-amber-900/40 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* List of Numbers with 5 Neighbours */}
      <div className="space-y-2.5">
        {filteredNumbers.map((num) => {
          const neighboursList = NEIGHBOURS[num] || [];
          const labels = ['L2', 'L1', 'CT', 'R1', 'R2'];

          return (
            <div
              key={num}
              className="bg-[#10121a] rounded-2xl border border-slate-800 p-3 sm:p-4 shadow-md hover:border-amber-900/60 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    Number #{num}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    (Wheel Sector)
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  5 Pocket Sequence
                </span>
              </div>

              {/* 5 Neighbours Circles (L2, L1, CT, R1, R2) */}
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {neighboursList.map((neighVal, idx) => {
                  const color = getNumberColor(neighVal);
                  const bgHex = color === 'red' ? '#E53935' : color === 'green' ? '#4CAF50' : '#212121';
                  const isCenter = idx === 2;
                  const isAnim = animatingNum === neighVal;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleNeighbourClick(neighVal)}
                      className="flex flex-col items-center justify-center group focus:outline-none"
                    >
                      <div
                        style={{ backgroundColor: bgHex }}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-xs sm:text-sm text-white shadow-md border transition-transform duration-200 cursor-pointer ${
                          isCenter
                            ? 'ring-2 ring-amber-400/80 border-amber-300'
                            : 'border-white/20'
                        } ${
                          isAnim ? 'scale-125 ring-4 ring-amber-400 z-10' : 'group-hover:scale-105 active:scale-90'
                        }`}
                      >
                        {neighVal}
                      </div>

                      <span
                        className={`text-[9px] sm:text-[10px] font-bold mt-1 ${
                          isCenter ? 'text-amber-400 font-black' : 'text-slate-400'
                        }`}
                      >
                        {labels[idx]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

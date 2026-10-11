import React, { useState } from 'react';
import { getNumberColor } from '../utils/constants';
import { Dices, Info } from 'lucide-react';

interface RngTabProps {
  lastRng: number | null;
  onSpinRng: (num: number) => void;
}

export const RngTab: React.FC<RngTabProps> = ({ lastRng, onSpinRng }) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = () => {
    setIsSpinning(true);
    // Rapid shuffle simulation for 400ms
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count > 6) {
        clearInterval(interval);
        const randomPick = Math.floor(Math.random() * 37); // 0 to 36
        onSpinRng(randomPick);
        setIsSpinning(false);
      }
    }, 60);
  };

  const currentColor = lastRng !== null ? getNumberColor(lastRng) : null;
  const currentBg =
    currentColor === 'red'
      ? '#E53935'
      : currentColor === 'green'
      ? '#4CAF50'
      : currentColor === 'black'
      ? '#212121'
      : '#161822';
  const colorEmoji = currentColor === 'red' ? '🔴' : currentColor === 'black' ? '⚫' : '🟢';

  return (
    <div className="max-w-md mx-auto space-y-6 pt-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#D4AF37]">
          Random Number Generator (RNG)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Simulate independent single spins for testing
        </p>
      </div>

      {/* Big Display Box with "?" initially */}
      <div className="flex flex-col items-center justify-center">
        <div
          style={{ backgroundColor: currentBg }}
          className={`w-36 h-36 sm:w-44 sm:h-44 rounded-3xl border-4 border-amber-400/80 shadow-2xl flex items-center justify-center transition-all duration-300 ${
            isSpinning ? 'scale-95 animate-pulse' : 'scale-100 shadow-amber-500/20'
          }`}
        >
          <span className="text-5xl sm:text-6xl font-black text-white drop-shadow-md">
            {lastRng !== null ? lastRng : '?'}
          </span>
        </div>

        {/* Indicator Below Box */}
        <div className="mt-4 text-center">
          <span className="text-sm font-bold text-slate-300">
            Last RNG:{' '}
            {lastRng !== null ? (
              <span className="text-amber-400 font-black">
                {lastRng} {colorEmoji}
              </span>
            ) : (
              <span className="text-slate-500 italic">None</span>
            )}
          </span>
        </div>
      </div>

      {/* SPIN RNG Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="w-full sm:w-64 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-950/50 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Dices className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? 'Generating...' : '🎲 SPIN RNG'}</span>
        </button>
      </div>

      {/* Info Notice */}
      <div className="bg-[#10121a] border border-amber-900/30 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-amber-300 block mb-1">Testing Utility Only:</strong>
          Ye feature testing ke liye hai. Random number generate karta hai. Iska result History me add <u>nahi</u> hota hai, sirf preview ke liye hai.
        </div>
      </div>
    </div>
  );
};

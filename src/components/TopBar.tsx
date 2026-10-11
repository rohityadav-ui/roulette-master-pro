import React from 'react';
import { Settings, Moon, Sun, Share2 } from 'lucide-react';
import { getNumberColor } from '../utils/constants';

interface TopBarProps {
  onOpenSettings: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onShare: () => void;
  lastRng: number | null;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenSettings,
  isDarkMode,
  onToggleTheme,
  onShare,
  lastRng,
}) => {
  const lastRngColor = lastRng !== null ? getNumberColor(lastRng) : null;
  const colorEmoji = lastRngColor === 'red' ? '🔴' : lastRngColor === 'black' ? '⚫' : '🟢';

  return (
    <div className="bg-[#0c0d12] border-b border-amber-900/30 sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Title in Gold */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-[1.5px] flex items-center justify-center shadow-md shadow-amber-900/30">
            <div className="w-full h-full bg-[#12131a] rounded-full flex items-center justify-center">
              <span className="text-[11px] font-black text-[#D4AF37]">R</span>
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-widest text-[#D4AF37] drop-shadow-sm font-serif">
              ROULETTE ANALYZER
            </h1>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-[#181a24] text-amber-300 hover:text-amber-100 hover:bg-[#202330] border border-amber-900/40 transition-colors"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onShare}
            className="p-2 rounded-lg bg-[#181a24] text-amber-300 hover:text-amber-100 hover:bg-[#202330] border border-amber-900/40 transition-colors"
            title="Share"
            aria-label="Share App"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-[#181a24] text-amber-300 hover:text-amber-100 hover:bg-[#202330] border border-amber-900/40 transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Below Top Bar Indicator: Last RNG */}
      <div className="bg-[#12131a] border-t border-b border-amber-950/40 px-4 py-1 text-center">
        <span className="text-xs font-semibold text-slate-300 tracking-wide">
          🎲 Last RNG:{' '}
          {lastRng !== null ? (
            <span className="font-bold text-amber-400">
              {lastRng} {colorEmoji}
            </span>
          ) : (
            <span className="text-slate-500 italic">None yet (Spin in RNG tab)</span>
          )}
        </span>
      </div>
    </div>
  );
};

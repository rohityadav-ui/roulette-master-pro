import React from 'react';
import { Download, Mic, WifiOff, Disc3 } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

interface HeaderProps {
  isListening: boolean;
  onToggleVoice: () => void;
  voiceError: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  isListening,
  onToggleVoice,
  voiceError,
}) => {
  const { isInstallable, isOffline, triggerInstall } = usePWA();

  return (
    <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/80 shadow-2xl">
      <div className="max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center">
                <Disc3 className="w-4 h-4 text-amber-400 animate-spin-slow" />
              </div>
            </div>
            {/* Glow ring */}
            <span className="absolute -inset-0.5 rounded-xl bg-amber-500/30 blur-sm -z-10" />
          </div>

          <div>
            <h1 className="text-sm sm:text-base font-black tracking-widest bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent font-serif">
              ROULETTE PATTERN HUD
            </h1>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Pattern HUD</span>
              {isOffline && (
                <span className="flex items-center gap-1 text-amber-400 font-semibold ml-1">
                  <WifiOff className="w-3 h-3" /> Offline
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          {isInstallable && (
            <button
              onClick={triggerInstall}
              title="Install App"
              aria-label="Install App"
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Install</span>
            </button>
          )}

          {/* Voice Input Toggle Button in Header */}
          <button
            onClick={onToggleVoice}
            title={isListening ? 'Voice Input Active' : 'Enable Voice Input'}
            aria-label="Toggle Voice Input"
            className={`p-2 rounded-xl border text-xs transition-all active:scale-95 ${
              isListening
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/40 animate-pulse'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700'
            }`}
          >
            <Mic className={`w-4 h-4 ${isListening ? 'text-rose-400' : ''}`} />
          </button>
        </div>
      </div>

      {voiceError && (
        <div className="bg-rose-950/80 border-b border-rose-800/60 px-4 py-1 text-center text-[11px] text-rose-200 font-medium">
          {voiceError}
        </div>
      )}
    </header>
  );
};

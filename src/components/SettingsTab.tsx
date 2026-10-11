import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Globe,
  Download,
  Share2,
  Trash2,
  RotateCcw,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { exportSessionToCSV } from '../utils/storage';
import { SpinRecord } from '../types/roulette';

interface SettingsTabProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  spins: SpinRecord[];
  onClearHistory: () => void;
  onResetAppData: () => void;
  onShare: () => void;
  onOpenDisclaimer: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  isDarkMode,
  onToggleTheme,
  language,
  onToggleLanguage,
  spins,
  onClearHistory,
  onResetAppData,
  onShare,
  onOpenDisclaimer,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-3.5 sm:p-4 shadow-xl">
        <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#D4AF37] mb-1">
          Settings & Preferences
        </h2>
        <p className="text-xs text-slate-400">
          Configure app appearance, data, and backup options
        </p>
      </div>

      {/* Preferences Section */}
      <div className="bg-[#10121a] rounded-2xl border border-slate-800 p-4 shadow-xl space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] block">
          Appearance & Language
        </span>

        {/* Dark / Light Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            {isDarkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <div>
              <span className="text-xs font-bold text-slate-200 block">Theme Mode</span>
              <span className="text-[11px] text-slate-500">Dark Casino (Obsidian + Gold) / Light</span>
            </div>
          </div>
          <button
            onClick={onToggleTheme}
            className="px-3 py-1.5 bg-[#181a24] hover:bg-[#202330] rounded-xl text-xs font-bold text-amber-300 border border-slate-700 transition-colors"
          >
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-xs font-bold text-slate-200 block">Language / Bhasha</span>
              <span className="text-[11px] text-slate-500">English aur Hinglish guide</span>
            </div>
          </div>
          <button
            onClick={onToggleLanguage}
            className="px-3 py-1.5 bg-[#181a24] hover:bg-[#202330] rounded-xl text-xs font-bold text-amber-300 border border-slate-700 transition-colors"
          >
            {language === 'en' ? 'English' : 'हिंदी / Hinglish'}
          </button>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-[#10121a] rounded-2xl border border-slate-800 p-4 shadow-xl space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] block">
          Data & Sharing
        </span>

        {/* Export CSV */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <Download className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-xs font-bold text-slate-200 block">Export History (CSV)</span>
              <span className="text-[11px] text-slate-500">Download logged spins to Excel spreadsheet</span>
            </div>
          </div>
          <button
            onClick={() => exportSessionToCSV(spins)}
            disabled={spins.length === 0}
            className="px-3 py-1.5 bg-[#181a24] hover:bg-[#202330] text-emerald-300 rounded-xl text-xs font-bold border border-emerald-900/50 transition-colors disabled:opacity-40"
          >
            Download
          </button>
        </div>

        {/* Share App */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-xs font-bold text-slate-200 block">Share App Link</span>
              <span className="text-[11px] text-slate-500">Copy URL to clipboard or native share</span>
            </div>
          </div>
          <button
            onClick={onShare}
            className="px-3 py-1.5 bg-[#181a24] hover:bg-[#202330] text-blue-300 rounded-xl text-xs font-bold border border-blue-900/50 transition-colors"
          >
            Share
          </button>
        </div>

        {/* Clear History */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <Trash2 className="w-4 h-4 text-red-400" />
            <div>
              <span className="text-xs font-bold text-slate-200 block">Clear Spins History</span>
              <span className="text-[11px] text-slate-500">Delete all recorded spin numbers</span>
            </div>
          </div>
          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={spins.length === 0}
            className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-xl text-xs font-bold border border-red-900/50 transition-colors disabled:opacity-40"
          >
            Clear
          </button>
        </div>

        {/* Reset App Data */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <div>
              <span className="text-xs font-bold text-slate-200 block">Reset All App Data</span>
              <span className="text-[11px] text-slate-500">Clear localStorage, settings, and RNG history</span>
            </div>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-rose-300 rounded-xl text-xs font-bold border border-rose-900/50 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* About & Disclaimer */}
      <div className="bg-[#10121a] rounded-2xl border border-slate-800 p-4 shadow-xl space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] block">
          About & Disclaimer
        </span>

        <div className="text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            <strong>Roulette Master Pro</strong> (European Edition) is an analytical tool built for tracking wheel frequency, 5-neighbour sectors, category progressions, and sequence patterns.
          </p>
        </div>

        {/* Disclaimer button */}
        <button
          onClick={onOpenDisclaimer}
          className="w-full py-2.5 px-4 bg-[#181a24] hover:bg-[#202330] rounded-xl text-xs font-bold text-amber-300 border border-amber-900/40 flex items-center justify-center gap-2 transition-colors"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Read Responsible Gaming Disclaimer</span>
        </button>
      </div>

      {/* Clear Confirmation */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141620] border border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl">
            <h3 className="text-base font-black text-amber-300 mb-2">Clear Spins History?</h3>
            <p className="text-xs text-slate-300 mb-5">
              Kya aap sach me saare spins clear karna chahte hain?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-300 bg-[#202330] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-lg"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141620] border border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl">
            <h3 className="text-base font-black text-rose-300 mb-2">Reset App Data?</h3>
            <p className="text-xs text-slate-300 mb-5">
              Isse aapka saara data, history, RNG state aur custom preferences reset ho jayenge.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-300 bg-[#202330] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetAppData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-lg"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { ShieldAlert, Check } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#141620] border-2 border-amber-500/70 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#D4AF37] uppercase tracking-wider">
              Responsible Gaming Notice
            </h3>
            <span className="text-[11px] text-slate-400">
              Entertainment & Educational Purpose
            </span>
          </div>
        </div>

        <div className="bg-[#181a26] p-4 rounded-2xl border border-amber-900/30 text-xs sm:text-sm text-slate-200 leading-relaxed mb-6 font-medium">
          "This app is for entertainment and educational purposes only. Roulette outcomes are random — no app can truly predict them. Please gamble responsibly."
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>I Understand & Agree</span>
          </button>
        </div>
      </div>
    </div>
  );
};

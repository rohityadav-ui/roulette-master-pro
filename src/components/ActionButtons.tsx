import React, { useState } from 'react';
import { RotateCcw, Trash2, Mic, MicOff } from 'lucide-react';

interface ActionButtonsProps {
  canUndo: boolean;
  onUndo: () => void;
  onReset: () => void;
  isListening: boolean;
  onToggleVoice: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  canUndo,
  onUndo,
  onReset,
  isListening,
  onToggleVoice,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <>
      <div className="bg-gray-950/80 backdrop-blur-md border-b border-gray-800/80 p-2.5 shadow-lg">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-2.5">
          {/* Undo Button */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border transition-all active:scale-95 ${
              canUndo
                ? 'bg-gray-900 hover:bg-gray-800 text-amber-300 border-gray-700/80 shadow-md shadow-black/40'
                : 'bg-gray-950 text-gray-600 border-gray-900 cursor-not-allowed opacity-50'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Undo</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={() => setShowConfirmReset(true)}
            disabled={!canUndo}
            className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border transition-all active:scale-95 ${
              canUndo
                ? 'bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border-rose-900/60 shadow-md shadow-rose-950/20'
                : 'bg-gray-950 text-gray-600 border-gray-900 cursor-not-allowed opacity-50'
            }`}
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Reset</span>
          </button>

          {/* Voice Button */}
          <button
            onClick={onToggleVoice}
            className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border transition-all active:scale-95 ${
              isListening
                ? 'bg-rose-500/30 text-rose-200 border-rose-500 ring-2 ring-rose-500/50 shadow-lg shadow-rose-500/30 animate-pulse'
                : 'bg-gray-900 hover:bg-gray-800 text-gray-300 border-gray-700/80 shadow-md shadow-black/40'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 text-rose-400" />
                <span>Voice ON</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-gray-400" />
                <span>Voice</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-sm w-full p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-black text-amber-300 mb-2">
              Reset Spin History?
            </h3>
            <p className="text-xs text-gray-300 mb-6 leading-relaxed">
              Are you sure you want to clear all tracked spins? This will reset all pattern counts and category probabilities.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 text-xs font-bold text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onReset();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-950/50"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

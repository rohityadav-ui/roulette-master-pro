import React, { useState } from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';

interface UndoClearBarProps {
  onUndo: () => void;
  onClearAll: () => void;
  canUndo: boolean;
}

export const UndoClearBar: React.FC<UndoClearBarProps> = ({
  onUndo,
  onClearAll,
  canUndo,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${
            canUndo
              ? 'bg-[#181a24] hover:bg-[#222533] text-amber-300 border-amber-900/60 active:scale-95 shadow-md'
              : 'bg-[#101218] text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>↶ Undo Last</span>
        </button>

        <button
          onClick={() => setShowConfirm(true)}
          disabled={!canUndo}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${
            canUndo
              ? 'bg-red-950/40 hover:bg-red-900/60 text-red-300 border-red-900/60 active:scale-95 shadow-md'
              : 'bg-[#101218] text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
          }`}
        >
          <Trash2 className="w-4 h-4 text-red-400" />
          <span>🗑️ Clear All</span>
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141620] border border-amber-900/50 rounded-2xl max-w-sm w-full p-5 shadow-2xl">
            <h3 className="text-base font-black text-amber-300 mb-2">
              Clear Entire History?
            </h3>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Kya aap sach me saare spins clear karna chahte hain? Sabhi live statistics reset ho jayenge.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-[#202330] hover:bg-[#282c3c] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAll();
                  setShowConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-lg shadow-red-950/50 transition-colors"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

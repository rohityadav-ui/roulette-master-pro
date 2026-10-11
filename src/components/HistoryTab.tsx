import React, { useState } from 'react';
import { SpinRecord } from '../types/roulette';
import { Download, Trash2, Search, X } from 'lucide-react';
import { exportSessionToCSV } from '../utils/storage';

interface HistoryTabProps {
  spins: SpinRecord[];
  onClearAll: () => void;
  onDeleteSingle: (id: string) => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  spins,
  onClearAll,
  onDeleteSingle,
}) => {
  const [filterColor, setFilterColor] = useState<'all' | 'red' | 'black' | 'green'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filtered = spins
    .filter((s) => {
      if (filterColor !== 'all' && s.color !== filterColor) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.trim().toLowerCase();
        if (!s.value.toString().includes(term) && !s.sector.includes(term)) return false;
      }
      return true;
    })
    .reverse(); // Newest first

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#10121a] rounded-2xl border border-amber-900/40 p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#D4AF37]">
            Complete Spin History ({spins.length} Total)
          </h2>
          <span className="text-xs text-slate-400">
            Chronological record of every entered outcome
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportSessionToCSV(spins)}
            disabled={spins.length === 0}
            className="px-3 py-1.5 bg-[#181a24] hover:bg-[#222533] text-emerald-300 font-bold text-xs rounded-xl border border-emerald-900/50 flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={spins.length === 0}
            className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 font-bold text-xs rounded-xl border border-red-900/50 flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-[#10121a] p-2.5 rounded-2xl border border-slate-800">
        {/* Search */}
        <div className="relative flex-1 min-w-[150px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search number..."
            className="w-full bg-[#181a24] border border-slate-800 rounded-xl pl-8 pr-7 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Color buttons */}
        <div className="flex items-center gap-1 bg-[#181a24] p-0.5 rounded-xl border border-slate-800 text-xs">
          {(['all', 'red', 'black', 'green'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilterColor(c)}
              className={`px-2.5 py-1 rounded-lg capitalize font-bold transition-colors ${
                filterColor === c
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table List */}
      <div className="bg-[#10121a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#0c0d12] text-slate-400 sticky top-0 z-10 border-b border-slate-800 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Spin #</th>
                <th className="py-2.5 px-3">Number</th>
                <th className="py-2.5 px-3">Color</th>
                <th className="py-2.5 px-3">Parity</th>
                <th className="py-2.5 px-3">Dozen</th>
                <th className="py-2.5 px-3">Sector</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-[#12141e] text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                    Koi spins match nahi hue.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  let bgHex = '#212121';
                  if (s.color === 'red') bgHex = '#E53935';
                  else if (s.color === 'green') bgHex = '#4CAF50';

                  return (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2 px-3 font-bold text-slate-400">
                        #{s.spinNumber}
                      </td>
                      <td className="py-2 px-3">
                        <div
                          style={{ backgroundColor: bgHex }}
                          className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs text-white border border-white/20 shadow-sm"
                        >
                          {s.value}
                        </div>
                      </td>
                      <td className="py-2 px-3 font-semibold capitalize">
                        <span
                          className={
                            s.color === 'red'
                              ? 'text-red-400'
                              : s.color === 'green'
                              ? 'text-emerald-400'
                              : 'text-slate-300'
                          }
                        >
                          {s.color}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        {s.isEven === null ? '—' : s.isEven ? 'Even' : 'Odd'}
                      </td>
                      <td className="py-2 px-3 font-semibold">
                        {s.dozen ? `Dozen ${s.dozen}` : '—'}
                      </td>
                      <td className="py-2 px-3 capitalize text-slate-400">
                        {s.sector === 'none' ? '—' : s.sector}
                      </td>
                      <td className="py-2 px-3 text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(s.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={() => onDeleteSingle(s.id)}
                          className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
                          title="Delete spin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141620] border border-amber-900/50 rounded-2xl max-w-sm w-full p-5 shadow-2xl">
            <h3 className="text-base font-black text-amber-300 mb-2">
              Clear All Spins?
            </h3>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Kya aap sure hain ki saari history delete karni hai? Ye undo nahi ho sakta.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-[#202330] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAll();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-lg"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

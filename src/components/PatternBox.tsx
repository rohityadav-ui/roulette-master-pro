import React from 'react';
import { ChevronRight } from 'lucide-react';

interface PatternBoxProps {
  title: string;
  count: number;
  totalSpins: number;
  icon: string;
  colorName: 'blue' | 'cyan' | 'green' | 'yellow' | 'purple' | 'pink';
  description: string;
  onClick?: () => void;
  hasDetails?: boolean;
}

export const PatternBox: React.FC<PatternBoxProps> = ({
  title,
  count,
  totalSpins,
  icon,
  colorName,
  description,
  onClick,
  hasDetails = false,
}) => {
  const percentage = totalSpins > 0 ? Math.min(100, Math.round((count / totalSpins) * 100)) : 0;

  const colorStyles = {
    blue: {
      border: 'border-blue-500/40 hover:border-blue-400',
      text: 'text-blue-400',
      bar: 'bg-blue-500',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    cyan: {
      border: 'border-cyan-500/40 hover:border-cyan-400',
      text: 'text-cyan-400',
      bar: 'bg-cyan-500',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    green: {
      border: 'border-emerald-500/40 hover:border-emerald-400',
      text: 'text-emerald-400',
      bar: 'bg-emerald-500',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    yellow: {
      border: 'border-yellow-500/40 hover:border-yellow-400',
      text: 'text-yellow-400',
      bar: 'bg-yellow-500',
      badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    },
    purple: {
      border: 'border-purple-500/40 hover:border-purple-400',
      text: 'text-purple-400',
      bar: 'bg-purple-500',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    pink: {
      border: 'border-pink-500/40 hover:border-pink-400',
      text: 'text-pink-400',
      bar: 'bg-pink-500',
      badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    },
  }[colorName];

  return (
    <div
      onClick={onClick}
      className={`bg-gray-900/80 backdrop-blur-md rounded-2xl border ${colorStyles.border} p-3.5 shadow-xl flex flex-col justify-between transition-all select-none ${
        onClick ? 'cursor-pointer active:scale-95' : ''
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{icon}</span>
            <span className={`text-xs font-black uppercase tracking-wider ${colorStyles.text}`}>
              {title}
            </span>
          </div>
          {hasDetails && (
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
          )}
        </div>
        <p className="text-[11px] text-gray-400 leading-tight mb-2.5">
          {description}
        </p>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-xl sm:text-2xl font-black text-white">
            {count} <span className="text-xs font-bold text-gray-400">times</span>
          </span>
          <span className={`text-xs font-black px-2 py-0.5 rounded-lg border ${colorStyles.badge}`}>
            {percentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
          <div
            style={{ width: `${percentage}%` }}
            className={`h-full rounded-full ${colorStyles.bar} transition-all duration-300`}
          />
        </div>
      </div>
    </div>
  );
};

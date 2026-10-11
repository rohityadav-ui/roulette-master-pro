import React from 'react';
import { TabType } from '../types/roulette';
import {
  Home,
  Compass,
  BarChart2,
  ClipboardList,
  Target,
  Dices,
  Settings,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: 'Home', icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { key: 'neighbours', label: 'Neighbours', icon: <Compass className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { key: 'charts', label: 'Charts', icon: <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { key: 'history', label: 'History', icon: <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { key: 'patterns', label: 'Patterns', icon: <Target className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { key: 'rng', label: 'RNG', icon: <Dices className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { key: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-[#0c0d12]/95 backdrop-blur-lg border-t border-amber-950/70 z-40 py-1.5 px-2">
      <div className="max-w-4xl mx-auto grid grid-cols-7 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChangeTab(tab.key)}
              className={`py-1.5 rounded-xl flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'text-[#D4AF37] font-black bg-amber-950/40 ring-1 ring-amber-500/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#181a24]/50 font-medium'
              }`}
            >
              <div className="transition-transform duration-200">
                {tab.icon}
              </div>
              <span className="text-[9px] sm:text-[10px] mt-0.5 truncate tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

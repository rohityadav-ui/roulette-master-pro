import React from 'react';
import { ActiveTab } from '../types';
import { Home, Target, TrendingUp } from 'lucide-react';

interface TabBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onSelectTab }) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'HOME', icon: <Home className="w-4 h-4" /> },
    { id: 'patterns', label: 'PATTERNS', icon: <Target className="w-4 h-4" /> },
    { id: 'trends', label: 'TRENDS', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-gray-950/70 backdrop-blur-md border-b border-gray-800/80 px-3 py-1.5 sticky top-[57px] z-20">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2 p-1 bg-gray-900/90 rounded-2xl border border-gray-800/80 shadow-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black tracking-wider transition-all duration-200 select-none ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 shadow-lg shadow-amber-500/25 ring-1 ring-amber-400'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

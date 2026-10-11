import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SpinRecord, TabType } from './types/roulette';
import { calculateLiveStats, createSpinRecord } from './utils/rouletteAnalytics';
import {
  loadSessionFromStorage,
  saveSessionToStorage,
  loadLastRng,
  saveLastRng,
  hasSeenDisclaimer,
  markDisclaimerSeen,
} from './utils/storage';
import { TopBar } from './components/TopBar';
import { FrozenHistoryBar } from './components/FrozenHistoryBar';
import { RouletteGrid } from './components/RouletteGrid';
import { UndoClearBar } from './components/UndoClearBar';
import { LiveStats } from './components/LiveStats';
import { NeighboursTab } from './components/NeighboursTab';
import { PatternsTab } from './components/PatternsTab';
import { RngTab } from './components/RngTab';
import { ChartsTab } from './components/ChartsTab';
import { HistoryTab } from './components/HistoryTab';
import { SettingsTab } from './components/SettingsTab';
import { BottomNav } from './components/BottomNav';
import { DisclaimerModal } from './components/DisclaimerModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [spins, setSpins] = useState<SpinRecord[]>([]);
  const [lastRng, setLastRng] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const savedSpins = loadSessionFromStorage();
    if (savedSpins && savedSpins.length > 0) {
      setSpins(savedSpins);
    }
    const savedRng = loadLastRng();
    if (savedRng !== null) {
      setLastRng(savedRng);
    }

    // Check disclaimer
    if (!hasSeenDisclaimer()) {
      setShowDisclaimer(true);
    }
  }, []);

  // Save spins to storage on update
  useEffect(() => {
    saveSessionToStorage(spins);
  }, [spins]);

  // Live analytics
  const liveStats = useMemo(() => {
    return calculateLiveStats(spins);
  }, [spins]);

  // Add spin to history
  const handleSelectNumber = useCallback((val: number) => {
    setSpins((prev) => {
      const nextSpinNumber = prev.length + 1;
      const record = createSpinRecord(val, nextSpinNumber);
      return [...prev, record];
    });
  }, []);

  // Undo last spin
  const handleUndo = useCallback(() => {
    setSpins((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, prev.length - 1);
    });
  }, []);

  // Clear all spins
  const handleClearAll = useCallback(() => {
    setSpins([]);
    saveSessionToStorage([]);
  }, []);

  // Delete single spin from history tab
  const handleDeleteSingle = useCallback((id: string) => {
    setSpins((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      return filtered.map((s, idx) => ({ ...s, spinNumber: idx + 1 }));
    });
  }, []);

  // RNG generation - DOES NOT add to history, only updates Last RNG
  const handleSpinRng = useCallback((num: number) => {
    setLastRng(num);
    saveLastRng(num);
  }, []);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Roulette Master Pro',
          text: 'Check out this European Roulette Analyzer & Pattern Tracker!',
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('App link copied to clipboard!');
    }
  };

  // Reset all app data
  const handleResetAppData = () => {
    setSpins([]);
    setLastRng(null);
    saveSessionToStorage([]);
    saveLastRng(null);
    showToast('App data reset successfully!');
  };

  // Close disclaimer modal
  const handleCloseDisclaimer = () => {
    markDisclaimerSeen();
    setShowDisclaimer(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-black ${
        isDarkMode ? 'bg-[#0a0a0e] text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* 1. TOP BAR */}
      <TopBar
        onOpenSettings={() => setActiveTab('settings')}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onShare={handleShare}
        lastRng={lastRng}
      />

      {/* 2. FROZEN HISTORY BAR (Always sticky right below top bar) */}
      <FrozenHistoryBar spins={spins} />

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-5 pb-24 space-y-4">
        {/* HOME TAB: Exactly as ordered in user brief */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* ROULETTE GRID (0-36) */}
            <RouletteGrid onSelectNumber={handleSelectNumber} />

            {/* UNDO & CLEAR ALL BUTTONS */}
            <UndoClearBar
              onUndo={handleUndo}
              onClearAll={handleClearAll}
              canUndo={spins.length > 0}
            />

            {/* LIVE STATISTICS */}
            <LiveStats stats={liveStats} />
          </div>
        )}

        {/* NEIGHBOURS TAB */}
        {activeTab === 'neighbours' && (
          <NeighboursTab onSelectNumber={handleSelectNumber} />
        )}

        {/* CHARTS TAB */}
        {activeTab === 'charts' && (
          <ChartsTab spins={spins} stats={liveStats} />
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <HistoryTab
            spins={spins}
            onClearAll={handleClearAll}
            onDeleteSingle={handleDeleteSingle}
          />
        )}

        {/* PATTERNS TAB */}
        {activeTab === 'patterns' && (
          <PatternsTab spins={spins} onSelectNumber={handleSelectNumber} />
        )}

        {/* RNG TAB */}
        {activeTab === 'rng' && (
          <RngTab lastRng={lastRng} onSpinRng={handleSpinRng} />
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <SettingsTab
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
            language={language}
            onToggleLanguage={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            spins={spins}
            onClearHistory={handleClearAll}
            onResetAppData={handleResetAppData}
            onShare={handleShare}
            onOpenDisclaimer={() => setShowDisclaimer(true)}
          />
        )}
      </main>

      {/* BOTTOM NAVIGATION (7 items: Home, Neighbours, Charts, History, Patterns, RNG, Settings) */}
      <BottomNav activeTab={activeTab} onChangeTab={(t) => setActiveTab(t)} />

      {/* RESPONSIBLE GAMING DISCLAIMER MODAL */}
      <DisclaimerModal isOpen={showDisclaimer} onClose={handleCloseDisclaimer} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-2xl animate-in fade-in duration-150">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

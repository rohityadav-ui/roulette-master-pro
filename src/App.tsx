import React, { useState, useEffect } from 'react';
import { useHistory } from './hooks/useHistory';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { HistoryStrip } from './components/HistoryStrip';
import { ActionButtons } from './components/ActionButtons';
import { HomeTab } from './components/HomeTab';
import { PatternsTab } from './components/PatternsTab';
import { TrendsTab } from './components/TrendsTab';
import { getColorLabel } from './engine/colorMapper';

export default function App() {
  const {
    spins,
    activeTab,
    isListening,
    voiceError,
    setActiveTab,
    addSpin,
    undoLast,
    resetHistory,
    removeSpin,
    toggleVoice,
  } = useHistory();

  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);

  const handleAddSpinWithToast = (num: number) => {
    addSpin(num);
    const color = num === 0 ? 'Zero' : getColorLabel(num === 0 ? 'G' : [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(num) ? 'R' : 'B');
    setToast({
      message: `Logged #${num} (${color})`,
      id: Date.now(),
    });
    setTimeout(() => {
      setToast((prev) => (prev?.id === toast?.id ? null : prev));
    }, 1800);
  };

  const [isPinned, setIsPinned] = useState<boolean>(() => {
    return localStorage.getItem('roulette_layout_pinned') === 'true';
  });

  const handleTogglePin = () => {
    setIsPinned((prev) => {
      const next = !prev;
      localStorage.setItem('roulette_layout_pinned', String(next));
      return next;
    });
  };

  // Keyboard shortcut listener (Ctrl+Z to Undo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undoLast();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoLast]);

  return (
    <div className="min-h-screen bg-gray-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-amber-500/10 via-amber-700/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-cyan-500/5 blur-3xl rounded-full" />
      </div>

      {/* 1. Header (Always Visible) */}
      <Header
        isListening={isListening}
        onToggleVoice={toggleVoice}
        voiceError={voiceError}
      />

      {/* 2. Tab Bar (3 Tabs, Always Visible) */}
      <TabBar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* 3. History Strip (Always Visible, Sticky, RTL) */}
      <HistoryStrip spins={spins} onRemoveSpin={removeSpin} />

      {/* 4. Action Buttons (Undo, Reset, Voice, Always Visible) */}
      <ActionButtons
        canUndo={spins.length > 0}
        onUndo={undoLast}
        onReset={resetHistory}
        isListening={isListening}
        onToggleVoice={toggleVoice}
      />

      {/* 5. Main Content Area */}
      <main
        className={`flex-1 w-full mx-auto p-3 sm:p-4 pb-16 space-y-4 transition-all duration-300 ${
          isPinned && activeTab === 'home' ? 'max-w-xl md:max-w-5xl' : 'max-w-xl'
        }`}
      >
        {/* Tab 1: HOME */}
        {activeTab === 'home' && (
          <HomeTab
            spins={spins}
            onSelectNumber={handleAddSpinWithToast}
            isPinned={isPinned}
            onTogglePin={handleTogglePin}
          />
        )}

        {/* Tab 2: PATTERNS */}
        {activeTab === 'patterns' && (
          <PatternsTab
            spins={spins}
            onSelectNumber={handleAddSpinWithToast}
          />
        )}

        {/* Tab 3: TRENDS */}
        {activeTab === 'trends' && (
          <TrendsTab
            spins={spins}
            onSelectNumber={handleAddSpinWithToast}
          />
        )}
      </main>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-gray-950 font-black text-xs px-4 py-2 rounded-2xl shadow-2xl shadow-amber-500/40 border border-amber-300 animate-in fade-in zoom-in-95 duration-150">
          {toast.message}
        </div>
      )}
    </div>
  );
}

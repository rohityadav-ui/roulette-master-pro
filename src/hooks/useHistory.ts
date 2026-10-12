import { create } from 'zustand';
import { ActiveTab, SpinItem } from '../types';
import { getCategory, getColumn, getDozen } from '../engine/categories';
import { getColor } from '../engine/colorMapper';

interface HistoryState {
  spins: SpinItem[];
  activeTab: ActiveTab;
  isListening: boolean;
  voiceError: string | null;
  setActiveTab: (tab: ActiveTab) => void;
  addSpin: (num: number) => void;
  undoLast: () => void;
  resetHistory: () => void;
  removeSpin: (id: string) => void;
  toggleVoice: () => void;
}

// Web Audio API synthesizer for clean casino sound without broken asset files
class SoundFX {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playChip() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(400, t + 0.07);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.07);
    } catch {
      // ignore
    }
  }

  public playUndo() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.09);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.09);
    } catch {
      // ignore
    }
  }

  public playVoiceChime() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587, t);
      osc.frequency.setValueAtTime(880, t + 0.08);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    } catch {
      // ignore
    }
  }
}

export const soundFX = new SoundFX();

const STORAGE_KEY = 'roulette_pattern_hud_spins_v1';

function loadStoredSpins(): SpinItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

function saveStoredSpins(spins: SpinItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spins));
  } catch {
    // ignore
  }
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onresult: ((event: { results: { [key: number]: { [key: number]: { transcript: string } }; length: number } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

let recognitionInstance: SpeechRecognitionInstance | null = null;

export const useHistory = create<HistoryState>((set, get) => ({
  spins: loadStoredSpins(),
  activeTab: 'home',
  isListening: false,
  voiceError: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  addSpin: (num) => {
    soundFX.playChip();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(20);
      } catch {
        // ignore
      }
    }

    const newSpin: SpinItem = {
      id: `spin_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      value: num,
      color: getColor(num),
      category: getCategory(num),
      dozen: getDozen(num),
      column: getColumn(num),
      timestamp: Date.now(),
    };

    set((state) => {
      const updated = [...state.spins, newSpin];
      saveStoredSpins(updated);
      return { spins: updated };
    });
  },

  undoLast: () => {
    soundFX.playUndo();
    set((state) => {
      if (state.spins.length === 0) return state;
      const updated = state.spins.slice(0, -1);
      saveStoredSpins(updated);
      return { spins: updated };
    });
  },

  resetHistory: () => {
    soundFX.playUndo();
    saveStoredSpins([]);
    set({ spins: [] });
  },

  removeSpin: (id) => {
    soundFX.playUndo();
    set((state) => {
      const updated = state.spins.filter((s) => s.id !== id);
      saveStoredSpins(updated);
      return { spins: updated };
    });
  },

  toggleVoice: () => {
    const currentState = get().isListening;
    if (currentState) {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch {
          // ignore
        }
      }
      set({ isListening: false });
      return;
    }

    // Check speech recognition support
    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRec) {
      set({ voiceError: 'Speech Recognition not supported in this browser' });
      setTimeout(() => set({ voiceError: null }), 3000);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognitionInstance = recognition;
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        soundFX.playVoiceChime();
        set({ isListening: true, voiceError: null });
      };

      recognition.onresult = (event) => {
        const last = event.results[event.results.length - 1];
        if (last && last[0]) {
          const transcript = last[0].transcript.toLowerCase().trim();
          let matchedNumber: number | null = null;

          if (transcript.includes('zero') || transcript.includes('shunya')) {
            matchedNumber = 0;
          } else {
            const digits = transcript.match(/\d+/);
            if (digits) {
              const parsed = parseInt(digits[0], 10);
              if (parsed >= 0 && parsed <= 36) {
                matchedNumber = parsed;
              }
            }
          }

          if (matchedNumber !== null) {
            get().addSpin(matchedNumber);
          }
        }
      };

      recognition.onerror = () => {
        set({ isListening: false, voiceError: 'Voice recognition stopped' });
        setTimeout(() => set({ voiceError: null }), 3000);
      };

      recognition.onend = () => {
        set({ isListening: false });
      };

      recognition.start();
    } catch {
      set({ isListening: false, voiceError: 'Could not start voice recognition' });
      setTimeout(() => set({ voiceError: null }), 3000);
    }
  },
}));

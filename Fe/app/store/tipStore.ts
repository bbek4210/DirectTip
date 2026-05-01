import { create } from 'zustand';
import { Tip } from '../lib/api-types';

interface TipStore {
  tips: Tip[];
  filteredTips: Tip[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setTips: (tips: Tip[]) => void;
  addTip: (tip: Tip) => void;
  updateTipStatus: (tipId: string, status: Tip['status']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  filterByStatus: (status: Tip['status']) => void;
  clearTips: () => void;
}

export const useTipStore = create<TipStore>((set) => ({
  tips: [],
  filteredTips: [],
  isLoading: false,
  error: null,

  setTips: (tips) => {
    set({ tips, filteredTips: tips });
  },

  addTip: (tip) => {
    set((state) => ({
      tips: [tip, ...state.tips],
      filteredTips: [tip, ...state.filteredTips],
    }));
  },

  updateTipStatus: (tipId, status) => {
    set((state) => {
      const updatedTips = state.tips.map((tip) =>
        tip._id === tipId ? { ...tip, status } : tip
      );
      return {
        tips: updatedTips,
        filteredTips: updatedTips,
      };
    });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },

  filterByStatus: (status) => {
    set((state) => ({
      filteredTips: state.tips.filter((tip) => tip.status === status),
    }));
  },

  clearTips: () => {
    set({ tips: [], filteredTips: [], error: null });
  },
}));

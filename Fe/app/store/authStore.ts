import { create } from 'zustand';
import { User, Creator } from '../lib/api-types';
import { authService, creatorService } from '../lib/api-service';

interface AuthStore {
  user: User | null;
  creator: Creator | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  register: (email: string, walletAddress: string, role: 'creator' | 'viewer') => Promise<void>;
  login: (email: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setCreator: (creator: Creator | null) => void;
  initializeFromStorage: () => void;
  fetchCreator: (creatorId: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  creator: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  register: async (email, walletAddress, role) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(email, walletAddress, role);
      set({ user, isLoading: false, isInitialized: true });
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  login: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(email);
      set({ user, isLoading: false, isInitialized: true });
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({ user: null, creator: null, isInitialized: true });
    localStorage.removeItem('user');
    localStorage.removeItem('creator');
  },

  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },

  setCreator: (creator) => {
    set({ creator });
    if (creator) {
      localStorage.setItem('creator', JSON.stringify(creator));
    } else {
      localStorage.removeItem('creator');
    }
  },

  fetchCreator: async (creatorId) => {
    set({ isLoading: true, error: null });
    try {
      const creator = await creatorService.getById(creatorId);
      set({ creator, isLoading: false });
      localStorage.setItem('creator', JSON.stringify(creator));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch creator';
      set({ error: errorMessage, isLoading: false });
    }
  },

  initializeFromStorage: () => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedCreator = localStorage.getItem('creator');
      
      if (storedUser) {
        set({ user: JSON.parse(storedUser), isInitialized: true });
      }
      if (storedCreator) {
        set({ creator: JSON.parse(storedCreator) });
      }
    } catch (error) {
      console.error('Failed to initialize from storage:', error);
      set({ isInitialized: true });
    }
  },
}));


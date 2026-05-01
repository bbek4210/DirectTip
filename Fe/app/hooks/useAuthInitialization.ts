import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

/**
 * Hook to initialize auth state from localStorage on app load
 * Call this in a useEffect at the app root level
 */
export const useAuthInitialization = () => {
  useEffect(() => {
    const { initializeFromStorage } = useAuthStore.getState();
    initializeFromStorage();
  }, []);
};

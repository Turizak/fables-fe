import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // Helper function to check if we're in the client
  const isClient = () => typeof window !== 'undefined';

  // Get initial tokens from localStorage if available
  const getInitialToken = () => (isClient() ? localStorage.getItem('authToken') : null);
  const getInitialRefreshToken = () => (isClient() ? localStorage.getItem('refreshToken') : null);

  const token = ref<string | null>(getInitialToken());
  const refreshToken = ref<string | null>(getInitialRefreshToken());

  const setToken = (newToken: string) => {
    token.value = newToken;
    if (isClient()) {
      localStorage.setItem('authToken', newToken);
    }
  };

  const setRefreshToken = (newRefreshToken: string) => {
    refreshToken.value = newRefreshToken;
    if (isClient()) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }
  };

  const clearTokens = () => {
    token.value = null;
    refreshToken.value = null;
    if (isClient()) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  };

  const isAuthenticated = computed(() => !!token.value);

  return {
    token,
    refreshToken,
    setToken,
    setRefreshToken,
    clearTokens,
    isAuthenticated,
  };
});

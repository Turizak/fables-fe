import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import jwtDecode from 'jwt-decode';

export const useAuthStore = defineStore('auth', () => {
  // Helper function to check if we're in the client
  const isClient = () => typeof window !== 'undefined';

  // Get initial tokens from localStorage if available
  const getInitialToken = () =>
    isClient() ? localStorage.getItem('authToken') : null;
  const getInitialRefreshToken = () =>
    isClient() ? localStorage.getItem('refreshToken') : null;

  const token = ref<string | null>(getInitialToken());
  const refreshToken = ref<string | null>(getInitialRefreshToken());
  const decodedToken = ref<any>(null);

  // Decode the token if it exists when the store initializes
  if (token.value) {
    try {
      decodedToken.value = jwtDecode(token.value);
    } catch (error) {
      console.error('Invalid token at store initialization:', error);
    }
  }

  // Function to decode and store the token
  const decodeToken = (newToken: string) => {
    try {
      decodedToken.value = jwtDecode(newToken);
    } catch (error) {
      console.error('Invalid token:', error);
    }
  };

  const setToken = (newToken: string) => {
    token.value = newToken;
    if (isClient()) {
      localStorage.setItem('authToken', newToken);
    }
    // Decode the new token and store it
    decodeToken(newToken);
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
    decodedToken.value = null;
    if (isClient()) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  };

  const isAuthenticated = computed(() => !!token.value);

  return {
    token,
    decodedToken,
    refreshToken,
    setToken,
    setRefreshToken,
    clearTokens,
    isAuthenticated,
  };
});
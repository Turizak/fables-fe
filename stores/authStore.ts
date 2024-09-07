import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import jwtDecode from 'jwt-decode';

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig();

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
    decodeToken(newToken);
  };

  const setRefreshToken = (newRefreshToken: string) => {
    refreshToken.value = newRefreshToken;
    if (isClient()) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }
  };

    // Check if token is expired
    const isTokenExpired = () => {
      if (!decodedToken.value?.exp) return true;
  
      // Check if the token expiration time has passed
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return decodedToken.value.exp < currentTime;
    };

    // Function to refresh the token
  const refreshAuthToken = async () => {
    if (!refreshToken.value) return;

    try {
      const response: any = await $fetch(config.public.baseURL + '/account/token/refresh',  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          refreshToken: refreshToken.value,
        },
      });
      const newToken = response.data.token;
      setToken(newToken);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      clearTokens();
    }
  };

  // Function to handle token refresh if expired
  const ensureValidToken = async () => {
    if (isTokenExpired()) {
      await refreshAuthToken(); // Refresh token if expired
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
    ensureValidToken,
  };
});
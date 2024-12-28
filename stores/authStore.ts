// SPDX-License-Identifier: Apache-2.0
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import jwtDecode from "jwt-decode";
import type { JwtPayload } from "jwt-decode";
import type { AuthResponse } from "~/types/types";

export const useAuthStore = defineStore("auth", () => {
  const config = useRuntimeConfig();

  // Helper function to check if we're in the client
  const isClient = () => typeof window !== "undefined";

  // Get initial tokens from localStorage if available
  const getInitialToken = (): string | null =>
    isClient() ? localStorage.getItem("authToken") : null;
  const getInitialRefreshToken = (): string | null =>
    isClient() ? localStorage.getItem("refreshToken") : null;

  const token = ref<string | null>(getInitialToken());
  const refreshToken = ref<string | null>(getInitialRefreshToken());
  const decodedToken = ref<JwtPayload | null>(null);

  // Decode the token if it exists when the store initializes
  if (token.value) {
    try {
      decodedToken.value = jwtDecode<JwtPayload>(token.value);
    } catch (error) {
      console.error("Invalid token at store initialization:", error);
    }
  }

  // Function to decode and store the token
  const decodeToken = (newToken: string) => {
    try {
      decodedToken.value = jwtDecode<JwtPayload>(newToken);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  const setToken = (newToken: string) => {
    token.value = newToken;
    if (isClient()) {
      localStorage.setItem("authToken", newToken);
    }
    decodeToken(newToken);
  };

  const setRefreshToken = (newRefreshToken: string) => {
    refreshToken.value = newRefreshToken;
    if (isClient()) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }
  };

  // Check if token is expired
  const isTokenExpired = (): boolean => {
    if (!decodedToken.value?.exp) return true;

    // Check if the token expiration time has passed
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decodedToken.value.exp < currentTime;
  };

  const refreshAuthToken = async () => {
    if (!refreshToken.value) return;
  
    try {
      const { data, error } = await useFetch<AuthResponse>(
        config.public.baseURL + "/account/token/refresh", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refreshToken: refreshToken.value,
          }),
        }
      );
  
      if (error.value) {
        console.error("Failed to refresh token:", error.value);
        clearTokens();
        await navigateTo("/login");
        return;
      }
  
      // Use data.value since useFetch returns a Ref
      const newToken = data.value?.data.tokens.accessToken;
      const newRefreshToken = data.value?.data.tokens.refreshToken;
  
      if (newToken && newRefreshToken) {
        setToken(newToken);
        setRefreshToken(newRefreshToken);
        console.log("Token refreshed successfully");
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      clearTokens();
      await navigateTo("/login");
    }
  };

  // Function to handle token refresh if expired
  const ensureValidToken = async () => {
    if (isTokenExpired()) {
      await refreshAuthToken(); // Refresh token if expired
    } else console.log("Token is not expired");
  };

  const clearTokens = () => {
    token.value = null;
    refreshToken.value = null;
    decodedToken.value = null;
    if (isClient()) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
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

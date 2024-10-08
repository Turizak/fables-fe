import { useAuthStore } from "~/stores/authStore";

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();
  try {
    await authStore.ensureValidToken();
  } catch (error) {
    console.error("Error ensuring valid token:", error);
    return navigateTo("/login");
  }

  if (!authStore.refreshToken || authStore.refreshToken === null) {
    return navigateTo("/login");
  }
});

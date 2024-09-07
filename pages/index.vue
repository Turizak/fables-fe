<script setup>
import { useAuthStore } from '~/stores/authStore';

const authStore = useAuthStore();
const config = useRuntimeConfig();

const buttonText = ref('Refresh Token');
const loading = ref(false);

// Function to format the UNIX timestamp
const formatUnixTimestamp = (unixTimestamp) => {
  if (!unixTimestamp) return 'Invalid timestamp';
  const date = new Date(unixTimestamp * 1000); // Convert UNIX timestamp to milliseconds
  return date.toLocaleString(); // Customize the formatting as needed
};

const formattedExpirationTime = computed(() => {
  const exp = authStore.decodedToken?.exp;
  return exp ? formatUnixTimestamp(exp) : 'Token not available';
});

const refreshAuthToken = async () => {
  loading.value = true;
  buttonText.value = 'Refreshing';
  try {
    const response = await $fetch(
      config.public.baseURL + '/account/token/refresh',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          refreshToken: authStore.refreshToken,
        },
      }
    );
    const newToken = response.data.token;
    authStore.setToken(newToken);
  } catch (error) {
    console.error('Failed to refresh token:', error);
    authStore.clearTokens();
  } finally {
    loading.value = false;
    buttonText.value = 'Refresh Token';
  }
};

// const fetchProtectedData = async () => {
//   await authStore.ensureValidToken();
//   try {
//     const data = await $fetch('/api/protected', {
//       headers: {
//         Authorization: `Bearer ${authStore.token}`,
//       },
//     });
//     console.log(data);
//   } catch (error) {
//     console.error('Failed to fetch protected data:', error);
//   }
// };
</script>

<template>
  <div class="flex flex-col text-center items-center justify-center">
    <h1 class="text-5xl p-2">Home Page</h1>
    <div class="w-[260px] mt-2">
      <UButton
        class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="loading"
        @click="refreshAuthToken"
      >
        {{ buttonText }}</UButton
      >
      <p class="mt-2 text-l">Expiration: {{ formattedExpirationTime }}</p>
    </div>
  </div>
</template>

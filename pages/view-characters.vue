<script setup lang="ts">
import type { ApiResponse, Character } from "~/types/types";

definePageMeta({
  middleware: "fresh-token",
});
const config = useRuntimeConfig();
const authStore = useAuthStore();

const { data: apiResponse } = await useFetch<
  ApiResponse<{ characters: Character[] }>
>("/account/owned-characters", {
  baseURL: config.public.baseURL,
  headers: {
    Authorization: `Bearer ${authStore.token}`,
    "Content-Type": "application/json",
  },
});

const characters = computed(() => apiResponse.value?.data.characters ?? []);
</script>

<template>
  <div>
    <h2 class="text-5xl text-center p-2 mb-4">Characters</h2>
    <div
      v-if="characters.length > 0"
      class="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <ViewCharacter
        v-for="character in characters"
        :key="character.uuid"
        :character="character"
      />
    </div>
    <p v-else>No characters found.</p>
  </div>
</template>

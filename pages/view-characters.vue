<script setup lang="ts">
type Character = {
  uuid: string;
  campaignUuid: string;
  creatorUuid: string;
  ownerUuid: string;
  firstName: string;
  lastName: string;
  race: string;
  class: string;
  age: number;
  height: number;
  weight: number;
  eyeColor: string;
  skinColor: string;
  hairColor: string;
  ruleset: string;
  created: {
    time: string;
    valid: boolean;
  };
  lastUpdated: null | string;
};

type ApiResponse = {
  data: {
    characters: Character;
  };
  message: string;
  status: number;
  statusText: string;
  timestamp: string;
};

definePageMeta({
  middleware: "fresh-token",
});
const config = useRuntimeConfig();
const authStore = useAuthStore();

const { data: apiResponse } = await useFetch<ApiResponse>(
  "/account/owned-characters",
  {
    baseURL: config.public.baseURL,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      "Content-Type": "application/json",
    },
  },
);

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

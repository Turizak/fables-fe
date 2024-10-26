<script setup lang="ts">
import type { ApiResponse, CampaignAll } from "~/types/types";
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/authStore";

const route = useRoute();
const uuid = route.params.uuid;

definePageMeta({
  middleware: "fresh-token",
});

const config = useRuntimeConfig();
const authStore = useAuthStore();

const { data: apiResponse } = await useFetch<ApiResponse<CampaignAll>>(
  `/campaign/${uuid}/all`,
  {
    baseURL: config.public.baseURL,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      "Content-Type": "application/json",
    },
  },
);

const items = [
  {
    label: "Characters",
    icon: "i-material-symbols:groups",
    defaultOpen: false,
    slot: "characters",
  },
  {
    label: "Locations",
    icon: "i-material-symbols:location-on",
    defaultOpen: false,
    slot: "locations",
  },
  {
    label: "NPCs",
    icon: "i-material-symbols-light:chat-bubble",
    defaultOpen: false,
    slot: "npcs",
  },
];

const campaign = computed(() => apiResponse.value?.data.campaign ?? null);
const characters = computed(() => apiResponse.value?.data.characters ?? []);
const locations = computed(() => apiResponse.value?.data.locations ?? []);
</script>

<template>
  <div class="text-center p-2">
    <UCard>
      <template #header>
        <h2 v-if="campaign" class="text-5xl">{{ campaign.name }}</h2>
        <p v-else>Loading campaign data...</p>
      </template>
      <UAccordion multiple :items="items">
        <template #item="{ item }">
          <p class="text-xl">
            {{ item.description }}
          </p>
        </template>

        <template #characters>
          <div
            v-if="characters.length > 0"
            class="flex flex-row flex-wrap flex-grow-0 gap-2"
          >
            <div v-for="character in characters" :key="character.uuid">
              <UTooltip>
                <template #text>
                  <p>{{ character.race + " " + character.class }}</p>
                </template>
                <UButton class="text-md my-2">
                  {{ character.firstName + " " + character.lastName }}
                </UButton>
              </UTooltip>
            </div>
          </div>
          <p v-else>No characters found.</p>
        </template>
        <template #locations>
          <div
            v-if="locations.length > 0"
            class="flex flex-row flex-wrap flex-grow-0 gap-2"
          >
            <UButton
              v-for="location in locations"
              :key="location.uuid"
              class="text-md my-2"
            >
              {{ location.name }}
            </UButton>
          </div>
          <p v-else>No locations found.</p>
        </template>
      </UAccordion>
    </UCard>
  </div>
</template>

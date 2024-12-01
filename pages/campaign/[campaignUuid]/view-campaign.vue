<script setup lang="ts">
import type { ApiResponse, CampaignAll } from "~/types/types";
import { format } from "date-fns";
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/authStore";

const route = useRoute();
const campaignUuid = route.params.campaignUuid;

definePageMeta({
  middleware: "fresh-token",
});

const config = useRuntimeConfig();
const authStore = useAuthStore();

const { data: apiResponse } = await useFetch<ApiResponse<CampaignAll>>(
  `/campaign/${campaignUuid}/all`,
  {
    baseURL: config.public.baseURL,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      "Content-Type": "application/json",
    },
  },
);

const links = [
  {
    label: "Character",
    labelClass: "text-lg",
    icon: "i-material-symbols-light:add-circle",
  },
  {
    label: "Quest",
    labelClass: "text-lg",
    icon: "i-material-symbols-light:add-circle",
    // to: `/campaign/${campaignUuid}/add-npc`,
  },
  {
    label: "Session",
    labelClass: "text-lg",
    icon: "i-material-symbols-light:add-circle",
    to: `/campaign/${campaignUuid}/add-session`,
  },
];

const items = [
  {
    label: "Characters",
    icon: "i-material-symbols-light:groups",
    defaultOpen: false,
    slot: "characters",
  },
  {
    label: "Locations",
    icon: "i-material-symbols-light:location-on",
    defaultOpen: false,
    slot: "locations",
  },
  {
    label: "NPCs",
    icon: "i-material-symbols-light:chat-bubble",
    defaultOpen: false,
    slot: "npcs",
  },
  {
    label: "Quests",
    icon: "i-material-symbols-light:swords-rounded",
    defaultOpen: false,
    slot: "quests",
  },
  {
    label: "Sessions",
    icon: "i-material-symbols-light:calendar-month",
    defaultOpen: false,
    slot: "sessions",
  },
];

const campaign = computed(() => apiResponse.value?.data.campaign ?? null);
const characters = computed(() => apiResponse.value?.data.characters ?? []);
const locations = computed(() => apiResponse.value?.data.locations ?? []);
const npcs = computed(() => apiResponse.value?.data.npcs ?? []);
const sessions = computed(() => apiResponse.value?.data.sessions ?? []);
</script>

<template>
  <div class="text-center p-2">
    <UHorizontalNavigation
      :links="links"
      class="flex justify-around border-gray-200 dark:border-gray-800"
    />
    <UCard>
      <template #header>
        <h2 v-if="campaign" class="text-5xl">
          {{ campaign.name }}
        </h2>
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
              <UTooltip>
                <template #text>
                  <p>{{ location.description }}</p>
                </template>
                {{ location.name }}
              </UTooltip>
            </UButton>
          </div>
          <p v-else>No locations found.</p>
        </template>
        <template #npcs>
          <div
            v-if="npcs.length > 0"
            class="flex flex-row flex-wrap flex-grow-0 gap-2"
          >
            <UButton v-for="npc in npcs" :key="npc.uuid" class="text-md my-2">
              <UTooltip>
                <template #text>
                  <p>{{ npc.description }}</p>
                </template>
                {{ npc.firstName + " " + npc.lastName }}
              </UTooltip>
            </UButton>
          </div>
          <p v-else>No NPCs found.</p>
        </template>
        <template #sessions>
          <div
            v-if="sessions.length > 0"
            class="flex flex-row flex-wrap flex-grow-0 gap-2"
          >
            <UButton
              v-for="session in sessions"
              :key="session.uuid"
              class="text-md mt-2"
              @click="
                navigateTo(
                  `/campaign/${campaignUuid}/session/${session.uuid}/view-session`,
                )
              "
            >
              <p>
                {{ format(new Date(session.dateOccured.time), "MMM-dd, yyyy") }}
              </p>
            </UButton>
          </div>
          <p v-else>No sessions found.</p>
        </template>
      </UAccordion>
    </UCard>
  </div>
</template>

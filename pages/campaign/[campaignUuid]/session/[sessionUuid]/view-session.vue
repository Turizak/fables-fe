<script setup lang="ts">
import type { ApiResponse, Campaign, Session } from "~/types/types";
import { format } from "date-fns";
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/authStore";

const route = useRoute();
const campaignUuid = route.params.campaignUuid;
const sessionUuid = route.params.sessionUuid;

definePageMeta({
  middleware: "fresh-token",
});

const config = useRuntimeConfig();
const authStore = useAuthStore();

const { data: sessionData } = await useFetch<ApiResponse<Session>>(
  `/campaign/${campaignUuid}/session/${sessionUuid}`,
  {
    baseURL: config.public.baseURL,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      "Content-Type": "application/json",
    },
  },
);

const { data: campaignData } = await useFetch<ApiResponse<Campaign>>(
  `/campaign/${campaignUuid}`,
  {
    baseURL: config.public.baseURL,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      "Content-Type": "application/json",
    },
  },
);

const session = computed(() => sessionData.value?.data?.session ?? null);
const campaign = computed(() => campaignData.value?.data.campaign ?? null);

const links = [
  {
    label: "Character",
    labelClass: "text-lg",
    icon: "i-material-symbols-light:add-circle",
  },
  {
    label: "Location",
    labelClass: "text-lg",
    icon: "i-material-symbols-light:add-circle",
    to: `/campaign/${campaignUuid}/session/${sessionUuid}/add-location`,
  },
  {
    label: "Note",
    labelClass: "text-lg",
    icon: "i-material-symbols-light:add-circle",
    to: `/campaign/${campaignUuid}/session/${sessionUuid}/add-note`,
  },
  {
    label: "NPC",
    labelClass: "text-lg",
    icon: "i-material-symbols-light:add-circle",
    to: `/campaign/${campaignUuid}/session/${sessionUuid}/add-npc`,
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
    label: "Notes",
    icon: "i-material-symbols-light:note-stack-rounded",
    defaultOpen: false,
    slot: "notes",
  },
  {
    label: "NPCs",
    icon: "i-material-symbols-light:chat-bubble",
    defaultOpen: false,
    slot: "npcs",
  },
];
</script>

<template>
  <div class="text-center p-2">
    <UCard class="mt-2">
      <template #header>
        <h2 v-if="campaign" class="text-4xl mb-4">
          {{ campaign.name }}
        </h2>
        <p v-else>Error loading campaign</p>
        <UDivider
          label="Add To Session"
          :ui="{ label: 'text-primary-500 dark:text-primary-400' }"
        />
        <UHorizontalNavigation
          :links="links"
          class="flex justify-around border-gray-200 dark:border-gray-800 mb-2"
        />
        <UDivider
          label="Session Date"
          :ui="{ label: 'text-primary-500 dark:text-primary-400' }"
        />
        <h3 v-if="session" class="text-4xl mt-2">
          {{ format(new Date(session.dateOccured.time), "MMM-dd, yyyy") }}
        </h3>
        <p v-else>Loading session data...</p>
      </template>
      <UAccordion multiple :items="items">
        <template #item="{ item }">
          <p class="text-xl">
            {{ item.description }}
          </p>
        </template>
        <template #characters>
          <!-- <div
            v-if="characters.length > 0"
            class="flex flex-row flex-wrap flex-grow-0 gap-2"
          > -->
          <!-- <div v-for="character in characters" :key="character.uuid">
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
          <p v-else>No characters found.</p> -->
        </template>
        <template #locations>
          <!-- <div
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
          <p v-else>No locations found.</p> -->
        </template>
        <template #npcs>
          <!-- <div
            v-if="npcs.length > 0"
            class="flex flex-row flex-wrap flex-grow-0 gap-2"
          >
            <UButton v-for="npc in npcs" :key="npc.uuid" class="text-md mt-2">
              <UTooltip>
                <template #text>
                  <p>{{ npc.description }}</p>
                </template>
                {{ npc.firstName + " " + npc.lastName }}
              </UTooltip>
            </UButton>
          </div> -->
          <!-- <p v-else>No NPCs found.</p> -->
        </template>
      </UAccordion>
    </UCard>
  </div>
</template>

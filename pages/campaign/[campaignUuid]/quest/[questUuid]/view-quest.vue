// SPDX-License-Identifier: Apache-2.0
<script setup lang="ts">
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/authStore";
import { format } from "date-fns";
import type {
  CharacterResponse,
  LocationResponse,
  NPCResponse,
  QuestResponse,
  SessionResponse,
} from "~/types/types";

definePageMeta({
  middleware: "fresh-token",
});

onMounted(async () => {
  if (questData.value) {
    state.name = questData.value?.data.quest.name ?? "";
    state.description = questData.value?.data.quest.description ?? "";
    state.questGiverUuid = questData.value?.data.quest.questGiver ?? "";
    state.locationUuids = questData.value?.data.quest.locationUuids ?? [];
    state.npcUuids = questData.value?.data.quest.npcUuids ?? [];
    state.partyUuids = questData.value?.data.quest.partyUuids ?? [];
    state.bossUuids = questData.value?.data.quest.bossUuids ?? [];
    state.startingSessionUuid =
      questData.value?.data.quest.startingSessionUuid ?? "";
    state.endingSessionUuid =
      questData.value?.data.quest.endingSessionUuid ?? "";
  }

  // Fetch questGiver by UUID
  if (state.questGiverUuid.length > 0) {
    const { data: questGiverData, error: questGiverDataError } =
      await useFetch<NPCResponse>(
        `/campaign/${campaignUuid}/npc/${state.questGiverUuid}`,
        {
          baseURL: config.public.baseURL,
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            "Content-Type": "application/json",
          },
        },
      );
    if (questGiverDataError.value) {
      console.error(
        "Error fetching quest giver details:",
        questGiverDataError.value,
      );
      return;
    }
    state.questGiver =
      questGiverData.value?.data.npc.firstName +
      " " +
      questGiverData.value?.data.npc.lastName;
  }

  // Fetch location by UUID
  if (state.locationUuids.length > 0) {
    const fetchedLocationDetails = await Promise.all(
      state.locationUuids.map(async (locationUuid) => {
        const locationDetails = await fetchLocationDetails(locationUuid);
        return locationDetails;
      }),
    );
    state.locationDetails = fetchedLocationDetails.filter(
      (details) => details !== null,
    );
  }

  // Fetch NPC by UUID
  if (state.npcUuids.length > 0) {
    const fetchedNPCDetails = await Promise.all(
      state.npcUuids.map(async (npcUuid) => {
        const npcDetails = await fetchNPCDetails(npcUuid);
        return npcDetails;
      }),
    );
    state.locationDetails = fetchedNPCDetails.filter(
      (details) => details !== null,
    );
  }

  // Fetch Character by UUID
  if (state.partyUuids.length > 0) {
    const fetchedCharacterDetails = await Promise.all(
      state.partyUuids.map(async (characterUuid) => {
        const characterDetails = await fetchCharacterDetails(characterUuid);
        return characterDetails;
      }),
    );
    state.characterDetails = fetchedCharacterDetails.filter(
      (details) => details !== null,
    );
  }

  // Fetch all bosses by bossUuid
  if (state.bossUuids.length > 0) {
    const fetchedBossDetails = await Promise.all(
      state.bossUuids.map(async (bossUuid) => {
        const bossDetails = await fetchBossDetails(bossUuid);
        return bossDetails;
      }),
    );
    state.bossDetails = fetchedBossDetails.filter(
      (details) => details !== null,
    );
  }

  // Fetch starting session by UUID
  if (state.startingSessionUuid.length > 0) {
    const { data: startingSessionData, error: startingSessionDataError } =
      await useFetch<SessionResponse>(
        `/campaign/${campaignUuid}/session/${state.startingSessionUuid}`,
        {
          baseURL: config.public.baseURL,
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            "Content-Type": "application/json",
          },
        },
      );
    if (startingSessionDataError.value) {
      console.error(
        "Error fetching starting session details:",
        startingSessionDataError.value,
      );
      return;
    }
    const dateOccured =
      startingSessionData.value?.data.session.dateOccured.time;
    if (dateOccured) {
      state.startingSession = format(new Date(dateOccured), "MMM-dd, yyyy");
    } else {
      console.error("Invalid date received for starting session");
    }
  }

  // Fetch ending session by UUID
  if (state.endingSessionUuid.length > 0) {
    const { data: endingSessionData, error: endingSessionDataError } =
      await useFetch<SessionResponse>(
        `/campaign/${campaignUuid}/session/${state.endingSessionUuid}`,
        {
          baseURL: config.public.baseURL,
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            "Content-Type": "application/json",
          },
        },
      );
    if (endingSessionDataError.value) {
      console.error(
        "Error fetching ending session details:",
        endingSessionDataError.value,
      );
      return;
    }
    const dateOccured = endingSessionData.value?.data.session.dateOccured.time;
    if (dateOccured) {
      state.startingSession = format(new Date(dateOccured), "MMM-dd, yyyy");
    } else {
      console.error("Invalid date received for starting session");
    }
  }
  state.loading = false;
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const route = useRoute();
const campaignUuid = route.params.campaignUuid;
const questUuid = route.params.questUuid;

const state = reactive({
  name: "",
  description: "",
  questGiver: "",
  questGiverUuid: "",
  bossUuids: [] as string[],
  bossDetails: [] as NPCResponse[],
  locationUuids: [] as string[],
  locationDetails: [] as LocationResponse[],
  npcUuids: [] as string[],
  npcDetails: [] as string[],
  partyUuids: [] as string[],
  characterDetails: [] as CharacterResponse[],
  startingSession: "",
  startingSessionUuid: "",
  endingSession: "Present",
  endingSessionUuid: "",
  disabled: false,
  loading: false,
});

const { data: questData, error: questDataError } =
  await useFetch<QuestResponse>(
    `/campaign/${campaignUuid}/quest/${questUuid}`,
    {
      baseURL: config.public.baseURL,
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/json",
      },
    },
  );

if (questDataError.value) {
  console.error("Error fetching quests:", questDataError.value);
}

const fetchBossDetails = async (bossUuid: string) => {
  const { data: bossData, error: bossDataError } = await useFetch<NPCResponse>(
    `/campaign/${campaignUuid}/npc/${bossUuid}`,
    {
      baseURL: config.public.baseURL,
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/json",
      },
    },
  );
  if (bossDataError.value) {
    console.error("Error fetching boss details:", bossDataError.value);
    return null;
  }
  return bossData.value;
};

const fetchLocationDetails = async (locationUuid: string) => {
  const { data: locationData, error: locationDataError } =
    await useFetch<LocationResponse>(
      `/campaign/${campaignUuid}/location/${locationUuid}`,
      {
        baseURL: config.public.baseURL,
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
      },
    );
  if (locationDataError.value) {
    console.error("Error fetching location details:", locationDataError.value);
    return null;
  }
  return locationData.value;
};

const fetchNPCDetails = async (npcUuid: string) => {
  const { data: npcData, error: npcDataError } =
    await useFetch<LocationResponse>(
      `/campaign/${campaignUuid}/npc/${npcUuid}`,
      {
        baseURL: config.public.baseURL,
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
      },
    );
  if (npcDataError.value) {
    console.error("Error fetching location details:", npcDataError.value);
    return null;
  }
  return npcData.value;
};

const fetchCharacterDetails = async (characterUuid: string) => {
  const { data: characterData, error: characterDataError } =
    await useFetch<CharacterResponse>(
      `/campaign/${campaignUuid}/character/${characterUuid}`,
      {
        baseURL: config.public.baseURL,
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
      },
    );
  if (characterDataError.value) {
    console.error("Error fetching location details:", characterDataError.value);
    return null;
  }
  return characterData.value;
};

const items = [
  {
    label: "Giver",
    icon: "i-material-symbols-light:calendar-month",
    defaultOpen: false,
    slot: "giver",
  },
  {
    label: "Bosses",
    icon: "i-material-symbols-light:groups",
    defaultOpen: false,
    slot: "bosses",
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
    label: "Party",
    icon: "i-material-symbols-light:swords-rounded",
    defaultOpen: false,
    slot: "party",
  },
];
</script>

<template>
  <div class="text-center p-2">
    <UCard class="mt-2">
      <template #header>
        <div v-if="questData">
          <h2 class="text-5xl mb-4">{{ state.name }}</h2>
          <p class="text-xl mb-2">{{ state.description }}</p>
          <p class="text-xl mb-2">
            {{ state.startingSession + " - " + state.endingSession }}
          </p>
        </div>
        <div v-else>
          <p>Loading quest data...</p>
        </div>
      </template>
      <UAccordion multiple :items="items">
        <template #item="{ item }">
          <p class="text-xl">
            {{ item.description }}
          </p>
        </template>
        <template #giver>
          <UButton
            :to="`/campaign/${campaignUuid}/npc/${state.questGiverUuid}/view-npc`"
            class="mb-4"
            >{{ state.questGiver }}</UButton
          >
        </template>
        <template #bosses>
          <div>
            <p v-if="state.bossDetails.length < 1" class="mb-4">
              No bosses found.
            </p>
            <UButton
              v-for="(boss, index) in state.bossDetails"
              :key="index"
              :to="`/campaign/${campaignUuid}/npc/${boss.data.npc.uuid}/view-npc`"
              class="mb-4"
            >
              {{ boss.data.npc.firstName + " " + boss.data.npc.lastName }}
            </UButton>
          </div>
        </template>
        <template #locations>
          <div>
            <p v-if="state.locationDetails.length < 1" class="mb-4">
              No locations found.
            </p>
            <UButton
              v-for="(location, index) in state.locationDetails"
              :key="index"
              :to="`/campaign/${campaignUuid}/location/${location.data.location.uuid}/view-location`"
              class="mb-4"
            >
              {{ location.data.location.name }}
            </UButton>
          </div>
        </template>
        <template #npcs>
          <div>
            <p v-if="state.npcUuids.length < 1" class="mb-4">No NPCs found.</p>
            <UButton
              v-for="npcUuid in state.npcUuids"
              :key="npcUuid"
              :to="`/campaign/${campaignUuid}/npc/${npcUuid}/view-npc`"
              class="mb-4"
            >
              {{ npcUuid }}
            </UButton>
          </div>
        </template>
        <template #party>
          <div>
            <p v-if="state.partyUuids.length < 1" class="mb-2">
              No party found.
            </p>
            <UButton
              v-for="characterUuid in state.partyUuids"
              :key="characterUuid"
              class="mb-2"
            >
              {{ characterUuid }}
            </UButton>
          </div>
        </template>
      </UAccordion>
    </UCard>
  </div>
</template>

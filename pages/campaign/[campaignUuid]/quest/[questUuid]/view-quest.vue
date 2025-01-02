<script setup lang="ts">
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/authStore";
import type {
  QuestResponse,
  NPCResponse,
  //   NPCsResponse,
} from "~/types/types";

definePageMeta({
  middleware: "fresh-token",
});

onMounted(() => {
  if (questData.value) {
    state.name = questData.value?.data.quest.name ?? "";
    state.description = questData.value?.data.quest.description ?? "";
    state.questGiverUuid = questData.value?.data.quest.questGiver ?? "";
    state.bossUuids = questData.value?.data.quest.bossUuids ?? [];
    state.locationUuids = questData.value?.data.quest.locationUuids ?? [];
    state.npcUuids = questData.value?.data.quest.npcUuids ?? [];
    state.partyUuids = questData.value?.data.quest.partyUuids ?? [];
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
  locationUuids: [] as string[],
  npcUuids: [] as string[],
  partyUuids: [] as string[],
  startingSession: undefined,
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

watch(
  () => state.questGiverUuid,
  (newQuestGiver) => {
    if (newQuestGiver) {
      fetchQuestGiverDetails(newQuestGiver);
    }
  },
);

const fetchQuestGiverDetails = async (questGiverUuid: string) => {
  const { data: questGiverData, error: questGiverDataError } =
    await useFetch<NPCResponse>(
      `/campaign/${campaignUuid}/npc/${questGiverUuid}`,
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
            <p v-if="state.bossUuids.length < 1" class="mb-4">
              No bosses found.
            </p>
            <UButton
              v-for="bossUuid in state.bossUuids"
              :key="bossUuid"
              :to="`/campaign/${campaignUuid}/npc/${bossUuid}/view-npc`"
              class="mb-4"
            >
              {{ bossUuid }}
            </UButton>
          </div>
        </template>
        <template #locations>
          <div>
            <p v-if="state.locationUuids.length < 1" class="mb-4">
              No locations found.
            </p>
            <UButton
              v-for="locationUuid in state.locationUuids"
              :key="locationUuid"
              :to="`/campaign/${campaignUuid}/location/${locationUuid}/view-location`"
              class="mb-4"
            >
              {{ locationUuid }}
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

// SPDX-License-Identifier: Apache-2.0
<script setup lang="ts">
import type { NPCsResponse } from "~/types/types";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const route = useRoute();
const campaignUuid = route.params.campaignUuid;

const npc = ref([]);

const { data: apiResponse, error } = await useFetch<NPCsResponse>(
  `/campaign/${campaignUuid}/npcs`,
  {
    baseURL: config.public.baseURL,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      "Content-Type": "application/json",
    },
  },
);

if (error.value) {
  console.error("Error fetching locations:", error.value);
}

const npcs = computed(
  () =>
    apiResponse.value?.data.npcs.map((npc) => ({
      label: npc.firstName + " " + npc.lastName,
      value: npc.uuid,
    })) ?? [],
);
</script>
<template>
  <USelectMenu
    v-if="npcs.length > 0"
    v-model="npc"
    :options="npcs"
    multiple
    searchable
    required
  />
</template>

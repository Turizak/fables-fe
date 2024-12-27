<script setup lang="ts">
import type { QuestsResponse } from "~/types/types";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const route = useRoute();
const campaignUuid = route.params.campaignUuid;

const quest = ref([]);

const { data: apiResponse, error } = await useFetch<QuestsResponse>(
  `/campaign/${campaignUuid}/quests`,
  {
    baseURL: config.public.baseURL,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      "Content-Type": "application/json",
    },
  },
);

if (error.value) {
  console.error("Error fetching quests:", error.value);
}

const quests = computed(
  () =>
    apiResponse.value?.data.quests.map((quest) => ({
      label: quest.name,
      value: quest.uuid,
    })) ?? [],
);
</script>
<template>
  <USelectMenu
    v-if="quests.length > 0"
    v-model="quest"
    :options="quests"
    class="w-full"
    multiple
    searchable
    required
  />
</template>

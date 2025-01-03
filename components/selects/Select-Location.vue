// SPDX-License-Identifier: Apache-2.0
<script setup lang="ts">
import type { LocationsResponse } from "~/types/types";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const route = useRoute();
const campaignUuid = route.params.campaignUuid;

const location = ref([]);

const { data: apiResponse, error } = await useFetch<LocationsResponse>(
  `/campaign/${campaignUuid}/locations`,
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

const locations = computed(
  () =>
    apiResponse.value?.data.locations.map((location) => ({
      label: location.name,
      value: location.uuid,
    })) ?? [],
);
</script>
<template>
  <USelectMenu
    v-if="locations.length > 0"
    v-model="location"
    :options="locations"
    class="w-full"
    multiple
    searchable
    required
  />
</template>

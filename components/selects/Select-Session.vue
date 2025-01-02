<script setup lang="ts">
import { format } from "date-fns";
import type { SessionsResponse } from "~/types/types.ts";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const route = useRoute();
const campaignUuid = route.params.campaignUuid;

const session = ref([]);

const { data: sessionsResponse, error: sessionsResponseError } =
  await useFetch<SessionsResponse>(`/campaign/${campaignUuid}/sessions`, {
    baseURL: config.public.baseURL,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      "Content-Type": "application/json",
    },
  });

if (sessionsResponseError.value) {
  console.error("Error fetching npcs:", sessionsResponseError.value);
}

const sessions = computed(
  () =>
    sessionsResponse.value?.data.sessions.map((session) => ({
      label: format(new Date(session.dateOccured.time), "MMM-dd, yyyy"),
      value: session.uuid,
    })) ?? [],
);
</script>

<template>
  <USelectMenu
    v-if="sessions.length > 0"
    v-model="session"
    :options="sessions"
    class="w-full"
    required
  />
</template>

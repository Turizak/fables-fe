<script setup lang="ts">
type Timestamp = {
  time: string;
  valid: boolean;
};

type Campaign = {
  uuid: string;
  name: string;
  creatorUuid: string;
  dmUuid: string;
  partyUuids: string[];
  completed: boolean;
  active: boolean;
  ruleset: string;
  maxPlayers: number;
  created: Timestamp;
  lastUpdated: Timestamp | null;
};

type ApiResponse = {
  data: {
    campaign: Campaign;
  };
  message: string;
  status: number;
  statusText: string;
  timestamp: string;
};
const config = useRuntimeConfig();
const authStore = useAuthStore();

const { data } = await useFetch<ApiResponse>(
  config.public.baseURL + "/campaign/" + "8335f613-ff58-496c-868d-3ab850ee949f",
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      "Content-Type": "application/json",
    },
  },
);
const campaign = data.value?.data.campaign ?? ({} as Campaign);
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-xl">{{ campaign.name }}</h3>
    </template>
    <div class="flex gap-2">
      <UIcon name="heroicons:user-group-solid" class="w-5 h-5" />
      <p>Party Size: {{ campaign.maxPlayers }}</p>
    </div>
    <div class="flex gap-2">
      <UIcon name="material-symbols-light:book-2-rounded" class="w-5 h-5" />
      <p>Ruleset: {{ campaign.ruleset }}</p>
    </div>

    <template #footer>
      <UButton block>View Details</UButton>
    </template>
  </UCard>
</template>

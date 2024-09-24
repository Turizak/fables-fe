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

definePageMeta({
  middleware: "fresh-token",
});

const config = useRuntimeConfig();
const authStore = useAuthStore();

const { data: apiResponse } = await useFetch<ApiResponse>(
  "/account/campaigns",
  {
    baseURL: config.public.baseURL,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      "Content-Type": "application/json",
    },
  },
);

const campaigns = computed(() => apiResponse.value?.data.campaigns ?? []);
</script>

<template>
  <div>
    <h2 class="text-5xl text-center p-2 mb-4">Campaigns</h2>
    <div
      v-if="campaigns.length > 0"
      class="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <ViewCampaign
        v-for="campaign in campaigns"
        :key="campaign.uuid"
        :campaign="campaign"
      />
    </div>
    <p v-else>No campaigns found.</p>
  </div>
</template>

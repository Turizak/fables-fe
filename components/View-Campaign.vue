<script setup>
import { useAuthStore } from "#imports";
const config = useRuntimeConfig();
const authStore = useAuthStore();

const { data } = await useFetch(
  config.public.baseURL + "/campaign/" + "8335f613-ff58-496c-868d-3ab850ee949f",
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      "Content-Type": "application/json",
    },
  },
);
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-xl">{{ data.data.campaign.name }}</h3>
    </template>
    <div class="flex gap-2">
      <UIcon name="heroicons:user-group-solid" class="w-5 h-5" />
      <p>Party Size: {{ data.data.campaign.maxPlayers }}</p>
    </div>
    <div class="flex gap-2">
      <UIcon name="material-symbols-light:book-2-rounded" class="w-5 h-5" />
      <p>Ruleset: {{ data.data.campaign.ruleset }}</p>
    </div>

    <template #footer>
      <UButton block>View Details</UButton>
    </template>
  </UCard>
</template>

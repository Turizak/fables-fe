<script setup>
import { useAuthStore } from "#imports";
definePageMeta({
  middleware: "fresh-token",
});

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
  <div>
    <h2>Title: {{ data.data.campaign.name }}</h2>
    <p>Number of Players: {{ data.data.campaign.maxPlayers }}</p>
    <p>Active? {{ data.data.campaign.active }}</p>
  </div>
</template>

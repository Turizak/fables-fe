<script setup lang="ts">
import type { Campaign, Props } from "~/types/types";

const { data } = defineProps<Props<{ data: Campaign }>>();
const campaign = data.data;
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-xl">{{ campaign.name }}</h3>
    </template>
    <div class="flex gap-2">
      <UIcon name="heroicons:user-group-solid" class="w-5 h-5" />
      <p>Party Size: {{ campaign.maxPlayers || "0" }}</p>
    </div>
    <div class="flex gap-2">
      <UIcon name="material-symbols-light:book-2-rounded" class="w-5 h-5" />
      <p>Ruleset: {{ campaign.ruleset || "Not Specified" }}</p>
    </div>

    <template #footer>
      <UButton block>View Details</UButton>
    </template>
  </UCard>
</template>

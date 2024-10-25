<script setup lang="ts">
import type { Campaign } from "~/types/types";

type Props<T> = {
  campaign: T;
};

const { campaign } = defineProps<Props<Campaign>>();
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
      <UButton block @click="navigateTo(`/campaign/${campaign.uuid}`)"
        >View Details</UButton
      >
    </template>
  </UCard>
</template>

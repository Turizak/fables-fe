<script setup lang="ts">
import type { Character, Props } from "~/types/types";

const { data } = defineProps<Props<{ data: Character }>>();
const character = data.data;
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-xl capitalize">{{ character.firstName || "none" }}</h3>
    </template>
    <div class="flex gap-2">
      <UIcon name="heroicons:user-group-solid" class="w-5 h-5" />
      <p class="capitalize">Race: {{ character.race || "none" }}</p>
    </div>
    <div class="flex gap-2">
      <UIcon name="material-symbols-light:book-2-rounded" class="w-5 h-5" />
      <p class="capitalize">Class: {{ character.class || "none" }}</p>
    </div>
    <template #footer>
      <UButton block>View Details</UButton>
    </template>
  </UCard>
</template>

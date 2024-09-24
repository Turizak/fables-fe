<script setup lang="ts">
type Character = {
  uuid: string;
  campaignUuid: string;
  creatorUuid: string;
  ownerUuid: string;
  firstName: string;
  lastName: string;
  race: string;
  class: string;
  age: number;
  height: number;
  weight: number;
  eyeColor: string;
  skinColor: string;
  hairColor: string;
  ruleset: string;
  created: {
    time: string;
    valid: boolean;
  };
  lastUpdated: null | string;
};

type Props = {
  character: Character;
};

const { character } = defineProps<Props>();
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

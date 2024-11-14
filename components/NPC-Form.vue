<script setup lang="ts">
import { npcValidate } from "~/utils/npc-validation";
import type { FormSubmitEvent } from "#ui/types";
import type { AuthResponse, NPCForm } from "~/types/types";
import { useAuthStore } from "#imports";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useToast();

const route = useRoute();
const uuid = route.params.uuid;

const classes = [
  { name: "Barbarian", value: "barbarian" },
  { name: "Bard", value: "bard" },
  { name: "Cleric", value: "cleric" },
  { name: "Druid", value: "druid" },
  { name: "Fighter", value: "fighter" },
  { name: "Monk", value: "monk" },
  { name: "Paladin", value: "paladin" },
  { name: "Ranger", value: "ranger" },
  { name: "Rogue", value: "rogue" },
  { name: "Sorcerer", value: "sorcerer" },
  { name: "Warlock", value: "warlock" },
  { name: "Wizard", value: "wizard" },
];

const races = [
  { name: "Dragonborn", value: "dragonborn" },
  { name: "Halfling", value: "halfling" },
  { name: "Half-Elf", value: "half-elf" },
  { name: "Half-Orc", value: "half-orc" },
  { name: "Human", value: "human" },
  { name: "Tiefling", value: "tiefling" },
  { name: "---", value: "", disabled: true },
  {
    name: "Dwarves",
    children: [
      { name: "Dwarf", value: "dwarf" },
      { name: "Hill Dwarf", value: "hill-dwarf" },
      { name: "Mountain Dwarf", value: "mountain-dwarf" },
    ],
  },
  {
    name: "Elves",
    children: [
      { name: "Elf", value: "elf" },
      { name: "Dark Elf (Drow)", value: "dark-elf" },
      { name: "High Elf", value: "high-elf" },
      { name: "Wood Elf", value: "wood-elf" },
    ],
  },
  {
    name: "Gnomes",
    children: [
      { name: "Gnome", value: "gnome" },
      { name: "Forest Gnome", value: "forest-gnome" },
      { name: "Rock Gnome", value: "rock-gnome" },
    ],
  },
];

const state = reactive({
  firstName: undefined,
  lastName: undefined,
  class: undefined,
  race: undefined,
  description: undefined,
  isQuestBoss: false,
});

const buttonText = reactive({
  submitButton: "Add NPC",
  backButton: "View Campaign",
});

const disabled = ref(false);
const loading = ref(false);

async function goBack() {
  await authStore.ensureValidToken();
  await navigateTo(`/campaign/${uuid}/view-campaign`);
}

async function onSubmit(event: FormSubmitEvent<NPCForm>) {
  loading.value = true;
  disabled.value = true;
  buttonText.submitButton = "Adding...";
  buttonText.backButton = "";
  await authStore.ensureValidToken();
  try {
    const response: AuthResponse = await $fetch(
      config.public.baseURL + "/campaign/" + uuid + "/npc/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: {
          firstName: event.data.firstName,
          lastName: event.data.lastName,
          class: event.data.class,
          race: event.data.race,
          description: event.data.description,
          isQuestBoss: event.data.isQuestBoss,
        },
      },
    );
    console.log(response);
    buttonText.submitButton = "Success!";
    toast.add({
      title: "NPC Added!",
      icon: "i-heroicons-check-circle-solid",
    });
  } catch (err) {
    console.error(err);
    toast.add({
      title: "There was an error - please try again",
      color: "red",
      icon: "i-heroicons-x-circle-solid",
    });
  } finally {
    loading.value = false;
    disabled.value = false;
    buttonText.submitButton = "Add NPC";
    buttonText.backButton = "View Campaign";
    state.firstName = undefined;
    state.lastName = undefined;
    state.race = undefined;
    state.class = undefined;
    state.description = undefined;
    state.isQuestBoss = false;
  }
}
</script>

<template>
  <UForm :validate="npcValidate" :state="state" @submit.prevent="onSubmit">
    <div class="grid grid-cols-2 gap-4">
      <UFormGroup label="Character First Name" name="firstName" class="mb-2">
        <UInput
          v-model="state.firstName"
          placeholder="25 character limit"
          :disabled="disabled"
          type="text"
          required
        />
      </UFormGroup>
      <UFormGroup label="Character Last Name" name="lastName" class="mb-2">
        <UInput
          v-model="state.lastName"
          placeholder="25 character limit"
          :disabled="disabled"
          type="text"
          required
        />
      </UFormGroup>
      <UFormGroup label="Class" name="class" class="mb-4">
        <USelect
          v-model="state.class"
          placeholder="Select a class..."
          option-attribute="name"
          :options="classes"
          required
        />
      </UFormGroup>
      <UFormGroup label="Race" name="race" class="mb-4">
        <USelect
          v-model="state.race"
          placeholder="Select a race..."
          :options="races"
          :disabled="disabled"
          option-attribute="name"
          required
        />
      </UFormGroup>
    </div>
    <UFormGroup label="Description" name="description" class="mb-4">
      <UTextarea
        v-model="state.description"
        placeholder="100 character limit"
        :disabled="disabled"
      />
    </UFormGroup>
    <UCheckbox
      v-model="state.isQuestBoss"
      name="isQuestBoss"
      label="Quest Boss"
    />
    <UButton
      block
      color="amber"
      variant="solid"
      class="p-2 box-border text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
      :loading="loading"
      @click="goBack"
    >
      {{ buttonText.backButton }}</UButton
    >
    <UButton
      type="submit"
      class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
      :loading="loading"
    >
      {{ buttonText.submitButton }}</UButton
    >
  </UForm>
</template>

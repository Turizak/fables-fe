// Name and Class

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { useAuthStore } from "#imports";

type CharacterForm = {
  name: string;
  ruleset: string;
  class: string;
  alignment: string;
  race: string;
};
const authStore = useAuthStore();
const toast = useToast();

const classes = [
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
];

const alignments = [
  "Chaotic Evil",
  "Chaotic Good",
  "Chaotic Neutral",
  "Lawful Evil",
  "Lawful Good",
  "Lawful Neutral",
  "Neutral",
  "Neutral Evil",
  "Neutral Good",
];

const races = [
  { name: "Dragonborn", value: "dragonborn" },
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
  name: undefined,
  ruleset: "5e",
  class: undefined,
  alignment: undefined,
  race: undefined,
});

const disabled = ref(false);
const loading = ref(false);
const buttonText = ref("Next Step: Appearance");

const validate = (state: CharacterForm): FormError[] => {
  const errors = [];
  if (!state.name) errors.push({ path: "name", message: "Required" });
  if (state.name && state.name.length > 25)
    errors.push({ path: "name", message: "Must be less than 25 characters" });
  if (!state.alignment) errors.push({ path: "alignment", message: "Required" });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<CharacterForm>) {
  disabled.value = true;
  loading.value = true;
  await authStore.ensureValidToken();
  try {
    const response = await $fetch<{
      status: string;
      message: string;
      data: CharacterForm;
    }>("https://httpbin.org/post", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/json",
      },
      body: {
        name: event.data.name,
        ruleset: event.data.ruleset,
        class: event.data.class,
        alignment: event.data.alignment,
        race: event.data.race,
      },
    });
    console.log(response);
    await navigateTo("/cchar/cchar-2");
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
    buttonText.value = "Next Step: Appearance";
    state.name = undefined;
    state.alignment = undefined;
  }
}
</script>

<template>
  <UForm :validate="validate" :state="state" @submit.prevent="onSubmit">
    <UFormGroup label="Character Name" name="name" class="mb-4">
      <UInput
        v-model="state.name"
        placeholder="Must be less than 25 characters"
        :disabled="disabled"
        type="text"
        required
      />
    </UFormGroup>
    <UFormGroup label="Ruleset" name="ruleset" class="mb-4">
      <USelect
        v-model="state.ruleset"
        disabled
        :options="['5e']"
        placeholder="5e"
      />
    </UFormGroup>
    <UFormGroup label="Class" name="class" class="mb-4">
      <USelect
        v-model="state.class"
        placeholder="Select a class..."
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
    <UFormGroup label="Alignment" name="alignment">
      <USelect
        v-model="state.alignment"
        placeholder="Select an alignment..."
        :options="alignments"
        :disabled="disabled"
        required
      />
    </UFormGroup>
    <UButton
      type="submit"
      class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
      :loading="loading"
    >
      {{ buttonText }}</UButton
    >
  </UForm>
</template>

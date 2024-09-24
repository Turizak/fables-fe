// Details

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { useAuthStore, useFormStore } from "#imports";

type CharacterForm = {
  firstName: string;
  lastName: string;
  class: string;
  alignment: string;
  race: string;
};
const authStore = useAuthStore();
const formStore = useFormStore();
const router = useRouter();

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

const alignments = [
  { name: "Chaotic Evil", value: "chaotic-evil" },
  { name: "Chaotic Good", value: "chaotic-good" },
  { name: "Chaotic Neutral", value: "chaotic-neutral" },
  { name: "Lawful Evil", value: "lawful-evil" },
  { name: "Lawful Good", value: "lawful-good" },
  { name: "Lawful Neutral", value: "lawful-neutral" },
  { name: "Neutral", value: "neutral" },
  { name: "Neutral Evil", value: "neutral-evil" },
  { name: "Neutral Good", value: "neutral-good" },
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
  alignment: undefined,
  race: undefined,
});

const buttonText = reactive({
  nextBtn: "Next Step: Appearance",
  prevBtn: "Go Back",
});

const disabled = ref(false);
const loading = ref(false);

const validate = (state: CharacterForm): FormError[] => {
  const errors = [];
  if (!state.firstName) errors.push({ path: "firstName", message: "Required" });
  if (state.firstName && state.firstName.length > 25)
    errors.push({
      path: "firstName",
      message: "Must be less than 25 characters",
    });
  if (!state.lastName) errors.push({ path: "lastName", message: "Required" });
  if (state.lastName && state.lastName.length > 25)
    errors.push({
      path: "lastName",
      message: "Must be less than 25 characters",
    });
  if (!state.class) errors.push({ path: "class", message: "Required" });
  if (!state.alignment) errors.push({ path: "alignment", message: "Required" });
  if (!state.race) errors.push({ path: "race", message: "Required" });
  return errors;
};

function updateFormStore(fields: CharacterForm) {
  Object.entries(fields).forEach(([field, value]) => {
    formStore.updateFormField(field, value);
  });
}

async function goBack() {
  await authStore.ensureValidToken();
  router.back();
}

async function onSubmit(event: FormSubmitEvent<CharacterForm>) {
  const eventData = {
    firstName: event.data.firstName,
    lastName: event.data.lastName,
    class: event.data.class,
    alignment: event.data.alignment,
    race: event.data.race,
  };
  disabled.value = true;
  loading.value = true;
  await authStore.ensureValidToken();
  updateFormStore(eventData);
  await navigateTo("/cchar/cchar-3");
}
</script>

<template>
  <UForm :validate="validate" :state="state" @submit.prevent="onSubmit">
    <UFormGroup label="Character First Name" name="firstName" class="mb-4">
      <UInput
        v-model="state.firstName"
        placeholder="Must be less than 25 characters"
        :disabled="disabled"
        type="text"
        required
      />
    </UFormGroup>
    <UFormGroup label="Character Last Name" name="lastName" class="mb-4">
      <UInput
        v-model="state.lastName"
        placeholder="Must be less than 25 characters"
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
    <UFormGroup label="Alignment" name="alignment">
      <USelect
        v-model="state.alignment"
        placeholder="Select an alignment..."
        option-attribute="name"
        :options="alignments"
        :disabled="disabled"
        required
      />
    </UFormGroup>
    <div class="flex flex-col justify-center mb-4">
      <UButton
        block
        color="amber"
        variant="solid"
        class="p-2 box-border text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="loading"
        @click="goBack"
      >
        {{ buttonText.prevBtn }}</UButton
      >
      <UButton
        type="submit"
        class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="loading"
      >
        {{ buttonText.nextBtn }}</UButton
      >
    </div>
  </UForm>
</template>

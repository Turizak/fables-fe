<script setup lang="ts">
import { useAuthStore, useFormStore } from "#imports";
import { characterValidate2 } from "~/utils/character-validation-2";
import type { FormSubmitEvent } from "#ui/types";
import type { ApiResponse, Race, Class, CharacterForm } from "~/types/types";

const authStore = useAuthStore();
const formStore = useFormStore();
const router = useRouter();
const config = useRuntimeConfig();

const state = reactive({
  firstName: undefined,
  lastName: undefined,
  class: undefined,
  race: undefined,
  nextBtn: "Next Step: Appearance",
  prevBtn: "Go Back",
  disabled: false,
  loading: false,
});

const { data: raceData, error: raceDataError } = await useFetch<
  ApiResponse<{ races: Race[] }>
>("/ruleset/5e/races", {
  baseURL: config.public.baseURL,
  headers: {
    Authorization: `Bearer ${authStore.token}`,
    "Content-Type": "application/json",
  },
});

if (raceDataError.value) {
  console.error("Error fetching campaigns:", raceDataError.value);
}

const { data: classData, error: classDataError } = await useFetch<
  ApiResponse<{ classes: Class[] }>
>("/ruleset/5e/classes", {
  baseURL: config.public.baseURL,
  headers: {
    Authorization: `Bearer ${authStore.token}`,
    "Content-Type": "application/json",
  },
});

if (classDataError.value) {
  console.error("Error fetching campaigns:", classDataError.value);
}

const races = computed(
  () =>
    raceData.value?.data.races.map((race) => ({
      label: race.name,
      value: race.index,
    })) ?? [],
);

const classes = computed(
  () =>
    classData.value?.data.classes.map((foo) => ({
      label: foo.name,
      value: foo.index,
    })) ?? [],
);

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
    race: event.data.race,
  };
  state.disabled = true;
  state.loading = true;
  await authStore.ensureValidToken();
  updateFormStore(eventData);
  await navigateTo("/cchar/cchar-3");
}
</script>

<template>
  <UForm
    :validate="characterValidate2"
    :state="state"
    @submit.prevent="onSubmit"
  >
    <UFormGroup label="Character First Name" name="firstName" class="mb-4">
      <UInput
        v-model="state.firstName"
        placeholder="Must be less than 25 characters"
        :disabled="state.disabled"
        type="text"
        required
      />
    </UFormGroup>
    <UFormGroup label="Character Last Name" name="lastName" class="mb-4">
      <UInput
        v-model="state.lastName"
        placeholder="Must be less than 25 characters"
        :disabled="state.disabled"
        type="text"
        required
      />
    </UFormGroup>
    <UFormGroup label="Class" name="class" class="mb-4">
      <USelect
        v-if="classes.length > 0"
        v-model="state.class"
        :options="classes"
        placeholder="Select a class"
        class="w-full"
        required
      />
    </UFormGroup>
    <UFormGroup label="Race" name="race" class="mb-4">
      <USelect
        v-if="races.length > 0"
        v-model="state.race"
        :options="races"
        placeholder="Select a race"
        class="w-full"
        required
      />
    </UFormGroup>
    <div class="flex flex-col justify-center mb-4">
      <UButton
        block
        color="amber"
        variant="solid"
        class="p-2 box-border text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="state.loading"
        @click="goBack"
      >
        {{ state.prevBtn }}</UButton
      >
      <UButton
        type="submit"
        class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="state.loading"
      >
        {{ state.nextBtn }}</UButton
      >
    </div>
  </UForm>
</template>

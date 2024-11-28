<script setup lang="ts">
import { npcValidate } from "~/utils/validation/npc-validation";
import type { FormSubmitEvent } from "#ui/types";
import type { ApiResponse, NPCForm, Class, Race } from "~/types/types";
import { useAuthStore } from "#imports";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useToast();
const route = useRoute();
const uuid = route.params.uuid;

const state = reactive({
  firstName: undefined,
  lastName: undefined,
  class: undefined,
  race: undefined,
  description: undefined,
  isQuestBoss: false,
  submitButton: "Add NPC",
  backButton: "Back to Campaign",
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

async function goBack() {
  await authStore.ensureValidToken();
  await navigateTo(`/campaign/${uuid}/view-campaign`);
}

async function onSubmit(event: FormSubmitEvent<NPCForm>) {
  state.loading = true;
  state.disabled = true;
  state.submitButton = "Adding...";
  state.backButton = "";
  await authStore.ensureValidToken();
  try {
    await $fetch(config.public.baseURL + "/campaign/" + uuid + "/npc/create", {
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
    });
    state.submitButton = "Success!";
    toast.add({
      title: "NPC Added!",
      icon: "i-material-symbols-light:check-circle",
    });
  } catch (error) {
    console.error("Error creating NPC: ", error);
    toast.add({
      title: "There was an error - please try again",
      color: "red",
      icon: "i-material-symbols-light:cancel",
    });
  } finally {
    state.loading = false;
    state.disabled = false;
    state.submitButton = "Add NPC";
    state.backButton = "Back to Campaign";
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
          :disabled="state.disabled"
          type="text"
          required
        />
      </UFormGroup>
      <UFormGroup label="Character Last Name" name="lastName" class="mb-2">
        <UInput
          v-model="state.lastName"
          placeholder="25 character limit"
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
    </div>
    <UFormGroup label="Description" name="description" class="mb-4">
      <UTextarea
        v-model="state.description"
        placeholder="100 character limit"
        :disabled="state.disabled"
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
      :loading="state.loading"
      @click="goBack"
    >
      {{ state.backButton }}</UButton
    >
    <UButton
      type="submit"
      class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
      :loading="state.loading"
    >
      {{ state.submitButton }}</UButton
    >
  </UForm>
</template>

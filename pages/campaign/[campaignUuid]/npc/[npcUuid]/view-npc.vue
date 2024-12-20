<script setup lang="ts">
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/authStore";
import { locationValidate } from "~/utils/validation/location-validation";
import type { LocationForm, LocationResponse } from "~/types/types";
import type { FormSubmitEvent } from "#ui/types";

const route = useRoute();
const toast = useToast();

const campaignUuid = route.params.campaignUuid;
const npcUuid = route.params.npcUuid;

definePageMeta({
  middleware: "fresh-token",
});

onMounted(() => {
  if (apiResponse.value) {
    state.firstName = apiResponse.value?.data.npc.firstName ?? "";
    state.lastName = apiResponse.value?.data.npc.lastName ?? "";
    state.race = apiResponse.value?.data.npc.race ?? "";
    state.class = apiResponse.value?.data.npc.class ?? "";
    state.description = apiResponse.value?.data.npc.description ?? "";
  }
  state.loading = false;
});

const config = useRuntimeConfig();
const authStore = useAuthStore();

const state = reactive({
  firstName: "",
  lastName: "",
  race: "",
  class: "",
  description: "",
  submitButton: "Update Location",
  loading: true,
  updateButtonDisabled: true,
  firstNameDisabled: true,
  lastNameDisabled: true,
  raceDisabled: true,
  classDisabled: true,
  descriptionDisabled: true,
});

function enableFirstName() {
  state.firstNameDisabled = !state.firstNameDisabled;
  state.updateButtonDisabled = !state.updateButtonDisabled;
}
function enableLastName() {
  state.lastNameDisabled = !state.lastNameDisabled;
  state.updateButtonDisabled = !state.updateButtonDisabled;
}
function enableRace() {
  state.raceDisabled = !state.raceDisabled;
  state.updateButtonDisabled = !state.updateButtonDisabled;
}
function enableClass() {
  state.classDisabled = !state.classDisabled;
  state.updateButtonDisabled = !state.updateButtonDisabled;
}

function enableDescription() {
  state.descriptionDisabled = !state.descriptionDisabled;
  state.updateButtonDisabled = !state.updateButtonDisabled;
}

const { data: apiResponse } = await useFetch<LocationResponse>(
  `/campaign/${campaignUuid}/npc/${npcUuid}`,
  {
    baseURL: config.public.baseURL,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      "Content-Type": "application/json",
    },
  },
);

async function onSubmit(event: FormSubmitEvent<LocationForm>) {
  state.loading = true;
  state.updateButtonDisabled = true;
  state.firstNameDisabled = true;
  state.lastNameDisabled = true;
  state.raceDisabled = true;
  state.classDisabled = true;
  state.descriptionDisabled = true;
  state.submitButton = "Adding...";
  await authStore.ensureValidToken();
  try {
    const response = await $fetch<LocationResponse>(
      `/campaign/${campaignUuid}/npc/${npcUuid}/update`,
      {
        method: "PATCH",
        baseURL: config.public.baseURL,
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: {
          name: event.data.location,
          description: event.data.description,
        },
      },
    );
    state.firstName = response.data.npc.firstName;
    state.lastName = response.data.npc.lastName;
    state.race = response.data.npc.race;
    state.class = response.data.npc.class;
    state.description = response.data.npc.description;

    state.submitButton = "Success!";
    toast.add({
      title: "Location Updated!",
      icon: "material-symbols-light:check-circle",
    });
  } catch (error) {
    console.error("Error creating location:", error);
    toast.add({
      title: "There was an error - please try again",
      color: "red",
      icon: "material-symbols-light:error",
    });
  } finally {
    state.loading = false;
    state.updateButtonDisabled = true;
    state.firstNameDisabled = true;
    state.lastNameDisabled = true;
    state.raceDisabled = true;
    state.classDisabled = true;
    state.descriptionDisabled = true;
    state.submitButton = "Update Location";
  }
}
</script>

<template>
  <div class="flex justify-center">
    <UForm
      class="w-[260px] mt-2"
      :validate="locationValidate"
      :state="state"
      @submit.prevent="onSubmit"
    >
      <UFormGroup label="First Name" name="firstName" class="mb-4">
        <div class="flex">
          <UButtonGroup orientation="horizontal" class="flex-grow">
            <UInput
              v-model="state.firstName"
              :disabled="state.firstNameDisabled"
              class="flex-grow"
            />
            <UButton
              icon="material-symbols-light:edit-square-rounded"
              size="sm"
              color="primary"
              @click="enableFirstName"
            />
          </UButtonGroup>
        </div>
      </UFormGroup>
      <UFormGroup label="Last Name" name="lastName" class="mb-4">
        <div class="flex">
          <UButtonGroup orientation="horizontal" class="flex-grow">
            <UInput
              v-model="state.lastName"
              :disabled="state.lastNameDisabled"
              class="flex-grow"
            />
            <UButton
              icon="material-symbols-light:edit-square-rounded"
              size="sm"
              color="primary"
              @click="enableLastName"
            />
          </UButtonGroup>
        </div>
      </UFormGroup>
      <UFormGroup label="Race" name="race" class="mb-4">
        <div class="flex">
          <UButtonGroup orientation="horizontal" class="flex-grow">
            <UInput
              v-model="state.race"
              :disabled="state.raceDisabled"
              class="flex-grow"
            />
            <UButton
              icon="material-symbols-light:edit-square-rounded"
              size="sm"
              color="primary"
              @click="enableRace"
            />
          </UButtonGroup>
        </div>
      </UFormGroup>

      <UFormGroup label="Class" name="class" class="mb-4">
        <div class="flex">
          <UButtonGroup orientation="horizontal" class="flex-grow">
            <UTextarea
              v-model="state.class"
              :disabled="state.classDisabled"
              class="flex-grow"
            />
            <UButton
              icon="material-symbols-light:edit-square-rounded"
              size="sm"
              color="primary"
              @click="enableClass"
            />
          </UButtonGroup>
        </div>
      </UFormGroup>
      <UFormGroup label="Description" name="description" class="mb-4">
        <div class="flex">
          <UButtonGroup orientation="horizontal" class="flex-grow">
            <UTextarea
              v-model="state.description"
              :disabled="state.descriptionDisabled"
              class="flex-grow"
            />
            <UButton
              icon="material-symbols-light:edit-square-rounded"
              size="sm"
              color="primary"
              @click="enableDescription"
            />
          </UButtonGroup>
        </div>
      </UFormGroup>
      <UButton
        type="submit"
        class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="state.loading"
        :disabled="state.updateButtonDisabled"
      >
        {{ state.submitButton }}</UButton
      >
    </UForm>
  </div>
</template>

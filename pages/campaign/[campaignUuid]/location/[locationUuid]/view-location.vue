<script setup lang="ts">
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/authStore";
import { locationValidate } from "~/utils/validation/location-validation";
import type { Location, apiResponse, LocationForm } from "~/types/types";
import type { FormSubmitEvent } from "#ui/types";

const route = useRoute();
const toast = useToast();

const campaignUuid = route.params.campaignUuid;
const locationUuid = route.params.locationUuid;

definePageMeta({
  middleware: "fresh-token",
});

onMounted(() => {
  if (apiResponse.value) {
    state.location = apiResponse.value?.data.location.name ?? "";
    state.description = apiResponse.value?.data.location.description ?? "";
  }
  state.loading = false;
});

const config = useRuntimeConfig();
const authStore = useAuthStore();

const state = reactive({
  location: undefined,
  description: undefined,
  submitButton: "Update Location",
  loading: true,
  updateButtonDisabled: true,
  locationDisabled: true,
  descriptionDisabled: true,
});

function enableLocation() {
  state.locationDisabled = !state.locationDisabled;
  state.updateButtonDisabled = !state.updateButtonDisabled;
}

function enableDescription() {
  state.descriptionDisabled = !state.descriptionDisabled;
  state.updateButtonDisabled = !state.updateButtonDisabled;
}

const { data: apiResponse } = await useFetch<ApiResponse<Location>>(
  `/campaign/${campaignUuid}/location/${locationUuid}`,
  {
    baseURL: config.public.baseURL,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      "Content-Type": "application/json",
    },
  },
);

// const location = computed(() => apiResponse.value?.data.location ?? null);

async function onSubmit(event: FormSubmitEvent<LocationForm>) {
  state.loading = true;
  state.updateButtonDisabled = true;
  state.locationDisabled = true;
  state.descriptionDisabled = true;
  state.submitButton = "Adding...";
  await authStore.ensureValidToken();
  try {
    const response = await $fetch(
      config.public.baseURL +
        "/campaign/" +
        campaignUuid +
        "/location/" +
        locationUuid +
        "/update",
      {
        method: "PATCH",
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
    state.location = response.data.location.name;
    state.description = response.data.location.description;

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
    state.locationDisabled = true;
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
      <UFormGroup label="Location Name" name="location" class="mb-4">
        <div class="flex">
          <UButtonGroup orientation="horizontal" class="flex-grow">
            <UInput
              v-model="state.location"
              :disabled="state.locationDisabled"
              class="flex-grow"
            />
            <UButton
              icon="material-symbols-light:edit-square-rounded"
              size="sm"
              color="primary"
              @click="enableLocation"
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

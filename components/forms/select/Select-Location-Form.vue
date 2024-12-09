<script setup lang="ts">
import type ApiResponse from "~/types/types";
import { useRoute } from "vue-router";
// import type { FormSubmitEvent } from "#ui/types";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const route = useRoute();

const campaignUuid = route.params.campaignUuid;
const sessionUuid = route.params.sessionUuid;

const state = reactive({
  location: undefined,
  locationUuid: undefined,
  loading: false,
  disable: false,
  submitButton: "Add location to session",
  createButton: "Create a new location",
});

const { data: apiResponse, error } = await useFetch<
  ApiResponse<{ locations: Location[] }>
>(`/campaign/${campaignUuid}/locations`, {
  baseURL: config.public.baseURL,
  headers: {
    Authorization: `Bearer ${authStore.token}`,
    "Content-Type": "application/json",
  },
});

if (error.value) {
  console.error("Error fetching locations:", error.value);
}

const locations = computed(
  () =>
    apiResponse.value?.data.locations.map((location) => ({
      label: location.name,
      value: location.uuid,
    })) ?? [],
);

async function onSubmit(event: FormSubmitEvent) {
  state.loading = true;
  state.disabled = true;
  state.submitButton = "Adding...";
  state.backButton = "";
  await authStore.ensureValidToken();
  try {
    await $fetch(
      config.public.baseURL +
        "/campaign/" +
        campaignUuid +
        "/session/" +
        sessionUuid +
        "/update",
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: {
          locationUuids: [event.data.location],
        },
      },
    );
    state.submitButton = "Success!";
    toast.add({
      title: "Location Added!",
      icon: "i-heroicons-check-circle-solid",
    });
  } catch (error) {
    console.error("Error creating location:", error);
    toast.add({
      title: "There was an error - please try again",
      color: "red",
      icon: "i-heroicons-x-circle-solid",
    });
  } finally {
    state.loading = false;
    state.disabled = false;
    state.submitButton = "Create Location";
    state.location = undefined;
    state.description = undefined;
  }
}
</script>

<template>
  <div>
    <UForm class="w-[260px] mt-2" :state="state" @submit.prevent="onSubmit">
      <UFormGroup>
        <USelect
          v-if="locations.length > 0"
          v-model="state.location"
          :options="locations"
          label="Select a Location"
          class="w-full"
        />
      </UFormGroup>
      <UFormGroup>
        <UButton
          type="submit"
          class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
          :loading="state.loading"
          :disabled="state.disabled"
        >
          {{ state.submitButton }}</UButton
        >
        <UButton
          type="submit"
          class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
          color="blue"
          variant="solid"
          :to="`/campaign/${campaignUuid}/create-location`"
          :loading="state.loading"
          :disabled="state.disabled"
        >
          {{ state.createButton }}</UButton
        >
      </UFormGroup>
    </UForm>
  </div>
</template>

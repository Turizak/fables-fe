<script setup lang="ts">
import type ApiResponse from "~/types/types";
definePageMeta({
  middleware: "fresh-token",
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const route = useRoute();

const campaignUuid = route.params.campaignUuid;

const state = reactive({
  location: undefined,
  loading: false,
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
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2 mb-2">Select Location</h1>
    <UForm>
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
        >
          {{ state.submitButton }}</UButton
        >
        <UButton
          class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
          color="blue"
          variant="solid"
          :to="`/campaign/${campaignUuid}/create-location`"
          :loading="state.loading"
        >
          {{ state.createButton }}</UButton
        >
      </UFormGroup>
    </UForm>
  </div>
</template>

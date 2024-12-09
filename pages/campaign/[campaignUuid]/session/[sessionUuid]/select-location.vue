<script setup lang="ts">
import SelectLocationForm from "~/components/forms/select/Select-Location-Form.vue";
definePageMeta({
  middleware: "fresh-token",
});

// const config = useRuntimeConfig();
// const authStore = useAuthStore();
// const route = useRoute();

// const campaignUuid = route.params.campaignUuid;

// const state = reactive({
//   location: undefined,
//   loading: false,
//   submitButton: "Add location to session",
//   createButton: "Create a new location",
// });

// const { data: apiResponse, error } = await useFetch<
//   ApiResponse<{ locations: Location[] }>
// >(`/campaign/${campaignUuid}/locations`, {
//   baseURL: config.public.baseURL,
//   headers: {
//     Authorization: `Bearer ${authStore.token}`,
//     "Content-Type": "application/json",
//   },
// });

// if (error.value) {
//   console.error("Error fetching locations:", error.value);
// }

// const locations = computed(
//   () =>
//     apiResponse.value?.data.locations.map((location) => ({
//       label: location.name,
//       value: location.uuid,
//     })) ?? [],
// );
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2 mb-2">Select Location</h1>
    <SelectLocationForm />
  </div>
</template>

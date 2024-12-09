<script setup lang="ts">
import { useRoute } from "vue-router";
import { locationValidate } from "~/utils/validation/location-validation";
import type { FormSubmitEvent } from "#ui/types";
import type { LocationForm } from "~/types/types";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useToast();

const route = useRoute();
const campaignUuid = route.params.campaignUuid;

const state = reactive({
  location: undefined,
  description: undefined,
  submitButton: "Create Location",
  loading: false,
  disabled: false,
});

async function onSubmit(event: FormSubmitEvent<LocationForm>) {
  state.loading = true;
  state.disabled = true;
  state.submitButton = "Adding...";
  state.backButton = "";
  await authStore.ensureValidToken();
  try {
    await $fetch(
      config.public.baseURL + "/campaign/" + campaignUuid + "/location/create",
      {
        method: "POST",
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
  <div class="flex justify-center">
    <UForm
      class="w-[260px] mt-2"
      :validate="locationValidate"
      :state="state"
      @submit.prevent="onSubmit"
    >
      <UFormGroup label="Location Name" name="location" class="mb-4">
        <UInput v-model="state.location" :disabled="state.disabled" />
      </UFormGroup>

      <UFormGroup label="Description" name="description" class="mb-4">
        <UTextarea v-model="state.description" :disabled="state.disabled" />
      </UFormGroup>

      <UButton
        type="submit"
        class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="state.loading"
      >
        {{ state.submitButton }}</UButton
      >
    </UForm>
  </div>
</template>

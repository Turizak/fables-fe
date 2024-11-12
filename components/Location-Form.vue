<script setup lang="ts">
import { useRoute } from "vue-router";
import { locationValidate } from "~/utils/location-validation";
import type { FormSubmitEvent } from "#ui/types";
import type { AuthResponse, LocationForm } from "~/types/types";

// const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useToast();

const route = useRoute();
const uuid = route.params.uuid;

const state = reactive({
  campaign: `${uuid}`,
  location: undefined,
  description: undefined,
});

const loading = ref(false);
const disabled = ref(false);
const buttonText = ref("Add Location");

async function onSubmit(event: FormSubmitEvent<LocationForm>) {
  loading.value = true;
  disabled.value = true;
  buttonText.value = "Adding...";
  try {
    const response: AuthResponse = await $fetch(
      // config.public.baseURL + "/api/campaign/" + uuid + "/location/create",
      "https://httpbin.org/post",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          name: event.data.location,
          description: event.data.description,
        },
      },
    );
    authStore.setToken(response.data.tokens.accessToken);
    authStore.setRefreshToken(response.data.tokens.refreshToken);
    await navigateTo(`/campaign/${uuid}/view-campaign`);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const errResponse = (
        error as {
          response: {
            _data: { message: string; status: number; statusText: string };
          };
        }
      ).response;
      toast.add({
        title: `${errResponse._data.message}`,
        color: "red",
        icon: "i-heroicons-x-circle-solid",
      });
      console.error(
        `Error: ${errResponse._data.status}, ${errResponse._data.statusText}`,
      );
    } else {
      console.error(error);
    }
  } finally {
    loading.value = false;
    disabled.value = false;
    buttonText.value = "Add Location";
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
        <UInput v-model="state.location" :disabled="disabled" />
      </UFormGroup>

      <UFormGroup label="Description" name="description" class="mb-4">
        <UTextarea v-model="state.description" :disabled="disabled" />
      </UFormGroup>

      <UButton
        type="submit"
        class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="loading"
      >
        {{ buttonText }}</UButton
      >
    </UForm>
  </div>
</template>

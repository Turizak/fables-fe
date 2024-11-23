<script setup lang="ts">
import { useRoute } from "vue-router";
import { format } from "date-fns";
import type { FormSubmitEvent } from "#ui/types";
import type {
  ApiResponse,
  AuthResponse,
  CampaignAll,
  SessionForm,
} from "~/types/types";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useToast();
const route = useRoute();
const uuid = route.params.uuid;

const state = reactive({
  dateOccured: new Date(),
});

const buttonText = reactive({
  submitButton: "Add Session",
  backButton: "View Campaign",
});

const partyUuids = ref<string[]>([]);
const loading = ref(false);
const disabled = ref(false);

const { data: apiResponse } = await useFetch<ApiResponse<CampaignAll>>(
  `/campaign/${uuid}/all`,
  {
    baseURL: config.public.baseURL,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      "Content-Type": "application/json",
    },
  },
);

const characters = computed(() => apiResponse.value?.data.characters ?? []);

async function goBack() {
  await authStore.ensureValidToken();
  await navigateTo(`/campaign/${uuid}/view-campaign`);
}

function setToStartOfDayUTC(dateInput: string | number | Date): string {
  const date = new Date(dateInput); // Convert input to Date
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input"); // Handle invalid dates
  }
  // Ensure the time is set to 00:00:00 UTC
  date.setUTCHours(0, 0, 0, 0);
  // Format the date as an ISO string in UTC
  return date.toISOString();
}

async function onSubmit(event: FormSubmitEvent<SessionForm>) {
  loading.value = true;
  disabled.value = true;
  buttonText.submitButton = "Adding...";
  buttonText.backButton = "";
  const dateOccured = setToStartOfDayUTC(event.data.dateOccured);
  console.log(dateOccured);
  await authStore.ensureValidToken();
  try {
    const response: AuthResponse = await $fetch(
      // config.public.baseURL + "/campaign/" + uuid + "/session/create",
      "https://httpbin.org/post",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: {
          partyUuids: partyUuids.value,
          dateOccured: dateOccured,
        },
      },
    );
    console.log(response);
    buttonText.submitButton = "Success!";
    toast.add({
      title: "Location Added!",
      icon: "i-heroicons-check-circle-solid",
    });
  } catch (err) {
    console.error(err);
    toast.add({
      title: "There was an error - please try again",
      color: "red",
      icon: "i-heroicons-x-circle-solid",
    });
  } finally {
    loading.value = false;
    disabled.value = false;
    buttonText.submitButton = "Add Session";
    buttonText.backButton = "View Campaign";
    partyUuids.value = [];
    state.dateOccured = new Date();
  }
}
</script>
<template>
  <div class="flex justify-center">
    <UForm class="w-[260px] mt-2" :state="state" @submit.prevent="onSubmit">
      <UFormGroup
        label="Date Occured"
        name="dateOccured"
        class="mb-4"
        size="xl"
      >
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UButton
            icon="i-material-symbols-light:calendar-month"
            :label="format(state.dateOccured, 'MMM d, yyy')"
          />

          <template #panel="{ close }">
            <DatePicker
              v-model="state.dateOccured"
              is-required
              @close="close"
            />
          </template>
        </UPopover>
      </UFormGroup>
      <UFormGroup label="Select Characters" name="characters" size="xl">
        <div v-if="characters.length > 0" class="grid grid-cols-2 gap-2 my-4">
          <div v-for="character in characters" :key="character.uuid">
            <UCheckbox
              v-model="partyUuids"
              :name="character.uuid"
              :value="character.uuid"
              :label="character.firstName + ' ' + character.lastName"
            />
          </div>
        </div>
        <p v-else>No characters found.</p>
      </UFormGroup>

      <UButton
        block
        color="amber"
        variant="solid"
        class="p-2 box-border text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="loading"
        @click="goBack"
      >
        {{ buttonText.backButton }}</UButton
      >

      <UButton
        type="submit"
        class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="loading"
      >
        {{ buttonText.submitButton }}</UButton
      >
    </UForm>
  </div>
</template>

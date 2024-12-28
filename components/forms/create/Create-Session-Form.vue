// SPDX-License-Identifier: Apache-2.0
<script setup lang="ts">
import { useRoute } from "vue-router";
import { format } from "date-fns";
import type { FormSubmitEvent } from "#ui/types";
import { sessionValidate } from "~/utils/validation/session-validation";
import type { ApiResponse, CampaignAll, SessionForm } from "~/types/types";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useToast();
const route = useRoute();
const campaignUuid = route.params.campaignUuid;

const state = reactive({
  dateOccured: undefined,
  partyUuids: [] as string[],
  submitButton: "Add Session",
  loading: false,
  disabled: false,
});

const { data: apiResponse } = await useFetch<ApiResponse<CampaignAll>>(
  `/campaign/${campaignUuid}/all`,
  {
    baseURL: config.public.baseURL,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      "Content-Type": "application/json",
    },
  },
);

const characters = computed(() => apiResponse.value?.data.characters ?? []);

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
  state.loading = true;
  state.disabled = true;
  state.submitButton = "Adding...";
  const dateOccured = setToStartOfDayUTC(event.data.dateOccured);
  await authStore.ensureValidToken();
  try {
    await $fetch(
      config.public.baseURL + "/campaign/" + campaignUuid + "/session/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: {
          partyUuids: state.partyUuids,
          dateOccured: dateOccured,
        },
      },
    );
    state.submitButton = "Success!";
    toast.add({
      title: "Session Added!",
      icon: "i-material-symbols-light:check-circle",
    });
  } catch (err) {
    console.error(err);
    toast.add({
      title: "There was an error - please try again",
      color: "red",
      icon: "i-material-symbols-light:cancel",
    });
  } finally {
    state.loading = false;
    state.disabled = false;
    state.submitButton = "Add Session";
    state.partyUuids = [];
    state.dateOccured = undefined;
  }
}
</script>
<template>
  <div class="flex justify-center">
    <UForm
      class="w-[260px] mt-2"
      :validate="sessionValidate"
      :state="state"
      @submit.prevent="onSubmit"
    >
      <UFormGroup
        label="Date Occured"
        name="dateOccured"
        class="mb-4"
        size="xl"
      >
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UButton
            icon="i-material-symbols-light:calendar-month"
            class="mt-2"
            :label="
              state.dateOccured
                ? format(new Date(state.dateOccured), 'MMM d, yyy')
                : 'Choose a date'
            "
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
              v-model="state.partyUuids"
              :name="character.uuid"
              :value="character.uuid"
              :label="character.firstName + ' ' + character.lastName"
            />
          </div>
        </div>
        <p v-else>No characters found.</p>
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

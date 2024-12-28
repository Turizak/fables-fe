// SPDX-License-Identifier: Apache-2.0
<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import type { NoteForm } from "~/types/types.ts";

const authStore = useAuthStore();
const toast = useToast();
const route = useRoute();
const campaignUuid = route.params.campaignUuid;
const sessionUuid = route.params.sessionUuid;

const state = reactive({
  campaign: campaignUuid,
  session: sessionUuid,
  note: undefined,
  submitButton: "Create Note",
  backButton: "Back to Session",
  disabled: false,
  loading: false,
});

async function goBack() {
  await authStore.ensureValidToken();
  await navigateTo(
    `/campaign/${campaignUuid}/session/${sessionUuid}/view-session`,
  );
}

async function onSubmit(event: FormSubmitEvent<NoteForm>) {
  state.loading = true;
  state.disabled = true;
  state.submitButton = "Adding...";
  state.backButton = "";
  await authStore.ensureValidToken();
  try {
    await $fetch("https://httpbin.org/post", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/json",
      },
      body: {
        campaign: event.data.campaign,
        session: event.data.session,
        note: event.data.note,
      },
    });
    state.submitButton = "Success!";
    toast.add({
      title: "Note Created!",
      icon: "i-material-symbols-light:check-circle",
    });
  } catch (error) {
    console.error("Error creating note: ", error);
    toast.add({
      title: "There was an error - please try again",
      color: "red",
      icon: "i-material-symbols-light:cancel",
    });
  } finally {
    state.loading = false;
    state.disabled = false;
    state.campaign = campaignUuid;
    state.session = sessionUuid;
    state.note = undefined;
    state.submitButton = "Create Note";
    state.backButton = "Back to Session";
  }
}
</script>
<template>
  <UForm :state="state" @submit.prevent="onSubmit">
    <div>
      <UFormGroup label="Campaign" name="campaign" class="mb-4">
        <div>
          <USelect
            v-model="state.campaign"
            :options="[state.campaign]"
            label="Select a Campaign"
            class="w-full"
            disabled
          />
        </div>
      </UFormGroup>
      <UFormGroup label="Session" name="session" class="mb-4">
        <div>
          <USelect
            v-model="state.session"
            :options="[state.session]"
            label="Select a Session"
            class="w-full"
            disabled
          />
        </div>
      </UFormGroup>
    </div>
    <UFormGroup label="Note" name="note" class="mb-4">
      <UTextarea v-model="state.note" :disabled="state.disabled" />
    </UFormGroup>
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

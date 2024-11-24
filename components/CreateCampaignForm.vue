<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore";
import type { FormError, FormSubmitEvent } from "#ui/types";
import type { CampaignForm } from "~/types/types";

const authStore = useAuthStore();
const config = useRuntimeConfig();
const toast = useToast();

const state = reactive({
  name: undefined,
  ruleset: "5e",
  maxPlayers: 1,
  loading: false,
  disabled: false,
  buttonText: "Create Campaign",
});

const validate = (state: CampaignForm): FormError[] => {
  const errors = [];
  if (!state.name) errors.push({ path: "name", message: "Required" });
  if (state.name && state.name.length > 100)
    errors.push({ path: "name", message: "Must be less than 100 characters" });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<CampaignForm>) {
  state.disabled = true;
  state.loading = true;
  state.buttonText = "Creating...";
  await authStore.ensureValidToken();
  try {
    const response = await $fetch<{
      status: string;
      message: string;
      data: CampaignForm;
    }>(config.public.baseURL + "/campaign/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/json",
      },
      body: {
        name: event.data.name,
        ruleset: event.data.ruleset,
        maxPlayers: event.data.maxPlayers,
      },
    });
    console.log(response);
    state.buttonText = "Success!";
    toast.add({
      title: "Campaign Created!",
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
    state.name = undefined;
    state.maxPlayers = 1;
    state.buttonText = "Create Campaign";
  }
}
</script>

<template>
  <UForm :validate="validate" :state="state" @submit.prevent="onSubmit">
    <UFormGroup label="Campaign Name" name="name" class="mb-4">
      <UInput
        v-model="state.name"
        :disabled="state.disabled"
        type="text"
        required
      />
    </UFormGroup>
    <UFormGroup label="Ruleset" name="ruleset" class="mb-4">
      <USelect
        v-model="state.ruleset"
        disabled
        :options="['5e']"
        placeholder="5e"
      />
    </UFormGroup>
    <div class="flex" />
    <UFormGroup label="Party Size" name="maxPlayers" class="mb-4">
      <p class="text-lg">{{ state.maxPlayers }}</p>
      <URange v-model="state.maxPlayers" :min="1" :max="6" required />
    </UFormGroup>

    <UButton
      type="submit"
      class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
      :loading="state.loading"
    >
      {{ state.buttonText }}</UButton
    >
  </UForm>
</template>

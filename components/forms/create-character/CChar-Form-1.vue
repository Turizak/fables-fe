<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import type { CharacterForm, ApiResponse, Campaign } from "~/types/types";
import { characterValidate } from "~/utils/validation/character-validation";
import { useAuthStore, useFormStore } from "#imports";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const formStore = useFormStore();

const state = reactive({
  ruleset: "5e",
  campaign: undefined,
  nextBtn: "Next Step: Details",
  campaignBtn: "Create Campaign",
  disabled: false,
  loading: false,
});

const { data: apiResponse, error } = await useFetch<
  ApiResponse<{ campaigns: Campaign[] }>
>("/account/campaigns", {
  baseURL: config.public.baseURL,
  headers: {
    Authorization: `Bearer ${authStore.token}`,
    "Content-Type": "application/json",
  },
});

if (error.value) {
  console.error("Error fetching campaigns:", error.value);
}

const campaignsOptions = computed(
  () =>
    apiResponse.value?.data.campaigns.map((campaign) => ({
      label: campaign.name,
      value: campaign.uuid,
    })) ?? [],
);

function updateFormStore(fields: CharacterForm) {
  Object.entries(fields).forEach(([field, value]) => {
    formStore.updateFormField(field, value);
  });
}

async function goBack() {
  await authStore.ensureValidToken();
  await navigateTo("/create-campaign");
}

async function onSubmit(event: FormSubmitEvent<CharacterForm>) {
  const eventData = {
    ruleset: event.data.ruleset,
    campaign: event.data.campaign,
  };
  state.disabled = true;
  state.loading = true;
  await authStore.ensureValidToken();
  updateFormStore(eventData);
  await navigateTo("/cchar/cchar-2");
}
</script>

<template>
  <UForm
    :validate="characterValidate"
    :state="state"
    @submit.prevent="onSubmit"
  >
    <UFormGroup label="Ruleset" name="ruleset" class="mb-4">
      <USelect
        v-model="state.ruleset"
        disabled
        :options="['5e']"
        placeholder="5e"
      />
    </UFormGroup>
    <UFormGroup label="Campaign" name="campaign" class="mb-4">
      <div class="flex gap-4">
        <USelect
          v-if="campaignsOptions.length > 0"
          v-model="state.campaign"
          :options="campaignsOptions"
          label="Select a Campaign"
          class="w-full"
        />
        <UTooltip text="A character must belong to a campaign.">
          <UIcon name="material-symbols:help-rounded" class="w-5 h-5 mt-1" />
        </UTooltip>
      </div>
    </UFormGroup>
    <div class="flex flex-col justify-center mb-4">
      <UButton
        block
        color="amber"
        variant="solid"
        class="p-2 box-border text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="state.loading"
        @click="goBack"
      >
        {{ state.campaignBtn }}</UButton
      >
      <UButton
        block
        type="submit"
        class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="state.loading"
      >
        {{ state.nextBtn }}</UButton
      >
    </div>
  </UForm>
</template>

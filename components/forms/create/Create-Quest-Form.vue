// SPDX-License-Identifier: Apache-2.0
<script setup lang="ts">
import SelectNPC from "~/components/selects/Select-NPC.vue";
import SelectSession from "~/components/selects/Select-Session.vue";
import type { FormSubmitEvent } from "#ui/types";
import type { QuestForm } from "~/types/types.ts";
import { questValidate } from "~/utils/validation/quest-validation";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useToast();
const route = useRoute();
const campaignUuid = route.params.campaignUuid;

const state = reactive({
  campaign: campaignUuid,
  name: undefined,
  description: undefined,
  questGiver: undefined,
  startingSessionUuid: undefined,
  submitButton: "Create Quest",
  disabled: false,
  loading: false,
});

const links = [
  {
    label: "NPC",
    labelClass: "text-lg",
    icon: "i-material-symbols-light:add-circle",
    to: `/campaign/${campaignUuid}/create-npc`,
  },
  {
    label: "Session",
    labelClass: "text-lg",
    icon: "i-material-symbols-light:add-circle",
    to: `/campaign/${campaignUuid}/create-session`,
  },
];

async function onSubmit(event: FormSubmitEvent<QuestForm>) {
  state.loading = true;
  state.disabled = true;
  state.submitButton = "Adding...";
  console.log(event.data.questGiver.value);
  await authStore.ensureValidToken();
  try {
    await $fetch(
      config.public.baseURL + "/campaign/" + campaignUuid + "/quest/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: {
          name: event.data.name,
          description: event.data.description,
          questGiver: event.data.questGiver.value,
          bossUuids: event.data.bossUuids
            ? event.data.bossUuids.map((boss) => boss.value)
            : [],
          startingSessionUuid: event.data.startingSessionUuid.value,
        },
      },
    );
    state.submitButton = "Success!";
    toast.add({
      title: "Quest Created!",
      icon: "i-material-symbols-light:check-circle",
    });
  } catch (error) {
    console.error("Error creating quest: ", error);
    toast.add({
      title: "There was an error - please try again",
      color: "red",
      icon: "i-material-symbols-light:cancel",
    });
  } finally {
    state.loading = false;
    state.disabled = false;
    state.campaign = campaignUuid;
    state.questGiver = undefined;
    state.startingSessionUuid = undefined;
    state.description = undefined;
    state.name = undefined;
    state.submitButton = "Create Quest";
  }
}
</script>
<template>
  <div class="p-2">
    <UCard class="mt-2">
      <template #header>
        <h2 class="text-5xl mb-2">Create Quest</h2>
        <UHorizontalNavigation
          :links="links"
          class="flex justify-around border-gray-200 dark:border-gray-800 mt-2"
        />
      </template>
      <UForm
        :state="state"
        :validate="questValidate"
        @submit.prevent="onSubmit"
      >
        <UFormGroup label="Campaign" name="campaign" class="hidden">
          <USelect
            v-model="state.campaign"
            :options="[state.campaign]"
            label="Select a Campaign"
            class="w-full"
            disabled
          />
        </UFormGroup>
        <UFormGroup label="Quest Name" name="name" class="mb-4">
          <UInput
            v-model="state.name"
            :disabled="state.disabled"
            type="text"
            required
          />
        </UFormGroup>
        <UFormGroup label="Quest Giver" name="questGiver" class="mb-4">
          <SelectNPC v-model="state.questGiver" />
        </UFormGroup>
        <UFormGroup
          label="Starting Session"
          name="startingSessionUuid"
          class="mb-4"
        >
          <SelectSession v-model="state.startingSessionUuid" />
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
    </UCard>
  </div>
</template>

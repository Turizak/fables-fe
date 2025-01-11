<script setup lang="ts">
import type { QuestsResponse } from "~/types/types";
import { useRoute } from "vue-router";
import { useAuthStore, useLocationStore } from "#imports";
import type { FormSubmitEvent } from "#ui/types";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const sessionStore = useLocationStore();
const toast = useToast();
const route = useRoute();

const campaignUuid = route.params.campaignUuid;
// const sessionUuid = route.params.sessionUuid;

const state = reactive({
  quest: undefined,
  loading: false,
  disabled: false,
  submitButton: "Add quest to session",
  createButton: "Create a new quest",
});

const { data: apiResponse, error } = await useFetch<QuestsResponse>(
  `/campaign/${campaignUuid}/quests`,
  {
    baseURL: config.public.baseURL,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      "Content-Type": "application/json",
    },
  },
);

if (error.value) {
  console.error("Error fetching quests:", error.value);
}

const quests = computed(
  () =>
    apiResponse.value?.data.quests.map((quest) => ({
      label: quest.name,
      value: quest.uuid,
    })) ?? [],
);
async function onSubmit(event: FormSubmitEvent<{ quest: string }>) {
  state.loading = true;
  state.disabled = true;
  state.submitButton = "Adding...";
  await authStore.ensureValidToken();
  const quest = event.data.quest;
  sessionStore.addQuest(quest);
  try {
    await $fetch("https://httpbin.org/patch", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/json",
      },
      body: {
        questUuids: sessionStore.quests,
      },
    });
    state.submitButton = "Success!";
    toast.add({
      title: "Quest Added!",
      icon: "i-material-symbols-light:check-circle",
    });
  } catch (error) {
    console.error("Error adding quest:", error);
    toast.add({
      title: "There was an error - please try again",
      color: "red",
      icon: "i-material-symbols-light:error",
    });
  } finally {
    state.loading = false;
    state.disabled = false;
    state.submitButton = "Create Quest";
    state.quest = undefined;
  }
}
</script>
<template>
  <div>
    <UForm class="w-[260px] mt-2" :state="state" @submit.prevent="onSubmit">
      <UFormGroup>
        <USelectMenu
          v-if="quests.length > 0"
          v-model="state.quest"
          :options="quests"
          label="Select a Quest"
          class="w-full"
        />
      </UFormGroup>
      <UFormGroup>
        <UButton
          type="submit"
          class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
          :loading="state.loading"
          :disabled="state.disabled"
        >
          {{ state.submitButton }}</UButton
        >
        <UButton
          type="submit"
          class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
          color="blue"
          variant="solid"
          :to="`/campaign/${campaignUuid}/create-quest`"
          :loading="state.loading"
          :disabled="state.disabled"
        >
          {{ state.createButton }}</UButton
        >
      </UFormGroup>
    </UForm>
  </div>
</template>

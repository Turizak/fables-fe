<script setup lang="ts">
import type { ApiResponse, Character } from "~/types/types";
import { useRoute } from "vue-router";
import { useAuthStore, useLocationStore } from "#imports";
import type { FormSubmitEvent } from "#ui/types";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const sessionStore = useLocationStore();
const toast = useToast();
const route = useRoute();

const campaignUuid = route.params.campaignUuid;
const sessionUuid = route.params.sessionUuid;

const state = reactive({
  npc: undefined,
  loading: false,
  disabled: false,
  submitButton: "Add NPC to session",
  createButton: "Create a new NPC",
});

const { data: apiResponse, error } = await useFetch<
  ApiResponse<{ npcs: Character[] }>
>(`/campaign/${campaignUuid}/npcs`, {
  baseURL: config.public.baseURL,
  headers: {
    Authorization: `Bearer ${authStore.token}`,
    "Content-Type": "application/json",
  },
});

if (error.value) {
  console.error("Error fetching npcs:", error.value);
}

const npcs = computed(
  () =>
    apiResponse.value?.data.npcs.map((npc) => ({
      label: npc.firstName + " " + npc.lastName,
      value: npc.uuid,
    })) ?? [],
);

async function onSubmit(event: FormSubmitEvent<{ npc: string }>) {
  state.loading = true;
  state.disabled = true;
  state.submitButton = "Adding...";
  await authStore.ensureValidToken();
  sessionStore.addNpc(event.data.npc);
  try {
    await $fetch(
      config.public.baseURL +
        "/campaign/" +
        campaignUuid +
        "/session/" +
        sessionUuid +
        "/update",
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: {
          npcUuids: sessionStore.npcs,
        },
      },
    );
    state.submitButton = "Success!";
    toast.add({
      title: "NPC Added!",
      icon: "i-material-symbols-light:check-circle",
    });
  } catch (error) {
    console.error("Error creating location:", error);
    toast.add({
      title: "There was an error - please try again",
      color: "red",
      icon: "i-material-symbols-light:error",
    });
  } finally {
    state.loading = false;
    state.disabled = false;
    state.submitButton = "Create NPC";
    state.createButton = "Create a new NPC";
    state.npc = undefined;
  }
}
</script>

<template>
  <div>
    <UForm class="w-[260px] mt-2" :state="state" @submit.prevent="onSubmit">
      <UFormGroup>
        <USelect
          v-if="npcs.length > 0"
          v-model="state.npc"
          :options="npcs"
          label="Select an NPC"
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
          :to="`/campaign/${campaignUuid}/create-npc`"
          :loading="state.loading"
          :disabled="state.disabled"
        >
          {{ state.createButton }}</UButton
        >
      </UFormGroup>
    </UForm>
  </div>
</template>

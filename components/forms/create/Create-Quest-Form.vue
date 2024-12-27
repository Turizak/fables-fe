<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import type { QuestForm } from "~/types/types.ts";

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
  questBoss: undefined,
  submitButton: "Create Quest",
  createButton: "Create a new NPC",
  disabled: false,
  loading: false,
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

const questGivers = computed(
  () =>
    apiResponse.value?.data.npcs.map((npc) => ({
      label: npc.firstName + " " + npc.lastName,
      value: npc.uuid,
    })) ?? [],
);
const questBosses = computed(() => [
  { label: "None", value: null },
  ...(apiResponse.value?.data.npcs.map((npc) => ({
    label: npc.firstName + " " + npc.lastName,
    value: npc.uuid,
  })) ?? []),
]);

async function onSubmit(event: FormSubmitEvent<QuestForm>) {
  state.loading = true;
  state.disabled = true;
  state.submitButton = "Adding...";
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
    state.questGiver = undefined;
    state.questBoss = undefined;
    state.description = undefined;
    state.name = undefined;
    state.submitButton = "Create Note";
    state.createButton = "Create a new NPC";
  }
}
</script>
<template>
  <UForm :state="state" @submit.prevent="onSubmit">
    <div>
      <UFormGroup label="Campaign" name="campaign" class="hidden">
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
    </div>
    <UFormGroup label="Quest Name" name="name" class="my-4">
      <UInput
        v-model="state.name"
        :disabled="state.disabled"
        type="text"
        required
      />
    </UFormGroup>
    <UFormGroup label="Description" name="description" class="mb-4">
      <UTextarea v-model="state.description" :disabled="state.disabled" />
    </UFormGroup>
    <UFormGroup label="Quest Giver" name="questGiver" class="mb-4">
      <USelect
        v-if="questGivers.length > 0"
        v-model="state.questGiver"
        :options="questGivers"
        label="Select an NPC"
        class="w-full"
        required
      />
    </UFormGroup>
    <UFormGroup label="Quest Boss" name="questBoss" class="mb-4">
      <USelect
        v-if="questBosses.length > 0"
        v-model="state.questBoss"
        :options="questBosses"
        label="Select an NPC"
        class="w-full"
      />
    </UFormGroup>
    <UButton
      type="submit"
      class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
      :loading="state.loading"
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
  </UForm>
</template>

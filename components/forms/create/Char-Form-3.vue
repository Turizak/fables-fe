// SPDX-License-Identifier: Apache-2.0
// Appearance

<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import type { CharacterForm } from "~/types/types";
import { characterValidate3 } from "~/utils/validation/character-validation-3";
import { useAuthStore, useFormStore } from "#imports";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const formStore = useFormStore();
const toast = useToast();
const router = useRouter();

const state = reactive({
  hair: undefined,
  skin: undefined,
  eyes: undefined,
  age: undefined,
  height: undefined,
  weight: undefined,
  gender: undefined,
  nextBtn: "Create Character",
  prevBtn: "Go Back",
  disabled: false,
  loading: false,
});

function updateFormStore(fields: CharacterForm) {
  Object.entries(fields).forEach(([field, value]) => {
    formStore.updateFormField(field, value);
  });
}

async function goBack() {
  await authStore.ensureValidToken();
  router.back();
}

async function onSubmit(event: FormSubmitEvent<CharacterForm>) {
  const uuid = "506bdf8b-4906-48ea-ad18-4e65a8a02e59";
  const eventData = {
    hair: event.data.hair,
    skin: event.data.skin,
    eyes: event.data.eyes,
    age: event.data.age,
    height: event.data.height,
    weight: event.data.weight,
    gender: event.data.gender,
  };
  state.disabled = true;
  state.loading = true;
  await authStore.ensureValidToken();
  updateFormStore(eventData);
  try {
    const response = await $fetch<{
      status: string;
      message: string;
      data: CharacterForm;
    }>(config.public.baseURL + "/campaign/" + uuid + "/character/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/json",
      },
      body: formStore.formData,
    });
    console.log(response);
    toast.add({
      title: "Character Created!",
      icon: "i-material-symbols-light:check-circle",
    });
    await navigateTo("/");
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
    state.nextBtn = "Create Character";
    state.prevBtn = "Back";
    state.hair = undefined;
    state.skin = undefined;
    state.eyes = undefined;
    state.age = undefined;
    state.height = undefined;
    state.weight = undefined;
    state.gender = undefined;
  }
}
</script>

<template>
  <UForm
    :validate="characterValidate3"
    :state="state"
    @submit.prevent="onSubmit"
  >
    <div class="grid grid-cols-2 gap-4">
      <UFormGroup label="Hair" name="hair">
        <UInput v-model="state.hair" :disabled="state.disabled" type="text" />
      </UFormGroup>
      <UFormGroup label="Skin" name="skin">
        <UInput v-model="state.skin" :disabled="state.disabled" type="text" />
      </UFormGroup>
      <UFormGroup label="Eyes" name="eyes">
        <UInput v-model="state.eyes" :disabled="state.disabled" type="text" />
      </UFormGroup>
      <UFormGroup label="Age (years)" name="age">
        <UInput v-model="state.age" :disabled="state.disabled" type="number" />
      </UFormGroup>
      <UFormGroup label="Height (inches)" name="height">
        <UInput
          v-model="state.height"
          :disabled="state.disabled"
          type="number"
        />
      </UFormGroup>
      <UFormGroup label="Weight (lbs)" name="weight" class="mb-4">
        <UInput
          v-model="state.weight"
          :disabled="state.disabled"
          type="number"
        />
      </UFormGroup>
    </div>
    <UFormGroup label="Gender" name="gender">
      <UInput v-model="state.gender" :disabled="state.disabled" type="text" />
    </UFormGroup>

    <div class="flex flex-col justify-center">
      <UButton
        block
        color="amber"
        variant="solid"
        class="p-2 box-border text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="state.loading"
        @click="goBack"
      >
        {{ state.prevBtn }}</UButton
      >
      <UButton
        type="submit"
        block
        class="p-2 box-border text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="state.loading"
      >
        {{ state.nextBtn }}</UButton
      >
    </div>
  </UForm>
</template>

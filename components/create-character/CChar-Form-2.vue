// Appearance

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { useAuthStore, useFormStore } from "#imports";

type CharacterForm = {
  hair: string;
  skin: string;
  eyes: string;
  height: number;
  weight: number;
  age: number;
  gender: string;
};
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
});

const disabled = ref(false);
const loading = ref(false);
const buttonText = reactive({
  nextBtn: "Create Character",
  prevBtn: "Go Back",
});

const validate = (state: CharacterForm): FormError[] => {
  const errors = [];
  if (state.hair && state.hair.length > 25)
    errors.push({ path: "hair", message: "Must be less than 25 characters" });
  if (state.skin && state.skin.length > 25)
    errors.push({ path: "skin", message: "Must be less than 25 characters" });
  if (state.eyes && state.eyes.length > 25)
    errors.push({ path: "eyes", message: "Must be less than 25 characters" });
  if (state.height && state.height < 1)
    errors.push({ path: "height", message: "Must be at least 12 inches" });
  if (state.gender && state.gender.length > 25)
    errors.push({ path: "gender", message: "Must be less than 25 characters" });
  if (state.age && state.age < 1)
    errors.push({ path: "age", message: "Must be at least 1 year old" });
  if (state.weight && state.weight < 1)
    errors.push({ path: "weight", message: "Must be at least 1lb" });
  return errors;
};

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
  disabled.value = true;
  loading.value = true;
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
      icon: "i-heroicons-check-circle-solid",
    });
    await navigateTo("/");
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
    buttonText.nextBtn = "Create Character";
    buttonText.prevBtn = "Back";
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
  <UForm :validate="validate" :state="state" @submit.prevent="onSubmit">
    <div class="grid grid-cols-2 gap-4">
      <UFormGroup label="Hair" name="hair">
        <UInput v-model="state.hair" :disabled="disabled" type="text" />
      </UFormGroup>
      <UFormGroup label="Skin" name="skin">
        <UInput v-model="state.skin" :disabled="disabled" type="text" />
      </UFormGroup>
      <UFormGroup label="Eyes" name="eyes">
        <UInput v-model="state.eyes" :disabled="disabled" type="text" />
      </UFormGroup>
      <UFormGroup label="Age (years)" name="age">
        <UInput v-model="state.age" :disabled="disabled" type="number" />
      </UFormGroup>
      <UFormGroup label="Height (inches)" name="height">
        <UInput v-model="state.height" :disabled="disabled" type="number" />
      </UFormGroup>
      <UFormGroup label="Weight (lbs)" name="weight" class="mb-4">
        <UInput v-model="state.weight" :disabled="disabled" type="number" />
      </UFormGroup>
    </div>
    <UFormGroup label="Gender" name="gender">
      <UInput v-model="state.gender" :disabled="disabled" type="text" />
    </UFormGroup>

    <div class="flex flex-col justify-center">
      <UButton
        block
        color="amber"
        variant="solid"
        class="p-2 box-border text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="loading"
        @click="goBack"
      >
        {{ buttonText.prevBtn }}</UButton
      >
      <UButton
        type="submit"
        block
        class="p-2 box-border text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="loading"
      >
        {{ buttonText.nextBtn }}</UButton
      >
    </div>
  </UForm>
</template>

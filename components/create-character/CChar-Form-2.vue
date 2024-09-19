// Alignment and Faith

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { useAuthStore } from "#imports";

type CharacterForm = {
  alignment: string;
  faith: string;
};
const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

const alignments = [
  "Chaotic Evil",
  "Chaotic Good",
  "Chaotic Neutral",
  "Lawful Evil",
  "Lawful Good",
  "Lawful Neutral",
  "Neutral",
  "Neutral Evil",
  "Neutral Good",
];

const state = reactive({
  alignment: undefined,
  faith: undefined,
});

const disabled = ref(false);
const loading = ref(false);
const buttonText = reactive({
  nextBtn: "Next: Appearance",
  prevBtn: "Go Back",
});

const validate = (state: CharacterForm): FormError[] => {
  const errors = [];
  if (!state.alignment) errors.push({ path: "name", message: "Required" });
  return errors;
};

const goBack = () => {
  router.back();
};

async function onSubmit(event: FormSubmitEvent<CharacterForm>) {
  disabled.value = true;
  loading.value = true;
  await authStore.ensureValidToken();
  try {
    const response = await $fetch<{
      status: string;
      message: string;
      data: CharacterForm;
    }>("https://httpbin.org/post", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/json",
      },
      body: {
        alignment: event.data.alignment,
        faith: event.data.faith,
      },
    });
    console.log(response);
    await navigateTo("/cchar/cchar-3");
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
    buttonText.nextBtn = "Next: Appearance";
    buttonText.prevBtn = "Back";
    state.alignment = undefined;
    state.faith = undefined;
  }
}
</script>

<template>
  <UForm :validate="validate" :state="state" @submit.prevent="onSubmit">
    <UFormGroup label="Alignment" name="alignment" class="mb-4">
      <USelect
        v-model="state.alignment"
        :options="alignments"
        :disabled="disabled"
        required
      />
    </UFormGroup>
    <UFormGroup label="Faith" name="faith">
      <UInput v-model="state.faith" :disabled="disabled" type="text" />
    </UFormGroup>
    <div class="flex gap-8 justify-center">
      <UButton
        class="p-2 box-border w-2/5 text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="loading"
        @click="goBack"
      >
        {{ buttonText.prevBtn }}</UButton
      >
      <UButton
        type="submit"
        class="p-2 box-border w-2/5 text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="loading"
      >
        {{ buttonText.nextBtn }}</UButton
      >
    </div>
  </UForm>
</template>

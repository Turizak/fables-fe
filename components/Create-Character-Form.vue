<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { useAuthStore } from "#imports";

type CharacterForm = {
  name: string;
  ruleset: string;
  class: string;
};
const authStore = useAuthStore();
const toast = useToast();

const state = reactive({
  name: undefined,
  ruleset: "5e",
  class: undefined,
});

const options = [
  {
    value: "barbarian",
    label: "Barbarian",
  },
  {
    value: "bard",
    label: "Bard",
  },
  {
    value: "cleric",
    label: "Cleric",
  },
  {
    value: "druid",
    label: "Druid",
  },
  {
    value: "fighter",
    label: "Fighter",
  },
  {
    value: "monk",
    label: "Monk",
  },
  {
    value: "paladin",
    label: "Paladin",
  },
  {
    value: "ranger",
    label: "Ranger",
  },
  {
    value: "rogue",
    label: "Rogue",
  },
  {
    value: "sorcerer",
    label: "Sorcerer",
  },
  {
    value: "warlock",
    label: "Warlock",
  },
  {
    value: "wizard",
    label: "Wizard",
  },
];

const disabled = ref(false);
const loading = ref(false);
const buttonText = ref("Create Character");

const validate = (state: CharacterForm): FormError[] => {
  const errors = [];
  if (!state.name) errors.push({ path: "name", message: "Required" });
  if (state.name && state.name.length > 25)
    errors.push({ path: "name", message: "Must be less than 25 characters" });
  return errors;
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
        name: event.data.name,
        ruleset: event.data.ruleset,
        class: event.data.class,
      },
    });
    console.log(response);
    toast.add({
      title: "Character Created!",
      icon: "i-heroicons-check-circle-solid",
    });
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
    buttonText.value = "Create Character";
    state.name = undefined;
  }
}
</script>

<template>
  <UForm :validate="validate" :state="state" @submit.prevent="onSubmit">
    <UFormGroup label="Character Name" name="name" class="mb-4">
      <UInput v-model="state.name" :disabled="disabled" type="text" required />
    </UFormGroup>
    <UFormGroup label="Ruleset" name="ruleset" class="mb-4">
      <USelect
        v-model="state.ruleset"
        disabled
        :options="['5e']"
        placeholder="5e"
      />
    </UFormGroup>
    <UFormGroup label="Class" name="class">
      <URadioGroup v-model="state.class" :options="options" />
    </UFormGroup>
    <UButton
      type="submit"
      class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
      :loading="loading"
    >
      {{ buttonText }}</UButton
    >
  </UForm>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types';
import { useAuthStore } from '~/stores/authStore';

const authStore = useAuthStore();
const config = useRuntimeConfig();
const toast = useToast();

const state = reactive({
  name: undefined,
  ruleset: '5e',
  maxPlayers: 1,
});

const loading = ref(false);
const disabled = ref(false);
const buttonText = ref('Create Campaign');

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.name) errors.push({ path: 'name', message: 'Required' });
  if (state.name.length > 100)
    errors.push({ path: 'name', message: 'Must be less than 100 characters' });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  disabled.value = true;
  loading.value = true;
  buttonText.value = 'Creating...';
  await authStore.ensureValidToken();
  try {
    const response: any = await $fetch(
      config.public.baseURL + '/campaign/create',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
        },
        body: {
          name: event.data.name,
          ruleset: event.data.ruleset,
          maxPlayers: event.data.maxPlayers,
        },
      }
    );
    console.log(response);
    buttonText.value = 'Success!';
    toast.add({
      title: 'Campaign Created!',
      icon: 'i-heroicons-check-circle-solid',
    });
  } catch (err: any) {
    console.error(err);
    toast.add({
      title: 'There was an error - please try again',
      color: 'red',
      icon: 'i-heroicons-x-circle-solid',
    });
  } finally {
    loading.value = false;
    disabled.value = false;
    state.name = undefined;
    state.maxPlayers = 1;
    buttonText.value = 'Create Campaign';
  }
}
</script>

<template>
  <UForm :validate="validate" :state="state" @submit.prevent="onSubmit">
    <UFormGroup label="Campaign Name" name="name" class="mb-4">
      <UInput :disabled="disabled" type="text" v-model="state.name" required />
    </UFormGroup>
    <UFormGroup label="Ruleset" name="ruleset" class="mb-4">
      <USelect
        disabled
        v-model="state.ruleset"
        :options="['5e']"
        placeholder="5e"
      />
    </UFormGroup>
    <div class="flex"></div>
    <UFormGroup label="Party Size" name="maxPlayers" class="mb-4">
      <p class="text-lg">{{ state.maxPlayers }}</p>
      <URange v-model="state.maxPlayers" :min="1" :max="6" required />
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

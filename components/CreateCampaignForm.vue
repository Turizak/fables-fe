<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types';
import { useAuthStore } from '~/stores/authStore';

const authStore = useAuthStore();
const config = useRuntimeConfig();
const toast = useToast();

const state = reactive({
  name: undefined,
  description: undefined,
});

const loading = ref(false);
const disabled = ref(false);
const buttonText = ref('Create Campaign');

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.name) errors.push({ path: 'name', message: 'Required' });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  disabled.value = true;
  loading.value = true;
  buttonText.value = 'Creating...';
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
          description: event.data.description,
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
    state.description = undefined;
    buttonText.value = 'Create Campaign';
  }
}
</script>

<template>
  <UForm :validate="validate" :state="state" @submit.prevent="onSubmit">
    <UFormGroup label="Campaign Name" name="name" class="mb-4">
      <UInput :disabled="disabled" type="text" v-model="state.name" required />
    </UFormGroup>
    <UFormGroup label="Description" name="description" class="mb-2">
      <UTextarea :disabled="disabled" v-model="state.description" autoresize />
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

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types';
import { useRouter } from 'nuxt/app';

const router = useRouter();
const state = reactive({
  email: undefined,
  password: undefined,
});

const buttonText = reactive({
  loginButton: "Login",
  createAccountButton: "Create Account"
})

const loading = ref(false);
const error = ref(null);

const validate = (state: any): FormError[] => {
  const errors = [];
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!state.email) errors.push({ path: 'email', message: 'Required' });
  if (!emailRegex.test(state.email))
    errors.push({ path: 'email', message: 'Invalid email address' });
  if (!state.password) errors.push({ path: 'password', message: 'Required' });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  loading.value = true;
  buttonText.loginButton = "Logging In..."
  buttonText.createAccountButton = ""
  error.value = null;
  try {
    const response = await $fetch('', {
      method: 'POST',
      body: {
        email: event.data.email,
        password: event.data.password
      }
    })
  } catch (err: any) {
    error.value = err.message || 'An error occurred';
  } finally {
    loading.value = false;
    buttonText.loginButton = "Login"
    buttonText.createAccountButton = "Create Account"
    router.push('/')
  }
}
</script>
<template>
  <div class="flex justify-center">
    <UForm class="w-[260px] mt-2" :validate="validate" :state="state" @submit.prevent="onSubmit">

      <!-- Error Message -->
      <div v-if="error" class="mb-2">
        <UButton disabled>Error: {{ error }}</UButton>
      </div>

      <UFormGroup label="Email" name="email" class="mb-4">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UButton type="submit"
        class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="loading">
        {{ buttonText.loginButton }}</UButton>
      <NuxtLink to="/createAccount">
        <UButton type="submit"
          class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
          :loading="loading">
          {{ buttonText.createAccountButton }}</UButton>
      </NuxtLink>
    </UForm>
  </div>
</template>

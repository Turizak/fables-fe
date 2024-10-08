<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore";
import type { FormError, FormSubmitEvent } from "#ui/types";

type AuthResponse = {
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
  message: string;
  status: number;
  statusText: string;
  timestamp: string;
};

type FormData = {
  email: string;
  password: string;
};

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useToast();

const state = reactive({
  email: undefined,
  password: undefined,
});

const buttonText = reactive({
  loginButton: "Login",
  createAccountButton: "Create Account",
});

const loading = ref(false);
const disabled = ref(false);

const validate = (state: FormData): FormError[] => {
  const errors = [];
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!state.email) errors.push({ path: "email", message: "Required" });
  if (!emailRegex.test(state.email))
    errors.push({ path: "email", message: "Invalid email address" });
  if (!state.password) errors.push({ path: "password", message: "Required" });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<FormData>) {
  loading.value = true;
  disabled.value = true;
  buttonText.loginButton = "Logging In...";
  buttonText.createAccountButton = "";
  try {
    const response: AuthResponse = await $fetch(
      config.public.baseURL + "/account/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          email: event.data.email,
          password: event.data.password,
        },
      },
    );
    authStore.setToken(response.data.tokens.accessToken);
    authStore.setRefreshToken(response.data.tokens.refreshToken);
    await navigateTo("/");
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const errResponse = (
        error as {
          response: {
            _data: { message: string; status: number; statusText: string };
          };
        }
      ).response;
      toast.add({
        title: `${errResponse._data.message}`,
        color: "red",
        icon: "i-heroicons-x-circle-solid",
      });
      console.error(
        `Error: ${errResponse._data.status}, ${errResponse._data.statusText}`,
      );
    } else {
      console.error(error);
    }
  } finally {
    loading.value = false;
    disabled.value = false;
    buttonText.loginButton = "Login";
    buttonText.createAccountButton = "Create Account";
  }
}
</script>
<template>
  <div class="flex justify-center">
    <UForm
      class="w-[260px] mt-2"
      :validate="validate"
      :state="state"
      @submit.prevent="onSubmit"
    >
      <UFormGroup label="Email" name="email" class="mb-4">
        <UInput v-model="state.email" :disabled="disabled" type="email" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" :disabled="disabled" type="password" />
      </UFormGroup>

      <UButton
        type="submit"
        class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="loading"
      >
        {{ buttonText.loginButton }}</UButton
      >
      <NuxtLink to="/create-account">
        <UButton
          type="submit"
          class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
          :loading="loading"
        >
          {{ buttonText.createAccountButton }}</UButton
        >
      </NuxtLink>
    </UForm>
  </div>
</template>

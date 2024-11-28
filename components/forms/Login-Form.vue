<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore";
import { loginValidate } from "~/utils/validation/login-validation";
import type { FormSubmitEvent } from "#ui/types";
import type { AuthResponse, FormData } from "~/types/types";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useToast();

const state = reactive({
  email: undefined,
  password: undefined,
  loginButton: "Login",
  createAccountButton: "Create Account",
  loading: false,
  disabled: false,
});

async function onSubmit(event: FormSubmitEvent<FormData>) {
  state.loading = true;
  state.disabled = true;
  state.loginButton = "Logging In...";
  state.createAccountButton = "";
  try {
    const { data, error } = await useFetch<AuthResponse>("/account/login", {
      baseURL: config.public.baseURL,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email: event.data.email,
        password: event.data.password,
      },
    });
    if (error.value) throw error.value;
    if (data.value) {
      authStore.setToken(response.data.tokens.accessToken);
      authStore.setRefreshToken(response.data.tokens.refreshToken);
      await navigateTo("/");
    }
  } catch (error) {
    console.error("Login error:", error?.statusCode || "Unknown error");
    toast.add({
      title: `Login failed: ${error?.statusCode}`,
      color: "red",
      icon: "i-material-symbols-light:cancel",
    });
  } finally {
    state.loading = false;
    state.disabled = false;
    state.loginButton = "Login";
    state.createAccountButton = "Create Account";
  }
}
</script>
<template>
  <div class="flex justify-center">
    <UForm
      class="w-[260px] mt-2"
      :validate="loginValidate"
      :state="state"
      @submit.prevent="onSubmit"
    >
      <UFormGroup label="Email" name="email" class="mb-4">
        <UInput v-model="state.email" :disabled="state.disabled" type="email" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput
          v-model="state.password"
          :disabled="state.disabled"
          type="password"
        />
      </UFormGroup>

      <UButton
        type="submit"
        class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
        :loading="state.loading"
      >
        {{ state.loginButton }}</UButton
      >
      <NuxtLink to="/create-account">
        <UButton
          type="submit"
          class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[20px]"
          :loading="state.loading"
        >
          {{ state.createAccountButton }}</UButton
        >
      </NuxtLink>
    </UForm>
  </div>
</template>

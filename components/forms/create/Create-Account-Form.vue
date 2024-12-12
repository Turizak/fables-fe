<script setup lang="ts">
import { validate } from "~/utils/validation/create-account-validation";
import type { FormSubmitEvent } from "#ui/types";
import type { FormType } from "~/types/types";

const state = reactive({
  email: undefined,
  createPassword: undefined,
  confirmPassword: undefined,
});

async function onSubmit(event: FormSubmitEvent<FormType>) {
  console.log(event.data);
}
</script>
<template>
  <div class="flex justify-center text-justify">
    <UForm
      class="w-[260px] mt-2"
      :validate="validate"
      :state="state"
      @submit="onSubmit"
    >
      <UFormGroup label="Email" name="email" class="mb-4">
        <UInput v-model="state.email" type="email" />
      </UFormGroup>

      <UFormGroup label="Create Password" name="createPassword" class="mb-4">
        <UInput v-model="state.createPassword" type="password" />
      </UFormGroup>
      <UFormGroup label="Confirm Password" name="confirmPassword" class="mb-4">
        <UInput v-model="state.confirmPassword" type="password" />
      </UFormGroup>

      <UButton
        type="submit"
        class="p-2 box-border w-full text-white inline-flex h-[35px] items-center justify-center rounded-[4px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none my-[20px]"
        >Create Account</UButton
      >
      <h2 class="text-xl underline mb-2">Password Requirements</h2>
      <ul>
        <li>12 or more characters</li>
        <li>1 upper case letter</li>
        <li>1 lower case letter</li>
        <li>1 number</li>
        <li>1 special character</li>
      </ul>
    </UForm>
  </div>
</template>

// SPDX-License-Identifier: Apache-2.0
<script setup lang="ts">
import CreateAccountForm from "~/components/forms/create/Create-Account-Form.vue";

definePageMeta({
  layout: "login" as "default",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2">Create Account</h1>
    <CreateAccountForm />
  </div>
</template>

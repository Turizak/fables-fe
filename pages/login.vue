// SPDX-License-Identifier: Apache-2.0
<script setup lang="ts">
import LoginForm from "~/components/forms/Login-Form.vue";

definePageMeta({
  layout: "login" as "default",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2">Login</h1>
    <LoginForm />
  </div>
</template>

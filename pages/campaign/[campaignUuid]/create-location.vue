// SPDX-License-Identifier: Apache-2.0
<script setup lang="ts">
import CreateLocationForm from "~/components/forms/create/Create-Location-Form.vue";
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2">Create Location</h1>
    <CreateLocationForm />
  </div>
</template>

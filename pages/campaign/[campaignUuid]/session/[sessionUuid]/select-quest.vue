// SPDX-License-Identifier: Apache-2.0
<script setup lang="ts">
import SelectQuestForm from "~/components/forms/select/Select-Quest-Form.vue";
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2 mb-2">Select Quest</h1>
    <SelectQuestForm />
  </div>
</template>

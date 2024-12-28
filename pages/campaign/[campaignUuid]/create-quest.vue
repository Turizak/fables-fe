// SPDX-License-Identifier: Apache-2.0
<script setup lang="ts">
import CreateQuestForm from "~/components/forms/create/Create-Quest-Form.vue";
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <CreateQuestForm />
  </div>
</template>

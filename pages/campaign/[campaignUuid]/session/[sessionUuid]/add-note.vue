// SPDX-License-Identifier: Apache-2.0
<script setup lang="ts">
import CreateNoteForm from "~/components/forms/create/Create-Note-Form.vue";
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2">Add Note</h1>
    <CreateNoteForm />
  </div>
</template>

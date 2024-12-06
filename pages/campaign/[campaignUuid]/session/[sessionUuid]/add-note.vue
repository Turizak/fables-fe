<script setup lang="ts">
import NoteForm from "~/components/forms/Note-Form.vue";
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2">Add Note</h1>
    <NoteForm />
  </div>
</template>

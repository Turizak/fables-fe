<script setup lang="ts">
import CreateSessionForm from "~/components/forms/create/Create-Session-Form.vue";
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2">Create Session</h1>
    <CreateSessionForm />
  </div>
</template>

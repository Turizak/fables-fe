<script setup lang="ts">
import SessionForm from "~/components/forms/Session-Form.vue";
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2">Add Session</h1>
    <SessionForm />
  </div>
</template>

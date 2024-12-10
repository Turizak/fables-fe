<script setup lang="ts">
import CreateNPCForm from "~/components/forms/create/Create-NPC-Form.vue";
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2">Create NPC</h1>
    <CreateNPCForm />
  </div>
</template>

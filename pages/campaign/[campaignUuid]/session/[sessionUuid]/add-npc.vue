<script setup lang="ts">
import NPCForm from "~/components/forms/NPC-Form.vue";
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2">Add NPC</h1>
    <NPCForm />
  </div>
</template>

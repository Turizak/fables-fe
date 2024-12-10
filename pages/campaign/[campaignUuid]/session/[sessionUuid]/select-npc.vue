<script setup lang="ts">
import SelectNPCForm from "~/components/forms/select/Select-NPC-Form.vue";
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2 mb-2">Select NPC</h1>
    <SelectNPCForm />
  </div>
</template>

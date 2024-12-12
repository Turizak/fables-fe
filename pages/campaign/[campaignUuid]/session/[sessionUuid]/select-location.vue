<script setup lang="ts">
import SelectLocationForm from "~/components/forms/select/Select-Location-Form.vue";
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2 mb-2">Select Location</h1>
    <SelectLocationForm />
  </div>
</template>

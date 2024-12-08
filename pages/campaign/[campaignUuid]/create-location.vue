<script setup lang="ts">
import LocationForm from "~/components/forms/Location-Form.vue";
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2">Create Location</h1>
    <LocationForm />
  </div>
</template>

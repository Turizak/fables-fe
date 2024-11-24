<script setup>
import CreateCharacterCCharForm2 from "~/components/forms/create-character/CChar-Form-2.vue";

definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="text-center p-2 mb-2 text-5xl">Create Character: Details</h1>
    <CreateCharacterCCharForm2 />
  </div>
</template>

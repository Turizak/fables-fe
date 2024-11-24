<script setup>
import CreateCharacterCCharForm3 from "~/components/forms/create-character/CChar-Form-3.vue";

definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="text-center p-2 mb-2 text-5xl">Create Character: Appearance</h1>
    <CreateCharacterCCharForm3 />
  </div>
</template>

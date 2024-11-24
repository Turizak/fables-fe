<script setup>
import CreateCharacterCCharForm1 from "~/components/forms/create-character/CChar-Form-1.vue";
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center p-2 mb-2 text-5xl">Create Character</h1>
    <CreateCharacterCCharForm1 />
  </div>
</template>

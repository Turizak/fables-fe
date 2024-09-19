<script setup>
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="text-center p-2 text-5xl">Create Character</h1>
    <h2 class="text-center p-2 mb-2 text-3xl">Appearance</h2>
    <CreateCharacterCCharForm2 />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="text-center p-2 mb-2 text-5xl">Create Character: Appearance</h1>
    <CharForm3 />
  </div>
</template>

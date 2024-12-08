<script setup>
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center p-2 mb-2 text-5xl">Create Character</h1>
    <CharForm1 />
  </div>
</template>

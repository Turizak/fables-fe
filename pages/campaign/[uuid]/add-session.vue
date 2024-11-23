<script setup lang="ts">
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2">Add Session</h1>
    <Session-Form />
  </div>
</template>

// SPDX-License-Identifier: Apache-2.0
<script setup lang="ts">
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="p-2 mb-4 text-5xl">This is a test page!</h1>
    <UCard>
      <template #header>
        <h2 class="h-8">Card Heading</h2>
      </template>
      <p class="h-32">Card Body</p>
      <template #footer>
        <p class="h-8">Card Footer</p>
      </template>
    </UCard>
  </div>
</template>

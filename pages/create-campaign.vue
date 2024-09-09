<script setup>
definePageMeta({
  middleware: 'fresh-token',
});
</script>

<template>
  <h1 class="p-2 mb-2 text-5xl">Create Campaign</h1>
  <CreateCampaignForm />
</template>

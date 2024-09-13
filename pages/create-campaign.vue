<script setup>
definePageMeta({
  middleware: 'fresh-token',
});
</script>

<template>
  <div>
    <h1 class="p-2 mb-2 text-5xl">Create Campaign</h1>
    <CreateCampaignForm />
  </div>

</template>

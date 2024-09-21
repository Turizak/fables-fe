<script setup>
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h2 class="text-5xl text-center p-2 mb-4">Campaigns</h2>
    <ViewCampaign />
  </div>
</template>

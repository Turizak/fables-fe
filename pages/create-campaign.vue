<script setup>
import CreateCampaignForm from "~/components/forms/CreateCampaignForm.vue";

definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="p-2 mb-2 text-5xl">Create Campaign</h1>
    <CreateCampaignForm />
  </div>
</template>

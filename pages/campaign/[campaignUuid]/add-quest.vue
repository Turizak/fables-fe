<script setup lang="ts">
import CreateQuestForm from "~/components/forms/create/Create-Quest-Form.vue";
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2">Add Quest</h1>
    <CreateQuestForm />
  </div>
</template>

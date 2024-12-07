<script setup lang="ts">
import QuestForm from "~/components/forms/Quest-Form.vue";
definePageMeta({
  middleware: "fresh-token",
});
</script>

<template>
  <div>
    <h1 class="flex justify-center text-5xl p-2">Add Quest</h1>
    <QuestForm />
  </div>
</template>

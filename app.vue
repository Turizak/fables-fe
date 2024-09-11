<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <USlideovers />
    <UNotifications
      :ui="{ strategy: 'override', position: 'top-10 right-0' }"
    />
  </div>
</template>

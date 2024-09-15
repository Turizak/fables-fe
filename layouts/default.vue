<template>
  <div class="flex flex-col min-h-screen">
    <Nav-bar />
    <UContainer>
      <slot />
    </UContainer>
    <Footer-component />
  </div>
</template>

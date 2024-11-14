<script setup>
import { useAuthStore } from "~/stores/authStore";
import SideMenu from "./SideMenu.vue";

const slideover = useSlideover();
const authStore = useAuthStore();

function openSlideover() {
  slideover.open(SideMenu, {
    onClose: slideover.close,
  });
}

async function logout() {
  authStore.clearTokens();
  await navigateTo("/login");
}
</script>

<template>
  <nav>
    <ul class="flex justify-between bg-green-400 text-black">
      <div class="flex p-2">
        <li>
          <UButton label="Open" @click="openSlideover">
            <UIcon
              name="material-symbols-light:density-medium"
              class="w-5 h-5"
            />
          </UButton>
        </li>
        <li><p class="text-xl px-2">Fables</p></li>
      </div>
      <li class="p-2">
        <UButton @click="logout">
          <UIcon name="material-symbols-light:logout" class="w-5 h-5" />
        </UButton>
      </li>
    </ul>
  </nav>
</template>

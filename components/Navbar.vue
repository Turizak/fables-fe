<script setup>
import { useAuthStore } from '~/stores/authStore';
import SideMenu from './SideMenu.vue';

const slideover = useSlideover();
const authStore = useAuthStore();

function openSlideover() {
  slideover.open(SideMenu, {
    onClose: slideover.close,
  });
}

async function logout() {
  authStore.clearTokens();
  await navigateTo('/login');
}
</script>

<template>
  <nav>
    <ul class="flex justify-between bg-green-400 text-black">
      <div class="flex">
        <li class="p-2">
          <UButton @click="openSlideover">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="size-5"
            >
              <path
                fill-rule="evenodd"
                d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                clip-rule="evenodd"
              />
            </svg>
          </UButton>
        </li>
        <li class="py-2 text-xl">Fables</li>
      </div>
      <div class=":hover cursor-pointer" @click="logout">
        <li class="py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-5 mt-1 mx-2"
          >
            <path
              fill-rule="evenodd"
              d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
              clip-rule="evenodd"
            />
            <path
              fill-rule="evenodd"
              d="M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H6.75A.75.75 0 0 1 6 10Z"
              clip-rule="evenodd"
            />
          </svg>
        </li>
      </div>
    </ul>
  </nav>
</template>

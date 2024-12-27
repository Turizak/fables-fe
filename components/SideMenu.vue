<script setup>
const isOpen = ref(false);
const slideover = useSlideover();

const items = [
  {
    label: "Campaigns",
    icon: "i-material-symbols-light:globe",
    defaultOpen: false,
    slot: "campaigns",
    size: "xl",
    color: "white",
  },
];
</script>

<template>
  <USlideover
    v-model="isOpen"
    :overlay="false"
    :ui="{ width: 'w-screen max-w-xs' }"
    side="left"
  >
    <div class="flex flex-col">
      <ul>
        <li class="h-6" />
        <li>
          <NuxtLink to="/" @click="slideover.close">
            <div
              class="flex p-2 ml-2 gap-2 md:hover:bg-green-400 hover:text-black hover:cursor-pointer"
            >
              <UIcon name="material-symbols-light:home" class="w-5 h-5 mt-1" />
              <p class="text-xl">Home</p>
            </div>
          </NuxtLink>
        </li>
        <li>
          <div class="bg-gray-700">
            <UAccordion multiple :items="items">
              <template #campaigns>
                <li>
                  <NuxtLink to="/create-campaign" @click="slideover.close">
                    <div
                      class="flex py-2 pl-4 gap-2 text-white hover:bg-green-400 hover:text-black hover:cursor-pointer"
                    >
                      <UIcon
                        name="material-symbols-light:add-box"
                        class="w-5 h-5 mt-1 ml-4"
                        color="white"
                      />
                      <p class="text-lg">Create a Campaign</p>
                    </div>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/view-campaigns" @click="slideover.close">
                    <div
                      class="flex py-2 pl-4 gap-2 text-white hover:bg-green-400 hover:text-black hover:cursor-pointer"
                    >
                      <UIcon
                        name="material-symbols-light:folder-open-rounded"
                        class="w-5 h-5 mt-1 ml-4"
                      />
                      <p class="text-lg">View Campaigns</p>
                    </div>
                  </NuxtLink>
                </li>
              </template>
            </UAccordion>
          </div>
        </li>
        <li>
          <div
            class="flex p-2 ml-2 gap-2 hover:bg-green-400 hover:text-black hover:cursor-pointer"
          >
            <UIcon
              name="material-symbols-light:account-circle"
              class="w-5 h-5 mt-1"
            />
            <p class="text-xl">My Profile</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="p-4 flex-1">
      <UButton
        color="gray"
        variant="ghost"
        size="sm"
        icon="i-heroicons-x-mark-20-solid"
        class="flex sm:hidden absolute end-5 top-5 z-10"
        square
        padded
        @click="slideover.close"
      />
    </div>
  </USlideover>
</template>

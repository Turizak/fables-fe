<script setup>
const isOpen = ref(false);
const slideover = useSlideover();
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
          <div class="flex p-2 ml-2 gap-2 bg-gray-700">
            <UIcon name="material-symbols-light:globe" class="w-5 h-5 mt-1" />
            <p class="text-xl">Campaigns</p>
          </div>
        </li>
        <li>
          <NuxtLink to="/create-campaign" @click="slideover.close">
            <div
              class="flex p-2 ml-2 gap-2 hover:bg-green-400 hover:text-black hover:cursor-pointer"
            >
              <UIcon
                name="material-symbols-light:add-box"
                class="w-5 h-5 mt-1 ml-4"
              />
              <p class="text-lg">Create a Campaign</p>
            </div>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/view-campaigns" @click="slideover.close">
            <div
              class="flex p-2 ml-2 gap-2 hover:bg-green-400 hover:text-black hover:cursor-pointer"
            >
              <UIcon
                name="material-symbols-light:folder-open-rounded"
                class="w-5 h-5 mt-1 ml-4"
              />
              <p class="text-lg">View Campaigns</p>
            </div>
          </NuxtLink>
        </li>
        <li>
          <div class="flex p-2 ml-2 gap-2 bg-gray-700">
            <UIcon name="heroicons:user-group-solid" class="w-5 h-5 mt-1" />
            <p class="text-xl">Characters</p>
          </div>
        </li>
        <li>
          <NuxtLink to="/cchar/cchar-1" @click="slideover.close">
            <div
              class="flex p-2 ml-2 gap-2 hover:bg-green-400 hover:text-black hover:cursor-pointer"
            >
              <UIcon
                name="material-symbols-light:add-box"
                class="w-5 h-5 mt-1 ml-4"
              />
              <p class="text-lg">Create a Character</p>
            </div>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/view-characters" @click="slideover.close">
            <div
              class="flex p-2 ml-2 gap-2 hover:bg-green-400 hover:text-black hover:cursor-pointer"
            >
              <UIcon
                name="material-symbols-light:folder-open-rounded"
                class="w-5 h-5 mt-1 ml-4"
              />
              <p class="text-lg">View Characters</p>
            </div>
          </NuxtLink>
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

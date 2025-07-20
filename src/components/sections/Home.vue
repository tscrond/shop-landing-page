<template>
  <div class="flex flex-col items-center justify-evenly w-full h-full px-4 gap-4">
    <img class="sm:w-[500px] sm:h-[500px]" src="/logo.png" alt="Logo" />

    <div class="flex flex-col items-center gap-2 text-center">
      <template v-if="isMobile">
        <p class="text-3xl">Zadzwoń:</p>
        <a
          :href="`tel:${phoneNumber}`"
          class="font-bold sm:text-4xl text-3xl text-blue-600 hover:underline"
        >
          +48 123 123 123
        </a>
      </template>
      <template v-else>
        <button
          @click="copyPhoneNumber"
          class="font-bold cursor-pointer sm:text-4xl text-3xl text-white hover:text-blue-600 focus:outline-none"
        >
          +48 123 123 123
        </button>
        <span class="text-sm text-green-600" v-if="copied">Skopiowano do schowka!</span>
      </template>
    </div>

    <slot name="navigation" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const phoneNumber = '+48123123123'
const copied = ref(false)
const isMobile = ref(false)

onMounted(() => {
  isMobile.value = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
})

function copyPhoneNumber() {
  navigator.clipboard.writeText('+48 123 123 123')
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

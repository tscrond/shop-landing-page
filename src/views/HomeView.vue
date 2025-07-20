<template>
  <div id="fullpage">
    <!-- Top/Bottom Navigation Buttons -->
<div
  v-if="currentSection > 1"
  class="fixed z-50"
  :class="isMobile ? 'top-4 right-4' : 'top-4 left-1/2 -translate-x-1/2'"
>
  <Button
    icon="pi pi-chevron-up"
    @click="goUp"
    class="rounded-full shadow-lg flex items-center justify-center"
    style="width: 48px; height: 48px; padding: 0; border-radius: 9999px;"
    raised
    severity="warn"
  />
</div>

<!-- DÓŁ -->
<div
  v-if="currentSection < 4"
  class="fixed z-50"
  :class="isMobile ? 'bottom-4 right-4' : 'bottom-4 left-1/2 -translate-x-1/2'"
>
  <Button
    icon="pi pi-chevron-down"
    @click="goDown"
    class="rounded-full shadow-lg flex items-center justify-center"
    style="width: 48px; height: 48px; padding: 0; border-radius: 9999px;"
    raised
    severity="warn"
  />
</div>

    <!-- Section 1: Home -->
    <div class="section">
      <Home>
        <template #navigation>
          <div class="flex flex-col gap-4">
            <Button style="background-color: #42C5E9;" label="Dowiedz się więcej" icon="pi pi-arrow-down" @click="goToSection(2)" />
            <Button style="background-color: #42C5E9;" label="Skontaktuj się z nami" icon="pi pi-phone" @click="goToSection(4)" />
          </div>
        </template>
      </Home>
    </div>


  <!-- Section 2: Features -->
  <div class="section">
    <Features>
      <template #navigation>
        <div class="flex flex-wrap gap-4 mt-8 justify-center">
            <Button style="background-color: #42C5E9;" label="O nas" icon="pi pi-info-circle" @click="goToSection(1)" />
            <Button style="background-color: #42C5E9;" label="Skontaktuj się z nami" icon="pi pi-phone" @click="goToSection(4)" />
            <Button style="background-color: #42C5E9;" label="Zobacz nasze produkty" icon="pi pi-objects-column" @click="goToSection(3)" />
        </div>
      </template>
    </Features>
  </div>

  <!-- Section 3: Product Gallery -->
  <div class="section">
    <Products></Products>
  </div>


  <!-- Section 4: Contact -->
  <div class="section">
    <Contact></Contact>
  </div>

  </div>


</template>

<script setup>
import fullpage from 'fullpage.js'
import 'fullpage.js/dist/fullpage.css'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { Image } from 'primevue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Carousel from 'primevue/carousel'
import InputText from 'primevue/inputtext'


import Home from '@/components/sections/Home.vue'
import Features from '@/components/sections/Features.vue'
import Products from '@/components/sections/Products.vue'
import Contact from '@/components/sections/Contact.vue'


const currentSection = ref(1)

let fp

const isMobile = ref(false)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
  }

  checkMobile() // initial check
  window.addEventListener('resize', checkMobile)

  isMobile.value = window.innerWidth <= 768

  fp = new fullpage('#fullpage', {
    autoScrolling: !isMobile,
    scrollOverflow: !isMobile,
    fitToSection: !isMobile,
    keyboardScrolling: !isMobile,
    touchSensitivity: isMobile ? 0 : 15,
    scrollingSpeed: 700,
    navigation: false,
    anchors: ['home', 'features', 'products', 'contact'],
    controlArrows: false,
    dragAndMove: false,
    normalScrollElements: '.scrollable-section',
    afterLoad: (_, destination) => {
      if (destination?.index !== undefined) {
        currentSection.value = destination.index + 1
      }
    }
  });

  if (isMobile) {
    // Prevent manual scroll or swipe on mobile
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.body.style.overflow = 'hidden'; // Block native scroll
  }
});

onBeforeUnmount(() => {
  if (fp) fp.destroy('all')
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('touchmove', preventScroll)
  document.body.style.overflow = ''
})

function goDown() {
  if (typeof fullpage_api !== 'undefined') {
    fullpage_api.moveSectionDown()
  }
}

function goUp() {
  if (typeof fullpage_api !== 'undefined') {
    fullpage_api.moveSectionUp()
  }
}

function goToSection(index) {
  fullpage_api.moveTo(index)
}

function preventScroll(e) {
  // Allow scroll inside scrollable content
  if (e.target.closest('.scrollable-section')) return;
  e.preventDefault();
}

</script>

<style scoped>
.inner-scrollable {
  max-height: 100vh; /* fill viewport */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* smooth scrolling on iOS */
}
</style>

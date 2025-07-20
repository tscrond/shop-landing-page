<template>
    <div class="flex flex-col justify-center items-center h-full w-full px-4 overflow-y-auto py-8 scrollable-section">
      <h2 class="text-3xl font-bold mb-6">Nasze produkty</h2>
      <div class="w-full max-w-6xl">
        <Carousel :value="products" :numVisible="1" :numScroll="1" circular :responsiveOptions="responsiveOptions">
          <template #item="{ data }">
            <Card class="flex flex-col items-center justify-center m-2 shadow-md w-full max-w-xs gap-2">
              <template #header>
                <Image
                  src="/medical_bed.png"
                  alt="Product Image"
                  imageClass="w-full h-[200px] object-cover rounded-t"
                  preview
                />
              </template>
              <template #title>{{ data.name }}</template>
              <template #content>
                <p class="text-sm text-center">{{ data.description }}</p>
              </template>
            </Card>
          </template>
        </Carousel>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

import Card from 'primevue/card';
import Carousel from 'primevue/carousel';
import Image from 'primevue/image';

const products = ref([
  {
    name: 'Łóżko',
    description: 'Łóżka rehabilitacyjne to specjalne rodzaje łóżek, które są przeznaczone dla osób potrzebujących wsparcia w trakcie procesu rehabilitacji. Te łóżka są zazwyczaj wyposażone w różne dodatkowe funkcje, takie jak regulowane podparcie pleców i nóg, które pomagają w utrzymaniu prawidłowej pozycji ciała podczas leżenia.',
    image: '<placeholder>',
  },
  {
    name: 'Łóżko 2',
    description: 'Łóżka rehabilitacyjne to specjalne rodzaje łóżek, które są przeznaczone dla osób potrzebujących wsparcia w trakcie procesu rehabilitacji. Te łóżka są zazwyczaj wyposażone w różne dodatkowe funkcje, takie jak regulowane podparcie pleców i nóg, które pomagają w utrzymaniu prawidłowej pozycji ciała podczas leżenia.',
   image: '<placeholder>',
  },
  {
    name: 'Chodzik 1',
    description: 'Podpórka trójkołowa aluminiowa RAPID firmy Timago jest sprzętem pomocniczym, przeznaczonym dla osób o obniżonej sprawności ruchowej, które potrzebują stabilnego podparcia i asekuracji podczas chodzenia. Zalecana jest także dla osób starszych, jako pomoc w utrzymaniu równowagi, poprawy komfortu poruszania się i zapewnienia bezpieczeństwa przed upadkiem.',
    image: '<placeholder>',
  },
  {
    name: 'Materac medyczny',
    description: 'Materace medyczne 100x200 charakteryzują się wysoką elastycznością punktową, posiadają również zróżnicowane strefy twardości, dzięki czemu łatwo dostosowują się do ciała użytkownika, zapewniając równomierne rozłożenie ciężaru i doskonałe wsparcie dla całej sylwetki.',
    image: '<placeholder>',
  },
  {
    name: 'Materac przeciwodleżynowy',
    description: 'Materace przeciwodleżynowe kładzie się bezpośrednio na standardowe materace, które znajdują się na łóżku chorego. Po napompowaniu materaca przeciwodleżynowego można na nim położyć prześcieradło i następnie pacjenta.',
    image: '<placeholder>',
  },
  {
    name: 'Materac przeciwodleżynowy 2',
    description: 'Materace przeciwodleżynowe kładzie się bezpośrednio na standardowe materace, które znajdują się na łóżku chorego. Po napompowaniu materaca przeciwodleżynowego można na nim położyć prześcieradło i następnie pacjenta.',
    image: '<placeholder>',
  },
])


const responsiveOptions = ref([
  {
    breakpoint: '2048px',
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: '1024px',
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: '768px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '560px',
    numVisible: 1,
    numScroll: 1
  }
])
</script>

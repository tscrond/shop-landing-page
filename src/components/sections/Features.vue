<template>
    <div class="flex flex-col justify-center items-center w-full h-full overflow-hidden">
        <!-- Scrollable inner container -->
        <div class="inner-scrollable scrollable-section flex flex-col items-center w-full px-4 py-8 overflow-y-auto max-h-full">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
            <!-- Heading in grid -->
            <div class="col-span-1 md:col-span-3 text-center">
                <h1 class="text-3xl font-bold mb-8">Co oferujemy?</h1>
            </div>

            <!-- Cards -->
            <Card v-for="(f, i) in features" :key="i" class="text-white">
                <template #title><p :class="f.icon" style="font-size: 20px;"></p> {{ f.title }}</template>
                <template #content>{{ f.text }}</template>
            </Card>
        </div>
        <slot name="navigation" />
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { Card } from 'primevue';

const features = ref([
  {
    title: 'Przyjazne podejście do klienta',
    text: 'Zawsze stawiamy na indywidualne podejście i otwartą komunikację. Dbamy o to, aby każdy klient czuł się wysłuchany i zaopiekowany na każdym etapie współpracy.',
    icon: 'pi pi-user'
  },
  {
    title: 'Lata doświadczenia',
    text: 'Nasza wiedza opiera się na wieloletnim doświadczeniu w branży. Dzięki temu możemy oferować sprawdzone rozwiązania i skuteczną pomoc w każdej sytuacji.',
    icon: 'pi pi-star'
  },
  {
    title: 'Wypożyczanie/sprzedaż sprzetu medycznego',
    text: 'W naszą ofertę wchodzi sprzedaż/wynajem: łóżek regulowanych, chodzików, materacy przeciwodleżynowych i innych produktów',
    icon: 'pi pi-shopping-cart'
  },
  {
    title: 'Darmowa konsultacja',
    text: 'Przed zakupem sprzętu, skontaktuj się z nami za pomocą adresu e-mail lub numeru telefonu',
    icon: 'pi pi-comments'
  },
  {
    title: 'Ekspresowa dostawa',
    text: 'Oferujemy ekspresową dostawę w obrębie województwa Śląskiego, Opolskiego oraz Małopolskiego',
    icon: 'pi pi-send'
  },
  {
    title: 'Instalacja sprzętu',
    text: 'Instalacja sprzętu u klienta jest wliczona w cenę usługi ;)',
    icon: 'pi pi-cog'
  }
])
</script>

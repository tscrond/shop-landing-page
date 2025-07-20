<template>
    <div class="flex flex-col items-center justify-around h-full px-4">
        <Card class="w-full max-w-xl">
        <template #title>Kontakt</template>
        <template #content>
            <form class="flex flex-col gap-4">
            <InputText placeholder="Temat" id="inputform" class="w-full" />
            <InputText type="email" placeholder="Adres e-mail" class="w-full" />
            <Textarea rows="4" placeholder="Napisz do nas" class="w-full" autoResize />
            <Button label="Wyślij" class="w-full mt-2" />
            </form>
        </template>
        </Card>
    </div>
</template>
<script setup>
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
</script>

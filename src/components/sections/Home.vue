<template>
    <div class="flex flex-col items-center justify-evenly w-full h-full px-4 gap-4">
        
        <img class="sm:w-[500px] sm:h-[500px]" src="/logo.png">

        <div class="flex flex-col gap-4">
            <h1 class="font-bold sm:text-4xl text-3xl">Kontakt: +48 123 123 123</h1>
        </div>
        
        <slot name="navigation" />
    </div>
</template>
<script setup></script>

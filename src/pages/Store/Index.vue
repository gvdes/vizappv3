<template>
  <q-page class="flex flex-center">
    <div>
      <div class="text-h3 text-grey-8 text-center">
        Hola <span class="text-primary">{{piniaAccount.account.name}}</span>
      </div>

      <div class="text-center anek-lg text-h5 text-grey-6">{{ greeting }}</div>

      <div class="q-py-lg text-center">
        <q-img :src="piniaAccount.avatar" style="width: 170px;"/>
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useAccountStore } from 'stores/Account';

  const piniaAccount = useAccountStore();

  const greetings = ref([
    "Que gusto verte!",
    "Excelente dia!",
    "Que sea un gran dia!",
    "Paciencia crack, paciencia.",
    "Como va todo?",
    "Empecemos...",
    "Manos a la obra!",
    "Exito!",
    "Me la pelas! xD",
    "Vacaciones??... pff...",
  ]);

  const greeting = computed( () => greetings.value[Math.floor(Math.random()*greetings.value.length)] );
</script>

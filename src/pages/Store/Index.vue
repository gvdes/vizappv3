<template>
<<<<<<< HEAD
  <q-page padding>

    <div class="row q-pa-md q-gutter-md">
      <div class="col">
          <div class="text-h3 text-grey-8 text-center">
          Hola <span class="text-primary">{{ piniaAccount.account.name }}</span>
        </div>

        <div class="text-center anek-lg text-h5 text-grey-6">{{ greeting }}</div>

        <div class="q-py-lg text-center">
          <q-img :src="piniaAccount.avatar" style="width: 170px;"/>
        </div>
      </div>

      <div>
        <MiniApps :apps="apps"/>
=======
  <q-page class="flex flex-center">
    <div>
      <div class="text-h3 text-grey-7 text-center">
        Hola <span class="text-primary">{{piniaAccount.account.name}}</span>
      </div>

      <div class="text-center anek-lg text-h5">{{ greeting }}</div>

      <div class="q-py-lg text-center">
        <q-img :src="piniaAccount.avatar" style="width: 170px;"/>
>>>>>>> 2d9e8c9d51cd79e7c82cd922547ee82fd06e9ba9
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { ref, watch, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import MiniApps from 'src/components/MiniApps.vue';

  const $q = useQuasar();
  const piniaAccount = useAccountStore();
  const apps = piniaAccount.apps.map( a => a.app )

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

  onBeforeMount(() => {
    console.log("Cargando interfaz");
  });

  const greeting = computed( () => greetings.value[Math.floor(Math.random()*greetings.value.length)] );
  const szs = computed(() => $q.screen);
</script>

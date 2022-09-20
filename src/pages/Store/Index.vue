<template>
  <q-page class="flex flex-center">
    <div>
      <!-- <div>
        XSMALL: {{szs.xs}}<br/>
        Size: {{szs.name}} ({{szs.width}} x {{szs.height}})<br/>
        {{szs.sizes}}<br/>
        {{szs.lt}}<br/>
        {{szs.gt}}<br/>
      </div> -->
      <div class="anek-bld text-h3 text-grey-7 text-center">
        Hola <span class="text-primary">{{piniaAccount.account.name}}</span>
      </div>

      <div class="text-center anek-lg text-h5">{{ greeting }}</div>

      <div class="q-py-lg text-center">
        <q-img :src="piniaAccount.avatar" style="width: 170px;"/>
      </div>

    </div>
  </q-page>
</template>

<script setup>
  import { ref, watch, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useAccountStore } from 'stores/Account';

  const $q = useQuasar();
  const piniaAccount = useAccountStore();

  const greetings = ref([
    "Que gusto verte!",
    "Excelente dia!",
    "Que sea un gran dia!",
    "Paciencia crack... paciencia.",
    "Como va todo?",
    "Empecemos...",
    "Manos a la obra!",
    "Exito!",
    "Me la pelas! xD"
  ]);

  onBeforeMount(() => {
    console.log("Cargando interfaz");
  });

  const greeting = computed( () => greetings.value[Math.floor(Math.random()*greetings.value.length)] );
  const szs = computed(() => $q.screen);

</script>

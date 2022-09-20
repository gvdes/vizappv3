<template>
    Aqui vendra el resumen del almacen
</template>

<script setup>
  import { ref, watch, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar, LocalStorage, Loading } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import Wapi from 'src/API/WarehouseApi';

  const $q = useQuasar();
  const $router = useRouter();
  const piniaAccount = useAccountStore();
  const warehousesdb = ref([]);
  const types = ref([]);

  onBeforeMount(() => { init(); });

  const init = () => {
    $q.loading.show({message:"Cargando vista, espera"});

    $q.loading.hide();
  }
</script>

<template>
  <div class="q-pa-md">
    Productos
  </div>
</template>

<script setup>
  import { ref, watch, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar, LocalStorage, Loading } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import { useWarehouseStore } from 'stores/Warehouse';
  import Wapi from 'src/API/WarehouseApi';

  const $q = useQuasar();
  const $route = useRoute();
  const $router = useRouter();
  const piniaAccount = useAccountStore();
</script>

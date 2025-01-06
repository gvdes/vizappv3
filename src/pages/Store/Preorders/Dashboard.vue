<template>
  <q-page padding>

    <div class="row">
      <q-table flat class="col" title="Por Surtir" row-key="name" hide-bottom  />
      <q-separator spaced inset vertical dark />
      <q-table flat class="col" title="Surtiendo" row-key="name" hide-bottom  />
      <q-separator spaced inset vertical dark />
      <q-table flat class="col" title="Por Validar" row-key="name" hide-bottom/>
      <q-separator spaced inset vertical dark />
    </div>

  </q-page>
</template>

<script setup>
import { ref, watch, onBeforeMount, computed, onMounted } from 'vue';
import ProductFinder from 'src/components/ProductFinder.vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, LocalStorage, Loading } from 'quasar';
import { useAccountStore } from 'stores/Account';
import pvtpi from 'src/API/PreordersApi.js'
import addProduct from 'src/components/Preorder/addProduct.vue';
import { $sktpvt } from 'src/boot/socket';

const $q = useQuasar();
const $route = useRoute();
const $router = useRouter()
const piniaAccount = useAccountStore();

</script>

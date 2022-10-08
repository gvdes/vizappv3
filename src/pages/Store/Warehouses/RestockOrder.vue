<template>
  <q-page>
    <div class="bg-white">
      <div class="q-pa-sm row items-center">
        <!-- <q-btn flat round dense icon="menu" /> -->
        <div class="col anek-bld text-grey-9 row items-center">
          <q-btn color="primary" flat icon="fas fa-chevron-left" dense @click="$router.replace(`/store/${piniaAccount.join}/almacenes/resurtido`)" label="Resurtido" no-caps/>
          <span class="q-pl-md">{{$route.params.rid}}</span>
        </div>
        <div class="row items-center">
          <q-btn flat rounded icon="autorenew" @click="init" />
          <q-btn flat rounded icon="fas fa-wand-sparkles"/>
          <q-btn flat rounded icon="support"/>
        </div>
      </div>
      <q-separator/>
    </div>
  </q-page>
</template>

<script setup>
  import { ref, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import RestockApi from 'src/API/RestockApi';
  import dayjs from 'dayjs';

  const $q = useQuasar();
  const $route = useRoute();
  const $router = useRouter();
  const piniaAccount = useAccountStore();

  onBeforeMount(() => {
    init();
  });

  const init = () => {
    let rid = $route.params.rid;
    console.log("Abriendo orden"+rid);
  }
</script>

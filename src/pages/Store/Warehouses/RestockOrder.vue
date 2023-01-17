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
          <q-btn flat rounded icon="fas fa-wand-sparkles" @click="wndPreview.state=true;"/>
          <q-btn flat rounded icon="support"/>
        </div>
      </div>
      <q-separator/>
    </div>

    <div class="text-caption text-grey-6">
      <pre>{{ owner }}</pre>
      <pre>{{ state }}</pre>
      <pre>{{ isOwner }}</pre>
    </div>

    <q-dialog v-model="wndPreview.state" persistent @show="getPreview">
      <q-card style="min-width:200px;">
        <q-card-section class="row items-center justify-between">
          <span class="q-ml-sm text-uppercase anek-bld">Stock acutal</span>
          <q-btn color="primary" icon="close" dense round flat @click="wndPreview.state=false;"/>
        </q-card-section>
        <q-separator />
        <q-card-section v-if="wndPreview.loading" class="text-center">
          <q-spinner-grid color="primary" size="3rem" />
          <div class="q-pa-md text-caption">Calculando, porfavor espera...</div>
        </q-card-section>
        <template v-else>
          <div class="text-h6 q-pa-md">{{ wndPreview.productsdb.length }}</div>
        </template>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { ref, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import RestockApi from 'src/API/RestockApi';
  import dayjs from 'dayjs';

  /** R E F E R E N C E S */
  const $q = useQuasar();
  const $route = useRoute();
  const $router = useRouter();
  const piniaAccount = useAccountStore();

  const order = ref(null);
  const wndPreview = ref({ state:false, productsdb:[], loading:true });

  /** H O O K S */
  onBeforeMount(() => { init(); });

  /** C O M P U T E D S */
  const state = computed(() => order.value ? order.value.state:null);
  const owner = computed(() => order.value ? order.value.owner:false);
  const isOwner = computed(() => owner.value ? piniaAccount.account.id==owner.value.id: false);

  /** M E T H O D S */
  const init = async () => {
    $q.loading.show({ message:"Cargando orden" });
    let rid = $route.params.rid;
    console.log("Abriendo orden"+rid);

    const resp = await RestockApi.orderOpen(rid);

    if(resp.error){ alert("Unauthorized!! ... Get out!!"); }else{
      $q.loading.hide();
      order.value = resp.order;
    }
  }

  const getPreview = async () => {
    console.log("Cargando data!!!");
    const resp = await RestockApi.preview($route.params.rid);
    console.log(resp);

    wndPreview.value.productsdb = resp.productsdb;
    wndPreview.value.loading = false;
  }
</script>

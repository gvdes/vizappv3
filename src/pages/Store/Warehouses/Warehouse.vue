<template>
  <q-page>
    <div class="bg-white row items-center">
      <div class="col-sm col-xs-12">
        <q-btn
          flat dense no-caps
          label="Almacenes"
          class="anek-bld text-grey-9"
          icon="fas fa-chevron-left"
          @click="$router.replace(`/store/${$route.params.idstore}/almacenes/`)"
        />
        <q-icon name="fas fa-chevron-right" size="10px" color="secondary"/>
        <q-btn flat dense disable :label="warehouse ? warehouse.name : ''"/>
      </div>

      <q-tabs
        inline-label align="right"
        class="text-primary col-md col-xs-12"
      >
        <q-route-tab name="structure" exact label="estructura" :to="`/store/${$route.params.idstore}/almacenes/${$route.params.wid}/estructura`"/>
        <q-route-tab name="products" label="productos" :to="`/store/${$route.params.idstore}/almacenes/${$route.params.wid}/productos`"/>
        <q-route-tab name="resume" label="resumen" :to="`/store/${$route.params.idstore}/almacenes/${$route.params.wid}/resumen`"/>
      </q-tabs>
    </div>
    <q-separator />

    <router-view />

    <q-dialog v-model="wndRestringed.state" persistent no-backdrop-dismiss no-esc-dismiss>
      <q-card class="bg-red text-white">
        <q-card-section class="row items-center">
          <q-avatar icon="fas fa-ban" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
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
  const piniaWarehouse = useWarehouseStore();

  const wndRestringed = ref({state:false});
  const warehouse = ref(null);

  onBeforeMount(async() => { init(); });

  const init = async () => {
    $q.loading.show({message:"Cargando Almacen..."});

    const resp = await Wapi.open($route.params.wid);

    if(resp.error){
      let ercode = resp.error.status;
      wndRestringed.value.state = true;
    }else{
      warehouse.value = resp.warehouse;
      piniaWarehouse.setWarehouse(resp.warehouse);
      console.log("%cPase por el index del almacen","font-size:1.5em;color:red;");
    }
  }

  const isMob = computed(() => $q.platform.is.mobile);

</script>

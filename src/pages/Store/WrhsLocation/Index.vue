<template>
  <q-page>
    <div class="bg-white row items-center">
      <div class="col-sm col-xs-12">
        <q-btn
          dense flat no-caps
          :label="`Almacen ${warehouse ? warehouse.name : ''}`"
          class="anek-bld text-grey-9"
          icon="fas fa-chevron-left"
          @click="$router.replace(`/store/${$route.params.idstore}/almacenes/${$route.params.wid}/estructura`)"
        />

        <template v-for="(path,idx) in fullpath" :key="path.id">
          <q-icon name="fas fa-chevron-right" size="10px" color="secondary"/>
          <q-btn :dense="!isMob" flat no-caps :disable="(idx==(fullpath.length-1))" :label="(isMob ? path.alias:path.name)" />
        </template>
      </div>

      <q-tabs
        inline-label align="right"
        class="text-primary col-sm col-xs-12"
      >
        <q-route-tab exact label="estructura" :to="`/store/${$route.params.idstore}/almacenes/${$route.params.wid}/seccion/${$route.params.lid}/estructura`"/>
        <q-route-tab label="productos" :to="`/store/${$route.params.idstore}/almacenes/${$route.params.wid}/seccion/${$route.params.lid}/productos`"/>
        <q-route-tab label="resumen" :to="`/store/${$route.params.idstore}/almacenes/${$route.params.wid}/seccion/${$route.params.lid}/resumen`"/>
      </q-tabs>
    </div>
    <q-separator />

    <router-view />
  </q-page>
</template>

<script setup>
  import { ref, watch, onBeforeMount, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar, LocalStorage, Loading } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import { useWarehouseStore } from 'stores/Warehouse';
  import Lapi from 'src/API/WrhsLocation';

  const $q = useQuasar();
  const $route = useRoute();
  const $router = useRouter();
  const piniaAccount = useAccountStore();
  const piniaWarehouse = useWarehouseStore();

  const warehouse = ref(null);
  const location = ref(null);
  const fullpath = ref([]);

  onMounted(() => { init(); });

  const init = async () => {
    $q.loading.show({ message:"Cargando seccion" });

    const resp = await Lapi.open($route.params.wid,$route.params.lid);
    console.log(resp);

    warehouse.value = resp.warehouse;
    location.value = resp.location;
    fullpath.value = resp.fullpath.reverse();

    $q.loading.hide();

  };

  const isMob = computed(() => $q.platform.is.mobile);
</script>

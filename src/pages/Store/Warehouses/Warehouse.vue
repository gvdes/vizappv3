<template>
  <q-page>
    <template v-if="showHead">
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
          v-model="tab"
        >
          <q-tab name="products" label="productos" />
          <q-tab name="structure" label="estructura" />
        </q-tabs>
      </div>
      <q-separator />
    </template>

    <!-- MOSTRARA ESTRUCTURA || PRODUCTOS || RESUMEN DEL ALMACEN-->
    <!-- <router-view /> -->

    <q-tab-panels v-model="tab" animated class="transparent">
      <q-tab-panel name="products" >
        <ProductsVisor :products="productsDB" :seasons="season_cats"/>
      </q-tab-panel>
      <q-tab-panel name="structure">
        <StructureVisor :roots="sectionsRoot" @rootsNews="addRoots"/>
      </q-tab-panel>
    </q-tab-panels>

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
  import { ref, computed, reactive } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  // import { useAccountStore } from 'stores/Account';
  import { useWarehouseStore } from 'stores/Warehouse';
  import Wapi from 'src/API/WarehouseApi';
  import ProductsVisor from 'src/components/Warehouse/ProductsVisor.vue';
  import StructureVisor from 'src/components/Warehouse/StructureVisor.vue';

  const $q = useQuasar();
  const $route = useRoute();
  const $router = useRouter();
  const piniaWarehouse = useWarehouseStore();

  const wndRestringed = ref({state:false});
  const warehouse = ref(null);
  const productsDB = ref([]);
  let season_cats = ref([]);
  let sectionsRoot = ref([]);
  let tab = ref(undefined)

  const isMob = computed(() => $q.platform.is.mobile);
  const $screen = computed(() => $q.screen);
  const showHead = computed(() => ($route.name!="wrhloc"&&$route.name!="wrhlocstructure"&&$route.name!="wrhlocproducts"&&$route.name!="wrhlocresume"));

  const addRoots = (locs) => {
    console.log("Se agregaron nuevos elementos")
    locs.forEach( l => sectionsRoot.value.push(l))
  }

  const init = async () => {
    $q.loading.show({message:"Cargando Almacen, Productos y Secciones, porfavor espera..."});

    const resp = await Wapi.open($route.params.wid);
    piniaWarehouse.$reset();
    console.log(resp);

    if(resp.error){
      let ercode = resp.error.status;
      wndRestringed.value.state = true;
    }else{
      warehouse.value = resp.warehouse;
      piniaWarehouse.setWarehouse(resp.warehouse);
      productsDB.value = resp.products;
      season_cats.value = resp.seasons_cats;
      sectionsRoot.value = resp.sections;
      tab.value = "products"

      console.log("%cPase por el index del almacen","font-size:1.5em;color:red;");
    }

    $q.loading.hide();
  }

  init();

</script>

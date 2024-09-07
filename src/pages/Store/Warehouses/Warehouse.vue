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
          <q-tab name="structure" label="estructura" />
          <q-tab name="products" label="productos" />
          <q-tab name="restock" label="resurtido" />
          <q-tab name="orders" label="Pedidos" />
        </q-tabs>
      </div>
      <q-separator />
    </template>

    <!-- MOSTRARA ESTRUCTURA || PRODUCTOS || RESUMEN DEL ALMACEN-->
    <!-- <router-view /> -->
    <q-tab-panels v-model="tab" animated class="transparent" keep-alive>
      <q-tab-panel name="structure" >
        <StructureVisor :rootsdb="sectionsRoot" @rootsNews="addRoots"/>
      </q-tab-panel>
      <q-tab-panel name="products">
        <ProductsVisor :store="store" :warehouse="warehouse" />
      </q-tab-panel>
      <q-tab-panel name="restock" class="q-pa-none">
        <PreRestock :store="store" :warehouse="warehouse"/>
      </q-tab-panel>
      <q-tab-panel name="orders">
        <Orders :sid="SID" :wid="WID" />
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="wndRestringed.state" persistent no-backdrop-dismiss no-esc-dismiss>
      <q-card class="bg-red text-white">
        <q-card-section class="row items-center">
          <q-avatar icon="fas fa-ban" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- <q-dialog v-model="wndProductEdit.state">
      <EditorProduct :product="wndProductEdit.product" @setMinMaxState="setMinMaxState"/>
    </q-dialog> -->
  </q-page>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import { useWarehouseStore } from 'stores/Warehouse';
  import Wapi from 'src/API/WarehouseApi';
  import ProductsVisor from 'src/components/Warehouse/ProductsVisor.vue';
  import StructureVisor from 'src/components/Warehouse/StructureVisor.vue';
  import EditorProduct from 'src/components/Warehouse/EditorProduct.vue';
  import Orders from 'src/components/Warehouse/Orders.vue';
  import PreRestock from 'src/components/Warehouse/PreRestock.vue';

  const $q = useQuasar();
  const $route = useRoute();
  const $router = useRouter();
  const piniaAccount = useAccountStore();
  const piniaWarehouse = useWarehouseStore();

  console.log(piniaAccount);
  console.log(piniaWarehouse);

  const SID = parseInt($route.params.idstore);
  const WID = parseInt($route.params.wid);
  const wndRestringed = ref({state:false});
  // let wndProductEdit = ref({state:false, product:null});
  // const productsDB = ref([]);
  // let season_cats = ref([]);
  let sectionsRoot = ref([]);
  let tab = ref(null);

  let store = ref(null);
  let warehouse = ref(null);

  const isMob = computed(() => $q.platform.is.mobile);
  const $screen = computed(() => $q.screen);
  const showHead = computed(() => ($route.name!="wrhloc"&&$route.name!="wrhlocstructure"&&$route.name!="wrhlocproducts"&&$route.name!="wrhlocresume"));

  const addRoots = (locs) => {
    console.log("Se agregaron nuevos elementos")
    locs.forEach( l => sectionsRoot.value.push(l))
  }

  // const openEditorProduct = (row) => {
  //   wndProductEdit.value.product = row;
  //   wndProductEdit.value.state = true;
  // }

  // const setMinMaxState = async data => {
  //   const resp = await Wapi.setMminMaxState($route.params.wid,data);

  //   wndProductEdit.value.state = false;
  //   wndProductEdit.value.product = null;

  //   let idx = productsDB.value.findIndex( p => p.id == resp.row._product );
  //   productsDB.value[idx].stock = resp.row;

  //   if(resp.row){
  //     $q.notify({
  //       message:"Cambios aplicados",
  //       icon:"done",
  //       color:"positive",
  //       position:"center"
  //     });
  //   }
  // }

  const initComp = async () => {
    $q.loading.show("Abriendo almacen, espera...");
    console.log("Inicializando almacen");
    const resp = await Wapi.open(WID);
    console.log(resp);

    store.value = resp.store;
    warehouse.value = resp.warehouse;
    tab.value = "restock";
    $q.loading.hide();
  }

  onMounted(() => {
    initComp();
  });

  // const getProducts = async () => {
  //   console.log("Obteniendo productos...");
  //   warehouse.value = null;
  //   productsDB.value = [];
  //   season_cats.value = [];
  //   // sectionsRoot.value = [];

  //   const resp = await Wapi.open($route.params.wid);
  //   console.log("productos listo!!");
  //   piniaWarehouse.$reset();
  //   console.log(resp);

  //   if(resp.error){
  //     let ercode = resp.error.status;
  //     wndRestringed.value.state = true;
  //   }else{
  //     warehouse.value = resp.warehouse;
  //     piniaWarehouse.setWarehouse(resp.warehouse);
  //     productsDB.value = resp.products;
  //     season_cats.value = resp.seasons_cats;
  //     // sectionsRoot.value = resp.sections;
  //   }
  // }

  // const getStructure = async() => {
  //   console.log("Obteniendo estructura...");
  //   sectionsRoot.value = [];
  //   const resp = await Wapi.structure($route.params.wid);
  //   console.log("estructura lista!!");
  //   console.log(resp);

  //   if(resp.error){
  //     let ercode = resp.error.status;
  //     wndRestringed.value.state = true;
  //   }else{
  //     sectionsRoot.value = resp.sections;
  //   }
  // }

  // getStructure();
  // getProducts();

</script>

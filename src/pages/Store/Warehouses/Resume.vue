<template>

  <div class="q-pa-sm">
    <q-card flat>
      <q-card-section horizontal>
        <q-card-section>
          <ProductFinder @itemtapped="finderFound" with-locations/>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>

  <div v-if="loadingcards" class="q-pa-xl text-center">
    <q-spinner-dots
      color="primary"
      size="3rem"
      :thickness="5"
    /><br/><span class="text-grey-6">Cargando resumen, espera</span>
  </div>
  <div class="row justify-center q-gutter-md q-pa-md" v-else>
    <q-card v-for="(report) in reports" :key="report.rep" flat class="col-xs-5 col-sm-3 col-md-2 col-xl-1" @click="open(report)">
      <q-card-section>
        <div class="text-h4">{{report.rows}}</div>
        <div class="text-caption text-grey-7">{{report.name}}</div>
      </q-card-section>
    </q-card>
  </div>

  <q-dialog v-model="wndProducts.state" :maximized="isMobile" full-width persistent>
    <q-table
        flat ref="tableprods"
        :columns="table.columns"
        :pagination="table.pagination"
        :rows="productsdb"
        :filter="table.filter"
        :visible-columns="showedcols"
        row-key="id"
      >
        <template v-slot:top>
          <div class="full-width row items-start">
            <q-btn size="1.4em" flat round color="primary" icon="close" v-if="isMobile" class="absolute-top-right" @click="wndProducts.state=false"/>

            <div class="col-md col-xs-12 text-h6 q-pb-md">{{ wndProducts.name }} ({{ productsdb.length }})</div>

            <div class="col-md col-xs-12 row justify-between items-start">
              <div class="col">
                <q-btn color="primary" flat round icon="autorenew" disabled/>
                <q-btn color="primary" flat round icon="download" disabled/>
              </div>

              <div class="col row justify-end items-center">
                <q-input
                  dense filled debounce="0"
                  v-model="table.filter"
                  placeholder="Buscar"
                  :hint="(productsdb.length==totalRowsShow.length) ? '':`Resultados: ${totalRowsShow.length} de ${productsdb.length}`"
                >
                  <template v-slot:append><q-icon name="search" /></template>
                </q-input>
                <q-btn class="q-ml-sm self-start" dense round color="primary" flat icon="close" v-if="!isMobile" @click="wndProducts.state=false"/>
              </div>
            </div>
            <!-- <q-select
              dense filled
              label="Filtro"
              class="col"
              v-model="view"
              :options="views"
              :disable="loading"
            /> -->
          </div>

          <!-- <div v-else class="full-width">
            ooli
          </div> -->
        </template>
      </q-table>
  </q-dialog>
</template>

<script setup>
  import { ref, watch, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar, LocalStorage, Loading } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import Wapi from 'src/API/WarehouseApi';
  import ProductFinder from 'src/components/ProductFinder.vue';

  const $q = useQuasar();
  const $router = useRouter();
  const $route = useRoute();
  const piniaAccount = useAccountStore();

  const finder = ref({ target:"", type:"prod" });

  const reports = ref([]);
  const loadingcards = ref(true);
  const wndProducts = ref({state:false, name:""});
  const productsdb = ref([]);
  const tableprods = ref(null);

  const table = ref({
    columns:[
      { name:"id", label:"ID", field:"id", },
      { name:"description", label:"Descripcion", align:"left", field: row => row.description },
      { name:"code", label:"Producto", field: row => row.code, align:"left" },
      { name:"shortcode", label:"Codigo Corto", field: row => row.short_code, align:"left" },
      { name:"relateds", label:"Relacionados", field: row => row.relateds.length ? row.relateds.length:'--', align:"center" },
      // { name:"state", label:"Estatus", field: row => row.state.name, align:"center" },
      { name:"current", label:"Actual", field: row => row.stock._current, align:"center", classes: row => row.stock._current<= 0 ? 'text-red anek-bld':'text-blue' },
      { name:"min", label:"Minimo", field:row => row.stock._min, classes: row => row.stock._min ? '':'text-red anek-bld', align:"center", },
      { name:"max", label:"Maximo", field:row => row.stock._max, classes: row => row.stock._max ? '':'text-red anek-bld', align:"center", },
      { name:"ipack", label:"PxC", field: row => row.pieces, classes: row => row.pieces ? '':'text-red anek-bld', align:"center" },
      { name:"unitrestock", label:"Un. surtido", align:"center", field: row => row.unitsupply ? row.unitsupply.name:'X', classes: row => row.unitsupply ? '':'text-red anek-bld' },
      { name:"locations", label:"Ubicaciones", align:"center", field: row => row.locations.length ? row.locations.map( l => l.path ).join(", ") :'--', classes: row => row.unitsupply ? '':'text-red anek-bld' },
    ],
    filter:"",
    pagination:{
      rowsPerPage:30
    }
  });

  const isMobile = computed(() => $q.platform.is.mobile);
  const totalRowsShow = computed(() => tableprods.value ? tableprods.value.filteredSortedRows :[]);
  const showedcols = computed(() => isMobile.value ? ["code","shortcode","ipack","current","min","max","locations","unitrestock"] : ["code","shortcode","relateds","ipack","unitrestock","description","current","min","max","locations"]);

  onBeforeMount(() => { init(); });

  const init = async () => {
    loadingcards.value = true;
    $q.loading.show({message:"Cargando vista..."});

    const resp = await Wapi.resumen($route.params.wid);
    loadingcards.value = false;

    console.log(resp);

    reports.value = resp.reports;

    $q.loading.hide();
  }

  const open = async (report) => {
    let rep = report.rep;

    wndProducts.value.name = report.label;
    console.log(report);
    $q.loading.show({message:'Obteniendo registros, espera'});
    const resp = await Wapi.report($route.params.wid,rep);
    console.log(resp);
    productsdb.value = resp.rows;
    wndProducts.value.name = resp.name;
    wndProducts.value.state = true;
    $q.loading.hide();
  };

  const finderFound = (item) => {

    console.log("Finder encontro lo + chido");
    console.log(item);
  }

</script>

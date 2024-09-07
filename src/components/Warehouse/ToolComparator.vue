<template>
  <div>
    <div>
      <q-card flat bordered>
        <q-card-section horizontal>
          <q-card-section>
            <q-btn color="primary" flat round icon="fas fa-rotate-right" @click="initComp" />
          </q-card-section>
          <q-separator vertical/>
          <q-card-section class="col">
            <div class="text-h6">Origen</div>
            <div class="row q-gutter-sm">
              <div class="col q-pa-sm bg-blue-grey-1">
                <div>Sucursal</div>
                <div>{{ store.name }}</div>
              </div>
              <div class="col q-pa-sm bg-blue-grey-1">
                <div>Almacen</div>
                <div>{{ warehouse.name }}</div>
              </div>
            </div>
          </q-card-section>
          <q-separator vertical />
          <q-card-section class="col">
            <div class="text-h6">Fuente</div>
            <div class="row q-gutter-sm">
              <q-select v-model="destBranch" :options="storesCompOpts" label="Sucursal" filled class="col" option-label="name" option-value="id" @update:model-value="destWarehouse = null; report=null;"/>
              <q-select v-model="destWarehouse" :options="warehouseCompOpts" label="Almacen" filled class="col" option-label="name" option-value="id"/>
            </div>
          </q-card-section>
          <q-separator vertical />
          <q-card-section class="col">
            <div class="text-h6">Comparativo</div>
            <q-select v-model="report" :options="reportsOpts" label="Seleccione" option-label="name" option-value="rep" filled :readonly="destWarehouse ? false:true" :disable="destWarehouse ? false:true"/>
          </q-card-section>
          <template v-if="report">
            <q-separator vertical/>
            <q-card-actions align="center">
              <q-btn color="primary" label="Generar" @click="genReport" />
            </q-card-actions>
          </template>
        </q-card-section>
      </q-card>

      <q-card class="q-mt-md" v-if="table1.data.length">
        <q-table flat
          :rows="rwosRepMinMax"
          :columns="table1.cols"
          row-key="product_id"
          :filter="table1.filtrator"
          :pagination="table1.pagination"
        >
          <template v-slot:top>
            <div class="full-width row justify-between items-start">
              <div>
                <div class="text-h6">{{ report.name }}</div>
                <div class="text-subtitle2">{{ report.description }}</div>
                <div>Resultados: <b class="text-h6">{{ table1.data.length }}</b></div>
              </div>

              <div class="row items-center">
                <div><q-input v-model="table1.filtrator" outlined rounded dense type="text" label="Buscar" /></div>
                <div><q-select v-model="table1.view" :options="table1.filtersView" label="Vista" dense outlined rounded /></div>
              </div>
            </div>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" :title="supState(props.row).msg">
              <q-td key="suppstate" :props="props"><q-icon name="circle" size="sm" :color="supState(props.row).color"/></q-td>
              <q-td key="id" :props="props">{{ props.row.product_id }}</q-td>
              <q-td key="pdesc" :props="props">{{ props.row.product_desc }}</q-td>
              <q-td key="code" :props="props">{{ props.row.product_code }}</q-td>
              <q-td key="shortcode" :props="props">{{ props.row.product_shortcode }}</q-td>
              <q-td key="stateincatname" :props="props">{{ props.row.state_incat_name }}</q-td>
              <q-td key="stockprovcurr" :props="props">{{ props.row.dest_current }}</q-td>
              <q-td key="stockprovavlbl" :props="props">{{ props.row.dest_available }}</q-td>
              <q-td key="stateinwrhname" :props="props">{{ props.row.state_incat_name }}</q-td>
              <q-td key="stockcurrent" :props="props">{{ props.row.stock_current }}</q-td>
              <q-td key="stockavlbl" :props="props">{{ props.row.stock_available }}</q-td>
              <q-td key="stockincome" :props="props">{{ props.row.stock_transit }}</q-td>
              <q-td key="stockmin" :props="props">{{ props.row.stock_min }}</q-td>
              <q-td key="stockmax" :props="props">{{ props.row.stock_max }}</q-td>
              <!-- <q-td key="id" :props="props"><small><pre>{{ props.row }}</pre></small></q-td> -->
            </q-tr>
          </template>
        </q-table>
      </q-card>
    </div>

    <q-inner-loading :showing="!readyComp">
      <q-spinner-gears size="50px" color="primary" />
      <div>Cargando datos...</div>
    </q-inner-loading>

    <q-inner-loading :showing="reporting">
      <q-spinner-dots size="5em" color="primary" />
      <div class="bg-white q-pa-md">Generando reporte... espere</div>
    </q-inner-loading>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Comparatool from 'src/API/ComparatoolApi';
  import { useQuasar } from 'quasar';

  const $route = useRoute();
  const $q = useQuasar();

  const sid = $route.params.idstore;
  const wid = $route.params.wid;

  const $props = defineProps({
    store:{type:Object, default:{}},
    warehouse:{type:Object, default:{}}
  });

  const reportsOpts = [
    { rep:"A", name:"Minimos y Maximos", description:"Productos que estan agotados o por agotarse", group:"cds" },
    { rep:"B", name:"Modelos Faltantes", description:"Productos que no tenemos pero CEDIS si", group:"cds" }
  ];

  const readyComp = ref(false); // cuando el componente esta re/cargando el inicio, muestra el inner loading
  const reporting = ref(false); // cuando un reporte se esta generando, muestra el inner loading
  const report = ref(null); // almacena el tipo de reporte a generar

  const destBranch = ref(null);
  const destWarehouse = ref(null);

  const table1 = ref({
    data:[],
    cols:[
      { name:"suppstate", align:"center", field: row => null },
      { name:"id", label:"ID", align:"center", field:"product_id" },
      { name:"pdesc", label:"Producto", align:"left", field:"product_desc" },
      { name:"code", label:"Codigo", align:"left", field:"product_code" },
      { name:"shortcode", label:"Codigo Corto", align:"center", field:"product_shortcode" },
      { name:"stateincatname", label:"Estado (Cat)", field:"state_incat_name" },
      { name:"stockprovcurr", label:"Stock (CP)", align:"center", field:"dest_current" },
      { name:"stockprovavlbl", label:"Stock (DP) ", align:"center", field:"dest_available" },
      { name:"stateinwrhname", label:"Estado (Alm)", field:"state_inwrh_name" },
      { name:"stockcurrent", label:"Stock Actual", align:"center", field:"stock_current" },
      { name:"stockavlbl", label:"Stock Disponible", align:"center", field:"stock_available" },
      { name:"stockincome", label:"Stock en Transito", align:"center", field:"stock_transit" },
      { name:"stockmin", label:"Stock minimo", align:"center", field:"stock_min" },
      { name:"stockmax", label:"Stock maximo", align:"center", field:"stock_max" },
    ],
    filtrator:null,
    pagination:{ rowsPerPage: 10 },
    filtersView:[{id:0, label:"Todo"}, {id:1, label:"Pedido Real"}, {id:2, "label":"Insuficiencia de proveedor"}],
    view: {id:1, label:"Real"}
  });

  const storesDB = ref([]);
  const storeType = computed(() => $props.store._type);
  const storesCompOpts = computed(() => storeType.value!=1 ? storesDB.value.filter( s => s.id==sid || s._type==1) : storesDB.value);
  const warehouseCompOpts = computed(() => destBranch.value ? destBranch.value.warehouses.filter( w => w.id!=wid ) : []);
  const rwosRepMinMax = computed(() => table1.value.view.id==1 ?
    table1.value.data.filter( r => (r.state_inwrh==1 && r.state_incat==1 && ((r.stock_available+r.stock_transit)<=r.stock_min) && (r.dest_current>(r.stock_available+r.stock_transit))) ) :
    table1.value.view.id==2 ? table1.value.data.filter( r => r.state_inwrh==1 && r.state_incat==1 && ((r.stock_available+r.stock_transit)<=r.stock_min) && (r.dest_current<(r.stock_available+r.stock_transit))) :
    table1.value.data
  );

  const initComp = async() => {
    readyComp.value = false;
    console.log("Vamo a traer los datos para la comparacion de almacenes");
    const resp = await Comparatool.index(wid);
    console.log(resp);

    storesDB.value = resp.stores;

    readyComp.value = true;

    // Vamo a poblar las sucursales y almacenes destino
    // asi como agregar las opciones de comparacion
  }

  const genReport = async () => {
    reporting.value = true;
    let repid = report.value.rep;
    let storedest = destBranch.value.id; // id del almacen destino
    let wrhdest = destWarehouse.value.id; // id del almacen destino
    const resp = await Comparatool.getReport(wid, storedest, wrhdest, repid);
    console.log(resp);

    table1.value.data = resp.products;

    reporting.value = false;
  }

  const supState = row => {
    let color = "";
    let msg = "";

    if(row.state_inwrh==1){
      let current_incom = row.stock_available+row.stock_transit;
      if(current_incom<=row.stock_min){
        let forsupp = (row.stock_max-current_incom);
        msg = `stock actual: ${current_incom}, min: ${row.stock_min}, max: ${row.stock_max}, SOLICITUD: ${forsupp}, proveedor: ${row.dest_current}`;
        if(row.dest_current>forsupp){
          color = "positive";
        }else{
          color = "negative";
        }
      }else{
        msg = `stock actual: ${current_incom}, minimo: ${row.stock_min}`;
        color = "purple";
      }
    }else{
      msg = `Estatus de almacen (${row.state_inwrh})`;
      color = "orange"
      if(row.state_incat==1){
        color = "positive"
      }else{
        msg = `Estatus en Catalogo (${row.state_incat})`;
        color = "negative"
      }
    }

    return { msg, color }
  }

  onMounted(() => {
    initComp();
    console.log($props);
  })
</script>

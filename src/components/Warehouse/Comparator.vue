<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h6">Comparar Almacen {{ warehouse?.name }}</div>
      <div class="text-subtitle2"><b>{{ pids.length }}</b> productos en la lista.</div>
    </q-card-section>
    <q-separator />

    <q-card-section class="row q-gutter-md">
      <q-select v-model="typ_comp.val" :options="typ_comp.opts" :disable="typ_comp.block" label="Comparativo" filled class="col" @update:model-value="setCompType"/>
      <q-select v-if="typ_comp.val=='Sucursal'" v-model="store" :options="stores" label="Sucursal" option-label="name" option-value="id" filled class="col" @update:model-value="setWarehouses"/>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-select v-model="warehouses.vss" :options="warehouses.opts" filled option-label="name" label="Almacen" :loading="warehouses.load"/>
    </q-card-section>

    <q-card-section horizontal class="column" v-if="prevStart">
      <q-btn color="primary" label="Iniciar" square @click="startCompare" :loading="toolCompare.state==1" />
    </q-card-section>
  </q-card>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import Wapi from 'src/API/WarehouseApi';

  let $route = useRoute();

  const $props = defineProps({
    pids:{ type:Array, default:[] }
  });

  const toolCompare = ref({ state:0 });

  const pids = ref($props.pids); // almacena los ids de los productos recibidos desde el componente padre (productos a comparar)

  const typ_comp = ref({ // define el tipo de comparativo (Local: entre almacenes de esta sucursal, Sucursal: entre almacenes de OTRA sucursal)
    val:"Local",
    opts:["Local","Sucursal"],
    block:true
  });

  const dataDB = ref(null); // almacena los datos recibidos desde el api
  const stores = ref([]); // almacena los sucursales a mostrar (solo disponible en el comparativo Sucursal)
  const store = ref(null); // almacena la sucursal seleccionada (solo disponible en el comparativo Sucursal)

  let warehouses = ref({ // almacena la lista de almacenes para eeleccionar
    vss:null,
    opts:[],
    load:true
  });

  let wid = $route.params.wid; // id del almacen desde el que estamos trabajando
  let sid = $route.params.idstore; // id de la sucursal desde la que estamos trabajando

  let warehouse = ref(null);

  const init = async () => {

    const resp = await Wapi.comparator(wid);
    console.log(resp);

    dataDB.value = resp.data;
    stores.value = resp.data.filter( s => (s.id!=sid && s._type==1));

    warehouse.value = resp.data.find( s => s.id==sid)["warehouses"].find( w => w.id==wid);
    warehouses.value.opts = resp.data.find( s => s.id==sid)["warehouses"].filter( w => w.id != wid);

    typ_comp.value.block = false;
    warehouses.value.load = false;
  }

  const setCompType = v => {

    warehouses.value.vss = null;
    warehouses.value.opts = [];
    store.value = null;

    if(v=="Local"){ warehouses.value.opts = dataDB.value.find( s => s.id==sid)["warehouses"].filter( w => w.id != wid); }
  }

  const setWarehouses = v => warehouses.value.opts = v.warehouses;

  const startCompare = async () => {
    toolCompare.value.state = 1;
    let vs_wid = warehouses.value.vss.id;
    let data = {pids:pids.value};
    let resp = await Wapi.comparator_start(wid,vs_wid,data);
    console.log(resp);
    toolCompare.value.state = 0;
  }

  const prevStart = computed(() => {
    if(typ_comp.value.val=="Local"){
      return warehouses.value.vss ?? false
    }else if(typ_comp.value.val=="Sucursal"){
      return (store.value&&warehouses.value.vss) ?? false
    }

    return false
  });

  init();
</script>

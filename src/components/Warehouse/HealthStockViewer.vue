<template>
  <q-card class="my-card" flat style="min-width:300px;">
    <q-card-section class="row justify-between">
      <q-btn dense flat color="primary" :label="isMobile?'':'Actualizar'" icon="autorenew" @click="init" :disable="loading"/>
      <q-btn dense flat color="primary" :label="isMobile?'':'Descargar'" icon="download" @click="init" :disable="loading"/>
      <q-btn dense flat color="primary" :label="isMobile?'':'Generar pedido'" icon="fas fa-list-check" :disable="loading">
        <q-menu>
          <div>
            <q-card-section>
              <q-icon name="warning" color="orange"/> Los pedidos de resurtido omiten todos los productos que: <br/><br/>
              > No tienen unidad de surtido<br/>
              > No tienen definido el valor de "piezas por caja"<br/>
              > No tienen unidad minima y/o maxima<br/>
              > El estatus es diferente a "disponible"<br/>
              > No tienen todos sus precios definidos (o no son mayores a $0.00)<br/>
            </q-card-section>
            <q-card-section class="row">
              <q-select v-model="neworder.to" :options="stores" label="Proveedor" option-value="id" option-label="name" :disable="stores.length==1" class="col"/>
              <q-btn color="primary" label="Iniciar" @click="orderstart" />
            </q-card-section>
          </div>
        </q-menu>
      </q-btn>
    </q-card-section>

    <template v-if="loading" >
      <q-card-section class="text-center">
        <q-spinner-gears
          color="primary"
          size="3rem"
          :thickness="5"
        />
        <div class="q-pt-md">Cargando datos</div>
      </q-card-section>
    </template>
    <template v-else>
      <q-card-section v-if="!productsdb.length">
        Vaya, aqui no hay nada, te apetece un cafe??
      </q-card-section>
      <q-table v-else
        flat ref="tableprods"
        :columns="table.columns"
        :visible-columns="showcols"
        :pagination="table.pagination"
        :rows="products"
        :filter="table.filter"
        row-key="_product"
      >
        <template v-slot:top>
          <div class="full-width">
            <div class="row q-gutter-md">
              <q-select
                dense filled
                label="Filtro"
                class="col"
                v-model="view"
                :options="views"
                :disable="loading"
              />
              <q-input dense filled debounce="300" v-model="table.filter" placeholder="Buscar" class="col">
                <template v-slot:append><q-icon name="search" /></template>
              </q-input>
            </div>
            <div class="text-center q-pt-md">Productos: {{totalRowsShow.length.toString()}}</div>
          </div>
        </template>
      </q-table>
    </template>

  </q-card>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useQuasar } from 'quasar';
  import { useRoute, useRouter } from 'vue-router';
  import { useAccountStore } from 'stores/Account';
  import RestockApi from 'src/API/RestockApi';

  const views = [
    { id:"none", label:"Todo" },
    { id:"oos", label:"Agotados / Negativos" },
    { id:"foos", label:"Por agotarse" },
    // { id:"nmm", label:"Sin min/max" },
    // { id:"nip", label:"Sin pzs/caja" },
    // { id:"nacts", label:"Bloqueados, eliminados, etc..." },
  ];

  const $q = useQuasar();

  const props = defineProps({
    stores:{ type:Array, default:[] }
  });
  const emit = defineEmits(['startorder']);

  const stores = ref(props.stores);// almacena las tiendas a las que puedo pedir mercancia
  const neworder = ref({ to:null, type:2 });// define la tienda a la que le solicitare la mercancia7
  const view = ref(views[0]);
  const loading = ref(true);
  const productsdb = ref([]);
  const textfiltrator = ref("");
  const tableprods = ref(null);
  const table = ref({
    columns:[
      { name:"id", label:"ID", field:"_product", },
      { name:"relateds", label:"Relacionados", field: row => row.product.relateds.length, align:"left" },
      { name:"code", label:"Producto", field: row => row.product.code, align:"left" },
      { name:"current", label:"Actual", field:"_current", align:"center", classes: row => row._current<= 0 ? 'text-red anek-bld':'text-blue' },
      { name:"min", label:"Minimo", field:"_min", classes: row => row._max ? '':'text-red anek-bld', align:"center", },
      { name:"max", label:"Maximo", field:"_max", classes: row => row._max ? '':'text-red anek-bld', align:"center", },
      { name:"ipack", label:"PxC", field: row => row.product.pieces, classes: row => row.product.pieces ? '':'text-red anek-bld', align:"center" },
      { name:"unitrestock", label:"Un. surtido", align:"center", field: row => row.unitsupply ? row.unitsupply.name:'X', classes: row => row.unitsupply ? '':'text-red anek-bld' },
      { name:"state", label:"Estatus", field: row => row.state.name, align:"center" },
      { name:"description", label:"Descripcion", align:"left", field: row => row.product.description },
    ],
    filter:"",
    pagination:{
      rowsPerPage:10
    }
  });

  const isMobile = computed(() => $q.platform.is.mobile);
  const oos = computed(() => productsdb.value.length ? productsdb.value.filter( p => p._current<=0 ) : []);//out of stock (agotados, current<=0)
  const foos = computed(() => productsdb.value.length ? productsdb.value.filter( p => (p._current>0 && p._current<p._min) ) : []);//for out of stock (current>0 && < min)
  // const nmm = computed(() => productsdb.value.length ? productsdb.value.filter( p => !p._min||!p._max) : []);// no mins or no max
  // const nip = computed(() => productsdb.value.length ? productsdb.value.filter( p => !p.product.pieces) : []);//no innerpack
  // const nacts = computed(() => productsdb.value.length ? productsdb.value.filter( p => p.state.id>1) : []);//no innerpack

  const products = computed(() => {
    switch(view.value.id){
      case 'oos': return oos.value;
      case 'foos': return foos.value;
      // case 'nmm': return nmm.value.value;
      // case 'nip': return nip.value;
      // case 'nacts': return nacts.value;
      default: return productsdb.value;
    }
  });
  const totalRowsShow = computed(() => tableprods.value ? tableprods.value.filteredSortedRows :[]);
  const showcols = computed(() => isMobile.value ? ["code","ipack","current","min","max"] : ["code","relateds","ipack","unitrestock","description","current","min","max","state"]);

  onMounted(() => {
    console.log(stores.value);
    neworder.value.to = stores.value.length == 1 ? stores.value[0]: null;
    init();
  });

  const init = async () => {
    console.log("cargando datos");
    loading.value = true;
    const resp = await RestockApi.outofstock();
    productsdb.value = resp.products;
    loading.value = false;
    console.log(resp);
  }

  const orderstart = () => {
    emit("startorder",neworder.value);
  }

</script>

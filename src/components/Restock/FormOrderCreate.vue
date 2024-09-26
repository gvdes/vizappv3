<template>
  <q-card class="my-card">
    <q-card-section horizontal class="row justify-between items-center">
      <q-card-section>Nuevo Pedido</q-card-section>
      <q-card-section>
        <div class="row items-center q-gutter-md">
          <q-select v-model="neworder.type" :options="reqtypes" dense filled option-label="name" option-value="id" />
          <!-- <q-select v-if="inaCds" v-model="ctxRestock.opt" dense :options="ctxRestock.opts" filled /> -->
        </div>
      </q-card-section>
    </q-card-section>
    <q-separator />

    <template v-if="settingsforcedis">
      <q-card-section >
        <div class="row q-gutter-md items-center">
          <q-select v-model="whrSrc" :options="mywarehouses" label="Almacen Origen" option-label="name" filled class="col"/>
          <div v-if="whrSrc" class="col"> Se realizara el comparativo contra los almacenes {{ mywarehouses.filter( w => w.id!=whrSrc.id ).map( w => w.name ).join(",") }}</div>
        </div>
      </q-card-section>
    </template>

    <!-- <q-separator />
    <div>{{ stores_std.map( s => s.alias ) }}</div>
    <div>{{ stores_cds.map( s => s.alias ) }}</div>
    <div>{{ mystore.name }}</div>
    <div>{{ mywarehouses.map( w => w.alias ) }}</div>
    <div>{{ vsCedis }}</div>
    <q-separator /> -->

    <q-tab-panels v-model="neworder.type.shortname" animated>
      <q-tab-panel name="MAN" class="q-pa-none">
        <q-card flat>
          <q-card-section class="text-center">
            <q-btn color="primary" label="Iniciar pedido en blanco" @click="createBlank" />
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="AVZ" class="q-pa-none">
        <q-card flat>
          <q-card-section horizontal class="items-center">
            <q-card-section class="text-subtitle2">Cargar productos desde</q-card-section>
            <q-card-section><q-select dense v-model="preViewType.opt" :options="preViewType.opts" filled /></q-card-section>
            <q-card-actions align="center"><q-btn color="primary" label="Cargar" @click="loadPrev"/></q-card-actions>
          </q-card-section>
          <q-separator />
          <template v-if="basketDB.length">
            <q-table
              :rows="basketDB"
              row-key="name"
              :columns="tablePrev.cols"
              :pagination="tablePrev.pgnt"
              :filter="tablePrev.filter"
            >
              <template v-slot:top>
                <div class="full-width">
                  <div class="row items-center">
                    <div class="col">Filtros</div>
                    <div class="col">
                      <q-input outlined dense rounded debounce="300" v-model="tablePrev.filter" placeholder="Buscar">
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                </div>
              </template>
            </q-table>
            <q-separator />
            <q-card-actions align="center" v-if="basketDB.length">
              <q-btn color="primary" label="Iniciar reserva" @click="createByImport" />
            </q-card-actions>
          </template>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="VFSOL" class="q-pa-none">
        <q-card flat>
          <q-card-section class="text-subtitle2">Cargar productos desde una Venta en Factusol</q-card-section>
          <q-card-section horizontal class="items-center justify-between">
            <q-card-section v-if="inaCds"><q-select dense v-model="srcBranch" label="Sucursal" :options="stores_std" option-label="name" /></q-card-section>
            <q-card-section><q-input dense v-model="folio.iptVal" label="Folio" type="text" /></q-card-section>
            <q-card-actions align="center"><q-btn color="primary" label="Cargar" /></q-card-actions>
          </q-card-section>
          <q-separator />
          <template v-if="basketDB.length">
            <q-separator />
            <q-card-actions align="right" >
              <q-btn color="primary" label="Iniciar reserva" @click="createByImport" />
            </q-card-actions>
          </template>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="PVT" class="q-pa-none">
        <q-card flat>
          <q-card-section class="text-subtitle2">Cargar productos Desde un pedido en Preventa</q-card-section>
          <q-card-section horizontal class="items-center justify-between">
              <q-card-section><q-input dense v-model="folio.iptVal" label="Folio" type="text" /></q-card-section>
            <q-card-actions align="center"><q-btn color="primary" label="Cargar" /></q-card-actions>
          </q-card-section>

          <template v-if="basketDB.length">
            <q-separator />
            <q-card-actions align="right" >
              <q-btn color="primary" label="Iniciar reserva" @click="createByImport" />
            </q-card-actions>
          </template>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useQuasar } from 'quasar';
  import { useRoute } from 'vue-router';
  import RestockApi from 'src/API/RestockApi';

  const $route = useRoute();
  const $q = useQuasar();

  const $sid = $route.params.idstore;

  const $props = defineProps({
    reqtypes:{type:Array, default:[]},
    inaCds:{type:Boolean, default:false},
    storesdb:{type:Array, default:[]},
  });

  const whrSrc = ref(null);
  const vsCedis = ref(null);
  const srcBranch = ref(null);
  const folio = ref({ iptVal:"", state:0 });
  const neworder = ref({ type:{id: 1, name: 'Manual', shortname: 'MAN'}, to:null });
  const basketDB = ref([]);
  const preViewType = ref({
    opt:{ id:"A", label:"Minimos y Maximos", dsc:"" },
    opts:[
      { id:"A", label:"Minimos y Maximos", dsc:"" },
      { id:"B", label:"Modelos Faltantes", dsc:"" },
    ]
  });
  const unitsMeasure = [
    { id:1, label:"Pieza"},
    { id:2, label:"Docena"},
    { id:3, label:"Caja"},
  ];

  const tablePrev = ref({
    cols:[
      { name:"idp", label:"IDP", field:"_product", align:"rigth" },
      { name:"code", label:"Codigo", field:row => row.product.code, align:"rigth", sortable:true },
      { name:"shortcode", label:"Codigo Corto", field:row => row.product.short_code, align:"center", sortable:true },
      { name:"desc", label:"Descripcion", field:row => row.product.description, align:"rigth" },
      // { name:"desc", label:"Producto", field:row => row.product, sortable:true }
      { name:"unitsupply", label:"Unidad/Surtido", field:row => unitsMeasure.find( um => um.id == row.product._assortment_unit).label, align:"center" },
      { name:"ipack", label:"Piezas/empaque", field:row => row.product.pieces, align:"center", sortable:true },
      { name:"min", label:"Stock Min.", field:"_min", align:"center", sortable:true },
      { name:"max", label:"Stock Max.", field:"_max", align:"center", sortable:true },
      { name:"available", label:"Stock Disponible", field:"available", align:"center", sortable:true },
      { name:"current", label:"Stock Actual", field:"_current", align:"center", sortable:true },
      { name:"income", label:"En Transito", field:"in_coming", align:"center", sortable:true },
      {
        name:"request",
        label:"Solicitud",
        field: row => {
          let req = (row.available<=row._min);
          let amount = (row._max - row.available);

          return row.product._assortment_unit == 3 ?
            (req ? Math.floor(amount/row.product.pieces) : 0):
            (req ? amount : 0);
        },
        format: (val,row) => {
          let lbl = row.product._assortment_unit == 3 ? "cj":"pz"
          lbl = val == 1 ? lbl : lbl+"s";
          return `${val} (${lbl})`;
        },
        align:"center",
        sortable:true
      },
      { name:"avlprov", label:"Disp. (CDS/pzs)", field:"stocks_product_sum_available", align:"center", sortable:true },
    ],
    pgnt:{ rowsPerPage: 10 },
    filter:""
  });

  const stores_std = computed(() => $props.storesdb.filter( s => s._type==2));
  // const stores_cds = computed(() => $props.storesdb.filter( s => s._type==1));
  const mystore = computed(() => $props.storesdb.filter( s => s.id==$sid)[0]);
  const mywarehouses = computed(() => mystore.value.warehouses.filter( w => w._state==1 && w._type==4));
  // const vscedises = computed(() => stores_cds.value.filter( s => s.id!=$sid));
  const settingsforcedis = computed(() => ($props.inaCds && [1,2].includes(neworder.value.type.id)));

  const $emit = defineEmits(["reqAdded", "fn2", "start"]);

  const createBlank = () => {
    console.log("Creando pedido");
    console.log(neworder.value);

    $emit("reqAdded");
  }

  const createByImport = () => {
    console.log(neworder.value);
    console.log("Creando por importacion");
  }

  const loadPrev = async () => {
    console.log(neworder.value);
    console.log("Cargando vista previa");

    let rid = preViewType.value.opt.id;
    let wrhsrc = whrSrc.value?.id;

    $q.loading.show({message:"Cargando productos, espera..."});

    const resp = await RestockApi.preview(rid,wrhsrc);
    basketDB.value = resp.resdynfn.basket;
    console.log(resp);

    $q.loading.hide();

  }

</script>

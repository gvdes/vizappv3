<template>
  <q-card flat>
    <q-card-section horizontal class="items-center">
      <q-card-section class="text-subtitle2">Cargar productos desde</q-card-section>
      <q-card-section>
        <q-select dense v-model="preViewType.opt" :options="preViewType.opts" filled :disable="state==2"/>
      </q-card-section>
      <q-card-actions align="center"><q-btn color="primary" label="Cargar" @click="loadPreview" :loading="state==2"/></q-card-actions>
    </q-card-section>

    <q-separator />

    <template v-if="state==3">
      <q-table
        :loading="state==2"
        :rows="basket"
        row-key="name"
        :columns="cols"
        :pagination="tablePrev.pgnt"
        :filter="tablePrev.filter"
      >
        <template v-slot:top >
          <div class="full-width">
            <div class="row items-center">
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
      <q-card-actions align="center">
        <q-select dense v-model="wrhTo" :options="warehouses_cedis" label="Proveedor" filled option-label="name"/>
        <q-btn v-if="wrhTo" color="primary" label="Iniciar reserva" @click="create" disable/>
      </q-card-actions>
    </template>
    <template v-if="state==4">
      <div class="text-h5 text-positive text-center q-pa-md">
        <q-icon name="done" /> Todo pinta bien... por ahora
      </div>
    </template>
    <template v-if="state==5">
      <div class="text-h5 text-positive text-center q-pa-xl">
        <q-spinner-box color="orange" size="3rem" :thickness="5" />
        <div>Reservando productos, esto podria demorar un poco...</div>
      </div>
    </template>
  </q-card>
</template>

<script setup>
  import { ref } from 'vue';
  import RestockApi from 'src/API/RestockApi';

  const $props = defineProps({
    warehouses_cedis:{type:Array, default:[]},
    restock_type:{type:Object, default:{}},
    wrhSrc:{type:Object, default:{}},
  })

  const $emit = defineEmits(["creating","created","previewLoading","previewLoaded"]);

  const wrhTo = ref(null);
  const state = ref(1); // 1 inicial, 2 cargando preview, 3 preview cargo con resultados, 4 preview cargo sin resultados, 5 creando pedido
  const basket = ref([]);

  const unitsMeasure = [
    { id:1, label:"Pieza"},
    { id:2, label:"Docena"},
    { id:3, label:"Caja"},
  ];

  const preViewType = ref({
    opt:{ id:"A", label:"Minimos y Maximos", dsc:"" },
    opts:[
      { id:"A", label:"Minimos y Maximos", dsc:"" },
      { id:"B", label:"Modelos Faltantes", dsc:"" },
    ]
  });

  const cols = [
      { name:"idp", label:"IDP", field:"_product", align:"rigth" },
      { name:"code", label:"Codigo", field:row => row.product.code, align:"rigth", sortable:true },
      { name:"shortcode", label:"Codigo Corto", field:row => row.product.short_code, align:"center", sortable:true },
      { name:"desc", label:"Descripcion", field:row => row.product.description, align:"rigth" },
      // { name:"desc", label:"Producto", field:row => row.product, sortable:true }
      { name:"ipack", label:"Piezas/empaque", field:row => row.product.pieces, align:"center", sortable:true },
      { name:"min", label:"Stock Min.", field:"_min", align:"center", sortable:true },
      { name:"max", label:"Stock Max.", field:"_max", align:"center", sortable:true },
      { name:"reserveds", label:"Resevados", field:"reserved", align:"center", sortable:true },
      { name:"available", label:"Stock Disponible", field:"available", align:"center", sortable:true },
      { name:"current", label:"Stock Actual", field:"_current", align:"center", sortable:true },
      { name:"income", label:"En Transito", field:"in_coming", align:"center", sortable:true },
      { name:"unitsupply", label:"Unidad/Surtido", field:row => unitsMeasure.find( um => um.id == row.product._assortment_unit).label, align:"center" },
      { name:"requnits", label:"Solicitud (uns)", field:"_z_amount_units", align:"center", sortable:true },
      { name:"reqpacks", label:"Solicitud (emp)", field:"_z_amount_packs", align:"center", sortable:true },
      { name:"avlprov", label:"Disp. (CDS/pzs)", field:"stocks_product_sum_available", align:"center", sortable:true },
    ];

  const tablePrev = ref({
    pgnt:{ rowsPerPage: 10 },
    filter:""
  });

  const loadPreview = async () => {
    console.log("Cargando vista previa");
    basket.value = [];
    state.value = 2;
    $emit("previewLoading");

    let rid = preViewType.value.opt.id;
    let wrhsrc = $props.whrSrc?.id;

    const resp = await RestockApi.preview(rid,wrhsrc);
    basket.value = resp.resdynfn.basket;
    state.value = basket.value.length ? 3:4;
    let scale = state.value==3;

    $emit("previewLoaded",scale);
  }

  const create = async () => {
    console.log("Creando pedido (AdvancedOrder)");
    state.value = 5;
    $emit('creating');

    let data = {
      type:$props.restock_type,
      to:wrhTo.value,
      folio:null,
      avz_params:{type:preViewType.value.opt,sections:[]}
    }

    console.log(data);

    const resp = await RestockApi.create(data);
    console.log(resp);
    // $emit('created', resp);
  }
</script>

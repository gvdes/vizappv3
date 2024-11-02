<template>
  <q-card>
    <template v-if="!addProduct">
      <q-card-section>
        <ProductFinder with-stock :warehouses="idsWrhsStocks" @itemtapped="itemTapped"/>
      </q-card-section>
    </template>
    <template v-else>
      <q-card-section horizontal class="text-white bg-primary">
        <q-img
          src="src/assets/__default__.png"
          width="80px"
          spinner-color="primary"
          spinner-size="80px"
          fit="contain"
        />
        <q-card-section class="col">
          <div class="row justify-between">
            <div class="text-h6">{{ addProduct.code }}</div>
            <div class="fs-dec2">{{ addProduct.id }}</div>
          </div>
          <div class="text-subtitle2">{{ addProduct.description }}</div>
        </q-card-section>
      </q-card-section>

      <q-card-section v-if="warns.length" class="q-pa-sm bg-grey-3">
        <q-chip v-for="warn,idx in warns" :key="idx" :color="warn.isCritical ? 'negative':'warning'" text-color="white" icon="warning">{{ warn.warn }} </q-chip>
      </q-card-section>

      <q-separator />
      <q-card-section class="q-gutter-md">
        <q-table dense :rows="wrhOrgStock" :columns="colsStock" row-key="name" hide-bottom title="Stock Actual" />

        <q-card class="my-card">
          <q-expansion-item :label="`Disponibilidad (${fullAvlbl})`" class="text-h6" >
            <q-table flat dense :rows="wrhsSrcStock" :columns="colsStock" row-key="name" hide-bottom :visible-columns="visibleColsProv" :pagination="{rowsPerPage:10}" />
          </q-expansion-item>
        </q-card>
      </q-card-section>
      <q-separator />
      <q-card-section horizontal>
        <q-card-section class="col">
          <q-list separator dense>
            <q-item>
              <q-item-section>Uns. x Emp.</q-item-section>
              <q-item-section>{{ addProduct.pieces }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>Unidad de Resurtido</q-item-section>
              <q-item-section>PZ/Cj</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-section class="col">
          <q-list separator dense>
            <q-item clickable v-ripple @click="putSuggest">
              <q-item-section>Sugerido</q-item-section>
              <q-item-section>{{ suggest }}</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="putReco">
              <q-item-section>Recomendado</q-item-section>
              <q-item-section>{{ reco }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card-section>
      <q-separator />
      <q-card-section class="row q-gutter-sm justify-center">
        <q-btn color="primary" icon="remove" @click="decAmount"/>
        <q-input type="number" v-model="amount" dense outlined input-class="text-h6 text-center" input-style="max-width:80px;" min="1"/>
        <q-btn color="primary" icon="add" @click="incAmount"/>
      </q-card-section>
      <q-separator />
      <q-card-actions align="between">
        <q-btn color="purple" icon="youtube_searched_for" label="Buscar otro" @click="addProduct=null"/>
        <q-btn
          label="Reservar"
          :color="warns.length ? 'warning':'positive'"
          :icon="warns.length ? 'warning':'add'"
          :disable="avlReserve"
          :loading="makingReserve"
          @click="tryReserve"
        />
      </q-card-actions>
    </template>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProductFinder from '../ProductFinder.vue';
import RestockApi from 'src/API/RestockApi';

const $props = defineProps({
  auths:{type:Array, default:[]},
  wrhsComps:{type:Array, deafult:[]},
  wrhOrg:{type:Object, deafult:{}},
  order:{type:Number, deafult:0}
});

const $emit = defineEmits(["reserving", "reserveSuccess", "reserveFail"]);

const addProduct = ref (null);
const visibleColsProv = ["available","reserved","wrh","state"];
const amount = ref(0);
const makingReserve = ref(false);

const colsStock = [
  { name:"wrh", label:"Almacen", field:row=>row.warehouse.name },
  { name:"available", label:"Disponible", field:"available" },
  { name:"reserved", label:"Reservado", field:"reserved" },
  { name:"min", label:"minimo", field:"_min" },
  { name:"max", label:"maximo", field:"_max" },
  { name:"income", label:"Por Llegar", field:"in_coming" },
  { name:"state", label:"Estatus", field:row=>row.warehouse._state },
];

const idWrhOrg = computed(() => $props.wrhOrg?.id );// id del almacen origen
const idsWrhsSrc = computed(() => $props.wrhsComps.map( w => w.id) );// ids de los almacenes para consultar stocks
// union de los almacenes proveedores + el almacen origen (para que el backend traiga stocks del almacen origen y almacenes proveedores)
const idsWrhsStocks = computed(() => idsWrhsSrc.value.concat([idWrhOrg.value]) );// ids de los almacenes a consultar en el buscador (ProductFinder)
const idsWrhsSrcLabels = computed(() => $props.wrhsComps.map( w => `${w.id}${w.alias}${w.store.alias}` ));

// se localiza el almacen solicitante de la lista de almacenes consultados
const wrhOrgStock = computed(() => addProduct.value ? addProduct.value.stocks.filter( w => w._warehouse == idWrhOrg.value) : []);
// se localizan los almacenes proveedores de la lista de almacenes consultados
const wrhsSrcStock = computed(() => addProduct.value ? addProduct.value.stocks.filter( w => w._warehouse != idWrhOrg.value) :[]);
// calcula el total de unidades disponibles de la lista de almacenes proveedores
const fullAvlbl = computed(() => wrhsSrcStock.value.map( w => w.available).reduce((acc,amount) => (acc+amount),0));
// devuelve una lista de las reglas de calidad de los datos del producto
const productQltRules = computed(() => {
  let cstock = wrhOrgStock.value[0];
  let minMax = addProduct.value ? ![cstock._min,cstock._max].includes(0):false; // valida que el minimo y el maximo esten configurados
  let ipack = addProduct.value ? addProduct.value.pieces!=0:false; //valida que tenga piezas por caja
  let locStateAvl = cstock._state!=1; // valida estado en el almacen
  let globStateAvl = addProduct.value ? addProduct.value._state==1:false; // valida el estado en el catalogo principal
  let noAvl = fullAvlbl.value>0 ?? false; // valida que halla al menos una pieza para poder solicitar
  // let missAvl = fullAvlbl.value>0 ?? false; // valida el estado en el catalogo principal

  return [
    { pass: minMax, warn:"Sin configuracion en minimo y/o maximo", isCritical:false },
    { pass: ipack, warn:"Sin configuracion en Unidades x Empaque", isCritical:false },
    { pass: locStateAvl, warn:"Producto inactivo en Almacen", isCritical:false },
    { pass: globStateAvl, warn:"Producto inactivo en Catalogo General", isCritical:false },
    { pass: noAvl, warn:"Disponibilidad 0", isCritical:false },
    // { pass: missAvl, warn:"Disponibilidad incompleta", isCritical:false },
  ]
});
// devuelve la lista de las reglas de calidad no pasadas por el producto
const warns = computed(() => productQltRules.value.filter( qlt => !qlt.pass));
// devuelve las reglas de calidad que son criticas
const warnsCritical = computed(() => warns.value.filter( qlt => qlt.isCritical));
// valida si el boton de reserva esta activo o no
const avlReserve = computed(() => !warnsCritical.value.length&&amount.value<=0);

// calucla el sugerido a solicitar
const suggest = computed(() => {
  if (addProduct.value&&warnsCritical.value.length==0){
    let ipack = addProduct.value.pieces;
    let cstock = wrhOrgStock.value[0];
    let avl = cstock.available;
    let min = cstock._min;
    let max = cstock._max;
    let res = cstock.reserved;
    let inc = cstock.in_coming;

    return (avl<=min) ? (max-(avl+inc)) : 0;
  }else{
    return 0;
  }
});
//
const reco = computed(() => fullAvlbl.value>suggest.value ? suggest.value : (fullAvlbl.value>0 ? fullAvlbl.value:0 ));

const itemTapped = product => {
  console.log(product);
  addProduct.value = product;
  amount.value = reco.value;
}

const putSuggest = () => amount.value = suggest.value;
const putReco = () => amount.value = reco.value;

const incAmount = () => amount.value++;
const decAmount = () => amount.value>1 ? amount.value--:null;

const tryReserve = async () => {
  $emit("reserving");
  let rid = $props.order;
  makingReserve.value = true;

  let data = {
    product:addProduct.value.id,
    amount:amount.value,
    unitsupply:"",
  }

  const resp = await RestockApi.addProduct(rid,data);
  console.log(resp);
  // makingReserve.value = false; // quitamos el estado de cargando al boton de reserva
  // $emit("reserveSuccess"); // emitimos el evento de reserva Exitosa || reserva Fallida
}

</script>

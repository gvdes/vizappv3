<template>
  <q-card class="wrapper">
    <q-toolbar class="bg-warning" v-if="duplicate">
      <q-toolbar-title>Editar {{ duplicate.product.code }}</q-toolbar-title>
    </q-toolbar>
    <q-toolbar class="bg-primary text-white" v-else>
      <q-toolbar-title>Agregar producto</q-toolbar-title>
    </q-toolbar>

    <div>
      <q-banner v-if="duplicate" class="bg-warning">
        Unidades traspasadas: <b>{{ duplicate.amount }}</b>
      </q-banner>

      <template v-if="!product">
        <q-card-section>
          <ProductFinder @itemtapped="setProduct" with-stock :warehouses="warehouses"/>
        </q-card-section>
      </template>

      <template v-else>
        <q-card-section>
          <div class="row items-center justify-between">
            <div>
              <div>ID: {{ product.id }}</div>
              <div>{{ product.code }}</div>
            </div>
            <div class="text-right">
              <div>{{ product.barcode }}</div>
              <div>{{ product.short_code }}</div>
            </div>
          </div>
          <div class="q-pt-md">{{ product.description }} </div>
        </q-card-section>

        <div class="row q-mb-md items-center">
          <div class="col text-center">
            <q-img
              src="src/assets/__default__.png"
              spinner-color="primary"
              spinner-size="50px"
              style="width: 200px"
            />
          </div>
          <div class="column col" >
            <q-btn flat color="primary" icon="fas fa-plus" class="q-py-md" @click="updateAmount('u')"/>
            <q-input dense borderless v-model="units.num" type="number" input-class="text-center text-h5" />
            <q-btn flat color="primary" icon="fas fa-minus" class="q-py-md" @click="updateAmount('d')" :disable="units.num<2"/>
          </div>
        </div>

        <q-separator />

        <div class="q-py-xs row bg-blue-grey-1">
          <q-btn flat class="col" color="primary" icon="fas fa-arrow-left" @click="restart"/>
          <q-btn flat class="col" color="primary" icon="close" @click="close"/>
          <q-btn flat class="col" color="primary" icon="fas fa-arrow-right" v-if="!duplicate" @click="set" />
          <q-btn class="col" color="warning" label="Aplicar cambios" v-if="duplicate&&dupdiff" @click="set"/>
        </div>
      </template>

      <q-inner-loading :showing="suspend">
        <q-spinner-gears size="50px" color="primary" />
        <div>Traspasando ...</div>
      </q-inner-loading>
    </div>
  </q-card>
</template>

<script setup>
import { ref, computed } from "vue";
import ProductFinder from 'src/components/ProductFinder.vue'

const $props = defineProps({
  warehouses:{ type:Array, default:[] },
  screen:{ type:Object, default:{} },
  platform:{ type:Object, default:{} },
  mybasket:{ type:Array, default:[] },
});

const $emit = defineEmits([ "set", "close" ])

const product = ref(undefined)
const warehouses = ref($props.warehouses);
const mybasket = ref($props.mybasket);
const screen = ref($props.screen);
const platform = ref($props.platform);
const state = ref(false);
const units = ref({ num:1 });
const suspend = ref(false);
const duplicate = ref(undefined);
const dupdiff = computed(() => duplicate.value && duplicate.value.amount!=units.value.num );

// const lineAdded = computed(() => product.value ? mybasket.value.map(p=>p.id).includes(product.value.id) : false);

const updateAmount = (op) => {
  let am = parseInt(units.value.num);
  if(op=='u'){
    units.value.num = am+1
  }else{
    am > 1 ? units.value.num = am-1 : null;
  }
}

const setProduct = item => {
  console.log(item);
  let dup = mybasket.value.find( p => p._product==item.id);
  if(dup){
    duplicate.value = dup;
    units.value.num = dup.amount;
  }
  console.log(mybasket.value);
  product.value = item
};

const unfreeze = () =>  suspend.value = false;

const restart = () => {
  suspend.value = false;
  product.value = undefined;
  duplicate.value = undefined;
}

const set = () => {
  suspend.value = true;
  let data = { product:product.value.id, amount:units.value.num }
  $emit("set",data);
}

const close = () => { $emit("close"); }

defineExpose({ unfreeze, restart, setProduct })
</script>

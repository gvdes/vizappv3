<template>
  <q-card class="my-card">
    <q-card-section class="item-center">
      <div class="row">
        <div class="text-subtitle2 col text-bold text-left text-grey text-overline">
          {{ EditProduct.category.familia.seccion.name }}</div>
        <div class="text-subtitle2 col text-bold text-center text-grey text-overline">
          {{ EditProduct.category.familia.name }}</div>
        <div class="text-subtitle2 col text-bold text-right text-grey text-overline">{{ EditProduct.category.name }}
        </div>
      </div>
    </q-card-section>
    <q-card-section class="item-center">
      <div class="row">
        <div class="text-h6 col text-bold text-left">{{ EditProduct.code }}</div>
        <div class="text-subtitle2 col text-bold text-center">Stock: {{ EditProduct.stocks[0]?._current }}</div>
        <div class="text-h6 col text-bold text-right">{{ EditProduct.short_code }}</div>
      </div>
      <div class="text-subtitle2 col">{{ EditProduct.description }}</div>
    </q-card-section>
    <q-card-section class="item-center row">
      <div class="col text-subtitle2 text-center  "
        v-for="(price, index) in EditProduct.prices.filter(e => mostPrice.includes(e._rate))" :key="index">
        <div :class="price.rates.id == selectPrice ? 'text-weight-bold' : 'text-caption text-strike'">
          {{ price.rates.name }}</div>
        <q-separator spaced inset vertical dark />
        <div :class="price.rates.id == selectPrice ? 'text-bold  text-blue-13' : 'text-caption'">{{ price.price }}
        </div>
        <q-separator spaced inset vertical dark />
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row items-end">
        <div class="text-center">
          <div class="col q-pa-xs ">
            <div class="text-bold text-h6">Cantidad:</div>
            <q-btn flat color="positive" icon="add" class="text-h5" @click="insertPro.units++" />
            <q-separator spaced inset vertical dark />
            <div class="col column q-py-md">
              <input type="number" min="1" v-model="insertPro.units" class="text-center exo"
                style="width: 100px; font-size: 3em; margin: auto auto; border:none;" />
            </div>
            <q-separator spaced inset vertical dark />
            <q-btn flat color="negative" icon="remove" class="text-h5"
              @click="insertPro.units > 1 ? insertPro.units-- : ''" />
          </div>

        </div>
        <q-separator spaced inset vertical dark />

        <div class="col q-pa-xs">
          <q-select dense filled v-model="unit_measure.val" :options="unit_measure.opts" label="Surtir por"
            option-label="name" />
          <q-separator spaced inset vertical dark />
          <q-input dense filled v-model="insertPro.notes" type="text" label="Notas" />
          <q-separator spaced inset vertical dark />
          <q-list>
            <q-item class="bg-grey-11">
              <q-item-section class="text-left text-caption">P x C</q-item-section>
              <q-item-section class="text-bold text-center"> {{ EditProduct.pieces }} pzs</q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-caption">Unidades</q-item-section>
              <q-item-section class="text-bold text-center"> {{ insertPro.amount_require }} pzs</q-item-section>
            </q-item>
            <q-item class="bg-grey-11">
              <q-item-section class="text-left text-caption text-bold">Total</q-item-section>
              <q-item-section class="text-bold text-center">$ {{ insertPro.amount_require * price
                }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card-section>


    <q-card-actions align="center">
      <q-btn-group spread class="full-width" v-if="!existProduct">
        <q-btn round flat title="Cancelar" icon="close" color="negative" v-close-popup @click="reset" />
        <q-btn round flat title="Agregar" icon="add" color="positive" @click="addProduct" />
      </q-btn-group>
      <q-btn-group spread class="full-width" v-else>
        <q-btn round flat title="Cancelar" icon="close" color="positive" v-close-popup  @click="reset" />
        <q-btn round flat title="Eliminar" icon="delete_forever" color="negative" @click="removeProduct" />
        <q-btn round flat title="Modificar" icon="edit" color="warning" @click="modifyProduct" />
      </q-btn-group>
    </q-card-actions>
  </q-card>

</template>

<script setup>
import { ref, watch, onBeforeMount, computed, onMounted } from 'vue';
import ProductFinder from 'src/components/ProductFinder.vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, LocalStorage, Loading } from 'quasar';
import { useAccountStore } from 'stores/Account';
import pvtpi from 'src/API/PreordersApi.js'

const $q = useQuasar();
const $route = useRoute();
const $router = useRouter()
const piniaAccount = useAccountStore();

const emit = defineEmits(['addingProd']);

const props = defineProps({
  EditProduct: { type: Object, default: {} },
  order: { type: Object, default: {} },
  unit_measure: { type: Object, default: {} },
  products:{type:Array,default:[]},
  insertPro:{ type: Object, default: {} },
})
const EditProduct = props.EditProduct
const order = props.order
const unit_measure = props.unit_measure
unit_measure.val = EditProduct.measure
const products = props.products
const insertPro = props.insertPro
const price = computed(() => EditProduct?.prices.filter(e => e._rate == selectPrice.value)[0].price)


const mostPrice = computed(() => {
  if (order.client.rate.id <= 3) {
    return [1, 2, 3, 4];
  } else {
    return [order.client.rate.id];
  }
})

const selectPrice = computed(() => {

  if (unit_measure.val.id == 1) {
    insertPro.amount_require = insertPro.units
  } else if (unit_measure.val.id == 2) {
    insertPro.amount_require = insertPro.units * 12
  } else if (unit_measure.val.id == 3) {
    insertPro.amount_require = insertPro.units * EditProduct.pieces
  }

  if (order.client.rate.id <= 3) {
    if (products?.length > 0) {
      if (insertPro.amount_require >= 3 && insertPro.amount_require <= 11 && unit_measure.val.id == 1) {
        return 2
      } else if (insertPro.amount_require >= 12 && insertPro.amount_require < EditProduct.pieces && unit_measure.val.id == 1 || unit_measure.val.id == 2 && insertPro.amount_require < EditProduct.pieces) {
        return 3
      } else if (insertPro.amount_require >= EditProduct.pieces && (unit_measure.val.id == 1 || unit_measure.val.id == 2) || unit_measure.val.id == 3) {
        return 4
      } else {
        return 1
      }
    } else {
      if (insertPro.amount_require >= 3 && insertPro.amount_require <= 11 && unit_measure.val.id == 1) {
        return 2
      } else if (insertPro.amount_require >= 12 && insertPro.amount_require < EditProduct.pieces && unit_measure.val.id == 1 || unit_measure.val.id == 2 && insertPro.amount_require < EditProduct.pieces) {
        return 3
      } else if (insertPro.amount_require >= EditProduct.pieces && (unit_measure.val.id == 1 || unit_measure.val.id == 2) || unit_measure.val.id == 3) {
        return 4
      } else {
        return 1
      }
    }
  } else {
    return order.client.rate.id
  }
})



const existProduct = computed(() => {
  let inx = products.findIndex(e => e.product.id == EditProduct.id)
  if(inx >= 0 ){
    return true
  }else{
    return false
  }
})

const addProduct = async () => {
  insertPro.price = price.value
  insertPro._state = 1
  insertPro.total = insertPro.amount_require * price.value
  insertPro._product = EditProduct.id
  insertPro._rate = selectPrice.value
  insertPro._supply_by = unit_measure.val.id
  insertPro._order = order.id

  const addPr = pvtpi.addProduct(insertPro);
  // console.log(addPr);
  if (addPr.error) {
    console.log(addPr)
  } else {
    emit('addingProd',addPr)
  }
}

const modifyProduct = () => {

}

const removeProduct = () => {

}

const reset = () => {
    insertPro._order = null,
    insertPro._product= null,
    insertPro.amount_require=1,
    insertPro.units= 1,
    insertPro.price= null,
    insertPro.total= null,
    insertPro._rate= null,
    insertPro._state= null,
    insertPro.notes= null,
    insertPro._supply_by= null
  }







</script>

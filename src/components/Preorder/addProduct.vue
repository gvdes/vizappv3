<template>
  <q-card class="my-card">
    <!-- {{ product.prices }} -->
    <q-card-section class="item-center">
      <div class="row">
        <div class="text-subtitle2 col text-bold text-left text-grey text-overline">
          {{ product.category.familia.seccion.name }}
        </div>
        <div class="text-subtitle2 col text-bold text-center text-grey text-overline">
          {{ product.category.familia.name }}
        </div>
        <div class="text-subtitle2 col text-bold text-right text-grey text-overline">
          {{ product.category.name }}
        </div>
      </div>
    </q-card-section>
    <q-card-section class="item-center">
      <div class="row">
        <div class="text-h6 col text-bold text-left">
          {{ product.code }}
        </div>
        <div class="text-subtitle2 col text-bold text-center">
          Stock: {{ product.stocks[0]._current }}
        </div>
        <div class="text-h6 col text-bold text-right">
          {{ product.short_code }}
        </div>
      </div>
      <div class="text-subtitle2 col">{{ product.description }}</div>
    </q-card-section>
    <div v-if="existPrice">
      <q-card-section class="item-center row">
        <div class="col text-subtitle2 text-center"
          v-for="(price, index) in product.prices.filter((e) => mostPrice.includes(e._rate))" :key="index">
          <div :class="price.rates.id == selectPrice ? 'text-weight-bold' : 'text-caption text-strike'">
            {{ price.rates.name }}
          </div>
          <q-separator spaced inset vertical dark />
          <div :class="price.rates.id == selectPrice ? 'text-bold  text-blue-13' : 'text-caption'">
            {{ price.price }}
          </div>
          <q-separator spaced inset vertical dark />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row items-end">
          <div class="text-center">
            <div class="col q-pa-xs">
              <div class="text-bold text-h6">Cantidad:</div>
              <q-btn flat color="positive" icon="add" class="text-h5" @click="product.pivot.units++" />
              <q-separator spaced inset vertical dark />
              <div class="col column q-py-md">
                <input type="number" min="1" v-model="product.pivot.units" class="text-center exo"
                  style=" width: 100px; font-size: 3em; margin: auto auto; border: none;" />
              </div>
              <q-separator spaced inset vertical dark />
              <q-btn flat color="negative" icon="remove" class="text-h5"
                @click="product.pivot.units > 1 ? product.pivot.units-- : ''" />
            </div>
          </div>
          <q-separator spaced inset vertical dark />

          <div class="col q-pa-xs">
            <q-select dense filled v-model="product.pivot.unitsupply" :options="unit_measure.opts" label="Surtir por"
              option-label="name" />
            <q-separator spaced inset vertical dark />
            <q-input dense filled v-model="product.pivot.notes" type="text" label="Notas" />
            <q-separator spaced inset vertical dark />
            <q-list>
              <q-item class="bg-grey-11">
                <q-item-section class="text-left text-caption">P x C</q-item-section>
                <q-item-section class="text-bold text-center">{{ product.pieces }} pzs</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="text-left text-caption">Unidades</q-item-section>
                <q-item-section class="text-bold text-center">{{ totalPzs }}
                  pzs</q-item-section>
              </q-item>
              <q-item class="bg-grey-11">
                <q-item-section class="text-left text-caption text-bold">Total</q-item-section>
                <q-item-section class="text-bold text-center">$ {{ totalPzs * price
                  }}</q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn-group spread class="full-width" v-if="!edit">
          <q-btn round flat title="Cancelar" icon="close" color="negative" v-close-popup @click="reset" />
          <q-btn round flat title="Agregar" icon="add" color="positive" @click="addProduct" />
        </q-btn-group>
        <q-btn-group spread class="full-width" v-else>
          <q-btn round flat title="Cancelar" icon="close" color="positive" v-close-popup />
          <q-btn round flat title="Eliminar" icon="delete_forever" color="negative" @click="removeProduct" />
          <q-btn round flat title="Modificar" icon="edit" color="warning" @click="modifyProduct" />
        </q-btn-group>
      </q-card-actions>
    </div>
    <q-card-section class="bg-red text-white" v-else>
      <div class="text-bold">
        <q-icon name="warning" />
        El producto no se puede setear precios en 0
      </div>
    </q-card-section>

  </q-card>
</template>

<script setup>
import { ref, watch, onBeforeMount, computed, onMounted } from "vue";

import { useRoute, useRouter } from "vue-router";
import { useQuasar, LocalStorage, Loading } from "quasar";
import { useAccountStore } from "stores/Account";
import pvtpi from "src/API/PreordersApi.js";
import Resourse from 'src/Resources/Preventa/product';
const $q = useQuasar();
const $route = useRoute();
const $router = useRouter();
const piniaAccount = useAccountStore();

const emit = defineEmits(["addingProd", "delProd", "ModifyProd","reset"]);

const props = defineProps({
  product: { type: Object, default: {} },
  order: { type: Object, default: {} },
  unit_measure: { type: Object, default: {} },
  products: { type: Array, default: [] },
  firstProducts: { type: Array, default: [] },
  rules: { type: Array, defaul: [] },
  edit: { type: Boolean, default: false }
});
const mostPrice = computed(() => {
  if (props.order.client._rate <= 3) {
    return [1, 2, 3, 4];
  } else {
    return [props.order.client._rate];
  }
});

const existPrice = computed(() => props.product.prices.every(p => parseFloat(p.price) > 0))
const totalPzs = computed(() => {
  let pzs = props.product.pivot.unitsupply.id == 3 ? (props.product.pivot.units * props.product.pieces) : props.product.pivot.unitsupply.id == 2 ? (props.product.pivot.units * 12) : props.product.pivot.units
  props.product.pivot.amount_require = pzs
  return pzs
})
const price = computed(() => props.product?.prices.find((e) => e._rate == selectPrice.value).price);

const selectPrice = computed(() => {
  if (props.order.client._rate <= 3) {
    if ((props.product.pivot.amount_require >= props.product.pieces && (props.product.pivot.unitsupply.id == 1 || props.product.pivot.unitsupply.id == 2)) || props.product.pivot.unitsupply.id == 3) {
      return 4;
    } else if (Resourse.verificarPrecioDocena(props.products, props.product, props.rules)) {
      return 3;
    } else if (Resourse.verificarPrecioMayoreo(props.products, props.product, props.rules)) {
      return 2;
    } else {
      return 1;
    }
  } else {
    return props.order.client._rate;
  }
});

const modifyProduct = () => {

}

const removeProduct = () => {

}

const addProduct = async () => {
  props.product.pivot.price = price.value
  props.product.pivot.total = totalPzs.value * price.value
  props.product.pivot._rate = selectPrice.value
  props.product.pivot._state = 1;
  props.product.pivot._supply_by = props.product.pivot.unitsupply.id
  console.log(props.product)
  const resp = await pvtpi.addProduct(props.product.pivot);
  if (resp.error) {
    console.log(resp);
  } else {
    // actPrice();
    // reset();
    emit("addingProd", resp);
    Resourse.actualizarPreciosProductos(props.products,props.order,props.rules)
    reset()
    console.log(resp)
    $q.loading.hide();
  }
}

const reset = () => {
    emit("reset");
}


</script>

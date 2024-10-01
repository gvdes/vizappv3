<template>
  <q-card class="my-card">
    <q-card-section class="item-center">
      <div class="row">
        <div class="text-subtitle2 col text-bold text-left text-grey text-overline">
          {{ EditProduct.category.familia.seccion.name }}
        </div>
        <div class="text-subtitle2 col text-bold text-center text-grey text-overline">
          {{ EditProduct.category.familia.name }}
        </div>
        <div class="text-subtitle2 col text-bold text-right text-grey text-overline">
          {{ EditProduct.category.name }}
        </div>
      </div>
    </q-card-section>
    <q-card-section class="item-center">
      <div class="row">
        <div class="text-h6 col text-bold text-left">
          {{ EditProduct.code }}
        </div>
        <div class="text-subtitle2 col text-bold text-center">
          Stock: {{ EditProduct.stocks[0]._current }}
        </div>
        <div class="text-h6 col text-bold text-right">
          {{ EditProduct.short_code }}
        </div>
      </div>
      <div class="text-subtitle2 col">{{ EditProduct.description }}</div>
    </q-card-section>
    <div v-if="existPrice">
      <q-card-section class="item-center row">
      <div class="col text-subtitle2 text-center" v-for="(price, index) in EditProduct.prices.filter((e) => mostPrice.includes(e._rate))" :key="index">
        <div :class="price.rates.id == selectPrice? 'text-weight-bold': 'text-caption text-strike'">
          {{ price.rates.name }}
        </div>
        <q-separator spaced inset vertical dark />
        <div :class=" price.rates.id == selectPrice ? 'text-bold  text-blue-13' : 'text-caption'" >
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
            <q-btn flat color="positive" icon="add" class="text-h5" @click="insertPro.units++"/>
            <q-separator spaced inset vertical dark />
            <div class="col column q-py-md">
              <input type="number" min="1" v-model="insertPro.units" class="text-center exo" style=" width: 100px; font-size: 3em; margin: auto auto; border: none;"/>
            </div>
            <q-separator spaced inset vertical dark />
            <q-btn flat color="negative" icon="remove" class="text-h5" @click="insertPro.units > 1 ? insertPro.units-- : ''"/>
          </div>
        </div>
        <q-separator spaced inset vertical dark />

        <div class="col q-pa-xs">
          <q-select dense filled v-model="unit_measure.val" :options="unit_measure.opts" label="Surtir por" option-label="name"/>
          <q-separator spaced inset vertical dark />
          <q-input dense filled v-model="insertPro.notes" type="text" label="Notas"/>
          <q-separator spaced inset vertical dark />
          <q-list>
            <q-item class="bg-grey-11">
              <q-item-section class="text-left text-caption">P x C</q-item-section>
              <q-item-section class="text-bold text-center">{{ EditProduct.pieces }} pzs</q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-caption">Unidades</q-item-section>
              <q-item-section class="text-bold text-center">{{ insertPro.amount_require }} pzs</q-item-section>
            </q-item>
            <q-item class="bg-grey-11">
              <q-item-section class="text-left text-caption text-bold">Total</q-item-section>
              <q-item-section class="text-bold text-center">$ {{ insertPro.amount_require * price }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card-section>

      <!-- <q-card-section>
      {{ allProducts[0].product }}
      </q-card-section> -->


    <q-card-actions align="center">
      <q-btn-group spread class="full-width" v-if="!existProduct">
        <q-btn round flat title="Cancelar" icon="close" color="negative" v-close-popup @click="reset"/>
        <q-btn round flat title="Agregar" icon="add" color="positive" @click="addProduct"/>
      </q-btn-group>
      <q-btn-group spread class="full-width" v-else>
        <q-btn round flat title="Cancelar" icon="close" color="positive" v-close-popup />
        <q-btn round flat title="Eliminar" icon="delete_forever" color="negative" @click="removeProduct"/>
        <q-btn round flat title="Modificar" icon="edit" color="warning" @click="modifyProduct"/>
      </q-btn-group>
    </q-card-actions>
    </div>
    <q-card-section class="bg-red text-white" v-else>
    <div class="text-bold" >
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

const $q = useQuasar();
const $route = useRoute();
const $router = useRouter();
const piniaAccount = useAccountStore();

const emit = defineEmits(["addingProd", "delProd","ModifyProd"]);

const props = defineProps({
  EditProduct: { type: Object, default: {} },
  order: { type: Object, default: {} },
  unit_measure: { type: Object, default: {} },
  products: { type: Array, default: [] },
  firstProducts: { type:Array, default:[]},
  insertPro: { type: Object, default: {} },
  rules:{type: Array, defaul:[]}
});
const EditProduct = props.EditProduct;
const order = props.order;
const unit_measure = props.unit_measure;
unit_measure.val = EditProduct.measure;
const products = props.products;
const firstProducts = props.firstProducts;
const insertPro = props.insertPro;
console.log(EditProduct)
const reglas = props.rules
// const allProducts  =ref([...firstProducts, ...products])



//computadas

// const actP = computed(() => {
// let inx = products.findIndex((e) => e.product.id == EditProduct.id);
//   if (inx >= 0) {
//     products[inx].amount_require = insertPro.amount_require
//   } else {
//     return false;
//   }
// })



const price = computed(() => EditProduct?.prices.filter((e) => e._rate == selectPrice.value)[0].price
);

const allProducts = computed(() =>  [...firstProducts, ...products])


const mostPrice = computed(() => {
  if (order.client.rate.id <= 3) {
    return [1, 2, 3, 4];
  } else {
    return [order.client.rate.id];
  }
});

const calcularMayo = computed(() => {
  let data = verificarPrecioMayoreo(allProducts.value, EditProduct)
  return data
})
const calcularDoce = computed(() => {
  let data = verificarPrecioDocena(allProducts.value, EditProduct)
  return data
})

const selectPrice = computed(() => {
  if (unit_measure.val.id == 1) {
    insertPro.amount_require = insertPro.units;
  } else if (unit_measure.val.id == 2) {
    insertPro.amount_require = insertPro.units * 12;
  } else if (unit_measure.val.id == 3) {
    insertPro.amount_require = insertPro.units * EditProduct.pieces;
  }
  if (order.client.rate.id <= 3) {
      if ( (insertPro.amount_require >= EditProduct.pieces && (unit_measure.val.id == 1 || unit_measure.val.id == 2)) || unit_measure.val.id == 3 ) {
        return 4;
      } else if (calcularDoce.value) {
        return 3;
      } else if (calcularMayo.value) {
        return 2;
      } else {
        return 1;
      }
  } else {
    return order.client.rate.id;
  }
});



const existProduct = computed(() => {
  let inx = products.findIndex((e) => e.product.id == EditProduct.id);
  if (inx >= 0) {
    return true;
  } else {
    return false;
  }
});

const existPrice = computed(() => {
  let sp = EditProduct.prices.filter(e  => e.price != 0)
  if(sp.length > 0){
    return true
  }else{
    return false
  }
})



// metodos
const actPrice = () => {
  let r
  allProducts.value.forEach(e => {
    const cumpleMayoreo = verificarPrecioMayoreo(allProducts.value, e.product)
    const cumpleDocena = verificarPrecioDocena(allProducts.value , e.product)
      if ( e.amount_require >= e.product.pieces ) {
      r = 4;
      } else {
       r = 1;
      }
      e.price = e.product.prices.filter(i => i._rate == r)[0].price
      e.rates = e.product.prices.filter(i => i._rate == r)[0].rates
      e.total = e.product.prices.filter(i => i._rate == r)[0].price * e.amount_require
    if(cumpleDocena){
      if(e.rates.id < 3){
      e.price = e.product.prices.filter(i => i._rate == 3)[0].price
      e.rates = e.product.prices.filter(i => i._rate == 3)[0].rates
      e.total = e.product.prices.filter(i => i._rate == 3)[0].price * e.amount_require
      }
    }
    if(cumpleMayoreo){
      if(e.rates.id < 2){
      e.price = e.product.prices.filter(i => i._rate == 2)[0].price
      e.rates = e.product.prices.filter(i => i._rate == 2)[0].rates
      e.total = e.product.prices.filter(i => i._rate == 2)[0].price * e.amount_require
      }
    }
    console.log(e.rates.id)
    AlterProduct(e)
  })
}


const verificarPrecioMayoreo = (prdts, product) => {

  const categoria = product.category.familia.seccion.id;
  const categoriaReglas = reglas.filter(e => e.id == categoria)[0].rules;
  let model = 0;
  let family = 0;
  let distinct = 0
  let rev;
  if (!categoriaReglas) {
    return false;
  }

  let sameModel = prdts.filter(p => p.product.id === product.id).reduce((acc, curr) => acc + curr.amount_require, 0);
  let sameFamily = prdts.filter(p => p.product.category.familia.id === product.category.familia.id ).reduce((acc, curr) => acc + curr.amount_require, 0);
  let distin  = prdts.filter(p =>  p.product.category.familia.seccion.id === product.category.familia.seccion.id && p.product.id !== product.id).reduce((acc, curr) => acc + curr.amount_require, 0);
  let inx = prdts.findIndex((e) => e.product.id == product.id);
  if (inx >= 0) {
    if(EditProduct.id === product.id){
        // prdts = prdts.filter(e => e.product.id !== product.id)
       sameModel = prdts.filter(p => p.product.id === product.id).reduce((acc, curr) => acc + curr.amount_require, 0);
       console.log(sameModel)
       sameFamily = prdts.filter(p => p.product.category.familia.id === product.category.familia.id ).reduce((acc, curr) => acc + curr.amount_require, 0);
       distin = prdts.filter(p =>  p.product.category.familia.seccion.id === product.category.familia.seccion.id && p.product.id !== product.id).reduce((acc, curr) => acc + curr.amount_require, 0)

        model = sameModel + insertPro.amount_require
        family = sameFamily + insertPro.amount_require
        distinct = distin + insertPro.amount_require
    }else{
      model = sameModel
      console.log(model)
      family = sameFamily
      distinct = distin
    }

  }else{
    model = sameModel + insertPro.amount_require
    family = sameFamily + insertPro.amount_require
    distinct = distin + insertPro.amount_require
  }

  for (const regla of categoriaReglas) {
      if (regla._type === 2) {
        if (regla.sameModel == 1 && model >= regla.min && (!regla.max || model <= regla.max)) {
          return true;
        }
        if (regla.sameModel == 0 && family >= regla.min && (!regla.max || family <= regla.max)) {
          return true;
        }
        if (regla.sameModel == 0 && distinct >= regla.min && (!regla.max || family <= regla.max) && regla.family == 0) {
          return true;
        }
      }
   }
   return false
}


const verificarPrecioDocena = (prdts, product ) => {

  const categoria = product.category.familia.seccion.id;
  const categoriaReglas = reglas.filter(e => e.id == categoria)[0].rules;
  let model = 0;
  let family =0;
  let category = 0;

  if (!categoriaReglas) {
     return false;
  }
  let sameModel  = prdts.filter(p => p.product.id === product.id).reduce((acc, curr) => acc + curr.amount_require, 0);
  let sameFamily = prdts.filter(p => p.product.category.familia.id === product.category.familia.id && p.product.id !== product.id).reduce((acc, curr) => acc + curr.amount_require, 0);
  let cat = prdts.filter(p => p.product.category.id === product.category.id && p.product.id !== product.id).reduce((acc, curr) => acc + curr.amount_require, 0);
  let inx = prdts.findIndex((e) => e.product.id == product.id);
  if (inx >= 0) {
    if(EditProduct.id === product.id){
       prdts = prdts.filter(e => e.product.id !== product.id)
       sameModel = prdts.filter(p => p.product.id === product.id).reduce((acc, curr) => acc + curr.amount_require, 0);
       sameFamily = prdts.filter(p => p.product.category.familia.id === product.category.familia.id ).reduce((acc, curr) => acc + curr.amount_require, 0);
       cat = prdts.filter(p => p.product.category.id === product.category.id && p.product.id !== product.id).reduce((acc, curr) => acc + curr.amount_require, 0);

      model =  insertPro.amount_require
      family = insertPro.amount_require
      category = insertPro.amount_require
    }else{
      model = sameModel
      family = sameFamily
      category = cat
    }

  }else{
    model = sameModel + insertPro.amount_require
    family = sameFamily + insertPro.amount_require
    category = cat + insertPro.amount_require
  }

    for (const regla of categoriaReglas) {
        if (regla._type === 3) {
            if (regla.sameModel == 1 && model >= regla.min && (!regla.max || model <= regla.max)) {
                return true;
            }
            if (regla.sameModel == 0 && family >= regla.min && (!regla.max || family <= regla.max)) {
                return true;
            }
            if (regla.sameModel == 1 && category >= regla.min && (!regla.max || family <= regla.max) &&  regla.category == 1) {
                return true;
            }
        }
    }
    return false;
}


const addProduct = async () => {
  $q.loading.show({ message: "Insertando  :)" });
  insertPro.price = price.value;
  insertPro._state = 1;
  insertPro.total = insertPro.amount_require * price.value;
  insertPro._product = EditProduct.id;
  insertPro._rate = selectPrice.value;
  insertPro._supply_by = unit_measure.val.id;
  insertPro._order = order.id;
  const addPr = await pvtpi.addProduct(insertPro);
  // console.log(addPr);
  if (addPr.error) {
    console.log(addPr);
  } else {
    emit("addingProd", addPr);
    // console.log(addPr)
    console.log(allProducts.value)
    $q.loading.hide();
    actPrice();
    reset();
  }
};

const modifyProduct = async () => {
  $q.loading.show({ message: "Actualizando  :|" });
  insertPro.price = price.value;
  insertPro._state = 1;
  insertPro.total = insertPro.amount_require * price.value;
  insertPro._product = EditProduct.id;
  insertPro._rate = selectPrice.value;
  insertPro._supply_by = unit_measure.val.id;
  insertPro._order = order.id;
  console.log(insertPro)
  const mdPr = await pvtpi.ModifyProduct(insertPro);
  console.log(mdPr);
  if (mdPr.error) {

    console.log(mdPr);
  } else {
    emit("ModifyProd", mdPr);
    $q.loading.hide();
    actPrice();
    reset();
  }
};

const removeProduct = async () => {
  $q.loading.show({ message: "Eliminando  :0" });
  const addPr = await pvtpi.removeProduct(insertPro);
  if (addPr.error) {
    console.log(addPr);
  } else {
    emit("delProd", insertPro);
    $q.loading.hide();
    reset()
    actPrice();
  }
};

const reset = () => {
  (insertPro._order = null),
  (insertPro._product = null),
  (insertPro.amount_require = 1),
  (insertPro.units = 1),
  (insertPro.price = null),
  (insertPro.total = null),
  (insertPro._rate = null),
  (insertPro._state = null),
  (insertPro.notes = null),
  (insertPro._supply_by = null);
};

const AlterProduct = async (curr) => {
  curr._rate = curr.rates.id
  console.log(curr)
  const mdPr = await pvtpi.ModifyProduct(curr);
  console.log(mdPr);
  if (mdPr.fail) {

    console.log(mdPr);
  } else {

    emit("ModifyProd", mdPr);
    $q.loading.hide();
  }
};
</script>

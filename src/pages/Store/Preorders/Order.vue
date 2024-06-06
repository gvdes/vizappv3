<template>
  <q-page v-if="order">
    <q-header class="bg-white" elevated>
      <div class="row items-start justify-between">

        <div class="q-pa-xs col text-center ">

          <q-expansion-item popup :label="`Preventa : ${piniaAccount.joinedStore.name}`" class="text-grey-13 text-bold">
            <q-card class="my-card">
              <q-card-section>
                <div class="row items-start justify-between">
                  <q-btn color="negative" flat icon="close"
                    @click="$router.push(`/store/${piniaAccount.join}/preorders/pedidos`)" dense />
                  <q-btn flat color="primary" icon="settings" dense> <q-tooltip
                      class="bg-accent">Configuracion</q-tooltip> </q-btn>
                  <q-btn flat color="primary" icon="archive" dense><q-tooltip class="bg-accent">Importar</q-tooltip>
                  </q-btn>
                  <q-btn flat color="primary" icon="unarchive" dense><q-tooltip class="bg-accent">Exportar</q-tooltip>
                  </q-btn>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </div>


      <div>
        <q-list>
          <q-item class="text-center">
            <q-item-section>
              <q-item-label overline>Cliente</q-item-label>
              <q-item-label caption>{{ order.name }}</q-item-label>
            </q-item-section>


            <q-separator spaced inset vertical dark />

            <q-item-section>
              <q-item-label overline>Folio</q-item-label>
              <q-item-label caption>{{ order.id }}</q-item-label>
            </q-item-section>


            <q-separator spaced inset vertical dark />

            <q-item-section>
              <q-item-label overline>Precio</q-item-label>
              <q-item-label caption>{{ order.client.id == 0 ? 'Publico' : order.client.rate.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <q-separator />

      <div>
        <q-list>
          <q-item class="text-center">
            <q-item-section>
              <q-item-label overline>Modelos</q-item-label>
              <q-item-label caption>{{ order.bodie?.length }}</q-item-label>
            </q-item-section>
            <q-separator spaced inset vertical dark />
            <q-item-section>
              <q-item-label overline>Piezas</q-item-label>
              <q-item-label caption>{{ order.bodie?.reduce((acc, item) => acc + item.amount_require, 0)
                }}</q-item-label>
            </q-item-section>
            <q-separator spaced inset vertical dark />
            <q-item-section>
              <q-item-label overline>Total</q-item-label>
              <q-item-label caption>$ {{ order.bodie?.reduce((acc, item) => acc + parseFloat(item.total), 0)
                }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-header>

    <q-separator spaced inset vertical dark />


    <q-table :rows="products" row-key="name" class="bg-blue-2" hide-header hide-bottom :rows-per-page-options="[0]">
      <template v-slot:body="product">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
          <q-card class="my-card" bordered @click="productEdit(product.row)">
            <q-card-section class="row items-center">
              <div class="q-pr-sm" v-if="product.row.product.picture">
                <q-avatar size="60px" font-size="52px"> <q-img
                    :src="`https://apimport.grupovizcarra.mx/storage/LUPITS.jpeg`" spinner-color="primary"
                    spinner-size="82px" /></q-avatar>
              </div>
              <div class="col q-pr-sm">
                <div class="text-h6">{{ product.row.product.code }} -- {{ product.row.product.short_code }}</div>
                <div class="text-caption text-grey-14 text-bold">{{ product.row.product.category.familia.seccion.name
                  }}
                  - {{ product.row.product.category.familia.name }} - {{ product.row.product.category.name }} (PXC {{
                    product.row.product.pieces }})</div>
                <div class="text-caption">{{ product.row.product.description }}</div>
                <div class="text-caption"> {{ product.row.unitsupply.name }}s {{ product.row.units }}
                  ({{ product.row.amount_require }} pzs), PU: ${{ product.row.price }} </div>
                <div class="text-caption text-blue text-bold">{{ product.row.notes }}</div>
              </div>
              <div class="text-right q-pr-sm">
                <div class=""> $ {{ product.row.total }} </div>
                <div class="text-blue text-bold ">{{ product.row.rates.name }}</div>
              </div>

            </q-card-section>

          </q-card>
        </div>
      </template>
    </q-table>


    <q-dialog v-model="wndProduct" position="bottom" :style="`${isMobile ? '' : 'width: 300px'}`" persistent>
      <addProduct :EditProduct="EditProduct" :order="order" :products="products" :unit_measure="unit_measure"
        :insertPro="insertPro" @addingProd="addingProd">
      </addProduct>
    </q-dialog>


    <q-separator spaced inset vertical dark />
    <q-footer>
      <q-card class="q-mb-md" flat bordered>
        <q-card-section class="row">
          <ProductFinder class="col" @itemtapped="finderFound" withPrices withCategories withStock />
          <q-btn v-if="products.length > 0" color="primary" flat icon="east" />
        </q-card-section>
      </q-card>
    </q-footer>
  </q-page>
</template>


<script setup>
import { ref, watch, onBeforeMount, computed, onMounted } from 'vue';
import ProductFinder from 'src/components/ProductFinder.vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, LocalStorage, Loading } from 'quasar';
import { useAccountStore } from 'stores/Account';
import pvtpi from 'src/API/PreordersApi.js'
import addProduct from 'src/components/Preorder/addProduct.vue';

const $q = useQuasar();
const $route = useRoute();
const $router = useRouter()
const piniaAccount = useAccountStore();

const order = ref(null);
const wndProduct = ref(false);

const products = ref([])

const EditProduct = ref([])
const unit_measure = ref({
  opts: null,
  val: null
})
const insertPro = ref({
  _order: null,
  _product: null,
  amount_require: 1,
  units: 1,
  price: null,
  total: null,
  _rate: null,
  _state: null,
  notes: null,
  _supply_by: null
})




const isMobile = computed(() => $q.platform.is.mobile);

const init = async () => {
  const pedido = $route.params.oid;
  $q.loading.show({ message: 'Cargando Pedido' });
  const resp = await pvtpi.getOrder(pedido)
  if (resp.error) {
    console.log(resp.error)
    $q.notify({
      message: 'No puedes ingresar a este Pedido',
      type: 'negative',
      position: 'center'
    })
    $q.loading.hide();
    $router.push(`/store/${piniaAccount.join}/preorders/pedidos`)
  } else {
    order.value = (resp.order)
    products.value = resp.order.bodie
    // insertPro.value = resp.order.id
    unit_measure.value.opts = resp.unit_measures
    console.log(resp);
    $q.loading.hide();
  }
}
const finderFound = (item) => {
  console.log("Finder encontro lo + chido");
  console.log(item);
  let inx = products.value.findIndex(i => i.product.id == item.id);
  if (inx >= 0) {
    $q.notify({ message: `El articulo ya esta en la lista`, type: 'warning', position: 'center' })
  } else {
    console.log(inx);
    unit_measure.value.val = item.measure
    wndProduct.value = true
    EditProduct.value = item
  }
}

const productEdit = (item) => {

    unit_measure.value.val = item.unitsupply
    EditProduct.value = item.product
    insertPro.value._order = item._order,
    insertPro.value._product= item._product,
    insertPro.value.amount_require=item.amount_require,
    insertPro.value.units= item.units,
    insertPro.value.price= item.price,
    insertPro.value.total= item.total,
    insertPro.value._rate= item._rate,
    insertPro.value._state= item._state,
    insertPro.value.notes= item.notes,
    insertPro.value._supply_by= item._supply_by
    console.log(insertPro.value);
    wndProduct.value = true

}

const addingProd = (item) => {
  item.then(i => products.value.push(i));
  wndProduct.value = false;
}
onBeforeMount(() => { init() })

</script>

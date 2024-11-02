<template>
  <q-page v-if="order" >
    <q-header class="bg-white" >
      <div class="row items-start justify-between">

        <div class="q-pa-xs col text-center ">

          <q-expansion-item popup :label="`Preventa : ${piniaAccount.joinedStore.name} `" class="text-grey-13 text-bold">
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
      <q-separator />
    </q-header>

    <q-separator spaced inset vertical dark />

    <div v-if="order._order_by">
      <q-card class="my-card" >
        <q-card-section>

          <div class="row">
            <div class="col">Pedido {{ order.order.id }}</div>
            <div class="col">Modelos: {{ order.order.bodie.length }}</div>
            <div class="col">Piezas: {{ order.order.bodie.reduce((acc,item) => acc + item.amount_require, 0) }}</div>
            <div class="col">Total: {{ order.order.bodie.reduce((acc,item) => acc + parseFloat(item.total), 0) }}</div>


          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-table :rows="products" row-key="name" class="bg-blue-2" hide-header hide-bottom :rows-per-page-options="[0]">
      <template v-slot:body="product">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-sm-4 col-md-3 grid-style-transition">
          <q-card class="my-card" bordered @click="productEdit(product.row)">
            <q-card-section class="row items-center">
              <div class="q-pr-sm" v-if="product.row.product.picture">
                <q-avatar size="60px" font-size="52px"> <q-img
                    :src="`https://apimport.grupovizcarra.mx/storage/LUPITS.jpeg`" spinner-color="primary"
                    spinner-size="82px" /></q-avatar>
              </div>
              <div class="q-pr-sm" v-else>
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


    <q-dialog v-model="wndProduct" position="bottom" :style="`${isMobile ? '' : 'width: 300px'}`" >
      <addProduct :EditProduct="EditProduct" :order="order" :products="products" :unit_measure="unit_measure" :firstProducts="firstProducts"
        :insertPro="insertPro" @addingProd="addingProd" @delProd="delProd" @ModifyProd="ModifyProd" :rules="rules">
      </addProduct>
    </q-dialog>

    <q-dialog v-model="printers.state" persistent>
      <q-card>
        <q-card-section class=" text-center text-bold text-subtitle1">
          Selecciona Impresora
        </q-card-section>
        <q-card-section >
          <q-select v-model="printers.val" :options="printers.opts" label="Impresora" option-label="name" filled />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" v-close-popup />
          <q-btn flat label="Enviar" color="positive" @click="changeStatus" />
        </q-card-actions>
      </q-card>
    </q-dialog>


    <q-separator spaced inset vertical dark />
    <q-footer>
      <q-card class="q-mb-md" flat bordered>
        <q-card-section class="row">
          <ProductFinder class="col" @itemtapped="finderFound" withPrices withCategories withStock />
          <q-btn v-if="products.length > 0" color="primary" flat icon="east" @click="getPrint"  />
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
import { $sktpvt } from 'src/boot/socket';

const $q = useQuasar();
const $route = useRoute();
const $router = useRouter()
const piniaAccount = useAccountStore();



const order = ref(null);
const wndProduct = ref(false);

const products = ref([])
const firstProducts = ref([]);

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
const rules = ref([]);
const printers = ref({
  state:false,
  opts:[],
  val:null
});


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
    if(resp.order._order_by){
      firstProducts.value = resp.order.order.bodie
    }
    products.value = resp.order.bodie
    // insertPro.value = resp.order.id
    unit_measure.value.opts = resp.unit_measures
    rules.value = resp.rules;
    console.log(resp);
    $q.loading.hide();
  }
}
const finderFound = (item) => {
  console.log("Finder encontro lo + chido");
  console.log(item);
  if(item){
    let inx = products.value.findIndex(i => i.product.id == item.id);
  if (inx >= 0) {
    $q.notify({ message: `El articulo ya esta en la lista`, type: 'warning', position: 'center' })
  } else {
    unit_measure.value.val = item.measure
    wndProduct.value = true
    EditProduct.value = item
   }
  }

}

const productEdit = (item) => {

    unit_measure.value.val = item.unitsupply
    EditProduct.value = item.product
    EditProduct.value.measure = item.unitsupply
    insertPro.value._order = item._order,
    insertPro.value._product= item._product,
    insertPro.value.amount_require = item.amount_require,
    insertPro.value.units= item.units,
    insertPro.value.price= item.price,
    insertPro.value.total= item.total,
    insertPro.value._rate= item._rate,
    insertPro.value._state= item._state,
    insertPro.value.notes= item.notes,
    insertPro.value._supply_by= item._supply_by
    console.log(insertPro.value);
    wndProduct.value = true
    console.log(item);

}

const addingProd = (item) => {
  products.value.push(item);
  wndProduct.value = false;
}

const delProd = (item) => {
  let inx = products.value.findIndex(e => e.product.id == item._product)
  products.value.splice(inx,1);
  wndProduct.value = false;
}

const ModifyProd = (item) => {
  let inx =  products.value.findIndex(e => e.product.id == item._product)
  products.value.splice(inx,1,item);
  wndProduct.value = false;
}

const getPrint = async()=>{

  const resp = await pvtpi.getPrints(3);
  if(resp.error){
    console.log(resp);
  }else{
    printers.value.state= true
    printers.value.opts = resp
  }
}

const changeStatus = async () => {
  console.log('se termina el pedido brou')//se tiene que revisar primero la configuracion para ver a donde va primero el pedido si a por surtir o a por validar
  $q.loading.show({message:'Guardando Pedido :p'});
  order.value.printer = printers.value.val.id
  order.value.typelog = 7//el tipo es el 7 siempre en el proceso
  const resp = await pvtpi.changeStatus(order.value);
  if(resp.error){
    console.log(resp)
  }else{
    $sktpvt.emit('ChangeStatusOrder', resp)
    console.log(resp)
    $q.notify({
      message:'Pedido en cola',
      type:'positive',
      position:'center'
    })
    $router.push(`/store/${piniaAccount.join}/preorders/pedidos`)
  }
}

onBeforeMount(() => { init() })

</script>

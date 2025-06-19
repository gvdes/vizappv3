<template>
  <q-page padding>

    <div class="row">
      <!-- <q-table class="col " title="Pedidos" row-key="name" hide-bottom :rows="orders" :columns="table.columns"
        :pagination="table.pagination" dense /> -->
      <q-separator spaced inset vertical dark />
      <q-table class="col bg-red-1" title="Por Surtir" row-key="name" hide-bottom :rows="Xsurtir"
        :columns="table.columns" :pagination="table.pagination" dense />
      <q-separator spaced inset vertical dark />
      <q-table class="col bg-yellow-1" title="Surtiendo" row-key="name" hide-bottom :rows="Surtiendo"
        :columns="table.columns" :pagination="table.pagination" dense />
      <q-separator spaced inset vertical dark />
      <q-table class="col bg-green-1" title="Pase a Caja" row-key="name" hide-bottom :rows="Xvalidar"
        :columns="table.columns" :pagination="table.pagination" dense />
      <q-separator spaced inset vertical dark />
    </div>

  </q-page>
</template>

<script setup>
import { ref, watch, onBeforeMount, computed, onMounted, onBeforeUnmount } from 'vue';
import ProductFinder from 'src/components/ProductFinder.vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, LocalStorage, Loading } from 'quasar';
import { useAccountStore } from 'stores/Account';
import dayjs from 'dayjs';
import pvtpi from 'src/API/PreordersApi.js'
import addProduct from 'src/components/Preorder/addProduct.vue';
import { $sktpvt } from 'src/boot/socket';

const $q = useQuasar();
const $route = useRoute();
const $router = useRouter()
const piniaAccount = useAccountStore();
const Xsurtir = computed(() => orders.value.filter(e => e._state == 3));
const Surtiendo = computed(() => orders.value.filter(e => e._state == 4));
const Xvalidar = computed(() => orders.value.filter(e => e._state == 5));



const table = ref({
  columns: [
    { name: 'name', label: 'Pedido', align: 'center', field: row => row.id },
    { name: 'client', label: 'Cliente', align: 'center', align: 'center', field: row => row.name },
    { name: 'cash', label: 'Caja', align: 'center', align: 'center', field: row => row.cash?.name },
  ],
  pagination: { rowsPerPage: 0 }
})

const date = new Date();
const orders = ref([]);
const fechas = ref({
  from: dayjs(date).format('YYYY-MM-DD'),
  to: dayjs(date).format('YYYY-MM-DD')
});

const init = async () => {
  $q.loading.show({ message: 'Cargando...' });
  const resp = await pvtpi.getOrders(fechas.value)
  console.log(resp);
  if (resp.error) {
    console.log(resp)
  } else {
    orders.value = resp
    $q.loading.hide();
  }
}

init()


//metodos Socket

const updOrder = (params) => {
  // console.log(params)
  let inx = orders.value.findIndex(e => e.id == params.id)
  if (inx >= 0) {
    if (orders.value[inx]._state != params._state) {
      orders.value[inx].state = params.state
      orders.value[inx]._state = params._state
    }
  }
}

const warehouse = (params) => {
  console.log(params)
  // let inx = orders.value.findIndex(e => e.id == params.id)
  // if(inx >= 0 ){
  orders.value.push(params)
  // }
}
onMounted(() => {
  $sktpvt.on('updOrder', updOrder)
  $sktpvt.on('warehouse', warehouse)
})

onBeforeUnmount(() => {
  $sktpvt.off('updOrder', updOrder)
  $sktpvt.off('warehouse', warehouse)
})




</script>

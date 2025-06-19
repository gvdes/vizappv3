<template>
  <q-page padding>
    <div :class="isMobile ? '' : 'col'">
      <div class="flex justify-center">
        <div class="text-center " :style="`width: 50%;`">
          <q-form @submit="onSubmit">
            <q-input v-model="order" type="number" label="Pedido" :color="message == 1 ? 'green' : 'red'" autofocus
              :bg-color="message == 1 ? 'green-1' : 'red-1'" rounded outlined />
            <div :class="`text-center text-${message == 1 ? 'green' : 'red'}`">
              {{ message == 1 ? 'Servicio Encendido' : 'Servicio Apagado' }}
            </div>
          </q-form>
        </div>
      </div>
      <q-table :rows="bascketOrder" row-key="name" grid :pagination="pagination" hide-bottom>
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
            <q-list bordered>
              <q-item clickable v-ripple @click="changeStatus(props.row)">
                <q-item-section>
                  <q-item-label class="text-center text-bold">{{ props.row.id }}</q-item-label>
                  <q-item-label class="text-center">{{ props.row.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </template>
      </q-table>
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import pvtpi from 'src/API/PreordersApi.js'
import { $sktpvt } from 'boot/socket'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'stores/Account';
import sound from 'src/SOUNDS/preorders/sounds';
import PreordersApi from 'src/API/PreordersApi.js';
import Accounts from 'src/API/Accounts';
const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();


const configs = ref([]);
const orders = ref([]);
const order = ref(null);
const pagination = ref({ rowsPerPage: [0] })
const message = computed(() => configs.value.filter(c => c._state_order == 5)[0]?.active)
const isMobile = computed(() => $q.platform.is.mobile);
const bascketOrder = computed(() => orders.value.filter(e => e.state.id == 5))

const init = async () => {
  $q.loading.show({ message: 'Obteniendo Registros' })
  const resp = await pvtpi.getConfig();
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp)
    configs.value = resp
    let act = configs.value.filter(c => c._state_order == 5)[0]?.active
    if (act == 1) {
      getOrders();
    }
  }
}

const getOrders = async () => {
  console.log('obteniendo ordenes :) ')
  const resp = await pvtpi.getOrdersCheckin()
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp);
    orders.value = resp.preorders;
    $q.loading.hide();
  }
}

const onSubmit = () => {
  console.log('enviadisimo')
  let inx = orders.value.findIndex(e => e.id == order.value)
  if (inx >= 0) {
    changeStatus(orders.value[0])
  } else {
    $q.notify({ message: 'El pedido no existe', type: 'negative', position: 'center' })
    order.value = null
  }
}

const changeStatus = async (pedido) => {
  $q.loading.show({ message: 'Cambiando Estado' })
  console.log(pedido)
  const resp = await pvtpi.changeStatus(pedido);
  if (resp.error) {
    console.log(resp)
  } else {
    $sktpvt.emit('ChangeStatusOrder', resp)
    console.log(resp)
    let inx = orders.value.findIndex(e => e.id == resp.id)
    orders.value.splice(inx, 1)
    $q.notify({
      message: 'Cambio el estado de el pedido',
      type: 'positive',
      position: 'center'
    })
    $router.push(`/store/${piniaAccount.join}/preorders/checkout/${resp.id}`);
    $q.loading.hide()
  }
}


init()

//metodos Socket
const changeStateConfig = (params) => {
  const id = params._state_order
  console.log(params)
  if (id == 3) {
    let inx = configs.value.findIndex(e => e._state_order == id)
    console.log()
    configs.value[inx] = params
    if (params.active == 1) {
      getOrders()
      $q.notify({ message: `'Servicion ${params.state.name} Encendido'`, type: 'positive', position: 'center' })
    } else {
      console.log('cambia los pendientes')
      $q.notify({ message: `'Servicio ${params.state.name} Apagado'`, type: 'negative', position: 'center' })
    }
  }
}

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

const checkout = (params) => {
  console.log(params)
  orders.value.push(params)
}
onMounted(() => {
  $sktpvt.on('changeStateConfig', changeStateConfig)
  $sktpvt.on('updOrder', updOrder)
  $sktpvt.on('checkout', checkout)
})

onBeforeUnmount(() => {
  $sktpvt.off('changeStateConfig', changeStateConfig)
  $sktpvt.off('updOrder', updOrder)
  $sktpvt.off('checkout', checkout)
})


</script>

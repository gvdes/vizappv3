<template>
  <q-page padding>
    <div :class="isMobile ? '' : 'row'">

      <q-separator />
      <div :class="isMobile ? '' : 'col'">

        <q-table :rows="orders" :columns="table.columns" :pagination="table.pagination" :filter="table.filter" flat
          bordered card-class="bg-grey-3">
          <template v-slot:top>
            <q-input dense debounce="300" v-model="table.filter" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" @click="initReimpresion(props.row)">
              <q-td key="id" :props="props">
                {{ props.row.id }}
              </q-td>
              <q-td key="client" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="state" :props="props">
                <q-badge
                  :class="`${colorCellState[(props.row.state.id ? parseInt(props.row.state.id) - 1 : parseInt(props.row.state.id) - 1)]}`">
                  {{ props.row.state.name }}
                </q-badge>
              </q-td>
              <q-td key="created" :props="props">
                <q-badge color="primary">
                  {{ props.row.user.nick }}
                </q-badge>
              </q-td>
              <q-td key="date" :props="props">
                {{ dayjs(props.row.created_at).format('HH:mm A') }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>


    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-fab vertical-actions-align="right" color="primary" text-color="white" icon="keyboard_arrow_left"
        :direction="isMobile ? 'up' : 'left'">
        <div v-for="(modulo, index) in permissions" :key="index">
          <q-fab-action color="primary" label-position="left" :icon="modulo.module.icon"
            :to="`/store/${piniaAccount.join}/${modulo.module.path}`" :label="modulo.module.name" />
        </div>
      </q-fab>
    </q-page-sticky>
  </q-page>

  <q-dialog v-model="reprint.state" persistent position="bottom">
    <q-card>
      <q-card-section class="bg-grey-4">
        <div class="text-h6 text-center text-bold"> Selecciona la Impresora</div>
        <div class="text-overline text-center"> Orden <span class="text-bold">{{ reprint.order.id }} </span></div>
      </q-card-section>
      <q-card-section>
        <q-select v-model="reprint.print" :options="reprint.opts" label="Impresora" filled option-label="name" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat icon="close" color="negative" v-close-popup />
        <q-btn flat icon="check" color="positive" @click="reprintTck" />
      </q-card-actions>
    </q-card>
  </q-dialog>
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

const permissions = computed(() => piniaAccount.account.modules.filter((e) => e.module.root == 'l02m'))


const configs = ref([]);
const reprint = ref({
  state: false,
  order: null,
  print: null,
  opts: []
})
const orders = ref([]);
const table = ref({
  columns: [
    { id: 'id', name: 'id', label: 'ID', field: row => row.id },
    { id: 'client', name: 'client', label: 'CLIENTE', field: row => row.name },
    { id: 'state', name: 'state', label: 'Estado', field: row => row.state.name, align: 'center', },
    { id: 'created', name: 'created', label: 'Realizo', field: row => row.user.nick },
    { id: 'date', name: 'date', label: 'Fecha', field: row => dayjs(row.created_at).format('YYYY-MM-DD HH:mm A') }
  ],
  filter: '',
  pagination: { rowsPerPage: 0 }
})

const isMobile = computed(() => $q.platform.is.mobile);

const init = async () => {
  $q.loading.show({ message: 'Obteniendo Registros' })
  const resp = await pvtpi.getConfig();
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp)
    configs.value = resp
    // let act = configs.value.filter(c => c._state_order == 2)[0]?.active
    // if (act == 1) {
    getOrders();
    // }
  }
}

const getOrders = async () => {
  console.log('obteniendo ordenes :) ')
  const resp = await pvtpi.getOrdersCheckin()
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp);
    orders.value = resp.preorders.filter(e => [3, 4].includes(e._state))
    $q.loading.hide();
  }
}

const colorCellState = [
  'bg-blue-14 ',
  'bg-light-blue-14',
  'bg-orange-14',
  'bg-yellow-14',
  'bg-deep-orange-14',
  'bg-light-green-14',
  'bg-purple-14',
  'bg-deep-purple-14',
  'bg-primary',
  'bg-negative',
  'bg-blue-grey-14'
];

const initReimpresion = async (order) => {
  const resp = await pvtpi.getPrints(2);
  if (resp.error) {
    console.log(resp);
  } else {
    reprint.value.order = order
    reprint.value.state = true
    reprint.value.opts = resp

  }
}

const reprintTck = async () => {
  $q.loading.show({ message: 'Imprimiendo' })
  let dat = {
    id: reprint.value.order.id,
    print: reprint.value.print.id
  }
  const resp = await pvtpi.reprintOrderWarehouse(dat);
  if (resp.error) {
    console.log(resp.error.response.data);
    let message = resp.error.response.data
    $q.notify({ message: message, type: 'negative', position: 'center' })
    $q.loading.hide();

  } else {
    console.log(resp);
    $q.notify({ message: resp, type: 'positive', position: 'center' })
    $q.loading.hide();
    reprint.value.order = null
    reprint.value.state = false
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
      $q.notify({ message: `'Servicion ${params.state.name} Apagado'`, type: 'negative', position: 'center' })
    }
  }
}

const updOrder = (params) => {
  console.log(params)
  let inx = orders.value.findIndex(e => e.id == params.id)
  console.log(inx);
  if (inx >= 0) {
    orders.value[inx].state = params.state
    orders.value[inx]._state = params._state
  }
}

const warehouse = (params) => {
  console.log(params)
  orders.value.push(params)
  sound.newOrder.play();
}
onMounted(() => {
  $sktpvt.on('changeStateConfig', changeStateConfig)
  $sktpvt.on('updOrder', updOrder)
  $sktpvt.on('warehouse', warehouse)

})

onBeforeUnmount(() => {
  $sktpvt.off('changeStateConfig', changeStateConfig)
  $sktpvt.off('updOrder', updOrder)
  $sktpvt.off('warehouse', warehouse)

})


</script>

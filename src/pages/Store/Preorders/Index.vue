<template>
  <q-page>
    <div class="bg-white">
      <div class="q-pa-sm row items-center">
        <!-- <q-btn flat round dense icon="menu" /> -->
        <div class="col anek-bld text-grey-9 q-pl-sm">Preventa</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
          <q-btn flat rounded icon="support" />
        </div>
      </div>
      <q-separator />
    </div>
    <q-separator spaced inset vertical dark />

    <div class="row">
      <q-separator spaced inset vertical dark />
      <q-input class="col" v-model="fechas.from" type="date" label="Desde" dense />
      <q-separator spaced inset vertical dark />
      <q-space />
      <q-input class="col" v-model="fechas.to" type="date" label="Hasta" dense />
      <q-space />
      <q-separator spaced inset vertical dark />
      <q-btn flat color="black" icon="arrow_forward" @click="getOrders" />
    </div>

    <q-separator spaced inset vertical dark />

    <div v-if="!isMobile" class="row">
      <q-separator spaced inset vertical dark />
      <q-card class="my-card col">
        <q-card-section>
          <div class="text-h6 text-center">Total Orders</div>
          <div class="text-h4 text-center"> <q-badge color="primary" class="text-h4 text-center">{{ orders?.length
              }}</q-badge></div>
        </q-card-section>

      </q-card>

      <q-separator spaced inset vertical dark />

      <q-card class="my-card col">
        <q-card-section>
          <div class="text-h6 text-center">Usuarios Conectados</div>
          <q-space />
          <div class="text-h4 text-center">
            <q-badge color="primary" class="text-h4 text-center">{{ connected?.length }}</q-badge>
          </div>
        </q-card-section>
      </q-card>

      <q-separator spaced inset vertical dark />

      <q-card class="my-card col">
        <q-card-section>
          <div class="text-h6 text-center">Orders Terminadas</div>
          <div class="text-h4 text-center"> <q-badge color="primary" class="text-h4 text-center">{{ orders?.filter(e =>
            e._state == 9).length }}</q-badge></div>
        </q-card-section>

      </q-card>

      <q-separator spaced inset vertical dark />

    </div>

    <div v-else class="row">
      <q-separator spaced inset vertical dark />
      <q-card class="my-card col">
        <q-card-section class="row">
          <div class=" col">Total Pedidos</div>
          <div class=" col">{{ orders.length }}</div>
        </q-card-section>
        <q-card-section class="row">
          <div class=" col">Usuarios Conectados</div>
          <div class=" col">{{ connected ? connected.length : 0 }}</div>
        </q-card-section>
        <q-card-section class="row">
          <div class=" col">Pedidos Terminados</div>
          <div class=" col">{{ orders?.filter(e => e._state == 9).length }}</div>
        </q-card-section>
      </q-card>
      <q-separator spaced inset vertical dark />
    </div>
    <q-separator spaced inset vertical dark />

    <div class="row">
      <q-separator spaced inset vertical dark />
      <q-table class="col" :title="`Pedidos desde ${fechas.from} al ${fechas.to}`" :rows="orders"
        :columns="table.columns" row-key="id" :filter="table.filter" v-if="orders">
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="table.filter" placeholder="Buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
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
              {{ dayjs(props.row.created_at).format('YYYY-MM-DD HH:mm A') }}
            </q-td>

          </q-tr>
        </template>

      </q-table>
      <q-separator spaced inset vertical dark />
    </div>

    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-fab  vertical-actions-align="right" color="primary" text-color="white" icon="keyboard_arrow_left" :direction="isMobile ? 'up' : 'left'">
        <!-- <template v-slot:label="{ opened }" v-if="!isMobile" >
          <div :class="{ 'example-fab-animate--hover': opened !== true }">
            {{ opened !== true ? 'Opciones' : 'Cerrar' }}
          </div>
        </template> -->
        <div v-for="(modulo, index) in permissions" :key="index">
          <q-fab-action color="primary" label-position="left" :icon="modulo.module.icon" :to="`${modulo.module.path}`"
            :label="modulo.module.name" />
        </div>
      </q-fab>
    </q-page-sticky>
  </q-page>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import pvtpi from 'src/API/PreordersApi.js'
import { $sktpvt } from 'boot/socket'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'stores/Account';
import PreordersApi from 'src/API/PreordersApi.js';
import Accounts from 'src/API/Accounts';

const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();


$sktpvt.connect();

$sktpvt.on('connect', () => {
  console.log('Conectado al servidor')
  $sktpvt.emit('ParametrosConexion', piniaAccount)
});
$sktpvt.on('PedidoCreado', (param) => {
  orders.value.push(param)
  console.log(`${param.user.nick} creo el pedido ${param.id} :)`)
})
$sktpvt.on('updateUserList', (users) => {
  connected.value = users
})

$sktpvt.on('updOrder', (params) => {
  console.log(params)
  let inx = orders.value.findIndex(e => e.id == params.id)
  orders.value[inx].state = params.state
  orders.value[inx]._state = params._state

})

// referencias

const date = new Date();
const connected = ref(null);
const fechas = ref({
  from: dayjs(date).format('YYYY-MM-DD'),
  to: dayjs(date).format('YYYY-MM-DD')
});
const wndOrder = ref(false)
const client = ref({
  state: false,
  val: null,
  opts: [],
  filter: []
})
const orders = ref([]);

const table = ref({
  columns: [
    { id: 'id', name: 'id', label: 'ID', field: row => row.id },
    { id: 'client', name: 'client', label: 'CLIENTE', field: row => row.name },
    {
      id: 'state', name: 'state', label: 'Estado', field: row => row.state.name, align: 'center',
    },
    { id: 'created', name: 'created', label: 'Realizo', field: row => row.user.nick },
    { id: 'date', name: 'date', label: 'Fecha', field: row => dayjs(row.created_at).format('YYYY-MM-DD HH:mm A') }
  ],
  filter: ''
})


//computed
const isMobile = computed(() => $q.platform.is.mobile);
const permissions = computed(() => piniaAccount.account.modules.filter((e) => e.module.root == '4bed'))


//metodos
const init = async () => {
  $q.loading.show({ message: 'Cargando...' });

  const resp = await PreordersApi.getOrders(fechas.value)
  console.log(resp);
  if (resp.error) {
    console.log(resp)
  } else {
    orders.value = resp
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

const getOrders = async () => {
  $q.loading.show({ message: `Obteniendo pedidos desde ${fechas.value.from} al ${fechas.value.to}` });
  console.log(fechas.value);
  const resp = await PreordersApi.getOrders(fechas.value)
  console.log(resp);
  if (resp.error) {
    console.log(resp)
  } else {
    orders.value = resp
    $q.loading.hide();
  }
}

init()

</script>

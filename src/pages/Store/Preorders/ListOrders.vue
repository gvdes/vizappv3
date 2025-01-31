<template>
  <q-page padding>

    <q-table title="Pedidos" :rows="orders" row-key="id" :columns="table.columns" :pagination="table.pagination" :filter="table.filter" v-if="orders">
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="table.filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <div>

        </div>
        <q-tr :props="props" @click="verifiedOrder(props.row)">
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
      </template></q-table>

    <q-dialog v-model="wndOrder" persistent>
      <q-card>
        <q-card-section class="row items-center bg-primary text-white">
          <q-icon name="list" />
          <span class="q-ml-sm">Nevo Pedido</span>
        </q-card-section>
        <q-card-section>
          <div class="text-caption text-grey">{{ client.state ? 'Escribe Cliente' : 'Escanea el codigo de barras de el cliente' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="viewCli">
            <q-input v-model="client.val" :type="client.state ? 'text' : 'number'" label="Cliente">
              <template v-slot:prepend>
                <q-btn color="primary" :icon="client.state ? 'person_add_disabled' : 'person_add'" title="client" flat
                  @click="client.state = !client.state" />
              </template>
            </q-input>
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat title="Cancelar" color="negative" v-close-popup icon="close" />
          <q-btn flat color="positive" icon="check" @click="viewCli" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="anexo.state" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add_box" color="primary" text-color="white" />
          <span class="q-ml-sm text-h6 text-bold">Crear anexo de el pedido {{ anexo.val.id }}</span>
        </q-card-section>
        <q-card-section>
          <div class="text-h6"> Cliente: {{ anexo.val.name }}</div>
          <div class="text-h6 text-overline"> Creado: {{ `${anexo.val.user.name} ${anexo.val.user.surnames}` }}</div>

        </q-card-section>
        <q-card-actions align="center">
          <q-btn flat icon="close" color="negative" @click="anexo.state = null; anexo.val = null" />
          <q-btn flat icon="check" color="positive" @click="createdAnexo(anexo.val)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="Anex.state" persistent>
      <q-card>
        <q-card-section class="row items-center bg-primary text-white">
          <q-icon name="post_add" />
          <span class="q-ml-sm">Nuevo Anexo</span>
        </q-card-section>
        <q-card-section>
          <q-form @submit="newAnexo">
            <q-input v-model="Anex.val" type="number" label="Pedido" />
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat title="Cancelar" color="negative" v-close-popup icon="close" />
          <q-btn flat color="positive" icon="check" @click="newAnexo" />
        </q-card-actions>
      </q-card>
    </q-dialog>


    <!-- <q-page-sticky position="bottom-right" :offset="[15, 20]">
      <q-btn fab icon="add" color="primary" @click="newOrder" />
    </q-page-sticky> -->


    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-fab color="primary" icon="add" direction="up">
        <q-fab-action color="primary" @click="newOrder" icon="add" label="Pedido" />
        <q-fab-action color="primary" @click="Anex.state = !Anex.state" icon="post_add" label="Anexo" />
      </q-fab>
      <!-- <q-btn fab icon="add" color="primary" @click="newOrder" /> -->
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

const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();

$sktpvt.connect();

$sktpvt.on('connect', () => {
  console.log('Conectado al servidor')
  $sktpvt.emit('ParametrosConexion', piniaAccount)
});
$sktpvt.on('PedidoCreado', (param) => {
  if(piniaAccount.account.id == param._created_by){
    orders.value.push(param)
  }
  console.log(`${param.user.nick} creo el pedido ${param.id} :)`)
})

$sktpvt.on('updOrder', (params) => {
  // console.log(params)
  if(piniaAccount.account.id == params._created_by){
    let inx = orders.value.findIndex(e => e.id == params.id)
    orders.value[inx].state = params.state
    orders.value[inx]._state = params._state
  }
  console.log(`${params.user.nick} termino el pedido ${params.id} :)`)
})
const anexo = ref({
  state: false,
  val: null
})
const wndOrder = ref(false)
const client = ref({
  state: true,
  val: null,
  opts: [],
  filter: []
})
const Anex = ref({
  state: false,
  val: null
})
const orders = ref(null)
const table = ref({
  columns: [
    { id: 'id', name: 'id', label: 'ID', field: row => row.id },
    { id: 'client', name: 'client', label: 'CLIENTE', field: row => row.name },
    { id: 'state', name: 'state', label: 'Estado', field: row => row.state.name, align: 'center', },
    { id: 'created', name: 'created', label: 'Realizo', field: row => row.user.nick },
    { id: 'date', name: 'date', label: 'Fecha', field: row => dayjs(row.created_at).format('YYYY-MM-DD HH:mm A') }
  ],
  filter: '',
  pagination:{rowsPerPage:10}
})
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

const init = async () => {
  $q.loading.show({ message: 'Cargando...' });

  const resp = await pvtpi.index()
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp);
    client.value.opts = resp.clients
    orders.value = resp.preorders
    $q.loading.hide();
  }
}

const newOrder = () => {
  wndOrder.value = true
}


const createValue = (val, done) => {
  if (val.length > 2) {
    if (!client.value.opts.includes(val)) {
      done(val, 'add-unique')
    }
  }
}

const viewCli = () => {
  let data
  if (client.value.state == false) {
    let inx = client.value.opts.findIndex(e => e.barcode == client.value.val);
    console.log(inx);
    if (inx >= 0) {
      console.log(client.value.opts[inx]);
      data = {
        _client: client.value.opts[inx].id,
        name: client.value.opts[inx].name
      }

      createdOrder(data);
    } else {
      $q.notify({ message: "No existe el cliente", type: 'negative', position: 'center' })
      client.value.val = null;
    }
  } else {
    data = {
      _client: typeof (client.value.val) === 'string' ? 0 : client.value.val.id,
      name: typeof (client.value.val) === 'string' ? client.value.val : client.value.val.name,
    }
    createdOrder(data)
  }
}


const createdOrder = async (data) => {

  console.log(data)

  const resp = await pvtpi.create(data);
  if (resp.error) {
    $q.notify({
      message: `${resp.error}`,
      type: 'negative',
      position: 'center'
    })
  } else {
    $q.notify({
      message: `El Pedido ${resp.id} se creo`,
      type: 'positive',
      position: 'center'
    })
    $sktpvt.emit('CreacionPedido', resp)
    $router.push(`/store/${piniaAccount.join}/preorders/pedidos/${resp.id}/`);
  }
}

const filterFn = (val, update) => {
  update(() => {
    if (val === '') {
      client.value.filter = client.value.opts
    }
    else {
      const needle = val.toLowerCase()
      client.value.filter = client.value.opts.filter(
        v => v.name.toLowerCase().indexOf(needle) > -1
      )
    }
  })
}

const verifiedOrder = (item) => {
  // console.log(item);
  if (item._state > 1 && item._state < 8) {
    console.log('creacion de anexo')
    anexo.value.state = true
    anexo.value.val = item
  } else if (item._state = 1 && item._created_by == piniaAccount.account.id) {
    $router.push(`/store/${piniaAccount.join}/preorders/pedidos/${item.id}/`);
  }
}

const createdAnexo = async (data) => {
  console.log(data)
  const resp = await pvtpi.createAnexo(data);
  console.log(resp)
  if (resp.error) {
    $q.notify({
      message: `${resp.error}`,
      type: 'negative',
      position: 'center'
    })
  } else {
    $q.notify({
      message: `El Anexo ${resp.id} se creo de el pedido ${data.id}`,
      type: 'positive',
      position: 'center'
    })
    $sktpvt.emit('CreacionPedido', resp)
    $router.push(`/store/${piniaAccount.join}/preorders/pedidos/${resp.id}/`);
  }
}

const newAnexo = async () => {

  $q.loading.show({ message: 'Cargando Pedido' });
  const resp = await pvtpi.getOrder(Anex.value.val)
  console.log(resp);
  if (resp.error) {
    console.log(resp.error.response.status)
    console.log(resp.error.response.data)
    $q.notify({
      message: `${resp.error.response.data}`,
      type: 'negative',
      position: 'center'
    })
    $q.loading.hide();
  //   $router.push(`/store/${piniaAccount.join}/preorders/pedidos`)
  } else {
    console.log()
    if (resp.order._state > 1 && resp.order._state < 8) {
    console.log('creacion de anexo')
    anexo.value.state = true
    anexo.value.val = resp.order
  } else  {
    $q.notify({
      message: `El pedido esta en Levantando No se puede crear el anexo`,
      type: 'negative',
      position: 'center'
    })
    Anex.value.state = false
    Anex.value.val = null
  }
    $q.loading.hide();
  }
}


const initPed = (item) => {
  console.log(item.id);
  $router.push(`/store/${piniaAccount.join}/preorders/pedidos/${item.id}/`);
}

init()
</script>

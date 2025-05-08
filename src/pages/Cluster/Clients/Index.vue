<template>
  <q-page padding>
    <div class="bg-white">

      <div class="q-pa-sm row items-center text-center text-h6">
        <div @click="$router.push('/')"> <q-icon size="30px" name="arrow_back" /></div>
        <div class="col anek-bld text-grey-9 q-pl-sm">Clientes</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
          <q-btn flat rounded icon="add" @click="newClient.state = !newClient.state" />

        </div>
      </div>
    </div>

    <q-separator spaced inset vertical dark />

    <q-table :rows="clients" :columns="table.columns" :filter="table.filter" @row-click="viewEdit">
      <template v-slot:top-right>
        <q-input filled dense debounce="300" v-model="table.filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>

    <q-dialog v-model="newClient.state">
      <viewClient :client="newClient.val" :types="types" :rates="rates" :state="states" :edit="newClient.edit"
        :clients="clients" @onReset="handleReset" @EditClient="editClient" @AddingClient="AddingClient" />
    </q-dialog>

    <q-dialog v-model="editMos.state" persistent>
      <q-card>
        <q-card-section class="text-h6">
          Cliente <span class="text-bold"> {{ editMos.val.res.name }} </span> actualizado
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col">
              <div class="text-center text-bold">Replicacion Exitosa</div>
              <q-separator spaced inset vertical dark />
              <q-list bordered v-for="(goal, index) in editMos.val.goals" :key="index">
                <q-item>
                  <q-item-section avatar>
                    <q-icon color="primary" name="store" />
                  </q-item-section>
                  <q-item-section>{{ goal.Sucursal }}</q-item-section>
                </q-item>
              </q-list>

            </div>
            <q-separator spaced inset vertical dark />
            <div class="col">
              <div class="text-center text-bold">Replicacion Fallida</div>
              <q-separator spaced inset vertical dark />
              <q-list bordered v-for="(fail, index) in editMos.val.fails" :key="index">
                <q-item clickable v-ripple @click="replyClient(fail)">
                  <q-item-section avatar>
                    <q-icon color="primary" name="store" />
                  </q-item-section>
                  <q-item-section>{{ fail.Sucursal }}</q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Salir" color="primary" :disable="editMos.val.fails.length > 0"  @click="editMos.state = !editMos.state; editMos.val = null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>



  </q-page>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'

import { useRoute, useRouter } from 'vue-router';
import viewClient from 'components/Clients/viewClent.vue'
import { layoutCluster } from 'stores/layoutCluster'
import dayjs from 'dayjs';
import clientApi from 'src/API/ClientsApi.js'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'stores/Account';
import PreordersApi from 'src/API/PreordersApi.js';
import Accounts from 'src/API/Accounts';
import { vizmedia } from "boot/axios"
import EditProduct from 'src/components/Restock/EditProduct.vue';

const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();
const layout = layoutCluster()

const editMos = ref({
  state: false,
  val: null,
  edit:false
})

const newClient = ref({
  state: false,
  edit: false,
  val: {
    id: null,
    fs_id: null,
    RFC: null,
    address: {
      DOM: null,
      CP: null,
      COL: null,
      MUN: null
    },
    celphone: null,
    barcode: null,
    payment: null,
    mail: null,
    rate: null,
    type: null,
    state: null
  }
})


const table = ref({
  columns: [
    { name: "id", label: "ID", field: r => r.id, align: 'center' },
    { name: "fs_id", label: "FS_ID", field: r => r.fs_id, align: 'center' },
    { name: "name", label: "NOMBRE", field: r => r.name, align: 'left' },
    // {name:"barcode",label:"CODIGO BARRAS",field:r => r.barcode, align:'left'},
    { name: "rate", label: "TARIFA", field: r => r.rate.name, align: 'left' },
    { name: "state", label: "ESTADO", field: r => r.state.name, align: 'left' },
    { name: "type", label: "TIPO", field: r => r.type.name, align: 'left' },
  ],
  filter: ""
})
const clients = ref([]);
const types = ref([]);
const rates = ref([]);
const states = ref([])

const init = async () => {
  $q.loading.show({ message: 'Obteniendo datos' })
  const resp = await clientApi.getClients();
  if (resp.error) {
    console.log(resp);
  } else {
    clients.value = resp.clients;
    types.value = resp.types;
    rates.value = resp.rates;
    states.value = resp.state;
    $q.loading.hide();
    console.log(resp);
  }
}

const viewEdit = (a, b) => {
  console.log(b);
  newClient.value.state = true
  newClient.value.edit = true
  newClient.value.val = b
}

const handleReset = () => {
  newClient.value = {
    state: false,
    edit: false,
    val: {
      id: null,
      fs_id: null,
      RFC: null,
      address: {
        DOM: null,
        CP: null,
        COL: null,
        MUN: null
      },
      celphone: null,
      barcode: null,
      payment: null,
      mail: null,
      rate: null,
      type: null,
      state: null
    }
  }
}

const editClient = (resp) => {
  let inx = clients.value.findIndex(c => c.id == resp.res.id);
  if (inx >= 0) {
    clients.value[inx] = resp.res
    handleReset();
    editMos.value.edit = true;
    editMos.value.state = true;
    editMos.value.val = resp

  }
}

const AddingClient = (resp) => {
  let inx = clients.value.findIndex(c => c.id == resp.res.id);
  if (inx < 0) {
    clients.value.push(resp.res)
    handleReset();
    editMos.value.state = true;
    editMos.value.val = resp
  }
}

const replyClient = async (client) => {
  client.edit = editMos.value.edit;
  console.log(client)
  const resp = await clientApi.syncCli(client);
  if(resp.error){
    console.log(resp)
  }else{
    if(resp.state){
      let inx = editMos.value.val.fails.findIndex(e => e.id == client.IdSucursal)
      editMos.value.val.fails.splice(inx,1);
      editMos.value.val.goals.push(client)
    }else{
      $q.notify({messasge:'Hubo error al querer sincronizar',type:'negative',position:'center'})
    }
  }
}


init();
layout.setTitle('Clientes')

const confirmExit = (e) => {
  if (editMos.value.state && editMos.value.val?.fails?.length > 0) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', confirmExit)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', confirmExit)
})
</script>

<template>
  <q-page padding>
    <div class="bg-white">

      <div class="q-pa-sm row items-center text-center text-h6">
        <div @click="$router.push('/cluster/usuarios')"> <q-icon size="30px" name="arrow_back" /></div>
        <div class="col anek-bld text-grey-9 q-pl-sm">Cajas</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />

        </div>
      </div>
    </div>
    <q-separator spaced inset vertical dark />
    <q-table :rows="stores" row-key="name" grid :filter="table.filter" :pagination="table.pagination"
      :columns="table.columns" v-if="stores.length > 0">

      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="table.filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card class="my-card" bordered flat>
            <q-card-section>
              <div class="text-h6">{{ props.row.name.toUpperCase() }}</div>
              <div class="text-subtitle2">Id: {{ props.row.id }}</div>
            </q-card-section>
            <q-card-actions align="center">
              <q-btn color="primary" icon="add" flat
                @click="mosCash.state = !mosCash.state; mosCash.val._store = props.row.id" />
              <q-space />
              Cajas: {{ props.row.cash.length }}
              <q-space />
              <q-btn color="primary" round flat dense :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                @click="props.expand = !props.expand" />
            </q-card-actions>
            <q-slide-transition>
              <div v-show="props.expand">
                <q-separator />
                <q-card-section class="text-subtitle2" v-for="(cash, index) in props.row.cash" :key="index">
                  <q-list dense>
                    <q-item clickable v-ripple @click="mosCashier(cash)">
                      <q-item-section>
                        <q-item-label overline> {{ cash.name }}</q-item-label>
                        <q-item-label caption> {{ cash.state.name }}</q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption class="text-bold"> {{ cash.created_at }} </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </div>
            </q-slide-transition>
          </q-card>
        </div>
      </template>
    </q-table>

  </q-page>



  <q-dialog v-model="mosCash.state" persistent>
    <q-card>
      <q-card-section class="text-center text-bold text-h6">
        {{ mosCash.edit ? 'Editar Caja' : 'Agregar Caja' }}
      </q-card-section>
      <q-card-section>
        <q-input v-model="mosCash.val.name" type="text" label="Nombre" filled />
        <q-separator spaced inset vertical dark />
        <!-- <q-input v-model="mosCash.val.state.name" type="text" label="Estado" filled />
        <q-separator spaced inset vertical dark /> -->
        <!-- <q-select v-model="mosCash.val.type" :options="types" label="Tipo" filled option-label="name" />
        <q-separator spaced inset vertical dark /> -->
        <q-select v-model="mosCash.val.tpv" :options="tpvs" label="Punto de Venta" filled option-label="name" />
        <q-separator spaced inset vertical dark />
        <q-select v-model="mosCash.val.document" :options="documents" label="Serie" filled option-label="name" />
        <!-- <q-separator spaced inset vertical dark />
        <q-select v-model="mosCash.val.store" :options="documents" label="Serie" filled option-label="name" /> -->
      </q-card-section>
      <q-card-actions align="center">
        <q-btn flat icon="close" color="negative" @click="reset" />
        <q-btn flat :icon="mosCash.edit ? 'edit' : 'send'" :color="mosCash.edit ? 'yellow' : 'positive'"
          @click="send" />
        <!-- <q-btn v-if="mosCash.edit" flat icon="delete" color="negative" @click="deleteCash" /> -->
      </q-card-actions>
    </q-card>
  </q-dialog>








</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import cashApi from 'src/API/cashApi.js'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'stores/Account';
import PreordersApi from 'src/API/PreordersApi.js';
import Accounts from 'src/API/Accounts';

const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();

const mosCash = ref({
  state: false,
  edit: false,
  val: {
    id: null,
    name: null,
    tpv: null,
    document: null,
    state: null,
    terminal: null,
    _store:null
  }
})
const stores = ref([])
const states = ref([])
const tpvs = ref([])
const documents = ref([]);
const table = ref({
  filter: '',
  pagination: { rowsPerPage: 0 },
  columns: [
    { id: 'id', name: 'id', label: 'ID', field: row => row.id },
    { id: 'name', name: 'name', label: 'Nombre', field: row => row.name },
    { id: 'cashier', name: 'cashier', label: 'Cajas', field: row => row.cash?.length }
  ]
})

const init = async () => {
  $q.loading.show({message:'Obteniendo datos'})
  const resp = await cashApi.index()
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp)
    stores.value = resp.stores
    states.value = resp.state
    tpvs.value = resp.tpv
    documents.value = resp.documents
    $q.loading.hide();
  }
}

const mosCashier = (print) => {
  mosCash.value.state = true
  mosCash.value.val = print
  mosCash.value.edit = true
}

const send = async () => {
  $q.loading.show({message:mosCash.value.edit ? 'Editando Caja':'Agregando Caja'})
  console.log(mosCash.value.val)
  const resp = await cashApi.editCash(mosCash.value.val)
  console.log(resp)
  if(resp.error){
    console.log(resp)
  }else{
    let inx = stores.value.find(e => e.id == resp._store).cash.findIndex(e => e.id == resp.id)
    if(inx >= 0){
      stores.value.find(e => e.id == resp._store).cash[inx] = resp;
      $q.notify({message:'Se edito correctamente', type:'positive', position:'center'})
      reset()
    }else{
      stores.value.find(e => e.id == resp._store).cash.push(resp);
      $q.notify({message:'Se agrego correctamente', type:'positive', position:'center'})
      reset()
    }
    $q.loading.hide();
  }
}

// const deleteCash = () => {

// }


const reset = () => {
  mosCash.value = {
    state: false,
    edit: false,
    val: {
      id: null,
      name: null,
      tpv: null,
      document: null,
      state: null,
      terminal: null,
      _store:null
    }
  }
}

init()
</script>

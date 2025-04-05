<template>
  <q-page padding>
    <div class="bg-white">

      <div class="q-pa-sm row items-center text-center text-h6">
        <div @click="$router.push('/cluster/usuarios')"> <q-icon size="30px" name="arrow_back" /></div>
        <div class="col anek-bld text-grey-9 q-pl-sm">Impresoras</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />

        </div>
      </div>
    </div>
    <q-separator spaced inset vertical dark />
    <q-table :rows="sucursales" row-key="name" grid :filter="table.filter" :pagination="table.pagination"
      :columns="table.columns" v-if="sucursales.length > 0">

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
              <q-btn color="primary" icon="add" flat @click="mosPrint.state = !mosPrint.state; mosPrint.val._store = props.row.id" />
              <q-space />
              Impresoras: {{ props.row.prints.length }}
              <q-space />
              <q-btn color="primary" round flat dense :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                @click="props.expand = !props.expand" />
            </q-card-actions>
            <q-slide-transition>
              <div v-show="props.expand">
                <q-separator />
                <q-card-section class="text-subtitle2" v-for="(print, index) in props.row.prints" :key="index">
                  <q-list dense>
                    <q-item clickable v-ripple @click="mosPrinter(print)">
                      <q-item-section>
                        <q-item-label overline> {{ print.name }}</q-item-label>
                        <q-item-label caption> {{ print.type.name }}</q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption class="text-bold"> {{ print.ip_address }} </q-item-label>
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



    <q-dialog v-model="mosPrint.state" persistent>
      <q-card>
        <q-card-section class="text-center text-bold text-h6">
          {{ mosPrint.edit ? 'Editar Impresora' : 'Agregar Impresora' }}
        </q-card-section>
        <q-card-section>
          <q-input v-model="mosPrint.val.name" type="text" label="Nombre" filled />
          <q-separator spaced inset vertical dark />
          <q-input v-model="mosPrint.val.ip_address" type="text" label="Ip" filled>
            <template v-slot:append>
              <q-btn color="primary" icon="sensors" @click="ping" flat
                :disable="mosPrint.val.ip_address == '' ? true : false" />
            </template>
          </q-input>
          <q-separator spaced inset vertical dark />
          <q-select v-model="mosPrint.val.type" :options="types" label="Tipo" filled option-label="name" />
          <q-separator spaced inset vertical dark />
        </q-card-section>
        <q-card-actions align="center" >
          <q-btn flat icon="close" color="negative" @click="reset" />
          <q-btn flat :icon="mosPrint.edit ? 'edit' : 'send'" :color="mosPrint.edit ? 'yellow' : 'positive'" @click="send" />
          <q-btn v-if="mosPrint.edit" flat icon="delete" color="negative" @click="deletePrint" />
        </q-card-actions>
      </q-card>
    </q-dialog>


  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import printApi from 'src/API/PrintApi.js'
import { $sktpvt } from 'boot/socket'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'stores/Account';
import Accounts from 'src/API/Accounts';
const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();


const mosPrint = ref({
  val: {
    id:null,
    name: null,
    ip_address: null,
    type: null,
    _store: null,
    _port: 9100
  },
  state: false,
  edit: false
})

const types = ref([]);


const sucursales = ref([]);
const table = ref({
  filter: '',
  pagination: { rowsPerPage: 12 },
  columns: [
    { id: 'id', name: 'id', label: 'ID', field: row => row.id },
    { id: 'name', name: 'name', label: 'Nombre', field: row => row.name },
    { id: 'prints', name: 'prints', label: 'Impresoras', field: row => row.prints?.length }
  ]
})

const init = async () => {
  const resp = await printApi.index()
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp);
    sucursales.value = resp.printer
    types.value = resp.types
  }
}

const mosPrinter = (print) => {
  mosPrint.value.state = true
  mosPrint.value.val = print
  mosPrint.value.edit = true
}

const reset = () => {
  mosPrint.value = {
    val: {
      id:null,
      name: null,
      ip_address: null,
      type: null,
      _store: null,
      _port: 9100
    },
    state: false
  }
}

const ping = async () => {
  $q.loading.show({ message: 'Probando Conexion' })
  const resp = await printApi.testPrint(mosPrint.value.val);
  if (resp.error) {
    console.log(resp.error.data)
    $q.notify({ message: resp.error.data, type: 'negative', position: 'center' })
    $q.loading.hide();
  } else {
    console.log(resp)
    $q.notify({ message: resp, type: 'positive', position: 'center' })
    $q.loading.hide();
  }
}


const send = async () => {
  $q.loading.show({message:mosPrint.value.edit ? 'Editando Impresora':'Agregando Impresora'})
  console.log(mosPrint.value.val)
  const resp = await printApi.editPrint(mosPrint.value.val)
  if(resp.error){
    console.log(resp)
  }else{
    let inx = sucursales.value.find(e => e.id == resp._store).prints.findIndex(e => e.id == resp.id)
    if(inx >= 0){
      sucursales.value.find(e => e.id == resp._store).prints[inx] = resp;
      $q.notify({message:'Se edito correctamente', type:'positive', position:'center'})
      reset()
    }else{
      sucursales.value.find(e => e.id == resp._store).prints.push(resp);
      $q.notify({message:'Se agrego correctamente', type:'positive', position:'center'})
      reset()
    }
    $q.loading.hide();
  }
}

const deletePrint = async () => {
  console.log(mosPrint.value.val)
  $q.loading.show({message:'Eliminando Impresora'})
  const resp = await printApi.deletePrint(mosPrint.value.val)
  if(resp.error){
    console.log(resp)
  }else{
    let inx = sucursales.value.find(e => e.id == mosPrint.value.val._store).prints.findIndex(e => e.id == mosPrint.value.val.id)
    if(inx >= 0){
      sucursales.value.find(e => e.id == mosPrint.value.val._store).prints.splice(inx,1);
      $q.notify({message:'Se elimino la Impresora',type:'positive',position:'center'})
      $q.loading.hide()
      reset();
    }
  }
}

init()

</script>

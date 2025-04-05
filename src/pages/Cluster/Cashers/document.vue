<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div class="col anek-bld text-grey-9 q-pl-sm">Series</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
          <q-btn flat rounded icon="add" @click="addDcm.state = !addDcm.state;" />
        </div>
      </div>
    </div>

    <q-list bordered>
      <q-item>
        <q-item-section>ID</q-item-section>
        <q-item-section>Nombre</q-item-section>
        <q-item-section>SERIE</q-item-section>
      </q-item>
    </q-list>
    <q-list bordered v-for="(document, index) in documents" :key="index">
      <q-item clickable v-ripple @click="editSerie(document)">
        <q-item-section>{{ document.id }}</q-item-section>
        <q-item-section>{{ document.name }}</q-item-section>
        <q-item-section>{{ document.serie }}</q-item-section>
      </q-item>
    </q-list>
  </q-page>
  <q-dialog v-model="addDcm.state" persistent>
    <q-card>
      <q-card-section class="row items-center">
        {{ addDcm.edit ? 'Editar Documento' : 'Agregar Documento' }}
      </q-card-section>
      <q-card-section>
        <q-input v-model="addDcm.val.name" type="text" label="Nombre" filled />
        <q-separator spaced inset vertical dark />
        <q-select v-model="addDcm.val.serie" :options="series" label="Serie" filled
          :option-disable="item => documents.some(e => e.serie == item)" />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn flat icon="close" color="negative" @click="reset" />
        <q-btn flat :icon="addDcm.edit ? 'edit' : 'send'" :color="addDcm.edit ? 'yellow' : 'positive'" @click="send" />
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

const documents = ref([]);
const addDcm = ref({
  val: {
    id: null,
    name: null,
    serie: null
  },
  state: false,
  edit: false
})
const series = ref([1, 2, 3, 4, 5, 6, 7, 8, 9]) //conforme avance la aplicacion se podran agregar mas series P:

const init = async () => {
  $q.loading.show({ message: 'Obteniendo Registros' })
  const resp = await cashApi.getDocument()
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp);
    documents.value = resp
    $q.loading.hide();
  }
}


const send = async () => {
  console.log(addDcm.value.val);
  $q.loading.show({ message: 'Enviando Datos' })
  const resp = await cashApi.editDocument(addDcm.value.val)
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp)
    let inx = documents.value.findIndex(e => e.id == resp.id);
    if (inx >= 0) {
      documents.value[inx] = resp
      $q.notify({ message: 'Se Actualizo Correctamente', position: 'center', type: 'positive' })
      reset()
    } else {
      documents.value.push(resp);
      $q.notify({ message: 'Se Inserto Correctamente', position: 'center', type: 'positive' })
      reset()
    }
    $q.loading.hide();
  }

}



const editSerie = (documents) => {
  addDcm.value.val = documents
  addDcm.value.state = true
  addDcm.value.edit = true
}
const reset = () => {
  addDcm.value = {
    val: {
      id: null,
      name: null,
      serie: null
    },
    state: false,
    edit: false
  }
}

const deleteDocument = () => {

}

init()
</script>

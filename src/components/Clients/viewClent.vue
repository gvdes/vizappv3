<template>

  <q-card class="my-card" style="width: 450px" v-if="editClient">
    <q-card-section class="text-center">
      <div class="text-h5 text-bold"> {{ edit ? 'Edicion Cliente' : 'Agregar Cliente' }} </div>
    </q-card-section>
    <q-card-section>
      <q-input v-model="editClient.name" type="text" label="Nombre" filled />
      <q-separator spaced inset vertical dark />
      <q-input v-model="address.DOM" type="text" label="Calle" filled />
      <q-separator spaced inset vertical dark />
      <div class="row">
        <q-input class="col" v-model="address.CP" type="number" label="Codigo Postal" filled />
        <q-separator spaced inset vertical dark />
        <q-input class="col" v-model="address.COL" type="text" label="Colonia" filled />
      </div>
      <q-separator spaced inset vertical dark />
      <q-input v-model="address.MUN" type="text" label="Municipio" filled />
      <q-separator spaced inset vertical dark />
      <q-input v-model="editClient.phone" type="number" label="Telefono" filled />
      <q-separator spaced inset vertical dark />
      <q-input v-model="editClient.celphone" type="number" label="Celular" filled :error="existCel"
        error-message="El numero ya esta registrado" />
      <q-separator spaced inset vertical dark />
      <q-input v-model="editClient.mail" type="text" label="Correo" filled :error="existMail"
        error-message="El correo ya esta registrado" />
    </q-card-section>
    <q-card-section>
      <q-select v-model="editClient.type" :options="types" label="Tipo" filled option-label="name" />
      <q-separator spaced inset vertical dark />
      <q-select v-model="editClient.rate" :options="rates" label="Precio" filled option-label="name" />
      <q-separator spaced inset vertical dark />
      <q-select v-model="editClient.state" :options="state" label="Estado" filled option-label="name" />
    </q-card-section>


    <q-card-actions align="right">
      <q-btn flat color="negative" icon="close" @click="onReset" />
      <q-btn flat color="positive" icon="check" @click="onSubmit" :disable="!validForm" />
    </q-card-actions>
  </q-card>


</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import viewClient from 'components/Clients/viewClent.vue'
import dayjs from 'dayjs';
import clientApi from 'src/API/ClientsApi.js'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'stores/Account';
import PreordersApi from 'src/API/PreordersApi.js';
import Accounts from 'src/API/Accounts';
import { vizmedia } from "boot/axios"




const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();

const address = ref({})

const editClient = ref(null)
const emit = defineEmits(['onReset', 'EditClient', 'AddingClient']);

const props = defineProps({
  client: { type: Object, default: {} },
  clients: { type: Array, default: [] },
  edit: { type: Boolean, default: false },
  types: { type: Array, default: [] },
  rates: { type: Array, default: [] },
  state: { type: Array, default: [] }
})





const existCel = computed(() => {
  const cel = editClient.value.celphone;
  if (!cel || cel.length === 0) return false;

  return props.clients
    .filter(e => e.id !== editClient.value.id)
    .some(e => e.celphone === cel);
})
const existMail = computed(() => {
  const mail = editClient.value.mail;
  if (!mail || mail.length === 0) return false;

  return props.clients
    .filter(e => e.id !== editClient.value.id)
    .some(e => e.mail === mail);
})


const validForm = computed(() =>
  editClient.value.name &&
  editClient.value.celphone &&
  editClient.value.mail &&
  editClient.value.rate &&
  editClient.value.type &&
  editClient.value.state &&
  !existCel.value &&
  !existMail.value)
// const existName = computed(() => {
//   const name = editClient.value.name;
//   if (!name || name.length === 0) return false;

//   return props.clients
//     .filter(e => e.id !== editClient.value.id)
//     .some(e => e.name === name);
// })

// const modifyCli = computed(() => JSON.stringify(props.client) == JSON.stringify(editClient.value))


const onSubmit = async () => {
  console.log(editClient.value)
  $q.loading.show({ message: props.edit ? 'Editando Cliente' : 'Agregando Cliente' })
  const resp = await clientApi.editClient(editClient.value)
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp)
    if (props.edit) {
      emit('EditClient', resp)
    } else {
      emit('AddingClient', resp)
    }
    $q.loading.hide()
  }
}


const onReset = () => {
  emit('onReset');
}


onMounted(() => {
  address.value = props.edit ? JSON.parse(props.client.address) : props.client.address
  props.client.address = address.value;
  editClient.value = { ...props.client }
})


</script>

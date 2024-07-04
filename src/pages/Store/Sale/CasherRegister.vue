<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div class="col anek-bld text-grey-9 q-pl-sm">Cajas</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
        </div>
      </div>
    </div>

    <q-separator spaced inset vertical dark />

    <q-table
      :rows="cash"
      :columns="table.columns"
      row-key="name"
      grid
      @row-click="mosPer"
    />
  </q-page>

  <q-dialog v-model="caj.state" persistent>
    <q-card>
      <q-card-section class="text-center">
        <div class="text-bold text-center"> Edicion {{ caj.val.id }}   {{ caj.val.name }}</div>
      </q-card-section>
      <q-card-section class="text-center">
        <div class="text-bold">Cajero : {{ caj.val.cashier.user.name }}</div>
        <q-separator spaced inset vertical dark />
        <div class="text-bold">Estado : {{ caj.val.state.name }}</div>
        <q-separator spaced inset vertical dark />
        <div class="text-bold">Impresora : {{ caj.val.cashier.printer.name }}</div>
        <q-separator spaced inset vertical dark />
        <div class="text-bold">Impresora : {{ caj.val.cashier.initial_cash }}</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="negative" v-close-popup />
        <q-btn flat label="Activar" color="positive" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="inf.state" persistent>
    <q-card>
      <q-card-section class="text-center">
        <div class="text-bold text-center">Apertura {{ inf.val.id }}   {{ inf.val.name }}</div>
      </q-card-section>
      <q-card-section class="text-center">
        <q-select v-model="cash_cashier._cashier" :options="cashier" option-label="name" label="Cajero" filled />
        <q-separator spaced inset vertical dark />
        <q-select v-model="cash_cashier._state" :options="state" label="Estado" option-label="name" filled />
        <q-separator spaced inset vertical dark />
        <q-select v-model="cash_cashier._printer" :options="printers" label="Impresora" option-label="name" filled />
        <q-separator spaced inset vertical dark />
        <q-input v-model="cash_cashier.initial_cash" type="number" label="Saldo Inicial" filled />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="negative" v-close-popup />
        <q-btn flat label="Activar" color="positive" v-close-popup />
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

const cash = ref([])
const caj = ref({
  state:false,
  val:null,
});
const state = ref([]);
const cashier = ref([]);
const printers = ref([])
const cash_cashier = ref({
  _cashier:null,
  _state:null,
  _printer:null,
  initial_cash:5000,
})
const inf = ref({
  state:false,
  val:null
})


const table = ref({
  columns:[
    {name:'Id', label:'ID', field: row => row.id},
    {name:'terminal', label:'Terminal', field: row => row.terminal},
    {name:'name', label:'Nombre', field: row => row.name},
    {name:'state', label:'Estado', field: row => row.state.name},
    {name:'cashier', label:'Cajero', field: row => row.cashier?.user?.name},
  ]
})

const init = async () => {
  const resp = await cashApi.getCash();
  console.log(resp);
  if(resp.error){
    console.log(resp)
  }else{
    cash.value = resp.cash
    cashier.value = resp.cashier
    state.value = resp.state
    printers.value = resp.printers
  }
}

const mosPer = (a,b) => {
  console.log(b);
  if(b._state == 1){
    caj.value.state = true
    caj.value.val = b
  }else{
    inf.value.state = true;
    inf.value.val = b
  }
}





init();
</script>

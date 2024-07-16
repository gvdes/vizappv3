<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div class="col anek-bld text-grey-9 q-pl-sm">Cajas</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
          <q-btn flat rounded icon="atm" @click="openAuto" />
        </div>
      </div>
    </div>

    <q-separator spaced inset vertical dark />

    <q-table
      :rows="cash"
      :columns="table.columns"
      row-key="name"
      grid
      hide-bottom
      :pagination="table.pagination"
      @row-click="MosCash"
      />
  </q-page>
  <q-dialog v-model="openBox.state" persistent>
    <q-card>
      <q-card-section class="flex justify-center">
        <q-icon name="store" size="xl" color="primary" />
      </q-card-section>
      <q-card-section class="text-center text-bold">
      Apertura de terminal {{ openBox.val.id  }} ({{ openBox.val.name }})
      </q-card-section>
      <q-card-section>
        <q-form
          @submit="openignBox"
          @reset="reset"
          class="q-gutter-md"
        >
        <q-select v-model="cash_cashier._cashier" :options="cashier" label="Cajero" filled option-label="name" option-value="id" dense/>
        <q-select v-model="cash_cashier._printer" :options="printers" label="Impresora" filled option-label="name" option-value="id" dense/>
        <q-input v-model="cash_cashier.initial_cash" type="number"  label="Efectivo Inicial" filled  dense/>
          <div>
            <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm" text-color="negative" v-close-popup />
            <q-btn label="Abrir" type="submit" color="primary" flat text-color="positive" :disable="!validOpening"  />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="automate.state" full-width>
    <q-card >
      <q-card-section class="flex justify-center">
        <q-icon name="atm" size="xl" />
      </q-card-section>
      <q-card-section>
        <div class="text-bold text-center text-subtitle1">Agrega  aperturas en automatico</div>
      </q-card-section>
      <q-card-section horizontal >
        <q-separator spaced inset vertical dark />
        <q-select class="col" v-model="automate.val._cash" :options="cash" label="Caja" option-label="name" filled dense />
        <q-separator spaced inset vertical dark />
        <q-select class="col"  v-model="automate.val._cashier" :options="cashier" label="Cajero" option-label="name" filled  dense/>
        <q-separator spaced inset vertical dark />
        <q-select class="col"  v-model="automate.val._printer" :options="printers" label="Impersora" option-label="name" filled dense />
        <q-separator spaced inset vertical dark />
        <q-input v-model="automate.val.initial_cash" type="number" label="Saldo Inicial" filled dense />
        <q-separator spaced inset vertical dark />
        <q-btn color="primary" icon="add" rounded flat @click="addAutomate" />
        <q-separator spaced inset vertical dark />
      </q-card-section>
      <q-card-section>
        <div class="text-bold text-center text-subtitle1">Quita aperturas en automatico</div>
      </q-card-section>

        <q-card-section >
          <q-list bordered>
            <q-item>
              <q-item-section  >
                Caja
              </q-item-section>
              <q-item-section>
               Cajero
              </q-item-section>
              <q-item-section>
                Impresora
              </q-item-section>
              <q-item-section>
               Saldo Inicial
              </q-item-section>
              <q-item-section class="text-center">
                Accion
              </q-item-section>
            </q-item>
            <q-separator   />
            <q-item  v-for="(auts, index) in automate.values" :key="index">
              <q-item-section  >
                {{ auts.cash.name }}
              </q-item-section>
              <q-item-section>
                {{ auts.user.name }}
              </q-item-section>
              <q-item-section>
                {{ auts.printer.name }}
              </q-item-section>
              <q-item-section>
                {{ auts.initial_cash}}
              </q-item-section>
              <q-item-section>
                <q-btn color="negative" icon="delete" rounded flat @click="deleteAutomate(auts)" />
              </q-item-section>
            </q-item>
          </q-list>
      </q-card-section>
      <q-card-section>
        <div class="row">

        </div>
      </q-card-section>

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
const openBox = ref({
  state:false,
  val:null,
});
const automate = ref({
  state:false,
  val:{
    _cash:null,
    _cashier:null,
    _printer:null,
    initial_cash:5000
  },
  values:[]
})
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
  ],
  pagination:{rowsPerPage:[0]}
})

const validOpening = computed(() => {
  if(cash_cashier.value._cashier && cash_cashier.value._printer && cash_cashier.value.initial_cash){
    return true
  }else{
    return false
  }
})

const init = async () => {
  const resp = await cashApi.getCash();
  // console.log(resp);
  if(resp.error){
    console.log(resp)
  }else{
    console.log(resp)
    cash.value = resp.cash
    cashier.value = resp.cashier
    state.value = resp.state
    printers.value = resp.printers
    automate.value.values = resp.automate
  }
}
const MosCash = (a,b) => {
  if(b.state.id == 2){
    console.log('Apertura de caja');
    openBox.value.state = true
    openBox.value.val = b
  }else{
    console.log('edicion de caja')
  }
}

const openignBox = async() => {
  $q.loading.show({message:'Abriendo Caja'})
  cash_cashier.value._cash = openBox.value.val.id
  console.log(cash_cashier.value)
  const resp = await cashApi.openCash(cash_cashier.value)
  if(resp.error){
    console.log(resp)
  }else{
    let inx = cash.value.findIndex(e => e.id == resp.id)
    console.log(inx);
    cash.value[inx] = resp
    openBox.value.state = false
    $q.notify({
      type:'positive',
      position:'center',
      message:`${openBox.value.val.name} Abierta correctamente :) `
    })
    $q.loading.hide()

    console.log(resp)
  }

}
const reset = () => {
   cash_cashier.value = {
  _cashier:null,
  _state:null,
  _printer:null,
  initial_cash:5000,
}
}
const openAuto = () => {
  console.log('inicio automatico');
  automate.value.state = true;
}
const addAutomate = () => {
  console.log('Agrega automatizacion')
}
const deleteAutomate = (caj) => {
  console.log('quita automatizacion')
  console.log(caj)
}
init();
</script>

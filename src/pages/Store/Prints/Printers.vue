<template>
  <q-page padding>

    <q-table flat  :rows="printers" grid :columns="table.columns" :pagination="table.pagination" @row-click="test" dense hide-bottom />

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


const printers = ref([]);
const types = ref([])

const table = ref({
  columns: [
    { name: 'id', label: 'ID', field: r => r.id },
    { name: 'name', label: 'Nombre', field: r => r.name },
    { name: 'IP', label: 'IP', field: r => r.ip_address },
    { name: 'type', label: 'TIPO', field: r => r.type.name },
  ],
  pagination:{rowsPerPage:0}
})


const init = async () => {
  $q.loading.show({message:'Obteniendo Impresoras'});
  const resp = await printApi.getPrinterStore()
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp);
    printers.value = resp.printer
    types.value = resp.types
    $q.loading.hide()
  }
}

const test = async (a, b) => {
  $q.loading.show({ message: 'Probando Conexion' })
  const resp = await printApi.testPrint(b);
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

init();

</script>

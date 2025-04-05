<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div class="col anek-bld text-grey-9 q-pl-sm">Puntos de Venta</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
          <q-btn flat rounded icon="add" @click="inserTpv.state = !inserTpv.state;" />
        </div>
      </div>
    </div>


    <q-list v-for="(points, index) in tpv" :key="index">
      <q-item clickable v-ripple @click="EditTPV.state = !EditTPV.state; EditTPV.val = points">
        <q-item-section avatar>
          <q-icon color="primary" name="point_of_sale" />
        </q-item-section>
        <q-item-section>{{ points.name }}</q-item-section>
      </q-item>
      <q-separator spaced inset vertical dark />
    </q-list>


  </q-page>

  <q-dialog v-model="inserTpv.state" persistent>
    <tpvForm :tpv="inserTpv.val" :warehouse="warehouse" :clients="clients" :insert="true" @reload="reload" ></tpvForm>
  </q-dialog>

  <q-dialog v-model="EditTPV.state" persistent>
    <tpvForm :tpv="EditTPV.val" :warehouse="warehouse" :clients="clients" :insert="false" @reload="reload" > </tpvForm>
  </q-dialog>

</template>



<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import tpvForm from 'components/Cashers/form.vue'
import dayjs from 'dayjs';
import cashApi from 'src/API/cashApi.js'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'stores/Account';
import PreordersApi from 'src/API/PreordersApi.js';
import Accounts from 'src/API/Accounts';
import { vizmedia } from "boot/axios"

const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();

const clients = ref([]);
const warehouse = ref([]);
const tpv = ref([])
const tab = ref('gene')

const inserTpv = ref({
  state: false,
  val: {
    name: null,
    _client: null,
    _warehouse: null,
    header_ticket: [
      { id: 1, name: 'fiscal_name', val: null },
      { id: 2, name: 'rfc', val: null },
      { id: 3, name: 'dom', val: null },
      { id: 4, name: 'tel', val: null },
      { id: 5, name: 'cel', val: null }
    ],
    footer_ticket: [
      { id: 1, name: 'linea1', val: null },
      { id: 2, name: 'linea2', val: null },
      { id: 3, name: 'linea3', val: null },
      { id: 4, name: 'linea4', val: null },
      { id: 5, name: 'linea5', val: null },
      { id: 6, name: 'linea6', val: null },
      { id: 7, name: 'linea7', val: null },
      { id: 8, name: 'linea8', val: null },
      { id: 9, name: 'linea9', val: null },
    ],
    logo: null
  }
})

const EditTPV = ref({
  state: false,
  val: null
})

const init = async () => {
  $q.loading.show({ message: 'Obteniendo datos' })
  const resp = await cashApi.getTPV();
  if (resp.error) {
    console.error(resp)
  } else {
    console.log(resp)
    tpv.value = resp.tpv
    if (tpv.value.length > 0) {
      tpv.value.forEach(e => obtFile(e))
    }
    clients.value = resp.clients
    warehouse.value = resp.warehouses
    $q.loading.hide()
  }
}
const obtFile = async (tpv) => {
  try {
    const resp = await cashApi.mosFIle(tpv.id);  // Llamamos a la función que usa axios
    console.log(resp);
    if (resp.error) {
      console.error('Error al obtener el archivo:', resp.error);
    } else {
      const blob = resp;  // `resp` es el Blob directamente en este caso

      const file = new File([blob], tpv.logo, { type: blob.type });  // Crea el File a partir del Blob
      console.log(file);
      tpv.logo = [file];  // Asigna el archivo al TPV
      const fileURL = URL.createObjectURL(file);  // Crea una URL temporal para mostrar el archivo
      console.log(fileURL);
      tpv.urlval = fileURL;  // Guarda la URL para poder usarla en el frontend (por ejemplo, en una etiqueta <img>)
    }
  } catch (error) {
    console.error('Error al procesar el archivo de TPV', error);
  }
};

const reload = (a) => {
  window.location.reload();
}


init();
</script>

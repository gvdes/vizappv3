<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div class="bg-white">
          <div class="q-pa-sm row items-center text-center text-h6">
            <div @click="$router.push('/cluster/indicators')"> <q-icon size="30px" name="arrow_back" /></div>
          </div>
        </div>
        <div class="col anek-bld text-grey-9 q-pl-sm">
          <div>Reportes</div>
          <div class="text-caption">{{`Formulario desde ${fechas.from} al ${fechas.to}`}}</div>
        </div>
        <div>
          <q-btn rounded flat  icon="download" title="Descargar Excel" />
          <q-btn rounded flat  icon="event"  title="Fecha" @click="date = !date" />
        </div>
      </div>
    </div>

    <q-separator spaced inset vertical dark />
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <q-select class="col" v-model="filters.storeval" :options="stores" label="Sucursales" filled
            option-label="name">
            <template v-if="filters.storeval" v-slot:append>
              <q-btn round dense flat icon="close" @click="filters.storeval = null" />
            </template>
          </q-select>
          <q-separator spaced inset vertical dark />
          <q-select class="col" v-model="filters.formval" :options="forms" label="Formulario" filled
            option-label="name">
            <template v-if="filters.formval" v-slot:append>
              <q-btn round dense flat icon="close" @click="filters.formval = null" />
            </template>
          </q-select>
        </div>
      </q-card-section>
    </q-card>
    <q-separator spaced inset vertical dark />
    <q-table :columns="table.columns" :rows="responseBascket" @row-click="viewResponseForm" />

    <q-dialog v-model="date">
      <q-card class="my-card">
        <q-card-section>
          <div class="q-pa-md">
            <div class="q-pb-sm">
            </div>
            <q-date v-model="fec" range minimal />
          </div>
        </q-card-section>
        <q-card-section>
          <q-card-actions align="right">
            <q-btn flat icon="close" color="negative" @click="date = !date" />
            <q-btn flat icon="check" color="positive" @click="buscas" />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>


  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAccountStore } from 'stores/Account';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import indpi from 'src/API/IndicatorApi';
import pdf from 'src/PDF/Indicators/userclass.js';
import dayjs from 'dayjs';
import { vizmedia } from 'boot/axios'
import { Column } from 'jspdf-autotable';
const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();


const today = new Date();
const date = ref(false);
const fec = ref(null);


const fechas = ref({
  to:dayjs(today.value).format("YYYY/MM/DD"),
  from:dayjs(today.value).format("YYYY/MM/DD")
});

const forms = ref([]);
const responses = ref([]);
const stores = ref([])
const filters = ref({
  storeval: null,
  formval: null
})

const table = ref({
  columns: [
    { name: 'id', label: 'ID', field: r => r.id, align: 'center' },
    { name: 'fecha', label: 'FECHA', field: r => dayjs(r.created_at).format('DD/MM/YYYY HH:mm:ss'), align: 'left' },
    { name: 'store', label: 'SUCURSAL', field: r => r.store.name, align: 'left' },
    { name: 'form', label: 'FORMULARIO', field: r => r.form.name, align: 'left' },
    { name: 'user', label: 'USUARIO', field: r => r.user.name, align: 'left' },
    { name: 'points', label: 'PUNTOS', field: r => r.total_score, align: 'center' },

  ]
})

const responseBascket = computed(() => responses.value.filter(e => {
  if (filters.value.storeval && !filters.value.formval) {
    return e._store == filters.value.storeval.id
  } else if (!filters.value.storeval && filters.value.formval) {
    return e._form == filters.value.formval.id
  } else if (filters.value.storeval && filters.value.formval) {
    return (e._form == filters.value.formval.id && e._store == filters.value.storeval.id)
  } else {
    return e
  }
}))


const init = async (fechas) => {
  $q.loading.show({ message: 'Obteniendo Checklists' })


  const resp = await indpi.getformResponses(fechas);
  if (resp.error) {
    console.log(resp)
  } else {
    $q.loading.hide();
    console.log(resp);
    forms.value = resp.form;
    responses.value = resp.responses;
    stores.value = resp.stores;
  }
}

const viewResponseForm = async (a,b) => {
  $router.push(`reports/${b.id}`)
}


const buscas = () => {
  if(typeof fec.value === 'string'){
    fechas.value.from = fec.value;
    fechas.value.to = fec.value
  }else{
    fechas.value.from = fec.value.from;
    fechas.value.to = fec.value.to
  }
  init(fechas.value)
  date.value = false
  console.log(fechas.value)
}




init(fechas.value)

</script>

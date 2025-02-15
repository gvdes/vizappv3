<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div class="bg-white">
          <div class="q-pa-sm row items-center text-center text-h6">
            <div @click="$router.push('/cluster/indicators')"> <q-icon size="30px" name="arrow_back" /></div>
          </div>
        </div>
        <div class="col anek-bld text-grey-9 q-pl-sm">Reportes</div>
        <div>

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

// fecha: dayjs(date).format('YYYY-MM-DD'),
// hora: dayjs(date).format('HH:mm:ss')



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
    { name: 'fecha', label: 'FECHA', field: r => dayjs(r.created_at).format('DD/MM/YYYY'), align: 'left' },
    { name: 'store', label: 'SUCURSAL', field: r => r.store.name, align: 'left' },
    { name: 'form', label: 'FORMULARIO', field: r => r.form.name, align: 'left' },
    { name: 'user', label: 'USUARIO', field: r => r.user.name, align: 'left' },
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


const init = async () => {
  $q.loading.show({ message: 'Obteniendo Checklists' })
  const resp = await indpi.getformResponses();
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





init()

</script>

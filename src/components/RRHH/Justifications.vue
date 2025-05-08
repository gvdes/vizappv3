<template>
  <q-table title="Justificaciones" :rows="filRow" row-key="id" :rows-per-page-options="[0]" separator="cell"
    :columns="table.columns">
    <template v-slot:top-right>
      <div class="row">
        <q-input dense v-model="filter" filled type="text" label="Buscar" class="col">

          <template v-if="filter" v-slot:append>
            <q-btn round dense flat icon="close" @click="filter = ''" />
          </template>

          <template v-slot:prepend><q-icon name="search" /></template></q-input>
        <q-separator spaced inset vertical dark class />
        <q-select dense v-model="optsVal" label="Tipo" filled class="col" :options="Type" option-label="name">
          <template v-if="optsVal" v-slot:append>
            <q-btn round dense flat icon="close" @click="optsVal = null" />
          </template>
        </q-select>
      </div>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          <div class="text-bold text-left">{{ props.row.id }}</div>
        </q-td>
        <q-td key="user" :props="props">
          <div class="text-bold text-left">{{ props.row.user.name }} {{ props.row.user.surnames }}</div>
        </q-td>
        <q-td key="creacion" :props="props">
          <div class="text-bold text-left"> {{ props.row.created_at }}</div>
        </q-td>
        <q-td key="start_date" :props="props">
          <div class="text-bold text-left"> {{ props.row.start_date }}</div>
        </q-td>
        <q-td key="final_date" :props="props">
          <div class="text-bold text-left"> {{ props.row.final_date }}</div>
        </q-td>
        <q-td key="notes" :props="props">
          <div class="text-bold text-left">{{ props.row.notes }}</div>
        </q-td>
        <q-td key="evidence" :props="props" @click="mosimage(props.row)">

          <q-table :rows="props.row.files" grid hide-bottom :pagination="{ rowsPerPage: 3 }">
            <template v-slot:item="pro">
              <div style="position: relative; border: 1px solid #EEEEEE;
                       border-radius: 15px;
                       width: 50px;
                       height: 50px;
                       margin: 5px
                       ">
                <q-avatar size="50px" square>

                  <q-img :src="`${pro.row.url}`" style="height: 25px; width: 25px">
                  </q-img>
                </q-avatar>
              </div>
            </template>
          </q-table>
        </q-td>
        <q-td key="type" :props="props">
          <q-select v-model="props.row.type" :options="Type" label="Justificacion" filled option-label="name" dense />
        </q-td>
        <q-td key="paymen" :props="props">
          <q-select v-model="props.row.paymen" :options="Payment" label="%" filled option-label="percentage" dense
            :disable="!props.row.type" />
        </q-td>
        <q-td key="state" :props="props">
          <q-select v-model="props.row.state" :options="State" label="Confirmacion" filled option-label="name" dense
            @update:model-value="chagestatus(props.row)" :disable="!props.row.paymen" />
        </q-td>
      </q-tr>

    </template>
  </q-table>

  <q-dialog v-model="image">
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="q-pa-md">
          <q-carousel swipeable animated v-model="slide" thumbnails infinite>
            <q-carousel-slide :name="index" :img-src="`${file.url}`" v-for="(file, index) in row.files"
              :key="index" />
          </q-carousel>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import rhpi from "src/API/RhApi";
import { vizmedia } from "boot/axios"
import { useAccountStore } from "stores/Account";
const $q = useQuasar();
const $router = useRouter();

const piniaAccount = useAccountStore();
const props = defineProps({
  Justification: { type: Array, default: [] },
  State: { type: Array, default: [] },
  Payment: { type: Array, default: [] },
  Type: { type: Array, default: [] },
})

const filter = ref('');


const optsVal = ref(null);

const bascket = computed(() => props.Justification.filter(e =>
  `${e.user?.name || ''} ${e.user?.surnames || ''}`.toLowerCase().includes(filter.value.toLowerCase())
))

const filRow = computed(() => {
  if (optsVal.value) {
    return bascket.value.filter(bs => bs._type == optsVal.value.id)
  } else {
    return bascket.value
  }
})





const slide = ref(0)
const emit = defineEmits(['change'])
const table = ref({
  columns: [
    { name: 'id', label: 'Id', field: row => row.id, sortable: true },
    { name: 'user', label: 'Colaborador', field: row => row.user, sortable: true },
    { name: 'creacion', label: 'Creacion', field: row => row.created_at, sortable: true },
    { name: 'start_date', label: 'Fecha Inicio', field: row => row.start_date, sortable: true },
    { name: 'final_date', label: 'Fecha Final', field: row => row.final_date, sortable: true },
    { name: 'notes', label: 'Motivo', field: row => row.notes, sortable: true },
    { name: 'evidence', label: 'Comprobante', field: row => row.evidence, sortable: true },
    { name: 'type', label: 'Tipo', field: row => row.type, sortable: true },
    { name: 'paymen', label: 'Porcetaje', field: row => row.paymen, sortable: true },
    { name: 'state', label: 'Estado', field: row => row.state, sortable: true },
  ]
})
const image = ref(false);
const row = ref(null)

const mosimage = (a) => {
  image.value = true
  console.log(a);
  row.value = a
}

const chagestatus = (a) => {
  emit('change', a);
}

</script>

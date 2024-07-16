<template>
      <q-table title="Justificationes" :rows="Justification" row-key="id"
      :rows-per-page-options="[0]"  separator="cell" :columns="table.columns">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            <div class="text-bold text-left">{{ props.row.id }}</div>
          </q-td>
          <q-td key="user" :props="props">
            <div class="text-bold text-left">{{ props.row.user.name }} {{ props.row.user.surnames }}</div>
          </q-td>
          <q-td key="start_date" :props="props">
            <div class="text-bold text-left"> {{ props.row.start_date }}</div>
          </q-td>
          <q-td key="final_date" :props="props">
            <div class="text-bold text-left"> {{props.row.final_date}}</div>
          </q-td>
          <q-td key="notes" :props="props">
            <div class="text-bold text-left">{{ props.row.notes }}</div>
          </q-td>
          <q-td key="evidence" :props="props"  @click="mosimage(props.row)">
            <q-img v-if="props.row.evidence != null"
              :src="`http://192.168.10.112:1920/kraken/public/multimedia/${props.row.id}-${props.row.evidence}`" :ratio="2" spinner-color="primary"
              spinner-size="20px" style="width: 100px"  />
            <q-avatar v-else rounded size="100px" font-size="52px" color="teal" text-color="white" icon="inventory_2" />
          </q-td>
          <q-td key="type" :props="props">
            <q-select v-model="props.row.type" :options="Type" label="Justificacion" filled  option-label="name" dense />
        </q-td>
        <q-td key="paymen" :props="props">
          <q-select v-model="props.row.paymen" :options="Payment" label="%" filled  option-label="percentage" dense  :disable="!props.row.type"/>
        </q-td>
        <q-td key="state" :props="props" >
            <q-select v-model="props.row.state" :options="State" label="Confirmacion" filled  option-label="name" dense @update:model-value="chagestatus(props.row)" :disable="!props.row.paymen"/>
        </q-td>
        </q-tr>

      </template>
    </q-table>

    <q-dialog v-model="image"  style="width: 700px; max-width: 80vw;">
      <q-card>
        <q-card-section class="row items-center">
          <q-img
              :src="`http://192.168.10.112:1920/kraken/public/multimedia/${row.id}-${row.evidence}`"  spinner-color="primary"
              spinner-size="20px" style="width: 700px; max-width: 80vw;"/>
        </q-card-section>
      </q-card>
    </q-dialog>

</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import rhpi from "src/API/RhApi";
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

const emit = defineEmits(['change'])
const table = ref({
  columns:[
    {name:'id', label:'Id', field: row => row.id },
    {name:'user', label:'Colaborador', field: row => row.user },
    {name:'start_date', label:'Fecha Inicio', field:row => row.start_date},
    {name:'final_date', label:'Fecha Final', field:row => row.final_date},
    {name:'notes', label:'Motivo', field: row => row.notes },
    {name:'evidence', label:'Comprobante', field: row => row.evidence},
    {name:'type', label:'Tipo', field: row => row.type},
    {name:'paymen', label:'Porcetaje', field: row => row.paymen},
    {name:'state', label:'Estado', field: row => row.state},
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
  emit('change',a);
}

</script>

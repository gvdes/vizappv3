<template>
  <q-page padding>

    <div class="q-pa-sm row items-center text-center text-h6">
      <q-btn flat rounded icon="arrow_back" @click="$router.push('/cluster/manpower')" />

      <div class="col anek-bld text-grey-9 q-pl-sm">Alta Dispositivo</div>
      <div>
        <q-btn flat rounded icon="autorenew" @click="init" />
        <q-btn flat rounded color="positive" icon="archive" @click="aproved = true" title="aceptadas" />
        <q-btn flat rounded color="negative" icon="archive" @click="rechazed = true" title="rechazadas" />

        <q-btn flat icon="event" color="primary">
          <q-menu fit>
            <q-card class="my-card">
              <q-card-section>
                <q-date v-model="mosDate" landscape minimal mask="YYYY-MM-DD" disable />
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <q-input class="col" v-model="range.min" type="number" label="Min" filled />
                  <q-separator spaced inset vertical dark />
                  <q-input class="col" v-model="range.max" type="number" label="Max" filled />
                  <q-separator spaced inset vertical dark />
                  <q-select v-model="anio.val" :options="anio.opts" label="Ano" filled />
                </div>
                <q-range :min="0" :max="53" v-model="range" :step="1" color="primary" disable  />
              </q-card-section>
              <q-card-actions  align="center">
                <q-btn flat label="Obtener" @click="getFiltJustifications" />
              </q-card-actions>
            </q-card>
          </q-menu>
          </q-btn>



      </div>
    </div>

    <q-separator spaced inset vertical dark />


    <ViewJustification :Justification="jsenespera" :State="states" :Payment="payment" :Type="types" @change="change" />

    <q-dialog v-model="aproved" full-width>
      <q-card>
        <q-card-section>
          <ViewJustification :Justification="jsaceptadas" :State="states" :Payment="payment" :Type="types"
            @change="change"  />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="rechazed" full-width>
      <q-card>
        <q-card-section>
          <ViewJustification :Justification="jsrechazadas" :State="states" :Payment="payment" :Type="types"
            @change="change"   />
        </q-card-section>
      </q-card>
    </q-dialog>



  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import rhpi from "src/API/RhApi";
import dayjs from 'dayjs';
import { useAccountStore } from "stores/Account";
import ViewJustification from 'src/components/RRHH/Justifications.vue';
const $q = useQuasar();
const $router = useRouter();

const piniaAccount = useAccountStore();
const date = new Date();
const justificaciones = ref([]);
const states = ref([]);
const types = ref([]);
const payment = ref([]);
const rechazed = ref(false);
const aproved = ref(false);


const semanas = ref([]);
const anio = ref({
  val:null,
  opts:[],
});
const range = ref({
  min: 0,
  max: 0
})





const jsrechazadas = computed(() => justificaciones.value.filter(j => j._state == 3));
const jsaceptadas = computed(() => justificaciones.value.filter(j => j._state == 1));
const jsenespera = computed(() => justificaciones.value.filter(j => j._state == 2));

const mosDate  = computed(() => {
  let simon = semanas.value.filter(e => e.week >= range.value.min && e.week <= range.value.max  && e.anio == anio.value.val);
  console.log(simon)
  let init = 0;
  let ultm = simon.length -1;
  return {from:simon[init]?.fecha, to:simon[ultm]?.fecha}
})



const init = async () => {
  $q.loading.show({ message: 'Trayendo las justificaciones' })
  const resp = await rhpi.getJustifications()
  if (resp.error) {
    console.log(resp)
    if (resp.error.status == 405) {
      $router.push('/')
      $q.notify({ message: 'No tienes acceso a esta pagina', type: 'negative', position: 'center' })
    }
  } else {
    console.log(resp)
    justificaciones.value = resp.justifications
    states.value = resp.states
    payment.value = resp.porcentages
    types.value = resp.types
    semanas.value = resp.fechas;
    let semAct = semanas.value.find(e => e.fecha == dayjs(date).format('YYYY-MM-DD'));
    anio.value.opts = [...new Set(semanas.value.map(item => item.anio))];
    range.value.min = semAct.week
    range.value.max = semAct.week
    anio.value.val = semAct.anio

    $q.loading.hide();
  }

}

const change = async (a) => {
  $q.loading.show({ message: 'Cambiando Status' });
  console.log(a)
  const resp = await rhpi.changeStatus(a);
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp)
    let inx = justificaciones.value.findIndex(e => e.id == resp.id)
    justificaciones.value[inx] = resp
    $q.loading.hide();
    $q.notify({ message: `Justificacion ${resp.state.name}`, type: resp.state.id == 1 ? 'positive' : 'negative', position: 'center' })
  }

}


const getFiltJustifications = async () => {
  $q.loading.show({message:'Obteniendo Datos'})
  justificaciones.value = [];

  let data = {
    anio:anio.value.val,
    min:range.value.min,
    max:range.value.max
  }
  const resp = await rhpi.getFiltJustifications(data)
  if(resp.error){
    console.log(resp)
  }else{
    console.log(resp);
    justificaciones.value = resp
    $q.loading.hide();
  }
}


init()

</script>

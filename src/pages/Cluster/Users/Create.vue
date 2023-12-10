<template>
  <q-page padding>

    <AppNavigator ref="main_menu" />

    <q-form @submit="onSubmit" class="q-gutter-md">
      <div>
        <q-splitter v-model="splitterModel">

          <template v-slot:before>
            <q-tabs v-model="tab" vertical class="text-primary">
              <q-tab name="person" icon="person" label="Datos Personales" style="height: 225px;" />
              <q-tab name="worker" icon="work" label="Datos Laborales" style="height: 225px;" />
              <q-tab name="documents" icon="folder" label="Documentos" style="height: 225px;" />
              <q-tab name="envuser" icon="addperson" label="Vista Previa" style="height: 225px;" v-if="formsvalid" />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up">

              <q-tab-panel name="person">
                <dataper :personaldata="personaldata" :date="date" :valifecha="valifecha" :isValid="isValid"
                  :celvalid="celvalid" :nickvalid="nickvalid" />
              </q-tab-panel>

              <q-tab-panel name="worker">
                <datawork :tab2="tab2" :roles="roles" :workpoints="workpoints" :apps="apps" />
              </q-tab-panel>

              <q-tab-panel name="documents">
                <datadoc :files="files" />
              </q-tab-panel>

              <q-tab-panel name="envuser">
              <datapre :addPersonImage="addPersonImage" :personaldata="personaldata" :area="area" :pos="pos" :work="work" :appis="appis" :files="files" :loading="loading" />
              </q-tab-panel>

            </q-tab-panels>
          </template>
        </q-splitter>
      </div>
    </q-form>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import AppNavigator from 'src/components/AppNavigator.vue';
import uapi from 'src/API/UserApi';
import addPersonImage from "src/assets/avatares/pikachu.png";
import dataper from 'src/components/Users/Create/PersonalData.vue';
import datawork from 'src/components/Users/Create/WorkerData.vue';
import datadoc from 'src/components/Users/Create/DocumentsData.vue';
import datapre from 'src/components/Users/Create/PreviewData.vue';


const $q = useQuasar();

const users = ref([]);
const loading = ref(false);
const date = ref(false);
const main_menu = ref(null);

const personaldata = ref({
  name: null,
  surnames: null,
  dayofbirth: { val: null, state: false },
  celphone: null,
  email: null,
  nick: null,
  gender: {
    val: null, opts: [
      { value: 'M', label: "Masculino" },
      { value: 'F', label: "Femenino" },
      { value: 'I', label: "Indefinido" }
    ]
  }
})

const roles = ref({
  areas: { val: null, opts: null },
  puesto: { val: null, opts: null }
})

const workpoints = ref({
  val: [],
  valfav: null,
  opts: null,

})

const apps = ref({
  val: [],
  opts: null
})

const files = ref([
  { id: 1, name: 'solicitud', val: null, label: "Solicitud de empleo" },
  { id: 2, name: 'identificacion', val: null, label: "Identificacion" },
  { id: 3, name: 'acta', val: null, label: "Acta de nacimiento" },
  { id: 4, name: 'comprobantedom', val: null, label: "Comprobante de domicilio" },
  { id: 5, name: 'comprobanteest', val: null, label: "Comprobante de esturdios" },
  { id: 6, name: 'rfc', val: null, label: "RFC" },
  { id: 7, name: 'seguro', val: null, label: "Seguro" },
  { id: 8, name: 'cartasreco', val: null, label: "Cartas de recomendacion" },
  { id: 9, name: 'constanciasit', val: null, label: "Constancia Fiscal" },
  { id: 10, name: 'CUPR', val: null, label: "CURP" },
  { id: 11, name: 'fotografia', val: null, label: "Fotografia" }
])

const tab = ref('person');

const tab2 = ref(null);

const splitterModel = ref(20)

const isValid = computed(() => {
  let eamil = users.value.filter((e) => e.email == personaldata.value.email);
  return eamil.length >= 1 ? true : false;
});
const celvalid = computed(() => {
  let num = personaldata.value.celphone ? personaldata.value.celphone.split('-').join('') : null
  let ciil = users.value.filter((e) => e.celphone == num);
  return ciil.length >= 1 ? true : false;
});
const nickvalid = computed(() => {
  let nkmil = users.value.filter((e) => e.nick == personaldata.value.nick);
  return nkmil.length >= 1 ? true : false;
});
const valifecha = computed(() => validafecha(personaldata.value.dayofbirth.val))
const pos = computed(() => roles.value.puesto.val ? roles.value.puesto.val.name : '')
const area = computed(() => roles.value.areas.val ? roles.value.areas.val.name : '')
const work = computed(() => workpoints.value.valfav ? workpoints.value.valfav.label : '')
const appis = computed(() => {
  let exapp = apps.value.val ? apps.value.val : [];
  return apps.value.opts.filter((e) => exapp.includes(e.value)).map((e) => e.label).join(', ')
})
const formsvalid = computed(() => personaldata.value.name && personaldata.value.surnames && personaldata.value.dayofbirth && personaldata.value.email && personaldata.value.celphone && personaldata.value.gender.val && personaldata.value.nick && roles.value.areas.val && roles.value.puesto.val && workpoints.value.valfav && (nickvalid.value == false) && (celvalid.value == false) && (isValid.value == false) && (valifecha.value))
onMounted(() => { init(); });

const init = async () => {
  const resp = await uapi.opts();
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp);
    roles.value.areas.opts = resp.roles
    workpoints.value.opts = resp.workpoints
    apps.value.opts = resp.app
    users.value = resp.usuarios
  }
};

const onSubmit = async () => {
  console.log('Se creara el usuario');
  loading.value = true;
  let adduser = {
    name: personaldata.value.name,
    surnames: personaldata.value.surnames,
    dob: personaldata.value.dayofbirth.val,
    celphone: personaldata.value.celphone,
    nick: personaldata.value.nick,
    email: personaldata.value.email,
    gender: personaldata.value.gender.val,
    _rol: roles.value.puesto.val.id,
    _store: workpoints.value.valfav.value,
    stores: workpoints.value.val,
    apps: apps.value.val,
  }
  console.log(adduser);
  const addp = await uapi.adduser(adduser);
  if (addp.error) {
    console.log(addp)
  } else {
    console.log(addp)
    loading.value = false
    personaldata.value.name = null;
    personaldata.value.surnames = null;
    personaldata.value.dayofbirth.val = null;
    personaldata.value.celphone = null;
    personaldata.value.nick = null;
    personaldata.value.email = null;
    personaldata.value.gender.val = null;
    roles.value.areas.val = null;
    roles.value.puesto.val = null;
    workpoints.value.valfav = null;
    workpoints.value.val = [];
    apps.value.val = [];
    tab.value = 'person'
    $q.notify({
      type: 'positive',
      position: 'center',
      message: `Se Crea el usuario ${addp.id} con el nick ${addp.nick}`
    })
  }
};

const validafecha = (fecha) => {
  if (fecha == null || fecha.length < 10) {
    return true
  } else {
    const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;

    if (!formatoFecha.test(fecha)) {
      return false; // Formato de fecha incorrecto
    }

    const [year, month, day] = fecha.split('-');
    const parsedYear = parseInt(year, 10);
    const parsedMonth = parseInt(month, 10);
    const parsedDay = parseInt(day, 10);

    if (parsedYear < 1000 || parsedYear > 9999) {
      return false; // Año inválido
    }

    if (parsedMonth < 1 || parsedMonth > 12) {
      return false; // Mes inválido
    }

    const lastDayOfMonth = new Date(parsedYear, parsedMonth, 0).getDate();
    if (parsedDay < 1 || parsedDay > lastDayOfMonth) {
      return false; // Día inválido
    }

    return true; // Fecha válida
  }

}

const isMob = computed(() => $q.platform.is.mobile);
</script>

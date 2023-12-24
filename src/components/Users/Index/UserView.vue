<template>
  <div style="width: 700px; max-width: 80vw">
    <div class="flex justify-center">
      <q-card class="my-card">
        <q-card-section>
          <div class="flex justify-center">
            <q-avatar size="170px"> <q-img :src="`src/assets/avatares/${useEdit.avatar}`" /> </q-avatar>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-center">{{ useEdit.name.toUpperCase() + ' ' + useEdit.surnames.toUpperCase() }}</div>
          <div class="flex justify-center">
            <q-badge color="primary">
              {{ useEdit.nick }}
            </q-badge>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-separator spaced />

    <div>
      <q-card class="my-card">
        <q-card-section>
          <q-tabs v-model="tab" class="text-primary">
            <q-tab name="personaldata" icon="person" label="Datos Personales" />
            <q-tab name="workerdata" icon="work" label="Datos Laborales" />
            <q-tab name="documents" icon="folder" label="Documentos" />
          </q-tabs>
        </q-card-section>
        <q-card-section>
          <q-tab-panels v-model="tab" animated>

            <q-tab-panel name="personaldata">

              <div v-if="users">

                <div class="text-h6 text-center">Datos personales</div>
                <q-input dense v-model="data.name" type="text" label="Nombre" />
                <q-input dense v-model="data.surnames" type="text" label="Nombre" />
                <q-separator spaced inset vertical dark />
                <div class="row">
                  <q-input dense v-model="data.dob" label="Fecha Nacimiento" class="col" mask="####-##-##"
                    :error="!valifecha" error-message="anio-mes-dia alguno esta mal :(">
                    <template v-slot:prepend>
                      <q-btn color="primary" icon="event" @click="date = !date" flat round />
                    </template>
                  </q-input>
                  <q-separator spaced inset dark />
                  <q-input dense v-model="data.email" type="text" label="Correo Electronico" class="col"
                    error-message="El correo ya esta en uso" :error="isValid" />
                  <q-separator spaced inset dark />
                  <q-input dense v-model="data.celphone" type="text" label="Telefono" mask="##########" class="col"
                    error-message="El numero de telefono ya esta en uso" :error="celvalid" />
                </div>
                <q-btn-toggle dense v-model="data.gender" spread style="border: 1px solid #1c105a;" unelevated
                  toggle-color="primary" color="white" text-color="primary" :options="gender.opts" />
                <q-input dense v-model="data.nick" type="text" label="Nick(alias)" error-message="El nick ya esta en uso"
                  :error="nickvalid" />
                <q-btn outlined rounded color="primary full-width" icon="lock" label="Cambio de contrasena" />
                <q-dialog v-model="date">
                  <q-date v-model="data.dob" minimal mask="YYYY-MM-DD" />
                </q-dialog>
              </div>
            </q-tab-panel>


            <q-tab-panel name="workerdata">
              <div>
                <q-splitter v-model="splitter" style="height: 300px">

                  <template v-slot:before>
                    <q-tabs v-model="tab2" vertical class="text-primary">
                      <q-tab name="general" icon="settings" label="General" />
                      <q-tab name="positions" icon="lock" label="Rol" />
                      <q-tab name="workpoints" icon="store" label="Sucursales" />
                      <q-tab name="apps" icon="app_registration" label="Apps" />
                    </q-tabs>
                  </template>
                  <template v-slot:after>
                    <q-tab-panels v-model="tab2" animated swipeable vertical transition-prev="jump-up"
                      transition-next="jump-up">
                      <q-tab-panel name="general">
                        <q-select dense v-model="data.state" :options="filter.status.opts" option-label="name"
                          label="Estado" filled />
                        <q-separator spaced inset vertical dark />
                        <div class="row">

                          <q-input dense filled v-model="data.FS_id" type="text" label="Id Factusol" :disable="true"
                            class="col" v-if="data.FS_id" />
                          <q-btn outline color="primary" label="Id Factusol" v-else />

                          <q-separator spaced inset vertical dark />

                          <q-input dense filled v-model="data.RC_id" type="text" label="Id Reloj Checador" :disable="true"
                            class="col" v-if="data.RC_id" />
                          <q-btn outline color="primary" label="Id Reloj Checador" v-else />
                          <q-separator spaced inset vertical dark />

                          <q-input dense filled v-model="data.TPV_id" type="text" label="Id TPVSol" :disable="true"
                            class="col" v-if="data.TPV_id" />
                          <q-btn outline color="primary" label="Id TPVSol" v-else />
                        </div>
                      </q-tab-panel>


                      <q-tab-panel name="positions">
                        <q-select dense option-label="name" v-model="data.rol.area" :options="filter.area.opts"
                          label="Area" filled />
                        <q-separator spaced inset vertical dark />
                        <q-select dense option-label="name" v-model="data.rol" :options="filpos" label="Puesto" filled />
                      </q-tab-panel>

                      <q-tab-panel name="workpoints">
                        <div class="text-h6">Sucursales</div>
                        <q-option-group v-model="filter.branches.val" :options="filter.branches.opts" color="primary" type="toggle" />

                      </q-tab-panel>

                      <q-tab-panel name="apps">
                        <div class="text-h6">Apps</div>
                        <q-option-group v-model="filter.apps.val" :options="filter.apps.opts" color="primary" type="toggle" />

                      </q-tab-panel>



                    </q-tab-panels>
                  </template>
                </q-splitter>
              </div>
            </q-tab-panel>



            <q-tab-panel name="documents">
              <div class="text-h6">Movies</div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>


          </q-tab-panels>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat color="negative" label="Restaurar" :disable="validchange" />
          <q-btn flat color="primary" label="Confimar" :disable="validchange" />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar';
import uapi from 'src/API/UserApi';
const $q = useQuasar();
const props = defineProps({ useEdit: { type: Object } })
const tab = ref('personaldata')
const tab2 = ref('general')
const splitter = ref(25)
const data = ref(JSON.parse(JSON.stringify(props.useEdit)));
const filter = ref({
  status: { val: null, opts: null },
  branches: { val: [], opts: null },
  area: { val: null, opts: null },
  position: { val: null, optsdb: null, opts: [] },
  apps: {val:[], opts:null}
});
const date = ref(false)
const users = ref(null);
const gender = ref({
  val: null, opts: [
    { value: 'M', label: "Masculino" },
    { value: 'F', label: "Femenino" },
    { value: 'I', label: "Indefinido" }
  ]
})


const valifecha = computed(() => validafecha(data.value.dob))
const filpos = computed(() => filter.value.position.optsdb.filter((e) => e._area == data.value.rol.area.id))
const workdis  = () => {
  let disp = data.value.use_store.filter((e) => e._state == 1)
  let wdip = disp.map((e) => e._store)
  wdip.forEach((e) => {
    filter.value.branches.val.push(e)
  })
}

const isValid = computed(() => {
  let arr = users.value.filter((e) => e.id != data.value.id);
  let eamil = arr.filter((e) => e.email == data.value.email);
  return eamil.length >= 1 ? true : false;
});

const celvalid = computed(() => {
  let num = data.value.celphone ? data.value.celphone : null
  let arr = users.value.filter((e) => e.id != data.value.id);
  let ciil = arr.filter((e) => e.celphone == num);
  return ciil.length >= 1 ? true : false;
});

const nickvalid = computed(() => {
  let arr = users.value.filter((e) => e.id != data.value.id);
  let nkmil = arr.filter((e) => e.nick == data.value.nick);
  return nkmil.length >= 1 ? true : false;
});

const validchange = computed(() => {
  data.value.celphone = parseInt(data.value.celphone);
  if (JSON.stringify(data.value) == JSON.stringify(props.useEdit)) {
    return true
  } else {
    return false
  }
})

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



const init = async () => {
  $q.loading.show({ message: "Cargando Usuario..." });
  const resp = await uapi.index();
  if (resp.error) {
    console.log(resp);
  } else {
    users.value = resp.usuarios
    filter.value.status.opts = resp.status
    filter.value.area.opts = resp.area
    filter.value.position.optsdb = resp.position
    filter.value.branches.opts = resp.workpoints
    filter.value.apps.opts = resp.apps
    workdis();
    $q.loading.hide();
  }
};

init();

</script>

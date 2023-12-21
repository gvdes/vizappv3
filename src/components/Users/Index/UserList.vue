<template>
  <div class="q-pa-md row items-start q-gutter-s">
    <div v-for="(use, index) in users" :key="index">
      <q-list>
        <q-item clickable v-ripple @click="editUser(use)">
          <q-item-section>
            <q-card flat class="mycard" bordered
              :style="`width: 250px; max-width: 230vw; height: 400px; border: 2px solid ${color(use)};`">
              <q-card-section>
                <div class="text-subtitle1 text-center">{{ use.name.toUpperCase() }}
                </div>
                <div class="text-subtitle2 text-center"> {{ use.surnames.toUpperCase() }}
                  <div>
                    <q-badge color="primary">
                      {{ use.nick }}
                    </q-badge>
                  </div>
                </div>
                <q-separator spaced inset vertical dark />
                <div class="row">
                  <div class="col">Sucursal:</div>
                  <div class="col"> {{ use.store.name }} </div>
                </div>
                <q-separator spaced inset vertical dark />
                <div class="row">
                  <div class="col">Area:</div>
                  <div class="col">{{ use.rol.area.name }}</div>
                </div>
                <q-separator spaced inset vertical dark />
                <div class="row">
                  <div class="col">Puesto:</div>
                  <div class="col"> {{ use.rol.name }}</div>
                </div>
                <q-separator spaced inset vertical dark />
                <div class="flex justify-center" v-if="use.avatar">
                  <q-avatar size="170px"> <q-img :src="`src/assets/avatares/${use.avatar}`" /> </q-avatar>
                </div>
                <div class="flex justify-center" v-else>
                  <q-avatar size="170px"> <q-img :src="`src/assets/avatares/pokesnorlax.png`" /> </q-avatar>
                </div>
              </q-card-section>
            </q-card>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>

  <q-dialog v-model="useEdit.state">
    <q-card class="my-card">
      <div class="flex justify-center">
        <q-avatar size="200px"> <q-img :src="`src/assets/avatares/${useEdit.body.avatar}`" /> </q-avatar>
      </div>

      <q-card-section>
        <div class="text-h6">{{ useEdit.body.name + ' ' + useEdit.body.surnames }}</div>
        <div class="text-subtitle2">{{ useEdit.body.rol.name }}</div>
        <div>
          <q-badge color="primary">
            {{ useEdit.body.nick }}
          </q-badge>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="q-gutter-y-md">
          <q-tabs v-model="tab" narrow-indicator dense align="justify" class="text-primary">
            <q-tab name="personaldata" icon="person" label="Datos Personales" />
            <q-tab name="workerdata" icon="work" label="Datos Laborales" />
            <q-tab name="documents" icon="folder" label="Documentos" />
          </q-tabs>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="personaldata">
              <q-input dense rounded outlined v-model="useEdit.body.name" type="text" label="Nombre(s)" class="q-my-md" />
              <q-input dense rounded outlined v-model="useEdit.body.surnames" type="text" label="Apellidos"
                class="q-my-md" />
              <q-input dense rounded outlined v-model="useEdit.body.nick" type="text" label="Nick(alias)" class="q-my-md"
                error-message="El nick ya esta en uso" :error="nickvalid" />
              <div class="row q-my-md">
                <q-input dense rounded outlined v-model="useEdit.body.dob" label="Fecha Nacimiento" class="col"
                  mask="####-##-##" :error="!valifecha" error-message="anio-mes-dia alguno esta mal :(">
                  <template v-slot:prepend>
                    <q-btn color="primary" icon="event" @click="date = !date" flat round />
                  </template>
                </q-input>

                <q-dialog v-model="date">
                  <q-date v-model="useEdit.body.dob" minimal mask="YYYY-MM-DD" />
                </q-dialog>

                <q-input dense rounded outlined v-model="useEdit.body.email" type="text" label="Correo Electronico"
                  class="col" error-message="El correo ya esta en uso" :error="isValid" />
                <q-input dense rounded outlined v-model="useEdit.body.celphone" type="text" label="Telefono"
                  mask="##-####-####" class="col" error-message="El numero de telefono ya esta en uso"
                  :error="celvalid" />
              </div>
              <q-btn-toggle class="row q-my-md" v-model="gender.val" spread style="border: 1px solid #1c105a;" rounded
                unelevated toggle-color="primary" color="white" text-color="primary" :options="gender.opts" />
              <q-btn color="primary" class="full-width q-my-md" label="Cambiar Contrasena" icon="lock" rounded />

              {{ envedit }}

            </q-tab-panel>
            <q-tab-panel name="workerdata">
              <div class="text-h6">Alarms</div>

            </q-tab-panel>
            <q-tab-panel name="documents">
              <div class="text-h6">Movies</div>

            </q-tab-panel>
          </q-tab-panels>


        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Reestablecer" />
        <q-btn flat label="Editar" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
const props = defineProps({ users: { type: Array } })
import { ref, computed } from 'vue';
const useEdit = ref({
  state: false,
  body: null
});
const tab = ref('personaldata')
const date = ref(false)
const gender = ref({
  val: null, opts: [
    { value: 'M', label: "Masculino" },
    { value: 'F', label: "Femenino" },
    { value: 'I', label: "Indefinido" }
  ]
})

const valifecha = computed(() => validafecha(useEdit.value.body.dob))

const isValid = computed(() => {
  let arr = props.users.filter((e) => e.id != useEdit.value.body.id);
  let eamil = arr.filter((e) => e.email == useEdit.value.body.email);
  return eamil.length >= 1 ? true : false;
});

const celvalid = computed(() => {
  let num = useEdit.value.body.celphone ? useEdit.value.body.celphone : null
  let arr = props.users.filter((e) => e.id != useEdit.value.body.id);
  let ciil = arr.filter((e) => e.celphone == num);
  console.log(ciil);
  return ciil.length >= 1 ? true : false;
});
const nickvalid = computed(() => {
  let arr = props.users.filter((e) => e.id != useEdit.value.body.id);
  let nkmil = arr.filter((e) => e.nick == useEdit.value.body.nick);
  return nkmil.length >= 1 ? true : false;
});
const envedit = computed(() => {
    let obj = props.users.filter((e) => e.id == useEdit.value.body.id)
    console.log(JSON.stringify(obj[0]))
    console.log(JSON.stringify(useEdit.value.body))
    if(JSON.stringify(obj[0])=== JSON.stringify(useEdit.value.body)){
      return true
    }else{
      return false
    }
})

const editUser = (use) => {
  useEdit.value.state = true;
  useEdit.value.body = use;
  gender.value.val = useEdit.value.body.gender
}

const color = (e) => {
  if (e._state == 1) {
    return '#00337C' // azul
  } else if (e._state == 2) {
    return '#03C988' // verde
  } else if (e._state == 3) {
    return '#E3651D' //naranja
  } else if (e._state == 4) {
    return '#B80000' // rojo
  } else if (e._state == 5) {
    return '#711DB0' // morado
  } else {
    return '#22092C' //negro default
  }
}

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



</script>

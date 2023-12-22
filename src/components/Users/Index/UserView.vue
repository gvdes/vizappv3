<template>
  <div>
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

    <q-separator spaced inset dark />

    <div>
      <q-card class="my-card">
        <q-card-section>
          <q-tabs v-model="tab" class="text-primary">
            <q-tab name="personaldata" icon="person" label="Datos Personales" />
            <q-tab name="workerdata" icon="work" label="Datos Laborales" />
            <q-tab name="documents" icon="folder" label="Documentos" />
          </q-tabs>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
defineProps({ useEdit: { type: Object } })

const tab = ref('personaldata')

const date = ref(false)

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
  return ciil.length >= 1 ? true : false;
});
const nickvalid = computed(() => {
  let arr = props.users.filter((e) => e.id != useEdit.value.body.id);
  let nkmil = arr.filter((e) => e.nick == useEdit.value.body.nick);
  return nkmil.length >= 1 ? true : false;
});

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

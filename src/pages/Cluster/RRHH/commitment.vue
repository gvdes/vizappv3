<template>
  <q-page padding>
    <q-btn flat rounded icon="arrow_back" @click="$router.push('/cluster/manpower')" />

    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h4 text-center text-bold">CARTAS COMPROMISO</div>
          <div class="text-subtitle1 text-center">Creacion de cartas compromiso para colaboradores </div>
        </q-card-section>
        <q-card-section>
          <q-select v-model="form.colab" :options="optsUser" label="Colaborador" option-label="complete_name" filled
            use-input @filter="filterFn" />
        </q-card-section>
        <q-card-section v-if="form.colab">
          <q-input v-model="form.colab.store.name" type="text" label="Sucursal" :disable="true" filled />
          <q-separator spaced inset vertical dark />
          <q-input v-model="form.colab.rol.name" type="text" label="Puesto" :disable="true" filled />

        </q-card-section>
        <q-card-section>
          <q-input v-model="form.reason" type="textarea" label="Motivo de carta compromiso : " filled />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn label="Enviar" type="submit" color="positive" flat rounded :disabled="!validForm" />
          <q-btn label="Cancelar" type="reset" color="negative" flat rounded class="q-ml-sm" />
        </q-card-actions>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import rhpi from 'src/API/RhApi';
import dayjs from 'dayjs';
import mosPdf from 'src/PDF/RRHH/commitments';
import useApi from 'src/API/UserApi';
import { useAccountStore } from 'stores/Account';
const $q = useQuasar();
const $router = useRouter();
const piniaAccount = useAccountStore()

const date = new Date();
const users = ref([]);
const optsUser = ref(users.value);
const form = ref({
  colab: null,
  reason: null,
  conclusion: '',
  fecha: dayjs(date).format('YYYY-MM-DD'),
  hora: dayjs(date).format('HH:mm:ss')
})


const user = computed(() =>
  users.value.map((e) => {
    e.complete_name = `${e.name} ${e.surnames}`;
    return e;
  })
);

const validForm = computed(() => form.value.colab && form.value.reason)


const init = async () => {
  $q.loading.show({ message: 'Obteniendo Usuarios' })
  const resp = await useApi.index()
  if (resp.error) {
    console.log(resp)
    if (resp.error.status == 405) {
      $router.push('/')
      $q.notify({ message: 'No tienes acceso a esta pagina', type: 'negative', position: 'center' })
    }
  } else {
    users.value = resp.usuarios
    $q.loading.hide()
  }
}

const onSubmit = async () => {
  if (validForm.value) {
    $q.loading.show({ message: 'Enviando Datos' })
    form.value.created_by = piniaAccount.account
    const resp = await rhpi.addCommitment(form.value);
    if (resp.error) {
      console.log(resp);
    } else {
      console.log(resp)
      mosPdf.pdf(resp)
      $q.notify({ message: 'Se efectuo la carta', type: 'positive', position: 'center' });
      $q.loading.hide();
      form.value = {
        colab: null,
        reason: '',
        conclusion: '',
        fecha: dayjs(date).format('YYYY-MM-DD'),
        hora: dayjs(date).format('HH:mm:ss')
      }
    }
  }
}

const onReset = () => {
  form.value = {
    colab: null,
    reason: '',
    conclusion: '',
    fecha: dayjs(date).format('YYYY-MM-DD'),
    hora: dayjs(date).format('HH:mm:ss')
  }
}

const filterFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase()
    optsUser.value = user.value.filter(v => `${v.name} ${v.surnames}`.toLowerCase().indexOf(needle) > -1)
  })
}

init()

</script>

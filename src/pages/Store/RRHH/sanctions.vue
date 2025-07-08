<template>
  <q-page padding>
    <q-btn flat rounded icon="arrow_back" @click="$router.push('/cluster/manpower')" />

    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h4 text-center text-bold">SANCIONES</div>
          <div class="text-subtitle1 text-center">Creacion de sanciones para colaboradores</div>
        </q-card-section>
        <q-card-section>
          <q-select v-model="form.colab" :options="optsUser" label="Colaborador" option-label="complete_name" filled
            use-input @filter="filterFn" dense />
        </q-card-section>
        <q-card-section v-if="form.colab">
          <q-input v-model="form.colab.store.name" type="text" label="Sucursal" :disable="true" filled dense />
          <q-separator spaced inset vertical dark />
          <q-input v-model="form.colab.rol.name" type="text" label="Puesto" :disable="true" filled dense />

        </q-card-section>
        <q-card-section>
          <div class="row">
            <q-select class="col" v-model="form.sancion" :options="sancions" label="Sancion" option-label="name" filled
              dense
              @update:model-value="(b) => form.mount = (form.sancion.sanction == 1 || form.sancion?.sanction == 2) ? 0 : form.sancion?.sanction" />
            <q-separator spaced inset vertical dark />
            <q-input v-model="form.mount" type="number" label="Monto"
              :disable="!(form.sancion?.sanction == 1 || form.sancion?.sanction == 2)" filled dense />
          </div>
          <q-separator spaced inset vertical dark />
          <q-input v-model="form.reason" type="text" label="Descripcion de la sancion" filled dense />
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
import pdf from 'src/PDF/RRHH/proceeding';
import useApi from 'src/API/UserApi';
import { useAccountStore } from 'stores/Account';
const $q = useQuasar();
const $router = useRouter();
const account = useAccountStore();

const date = new Date();
const users = ref([]);
const optsUser = ref(users.value);
const sancions = ref([]);
const form = ref({
  colab: null,
  sancion: null,
  mount: null,
  reason: null
})


const user = computed(() =>
  users.value.map((e) => {
    e.complete_name = `${e.name} ${e.surnames}`;
    return e;
  })
);

const validForm = computed(() => form.value.colab && form.value.sancion && form.value.sancion && form.value.mount)

const init = async () => {
  $q.loading.show({ message: 'Obteniendo Usuarios' })
  const resp = await rhpi.getSanctions()
  if (resp.error) {
    console.log(resp)
    if (resp.error.status == 405) {
      $router.push('/')
      $q.notify({ message: 'No tienes acceso a esta pagina', type: 'negative', position: 'center' })
    }
  } else {
    users.value = resp.users
    sancions.value = resp.sanction
    $q.loading.hide()

  }
}

const onSubmit = async () => {
  if (validForm) {
    $q.loading.show({ message: 'Enviando Datos' })
    form.value.created_by = account.account.id
    console.log(form.value)
    const resp = await rhpi.addSanctions(form.value);
    if (resp.error) {
      console.log(resp);
    } else {
      $q.loading.hide()
      $q.notify({ message: resp, type: 'positive', position: 'center' })
      onReset()
      console.log(resp)
    }
  }
}

const onReset = () => {
  form.value = {
    colab: null,
    sancion: null,
    mount: null,
    reason: null
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

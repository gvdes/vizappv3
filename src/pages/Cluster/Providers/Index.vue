<template>
  <q-page padding>
    <q-list bordered>
      <q-item clickable v-ripple v-for="( provider, index) in providers" :key="index" >
        <q-item-section avatar>
          <q-icon color="primary" name="person" />
        </q-item-section>
        <q-item-section>{{ provider.id }}</q-item-section>
        <q-item-section>{{ provider.fs_id }}</q-item-section>
        <q-item-section>{{ provider.fiscal_name }}</q-item-section>

      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar';
import papi from 'src/API/ProvidersApi';
const $q = useQuasar();

const providers = ref([]);




const init = async () => {
  $q.loading.show({ message: "Cargando Proveedores..." });
  const resp = await papi.index();
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp)
    providers.value = resp
    $q.loading.hide();
  }
};

init()
</script>

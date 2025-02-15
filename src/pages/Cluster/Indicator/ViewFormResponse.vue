<template>
  <q-page padding v-if="response != null">
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div class="bg-white">
          <div class="q-pa-sm row items-center text-center text-h6">
            <div @click="$router.push('/cluster/indicators/reports')"> <q-icon size="30px" name="arrow_back" /></div>
          </div>
        </div>
        <div class="col anek-bld text-grey-9 q-pl-sm text-bold text-h5">{{ response.form.name }}</div>
        <div>
        </div>
      </div>
    </div>

    <q-card class="my-card">
      <q-card-section class="row">
        <div class="col text-center text-bold ">RESPONDIO: {{ response.user.name }}</div>
        <div class="col text-center text-bold ">SUCURSAL: {{ response.store.name }}</div>
        <div class="col text-center text-bold ">CREADO: {{ dayjs(response.created_at).format('DD/MM/YYYY HH:mm:ss') }}
        </div>
        <div class="col text-center text-bold ">PUNTOS: </div>
      </q-card-section>
    </q-card>

    <q-separator spaced inset vertical dark />

    <q-card class="my-card">
      <q-card-section v-for="(response, index) in response.responses" >
        <div class="text-left text-bold"> {{ response.question.question }}</div>
        <q-separator spaced inset vertical dark />
        <div class="text-left text-bold"> {{ response.text }}</div>
        <q-separator spaced inset vertical dark />
        <div class="text-left text-bold"> {{   JSON.parse(JSON.parse(response.condition)) }}</div>
      </q-card-section>

    </q-card>



  </q-page>
</template>

<script setup>
import { ref, watch, onBeforeMount, onBeforeUnmount, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, LocalStorage, Loading } from 'quasar';
import { useAccountStore } from 'stores/Account';
import indpi from 'src/API/IndicatorApi.js'
import dayjs from 'dayjs';


const $q = useQuasar();
const $route = useRoute();
const $router = useRouter()
const piniaAccount = useAccountStore();

const response = ref(null)


const init = async () => {
  $q.loading.show({ message: 'Obteniendo Respuestas' });
  console.log($route.params.fid)
  const resp = await indpi.viewResponseForm($route.params.fid)
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp)
    response.value = resp
    $q.loading.hide();
  }
}

init();
</script>

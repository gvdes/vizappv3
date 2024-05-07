<template>
  <q-page v-if="order">
    <q-header elevated class="bg-white">
      <div class="row items-start justify-between">

        <div class="q-pa-xs col text-center ">
          <q-expansion-item popup  :label="`Pedido : ${order.id}`" class="text-black">
            <q-card class="my-card">
              <q-card-section>
                <div class="row items-start justify-between">
                  <q-btn color="negative" flat icon="close" @click="$router.push(`/store/${piniaAccount.join}/preorders`)" dense />
                  <q-btn flat color="primary" icon="settings" dense> <q-tooltip
                      class="bg-accent">Configuracion</q-tooltip> </q-btn>
                  <q-btn flat color="primary" icon="archive" dense><q-tooltip class="bg-accent">Importar</q-tooltip>
                  </q-btn>
                  <q-btn flat color="primary" icon="unarchive" dense><q-tooltip class="bg-accent">Exportar</q-tooltip>
                  </q-btn>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </div>

        <div class="col">
          <div class="text--3 bg-white q-pt-sm text-black text-center">PREVENTA / {{ piniaAccount.join }}</div>
          <div class="row items-center bg-white">
            <div class="q-pa-xs col text-center">
              <div class="text--3 text-black">Cliente:</div>
              <div class="text-uppercase text--1 text-black">
                {{ order.name }}
              </div>
            </div>
          </div>
      </div>

    </q-header>
  </q-page>
</template>


<script setup>
import { ref, watch, onBeforeMount, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, LocalStorage, Loading } from 'quasar';
import { useAccountStore } from 'stores/Account';
import pvtpi from 'src/API/PreordersApi.js'

const $q = useQuasar();
const $route = useRoute();
const $router = useRouter()
const piniaAccount = useAccountStore();

const order = ref(null);


const init = async () => {
  const pedido = $route.params.oid;
  $q.loading.show({ message: 'Cargando Pedido' });
  const resp = await pvtpi.getOrder(pedido)
  if (resp.error) {
    console.log(resp.error)
    $q.notify({
      message:'No puedes ingresar a este Pedido',
      type:'negative',
      position:'center'
    })
    $q.loading.hide();
    $router.push(`/store/${piniaAccount.join}/preorders`)
  } else {
    order.value = (resp)
    console.log(resp);
    $q.loading.hide();
  }
}


onBeforeMount(() => { init() })

</script>

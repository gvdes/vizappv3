<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <q-header reveal bordered class="transparent">
      <AppMainToolbar @toggleNavigatorStore="toggledNavigatorStore" />
    </q-header>

    <AppNavigator ref="main_menu" />

    <q-page-container class="bg-grey-3">
      <router-view v-if="access" />

      <q-dialog v-model="wndRestringed.state" persistent no-backdrop-dismiss no-esc-dismiss>
        <q-card class="bg-red text-white">
          <q-card-section class="row items-center">
            <q-avatar icon="fas fa-ban" />
            <span class="q-ml-sm">Acceso restringido!</span>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAccountStore } from 'stores/Account'
import AppMainToolbar from 'src/components/AppMainToolbar.vue';
import AppNavigator from 'src/components/AppNavigator.vue';
import Store from 'src/API/StoreApi';
import { $sktpvt, $sktrst, $sktind } from 'boot/socket'

const piniaAccount = useAccountStore();
const $q = useQuasar();
const $route = useRoute();
const $router = useRouter();
const access = ref(false); // muestra la pagina (interfaz) solo hasta que la api responde
const main_menu = ref(null);
const wndRestringed = ref({ state: false });

const activeStoreId = ref(null)
const isPvtConnected = ref(false)
const isRstConnected = ref(false)
const isIndConnected = ref(false);

// conectado al componente de navegacion del menu principal
const toggledNavigatorStore = () => main_menu.value.toggle();

const init = async () => {
  access.value = false;
  $q.loading.show({ message: "Espera..." });
  console.log(`Comprobando acceso a store ${$route.params.idstore}...`);
  let data = { store: $route.params.idstore };
  const resp = await Store.index(data);
  console.log(resp);
  if (resp.error) {
    let ercode = resp.error.status;
    access.value = false;
    wndRestringed.value.state = true;
    $router.push('/')
  } else {
    wndRestringed.value.state = false;
    console.log("Kraken response: ");
    access.value = true;
    piniaAccount.setStore($route.params.idstore);
    piniaAccount.persist()
  }
  $q.loading.hide();
};

const connectSocket = (path, storeId) => {

  if (path.includes('/preorders')) {
    if (!isPvtConnected.value || storeId !== activeStoreId.value) {
      if (isPvtConnected.value) $sktpvt.disconnect()
      $sktpvt.connect()
      if ($sktpvt.connected) {
        $sktpvt.emit('ParametrosConexion', piniaAccount)
      } else {
        $sktpvt.once('connect', () => {
          $sktpvt.emit('ParametrosConexion', piniaAccount)
        })
      }
      isPvtConnected.value = true
    }
  } else if (isPvtConnected.value) {
    $sktpvt.disconnect()
    isPvtConnected.value = false
  }

  if (path.includes('/resurtido')) {
    if (!isRstConnected.value || storeId !== activeStoreId.value) {
      if (isRstConnected.value) $sktrst.disconnect()
      $sktrst.connect()

      isRstConnected.value = true
    }
  } else if (isRstConnected.value) {
    $sktrst.disconnect()
    isRstConnected.value = false
  }

  if (path == `/store/${storeId}/`) {
    if (!isIndConnected.value || storeId !== activeStoreId.value) {
      if (isIndConnected.value) $sktrst.disconnect()
      $sktind.connect()
      isIndConnected.value = true
    }
  } else if (isIndConnected.value) {
    $sktind.disconnect()
    isIndConnected.value = false
  }
  console.log(path)
  console.log(storeId)
  activeStoreId.value = storeId
}



onMounted(() => {
  init();
  connectSocket($route.fullPath, $route.params.idstore)
})

watch(() => $route.fullPath, (newPath) => {
  console.log(newPath)
  const newStoreId = $route.params.idstore
  connectSocket(newPath, newStoreId)
})

onBeforeUnmount(() => {
  if (isPvtConnected.value) $sktpvt.disconnect()
  if (isRstConnected.value) $sktrst.disconnect()
  if (isIndConnected.value) $sktind.disconnect()
})

// watch(() => $route.params, (toParams, previousParams) => { init(); });
</script>

<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <q-header reveal bordered class="transparent">
      <AppMainToolbar @toggleNavigatorStore="toggleNavigatorStore" />
    </q-header>

    <AppNavigator ref="main_menu" />

    <!-- (Optional) The Footer -->
    <!-- <q-footer class="transparent text-dark">
      <div class="q-pa-sm text-center">Oooli</div>
    </q-footer> -->

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->

    <q-page-container class="bg-grey-3">
      <!-- This is where pages get injected -->
      <router-view v-if="access"/>

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
  import { ref, watch, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import AppMainToolbar from 'src/components/AppMainToolbar.vue';
  import AppNavigator from 'src/components/AppNavigator.vue';
  import Store from 'src/API/StoreApi';
  import Auth from 'src/API/Auth';
import { route } from 'quasar/wrappers';

  const $route = useRoute();
  const $router = useRouter();
  const $q = useQuasar();
  const piniaAccount = useAccountStore();
  const access = ref(false);
  const main_menu = ref(null);
  const wndRestringed = ref({state:false});

  onBeforeMount( async () => { init(); });

  watch(() => $route.params, (toParams, previousParams) => { init(); });

  console.log("justo abajo bro");
  console.log($route.params);

  const init = async()=>{

    access.value=false;
    $q.loading.show({ message:"Espera..." });
    console.log(`Comprobando acceso a store ${$route.params.idstore}...`);

    let data = { store:$route.params.idstore };
    const resp = await Store.index(data);

    console.log(resp);

    if(resp.error){
      let ercode = resp.error.status;
      access.value=false;
      wndRestringed.value.state=true;
    }else{
      wndRestringed.value.state = false;
      // console.log("Kraken response: ");
      // console.log(resp);
      access.value = true;
    }

    $q.loading.hide();
  };

  // conectado al componente de navegacion del menu principal
  const toggleNavigatorStore = () => main_menu.value.toggle();
</script>

<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <AppMainToolbar @toggleNavigatorStore="toggleNavigatorStore"/>

    <StoreNavigator ref="main_menu"/>

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
            <span class="q-ml-sm">No tienes acceso a esta sucursal</span>
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
  import StoreNavigator from 'src/components/StoreNavigator.vue';
  import Store from 'src/API/StoreApi';

  const $route = useRoute();
  const $router = useRouter();
  const $q = useQuasar();
  const piniaAccount = useAccountStore();
  const access = ref(false);
  const main_menu = ref(null);
  const wndRestringed = ref({state:false});

  onBeforeMount( async () => { init(); });

  const init = async()=>{
    access.value=false;
    $q.loading.show({ message:"Espera..." });
    console.log(`Comprobando acceso a store ${$route.params.idstore}...`);

    let data = { store:$route.params.idstore };
    const resp = await Store.index(data);

    if(resp.error){
      let ercode = resp.error.status;
      wndRestringed.value.state = true;
      access.value=false;
    }else{
      console.log("Kraken response: "+resp);
      piniaAccount.fresh(null,$route.params.idstore,null);
      wndRestringed.value.state = false;
      access.value = true;
    }

    $q.loading.hide();
  };

  // conectado al componente de navegacion del menu principal
  const toggleNavigatorStore = () => main_menu.value.toggle();

  watch(() => $route.params, (toParams, previousParams) => { init(); });
</script>

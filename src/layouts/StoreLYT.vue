<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <q-header reveal bordered class="transparent">
      <AppMainToolbar @toggleNavigatorStore="toggledNavigatorStore" />
    </q-header>

    <AppNavigator ref="main_menu" />

    <q-page-container class="bg-grey-3">
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
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { useQuasar } from 'quasar';
  import AppMainToolbar from 'src/components/AppMainToolbar.vue';
  import AppNavigator from 'src/components/AppNavigator.vue';
  import Store from 'src/API/StoreApi';

  const $q = useQuasar();
  const $route = useRoute();
  const access = ref(false); // muestra la pagina (interfaz) solo hasta que la api responde
  const main_menu = ref(null);
  const wndRestringed = ref({state:false});

  // conectado al componente de navegacion del menu principal
  const toggledNavigatorStore = () => main_menu.value.toggle();

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
      console.log("Kraken response: ");
      access.value = true;
    }

    $q.loading.hide();
  };

  init();

  watch(() => $route.params, (toParams, previousParams) => { init(); });
</script>

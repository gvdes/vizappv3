<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->
    <q-page-container>

      <q-header class="bg-white text-dark" bordered>
        <ClusterToolbar @toggleNavigatorStore="toggleNavigatorStore" />
      </q-header>
      <AppNavigator ref="main_menu" />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// import { ref } from 'vue';
console.log("El cluster ha sido visitado!!");

import { ref } from 'vue';
  import ClusterToolbar from 'src/components/ClusterToolbar.vue';
  import AppNavigator from 'src/components/AppNavigator.vue';
  import { useAccountStore } from 'stores/Account'

  const main_menu = ref(null);

  const piniaAccount = useAccountStore();
  const wndCreate = ref(false);
  const toggleNavigatorStore = () => main_menu.value.toggle();


  piniaAccount.setCluMdlTitle("Usuarios");

</script>

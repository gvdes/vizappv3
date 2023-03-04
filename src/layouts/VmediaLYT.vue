<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header bordered class="text-dark bg-white">
      <div class="row items-center">
        <div class="col text-left row items-center">
          <!-- <q-btn flat round dense icon="menu" @click="toggleNavigatorStore"/> -->
          <div class="q-pl-sm text-h6 cursor-pointer" @click="$router.push('/')">
            <q-tooltip>Regresar</q-tooltip>
            <strong class="text-grey-6">Viz</strong>App
          </div>
          <div class="text-center font-bold q-pl-xs">/ MULTIMEDIA</div>
        </div>
        <div class="col">
          <q-tabs inline-label class="text-primary col-md col-xs-12">
            <q-route-tab icon="home" to="/multimedia" replace label="Inicio"/>
            <q-route-tab icon="view_in_ar" to="/multimedia/product" replace label="Producto"/>
            <q-route-tab icon="tv" to="/multimedia/channel" replace label="Canal" />
            <q-route-tab icon="radio" to="/multimedia/radio" replace label="Radio" />
          </q-tabs>
        </div>
      </div>
    </q-header>

    <!-- <StoreNavigator ref="main_menu"/> -->

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-drawer side="left" bordered class="bg-grey-2">
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit q-pa-sm">
        <!-- Content here -->
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="bg-grey-3">
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
  import { ref, watch, onBeforeMount, computed } from 'vue';
  import StoreNavigator from 'src/components/StoreNavigator.vue';
  import { useRouter } from 'vue-router';

  const main_menu = ref(null);
  const $router = useRouter();

  // conectado al componente de navegacion del menu principal
  const toggleNavigatorStore = () => main_menu.value.toggle();
</script>

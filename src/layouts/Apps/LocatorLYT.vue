<!--
  Layout para la mini app del Ubicador
-->

<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header elevated>
      <q-toolbar class="bg-blue-10">
        <q-icon name="fab fa-atlassian fa-rotate-180" />
        <q-toolbar-title>
          <span class="cursor-pointer" @click="$router.push('/')">VizApp</span> - <span class="text-blue-2 cursor-pointer" @click="$router.replace('/apps/locator')">Ubicador</span>
        </q-toolbar-title>

        <div class="row items-center">
          <q-btn icon="help" dense rounded flat />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-grey-2">
      <!-- This is where pages get injected -->
      <router-view v-if="access"/>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $router = useRouter();

const access = ref(true)

const $q = useQuasar()

$q.loading.show({
  message:'Validando acceso a la app...'
})
</script>

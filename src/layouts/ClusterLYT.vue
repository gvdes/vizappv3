<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->
    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
  // import { ref } from 'vue';
  console.log("El cluster ha sido visitado!!");
  /**
   * @implements Hay que revisar si el usuario que entro al cluster tiene acceso al mismo
   */
</script>

<template>
  <q-layout view="hHr LpR lFf">
    <q-page-container>
      <!-- <q-header> -->
        <q-separator spaced inset vertical dark />
        <div class="q-gutter-y-md">
          <q-tabs v-model="tab" class="text-primary" dense>
            <q-route-tab name="Product" icon="inventory" label="Productos" :to="'/cluster/products'" />
            <q-route-tab name="Category" icon="category" label="Categorias" :to="'/cluster/products/categories'" />
            <q-route-tab name="Prices" icon="price_change" label="Precios" :to="'/cluster/products/prices'" />
            <q-route-tab name="Kit" icon="communities" label="Kits" :to="'/cluster/products/kits'" />
          </q-tabs>
        </div>

        <q-separator />
      <!-- </q-header> -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {ref} from 'vue';

const tab = ref('Product');
</script>

<template>
  <div>
    <q-card flat class="transparent">
      <q-card-section>
        <div class="text-h6">Apps</div>
      </q-card-section>
      <q-separator />
      <q-list>
        <q-item clickable v-ripple v-for="(app,idx) in apps" :key="idx" :to="app.path">
          <q-item-section>{{ app.name }}</q-item-section>
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-caret-right" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const $props = defineProps({
  apps:undefined
})
</script>

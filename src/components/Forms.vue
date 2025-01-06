<template>
  <div>
    <q-card flat class="transparent">
      <q-card-section v-if="!isMob">
        <div class="text-h6">Formularios</div>
      </q-card-section>
      <q-separator />
      <q-list>
        <q-item clickable v-ripple v-for="(app,idx) in apps" :key="idx" :to="`resp/form/${app.id}`">
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

import { ref, computed } from 'vue';
import { useQuasar, LocalStorage, Loading } from 'quasar';
const $q = useQuasar();

const $props = defineProps({
  apps:undefined
})
const isMob = computed(() => $q.platform.is.mobile);
</script>

<template>
  <div class="text-grey-9">
    <template v-if="clustermodules.length">
      <q-list>
        <q-item-label header>Cluster</q-item-label>
        <BranchModule v-for="(module) in clustermodules" :key="module.id" :module="module" />
      </q-list>
    </template>

    <q-separator />

    <template v-if="bofmodules.length">
      <q-list>
        <q-item-label header>Sucursal</q-item-label>
        <BranchModule v-for="(module) in bofmodules" :key="module.id" :module="module" />
      </q-list>
    </template>
  </div>
</template>

<script setup>

  import { computed } from 'vue';
  import { useQuasar } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import BranchModule from 'src/components/Branch.vue';

  const $q = useQuasar();
  const piniaAccount = useAccountStore();

  const clustermodules = computed(() => piniaAccount.clu_modules );
  const bofmodules = computed(() => piniaAccount.bof_modules );
</script>

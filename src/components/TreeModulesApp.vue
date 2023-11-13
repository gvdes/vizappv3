<template>
  <div class="text-grey-9">
    <template v-if="bof_modules.length">
      <q-list>
        <q-item-label header>Sucursal ({{ bof_modules.length }})</q-item-label>
        <BranchModule v-for="(module) in bof_modules" :key="module.id" :module="module" />
      </q-list>
    </template>
    <q-separator />
    <template v-if="clu_modules.length">
      <q-list>
        <q-item-label header>Cluster ({{ clu_modules.length }})</q-item-label>
        <BranchModule v-for="(module) in clu_modules" :key="module.id" :module="module" />
      </q-list>
    </template>
  </div>
</template>

<script setup>

  import { computed } from 'vue';
  import { useAccountStore } from 'stores/Account';
  import { useRoute, useRouter } from 'vue-router';
  import BranchModule from 'src/components/Branch.vue';

  const piniaAccount = useAccountStore();
  const $route = useRoute();
  const $router = useRouter();

  const clu_modules = computed(() => piniaAccount.clu_modules );
  const bof_modules = computed(() => piniaAccount.bof_modules );
</script>

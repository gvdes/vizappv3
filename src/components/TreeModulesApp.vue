<template>
  <div>
    <template v-if="espmodules.length">
      <q-list>
        <q-item clickable v-ripple v-for="(module) in espmodules" :key="module._module" @click="goto(module)">
          <q-item-section avatar>
            <q-icon :name="module.details.icon" color="secondary"/>
          </q-item-section>
          <q-item-section>
            <q-item-label> {{module.name}} </q-item-label>
            <q-item-label caption lines="2">{{ module.details.sdesc }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator />
    </template>

    <q-list v-if="stdmodules.length" >
      <branchModule v-for="(module) in stdmodules" :key="module.id" :module="module"/>
    </q-list>
  </div>
</template>

<script setup>

  import { ref, watch, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import branchModule from 'src/components/BranchModule.vue';

  const $q = useQuasar();
  const piniaAccount = useAccountStore();
  const $router = useRouter();

  const espmodules = computed(() => piniaAccount.esp_modules.map( m => m.module).filter( m => m.root==0&&m.deep==0) );
  const stdmodules = computed(() => piniaAccount.std_modules.map( m => m.module).filter( m => m.root==0&&m.deep==0) );

  const goto = (module)=>{
    console.log(module.path);
    // let store = piniaAccount.join;
    $router.push(`/${module.path}`);
  }
</script>

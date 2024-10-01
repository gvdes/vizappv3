<template>

  <template v-if="submodules.length">
    <q-expansion-item
      :content-inset-level="0.5"
      expand-separator
      expand-icon=""
      v-model="state"
      expand-icon-toggle
      header-class="q-pa-none q-pl-md"
    >
      <template v-slot:header="">
        <div class="col">
          <q-item clickable v-ripple class="q-pa-none" @click="goto">
            <q-item-section>
              <q-item-label>{{ $props.module.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </template>
      <Branch v-for="(module) in submodules" :key="module.id" :module="module" :cluster="cluster" />
    </q-expansion-item>
  </template>

  <template v-else>
    <q-item clickable v-ripple @click="goto">
      <q-item-section>
        <q-item-label>{{ $props.module.name }}</q-item-label>
      </q-item-section>
    </q-item>
  </template>

</template>

<script setup>
/**
 * Este modulo es recursivo
 */

  import { ref, computed } from 'vue';
  import { useAccountStore } from 'stores/Account';
  import { useRouter,useRoute } from 'vue-router';

  const $router = useRouter();
  const $route = useRoute();
  const piniaAccount = useAccountStore();
  const state = ref(true);

  const $props = defineProps({ module:Object, cluster:Boolean });
  const module = $props.module;
  const submodules = computed(() => piniaAccount.submodules($props.module.id) );
  const goto = () => {
    console.log(module)
    if($props.cluster){
      $router.push(`/cluster/${module.path}`);
      console.log(`%c/cluster/${module.path}`,"font-size:1.5em; color:pink;");
    }else{
      if($route.params.idstore){
        $router.push(`/store/${$route.params.idstore}/${module.path}`);
        console.log(`%c/store/${$route.params.idstore}/${module.path}`,"font-size:1.5em; color:pink;");
      }else{
        $router.push(`/store/${piniaAccount.join}/${module.path}`);
        console.log(`%c/store/${piniaAccount.join}/${module.path}`,"font-size:1.5em; color:pink;");
      }
    }
  }
</script>

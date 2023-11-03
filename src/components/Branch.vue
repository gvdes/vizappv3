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
      <Branch v-for="(module) in submodules" :key="module.id" :module="module" />
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

  import { ref, computed } from 'vue';
  import { useAccountStore } from 'stores/Account';
  import { useRouter } from 'vue-router';

  const $router = useRouter();
  const storeAccount = useAccountStore();
  const state = ref(true);

  const $props = defineProps({ module:Object });
  const module = $props.module;

  const submodules = computed(() => storeAccount.submodules($props.module.id).map( m => m.module) );

  const goto = () => {
    console.log(`%c${module.path}`,"font-size:1.5em; color:pink;");
    $router.push(module.path);
  }
</script>

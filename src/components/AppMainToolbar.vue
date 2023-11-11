<template>
  <div class="text-dark bg-white">
    <div class="q-pa-sm row items-center">
      <div class="col text-left row items-center">
        <q-btn flat round dense icon="menu" @click="toggleMenu"/>
        <div class="q-pl-sm text-h6"><strong class="text-grey-6">Viz</strong>App</div>
      </div>

      <div class="col text-center anek-bld">
        <template v-if="stores.length>1">
          <q-btn flat :label="labelStore" >
            <q-menu fit anchor="bottom left" self="top start" class="shadow-1">
              <q-list style="min-width: 200px">
                <div class="text-grey-6 anek-lg q-pa-sm">Sucursal</div>
                <q-item v-for="store in stores" :key="store.id" clickable v-ripple @click="switchStore(store.id)">
                  <q-item-section avatar class="anek-bld">{{ store.alias }}</q-item-section>
                  <q-item-section>{{ store.name }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
        <template v-else>{{ piniaAccount.joinedStore.name }}</template>
      </div>

      <div class="col text-right"></div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useAccountStore } from 'stores/Account'

  let $q = useQuasar();
  const $router = useRouter();
  const piniaAccount = useAccountStore();

  const $emit = defineEmits([ 'toggleNavigatorStore' ]);
  const stores = computed(() => piniaAccount.unjoinStores );
  const labelStore = computed(() => $q.screen.xs ? piniaAccount.joinedStore.alias : piniaAccount.joinedStore.name )

  const toggleMenu = () => $emit('toggleNavigatorStore');
  const switchStore = sid => $router.replace(`/store/${sid}`);
</script>

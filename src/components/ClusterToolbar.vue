<template>
  <div class="text-dark bg-white">
    <div class="q-pa-sm row items-center">
      <div class="col row items-center">
        <q-btn flat round dense icon="menu" @click="toggleMenu"/>
        <div class="text-h6" @click="$router.push('/')"><strong class="text-grey-6">Viz</strong>App </div>
      </div>

      <div class="col text-center anek-bld">
        <div :class="moduletitle ? 'fs-dec2':'text-uppercase text-bold'" class="self-start text-primary">Cluster</div>
        <div>{{ moduletitle }}</div>
      </div>

      <div class="col text-right"></div>
    </div>
  </div>

  <q-dialog v-model="wndStores.false" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
        <span class="q-ml-sm">You are currently not connected to any network.</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Turn on Wifi" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { ref, watch, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useAccountStore } from 'stores/Account'

  const $route = useRoute();
  const $router = useRouter();
  const $q = useQuasar();
  const piniaAccount = useAccountStore();
  const $emit = defineEmits(['toggleNavigatorStore','joinAt']);

  const stores = computed(() => piniaAccount.unjoinStores );
  const joinedStore = computed(() => piniaAccount.joinedStore );
  const moduletitle = computed(() => piniaAccount.clumdlname );

  const wndStores = ref({ state:false });

  const toggleMenu = () => $emit('toggleNavigatorStore');
  const joinAt = (sid) => $router.replace(`/store/${sid}`);
</script>

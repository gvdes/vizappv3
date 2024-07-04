<template>
  <q-page>

    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-fab color="primary" text-color="white" icon="keyboard_arrow_left" :direction="isMobile ? 'up' : 'left'">
        <template v-slot:label="{ opened }">
          <div :class="{ 'example-fab-animate--hover': opened !== true }">
            {{ opened !== true ? 'Opciones' : 'Cerrar' }}
          </div>
        </template>
        <div v-for="(modulo, index) in permissions" :key="index">
          <q-fab-action color="primary" :icon="modulo.module.icon" :to="`${modulo.module.path}`"
            :label="modulo.module.name" />
        </div>
      </q-fab>
    </q-page-sticky>
  </q-page>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import pvtpi from 'src/API/PreordersApi.js'
import { $sktpvt } from 'boot/socket'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'stores/Account';
import PreordersApi from 'src/API/PreordersApi.js';
import Accounts from 'src/API/Accounts';

const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();


const isMobile = computed(() => $q.platform.is.mobile);
const permissions = computed(() => piniaAccount.account.modules.filter((e) => e.module.root == '9f4f'))


</script>

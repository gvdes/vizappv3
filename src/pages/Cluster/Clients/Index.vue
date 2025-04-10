<template>
  <q-page padding>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import tpvForm from 'components/Cashers/form.vue'
import dayjs from 'dayjs';
import clientApi from 'src/API/clientsApi.js'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'stores/Account';
import PreordersApi from 'src/API/PreordersApi.js';
import Accounts from 'src/API/Accounts';
import { vizmedia } from "boot/axios"

const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();


const clients = ref([]);

const init = async () => {
  const resp = await clientApi.getClients();
  if(resp.error){

  }else{
    clients.value = resp;
  }
  console.log(resp);
}

init();

</script>

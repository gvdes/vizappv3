<template>
  <q-page padding >
    {{ users }}

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAccountStore } from 'stores/Account';
import uapi from 'src/API/UserApi';
const $q = useQuasar();
const $router = useRouter();
const piniaAccount = useAccountStore();

const users = ref(null)

const init = async () => {
  const resp = await uapi.workus();
  if (resp.error) {
    console.log(resp);
  } else {
    users.value = resp;
  }
};

init();
</script>

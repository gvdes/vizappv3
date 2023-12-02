<template>
  <q-page padding>
   <h1>info personal</h1>

   {{ rol.name }}
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar, LocalStorage } from 'quasar';
import { useAccountStore } from 'stores/Account';


const $q = useQuasar();
const $router = useRouter();
const piniaAccount = useAccountStore();

const state = ref(false);

/** C O M P U T E D S */

const account = computed(() => piniaAccount.account);
const rol = computed(() => piniaAccount.rol);
const accverified = computed(() => piniaAccount.verified);

/** M E T H O D S */

const toggle = () => { state.value = !state.value };

const sessionDestroy = () => {
  LocalStorage.clear();
  $router.replace('/login');
};

defineExpose({ toggle });

</script>

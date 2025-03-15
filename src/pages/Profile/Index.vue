<template>
  <q-page padding>
    <q-card class="my-card">
      <q-card-section class="text-h6">
        <div>NOMBRE: <span class="text-bold">{{ `${account.name} ${account.surnames}` }}</span></div>
        <div>FECHA NACIMIENTO: <span class="text-bold">{{ account.dob }}</span></div>
        <div>TELEFONO: <span class="text-bold">{{ account.celphone }}</span></div>
        <div>EMAIL: <span class="text-bold">{{ account.email }}</span></div>
      </q-card-section>
    </q-card>
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


defineExpose({ toggle });

</script>

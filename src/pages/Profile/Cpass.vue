<template>
  <q-page padding>
    <div class="flex justify-center">
      <q-card class="my-card"  style="width: 300px;">

        <q-card-section class="flex justify-center">
          <q-btn color="negative" flat :icon="type == 'password' ? 'visibility' : 'visibility_off'" rounded  @click="chageType" />
        </q-card-section>

        <q-card-section>
          <q-input v-model="lastPass" :type="type" label="Contrasena Actual" />
        </q-card-section>

        <q-card-section>
          <q-input v-model="pass" :type="type" label="Nueva Contrasena" :error="inputValid" error-message="La contrasena tiene numeros consecutivos ejemplo de contrasena a1b2c3" />
          <q-separator spaced inset vertical dark />
          <q-input v-model="confirmPass" :type="type" label="Confirma Contrasena" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup >
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar, LocalStorage } from 'quasar';
import { useAccountStore } from 'stores/Account';


const $q = useQuasar();
const $router = useRouter();
const piniaAccount = useAccountStore();


const lastPass = ref('');
const pass = ref('');
const confirmPass = ref('');
const type = ref('password')

const validpass = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/);



const chageType = () => {type.value == 'password' ? type.value = 'text' : type.value = 'password'}
const inputValid = computed(() => hasConsecutiveNumbers(pass.value) )



const hasConsecutiveNumbers = (password)  => {
    for (let i = 0; i < password?.length - 2; i++) {
        if (!isNaN(password[i]) && !isNaN(password[i + 1]) && !isNaN(password[i + 2])) {
            const a = parseInt(password[i]);
            const b = parseInt(password[i + 1]);
            const c = parseInt(password[i + 2]);
            if (b === a + 1 && c === b + 1) {
                return true;
            }
        }
    }
    return false;
}


</script>

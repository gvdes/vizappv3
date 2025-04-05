<template>
  <q-page padding>

    <q-list bordered v-if="cash">
      <q-item>
        <q-item-section avatar>
          <q-icon color="primary" name="point_of_sale" />
        </q-item-section>
        <q-item-section>{{ cash.name }}</q-item-section>
        <q-item-section>
          <div class="row">
            <q-btn class="col" color="primary" icon="logout"  @click="onClick" flat title="cerrar" />
            <q-btn class="col" color="primary" icon="logout"  @click="onClick" flat title="payments" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import cashApi from 'src/API/cashApi.js'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'stores/Account';
import PreordersApi from 'src/API/PreordersApi.js';
import Accounts from 'src/API/Accounts';

const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();

const cash = ref({});

const init = async () => {
  $q.loading.show({message:'Revisando cajas'})
  const resp = await cashApi.getCashAssigned()
  if(resp.error){
    console.log(resp);
  }else{
    console.log(resp)
    cash.value = resp;
    $q.loading.hide()
  }
}

init();
</script>

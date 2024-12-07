<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div class="bg-white">
          <div class="q-pa-sm row items-center text-center text-h6">
            <div @click="$router.push('/cluster/indicators')"> <q-icon size="30px" name="arrow_back" /></div>
          </div>
        </div>
        <div class="col anek-bld text-grey-9 q-pl-sm">Reportes</div>
        <div>

        </div>
      </div>
    </div>

    <q-separator spaced inset vertical dark />


    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Our Changing Planet</div>
        <div class="text-subtitle2">by John Doe</div>
      </q-card-section>
      <q-card-section>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script setup>
import { ref, watch, onBeforeMount, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, LocalStorage, Loading } from 'quasar';
import { useAccountStore } from 'stores/Account';
import indpi from 'src/API/IndicatorApi.js'


</script>

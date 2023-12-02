<template>
  <q-page padding>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <div>
        <q-splitter v-model="splitterModel">

          <template v-slot:before>
            <q-tabs v-model="tab" vertical class="text-primary">
              <q-tab name="person" icon="person" label="Datos Personales" />
              <q-tab name="worker" icon="work" label="Datos Laborales" />
              <q-tab name="documents" icon="folder" label="Documentos" />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up">
              <q-tab-panel name="person">
                <div class="text-h5 q-mb-s text-center">Datos Personales</div>
              </q-tab-panel>

              <q-tab-panel name="worker">
                <div class="text-h5 q-mb-s text-center">Datos Laborales</div>
              </q-tab-panel>

              <q-tab-panel name="documents">
                <div class="text-h5 q-mb-s text-center">Documentos</div>
                <div>
                  <q-btn label="Submit" type="submit" color="primary" />
                  <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, watch, onBeforeMount, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, LocalStorage, Loading } from 'quasar';
import { useAccountStore } from 'stores/Account';
import { useWarehouseStore } from 'stores/Warehouse';
import uapi from 'src/API/UserApi';
import { store } from 'quasar/wrappers';

const $q = useQuasar();
const $route = useRoute();
const $router = useRouter();
const piniaAccount = useAccountStore();
const piniaWarehouse = useWarehouseStore();

const users = ref(null);
const location = ref(null);
const fullpath = ref([]);

const tab = ref('person')
const splitterModel = ref(20)


onMounted(() => { init(); });

const init = async () => {
  const resp = await uapi.index();
  if (resp.error) {
    console.log(resp);
  } else {
    users.value = resp;
  }
};


const onSubmit = () => console.log("enviado");
const onReset = () => console.log("reseteo")

const isMob = computed(() => $q.platform.is.mobile);


</script>

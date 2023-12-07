<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div class="col anek-bld text-grey-9 q-pl-sm">Usuarios</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
        </div>
      </div>
    </div>
    <q-separator spaced inset vertical dark />
    <div class="q-pa-md row items-start q-gutter-s" >
      <div v-for="(use, index) in users" :key="index">
      <q-list>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-card class="mycard" bordered style="width: 380px; max-width: 70vw; height: 150px;">
              <q-card-section>
                <div class="text-h6">{{ use.name }} {{ use.surnames }} <q-avatar size="25px"> <q-img
                      :src="`src/assets/avatares/${use.avatar}`" /></q-avatar> <q-badge color="primary">
                    {{ use.nick }}
                  </q-badge> </div>
                <q-separator />
                <div>
                  Sucursal: {{ use.store.name }}
                </div>
                <q-separator />
                <div>
                  Area: {{ use.rol.area.name }}
                </div>
                <q-separator />
                <div>
                  Puesto: {{ use.rol.name }}
                </div>

              </q-card-section>
            </q-card>
          </q-item-section>
        </q-item>
      </q-list>

    </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab color="primary" icon="add" position="bottom-right" direction="up">
        <q-fab-action color="purple" @click="addUser" icon="person_add" />
        <q-fab-action color="blue" @click="exportUsers" icon="upgrade" />
      </q-fab>
    </q-page-sticky>


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

const users = ref(null);


const init = async () => {
  const resp = await uapi.index();
  if (resp.error) {
    console.log(resp);
  } else {
    users.value = resp;
  }
};

const addUser = () => {
  let store = piniaAccount.join;
  console.log("Redirecciona al formulario");
  $router.replace(`/store/${store}/usuarios/create`);
}

const exportUsers = () => {
  console.log("para exportarlos");
}


onMounted(() => { init(); });
const isMob = computed(() => $q.platform.is.mobile);
</script>

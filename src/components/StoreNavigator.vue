<template>
  <q-drawer
    v-model="state"
    side="left"
    class="bg-white"
    bordered
  >
    <!-- QScrollArea is optional -->
    <q-scroll-area class="fit">
      <div class="bg-grey-1 bg-grey-2">
        <q-card flat class="transparent">
          <q-card-section horizontal class="bg-primary text-white">
            <q-card-section class="row items-center q-pr-none">
              <q-btn flat round @click="$router.push('/profile')">
                <q-avatar size="50px">
                  <q-img :src="piniaAccount.avatar"/>
                </q-avatar>
              </q-btn>
            </q-card-section>
            <q-card-section class="col">
              <div class="text-bold text-h6">{{ account.nick }}</div>
              <div>{{ account.name }} {{ account.surnames }}</div>
              <div>{{ rol.name }}</div>
              <div class="text-indigo-3 text-bold">ID: {{ account.id }}</div>
            </q-card-section>
          </q-card-section>
          <q-btn color="primary" flat icon="fas fa-power-off" class="full-width" @click="dialog = !dialog"/>
        </q-card>
      </div>
      <q-separator/>
      <treeModulesApp />
    </q-scroll-area>

    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="fas fa-person-through-window" color="white" text-color="primary" />
          <span class="q-ml-sm">Cerrar sesion?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="cancelar" color="primary" v-close-popup />
          <q-btn autofocus label="si, cerrar" color="primary" @click="sessionDestroy" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-drawer>
</template>

<script setup>
  import { ref, watch, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar, LocalStorage } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import treeModulesApp from 'src/components/TreeModulesApp.vue';

  const $q = useQuasar();
  const $router = useRouter();
  const piniaAccount = useAccountStore();

  const state = ref(false);
  const dialog = ref(false);

  const toggle = () => { state.value=!state.value };
  const sessionDestroy = () => {
    LocalStorage.clear();
    // desconectar socket
    // guardar registro en MySQL del cierre de sesion
    $router.replace('/login');
  };

  const account = computed( () => piniaAccount.account );
  const rol = computed( () => piniaAccount.rol );
  const accverified = computed( () => piniaAccount.verified );

  defineExpose({toggle});
</script>

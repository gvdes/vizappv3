<template>
  <q-drawer
    v-model="state"
    side="left"
    class="bg-white"
  >
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
    <q-scroll-area style="height:500px">
      <treeModulesApp />
    </q-scroll-area>
<<<<<<< HEAD

    <q-separator/>

    <div class="q-pa-md">Acceso a apps: {{ apps.length }}</div>
  </q-drawer>
=======
    <q-separator />
>>>>>>> 2d9e8c9d51cd79e7c82cd922547ee82fd06e9ba9

    <div class="q-pa-md">
      <div v-for="app in apps" :key="app.id">{{ app.name }}</div>
    </div>

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
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useQuasar, LocalStorage } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import treeModulesApp from 'src/components/TreeModulesApp.vue';

  // const $q = useQuasar();
  const $router = useRouter();
  const piniaAccount = useAccountStore();

  const state = ref(false);
  const dialog = ref(false);

  /** C O M P U T E D S */

  const account = computed( () => piniaAccount.account );
  const rol = computed( () => piniaAccount.rol );
<<<<<<< HEAD
  const accverified = computed( () => piniaAccount.verified );
  const apps = computed( () => piniaAccount.apps.map( a => a.app) );
=======
  // const accverified = computed( () => piniaAccount.verified );
  const apps = computed(() => piniaAccount.apps.map( app => app.app) )
>>>>>>> 2d9e8c9d51cd79e7c82cd922547ee82fd06e9ba9

  /** M E T H O D S */

  const toggle = () => { state.value=!state.value };

  const sessionDestroy = () => {
    LocalStorage.clear();
    $router.replace('/login');
  };

  defineExpose({toggle});
</script>

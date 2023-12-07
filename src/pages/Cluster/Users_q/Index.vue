<template>
  <q-page padding class="bg-grey-3">
    <q-header class="bg-white text-dark" bordered>
      <ClusterToolbar @toggleNavigatorStore="toggleNavigatorStore" />
      <q-separator />
      <div class="row q-pa-sm items-center justify-between">
        <div><q-btn color="primary" icon="refresh" @click="init" dense flat/></div>
        <div></div>
        <div class="row items-center">
          <q-input rounded outlined dense v-model="taccounts.filter" type="text" label="Buscar" debounce="100" />
          <q-btn color="primary" icon="add" @click="wndCreate=true"/>
        </div>
      </div>
    </q-header>

    <AppNavigator ref="main_menu" />

    <q-table flat
      row-key="name"
      :rows="accountsdb"
      :columns="taccounts.cols"
      :pagination="taccounts.pagination"
      :filter="taccounts.filter"
    >
    </q-table>

    <q-dialog v-model="wndCreate">
      <UserCreator :stores="storesdb" :roles="rolesdb"/>
    </q-dialog>

    <!-- <pre>{{ accountsdb }}</pre>
    <pre>{{ storesdb }}</pre> -->

  </q-page>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import AccDB from 'src/API/Accounts';
  import { useQuasar, dom } from 'quasar';
  import ClusterToolbar from 'src/components/ClusterToolbar.vue';
  import AppNavigator from 'src/components/AppNavigator.vue';
  import { useAccountStore } from 'stores/Account'
  import UserCreator from 'src/components/Users/Creator.vue';

  const main_menu = ref(null);

  const piniaAccount = useAccountStore();
  const wndCreate = ref(false);
  const $q = useQuasar();
  const accountsdb = ref([]);
  const storesdb = ref([]);
  const rolesdb = ref([]);
  const taccounts = ref({
    cols:[
      { "name":"id", label:"ID", field:"id" },
      { "name":"names", label:"Nombre", field:row => `${row.name} ${row.surnames} ` },
      { "name":"nick", label:"nick", field:"nick"},
      { "name":"rol", label:"rol", field:row=>row.rol.name},
      { "name":"mainstore", label:"Sucursal", field:row=>row.store.alias},
      { "name":"state", label:"Estado", field:row=>row.state.name},
    ],
    pagination:{
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 50
      // rowsNumber: xx if getting data from a server
    },
    filter:""
  });

  const toggleNavigatorStore = () => main_menu.value.toggle();

  const init = async() => {
    $q.loading.show();

    const response = await AccDB.list();

    if(response.error){

    }else{
      $q.loading.hide();
      accountsdb.value = response.accounts;
      storesdb.value = response.stores;
      rolesdb.value = response.roles;
    }

  }

  piniaAccount.setCluMdlTitle("Usuarios");
  init();
</script>

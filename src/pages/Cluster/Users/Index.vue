<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <q-btn flat rounded icon="filter_alt" @click="filter.state = !filter.state" />
        <q-input v-model="search" type="text" label="Buscar"> <template v-slot:prepend><q-icon
              name="search" /></template></q-input>
        <div class="col anek-bld text-grey-9 q-pl-sm">Usuarios</div>
        <div>
          <q-btn flat rounded icon="download"  @click="exportExcel" />
          <q-btn flat rounded icon="autorenew" @click="init" />
          <q-btn flat rounded color="negative" icon="archive" @click="archived.state = !archived.state" />
        </div>
      </div>
    </div>
    <q-separator spaced inset vertical dark />

    <listuser :users="users" :roles="filter.position.optsdb" :areas="filter.area.opts" :branches="filter.branches.opts"
      @init="init" />

    <q-dialog v-model="filter.state">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6 text-center"><q-icon name="filter_alt" /> Filtros</div>
        </q-card-section>
        <q-card-section class=" row items-center">
          <q-separator spaced inset vertical dark />
          <q-select dense class="col" v-model="filter.branches.val" :options="filter.branches.opts" label="Sucursal"
            option-label="name" filled outlined />
          <q-separator spaced inset vertical dark />
          <q-select dense class="col" v-model="filter.status.val" :options="filter.status.opts" label="Estado"
            option-label="name" filled outlined />
          <q-separator spaced inset vertical dark />
          <q-select dense class="col" v-model="filter.area.val" :options="filter.area.opts" @update:model-value="posopts"
            label="Area" option-label="name" filled outlined />
          <q-separator spaced inset vertical dark />
          <q-select dense class="col" v-model="filter.position.val" :options="filter.position.opts" label="Puesto"
            option-label="name" filled outlined />
          <q-separator spaced inset vertical dark />
          <q-icon name="close" @click="delfil" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog :maximized="maximizedToggle" v-model="archived.state" transition-show="slide-up" transition-hide="slide-down" persistent>
      <q-card >
        <q-card-section>
          <q-bar class="bg-primary text-white">

          <q-space />
          <q-btn flat rounded icon="filter_alt" @click="filter.state = !filter.state" />
          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">Minimizar</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">Maximizar</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-bar>

        </q-card-section>
        <q-card-section>
          <q-input v-model="search" type="text" label="Buscar"> <template v-slot:prepend><q-icon
              name="search" /></template></q-input>
          <listuser :users="userArchived" :roles="filter.position.optsdb" :areas="filter.area.opts"
        :branches="filter.branches.opts" @init="init" />
        </q-card-section>
      </q-card>


    </q-dialog>





    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-fab color="primary" text-color="white" icon="keyboard_arrow_left" :direction="isMobile ? 'up' : 'left'">
        <template v-slot:label="{ opened }">
          <div :class="{ 'example-fab-animate--hover': opened !== true }">
            {{ opened !== true ? 'Opciones' : 'Cerrar' }}
          </div>
        </template>
        <div v-for="(modulo, index) in permissions" :key="index">
          <q-fab-action color="primary" :icon="modulo.module.icon" :to="`${modulo.module.path}`"
            :label="modulo.module.name" />
        </div>
      </q-fab>
    </q-page-sticky>


  </q-page>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAccountStore } from 'stores/Account';
import { useRouter } from 'vue-router';
import { useQuasar, useMeta } from 'quasar';
import excel from 'src/EXCEL/Users/userList.js';
import listuser from 'src/components/Users/Index/UserList.vue';
import uapi from 'src/API/UserApi';
const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();
const maximizedToggle = ref(true)
const usuarios = ref([]);
const search = ref('');
const archived = ref({ state: false });
const filter = ref({
  state: false,
  status: { val: null, opts: null },
  branches: { val: null, opts: null },
  area: { val: null, opts: null },
  position: { val: null, optsdb: null, opts: [] },
});


const userListArchived =  computed(() => {
  if (
    filter.value.status.val == null &&
    filter.value.branches.val == null &&
    filter.value.area.val == null &&
    filter.value.position.val == null
  ) {
    return usuarios.value.filter((e) => e._state == 4);
  } else {
    return usuarios.value.filter((e) => {
      const statusId = filter.value.status?.val?.id;
      const branchesId = filter.value.branches?.val?.id;
      const areasId = filter.value.area?.val?.id;
      const positionId = filter.value.position?.val?.id;

      const isStatusSelected = statusId != null;
      const isBranchesSelected = branchesId != null;
      const isAreasSelected = areasId != null;
      const isPositionSelected = positionId != null;
      return (
        (isStatusSelected || isBranchesSelected || isAreasSelected || isPositionSelected) &&
        e._state != null &&
        e._store != null &&
        e.rol != null &&
        e.rol.area != null &&
        (isStatusSelected ? e._state == statusId : true) &&
        (isBranchesSelected ? e._store == branchesId : true) &&
        (isAreasSelected ? e.rol.area.id == areasId : true) &&
        (isPositionSelected ? e.rol.id == positionId : true)
      );
    });
  }
});

const userList = computed(() => {
  if (
    filter.value.status.val == null &&
    filter.value.branches.val == null &&
    filter.value.area.val == null &&
    filter.value.position.val == null
  ) {
    return usuarios.value.filter((e) => e._state != 4);
  } else {
    return usuarios.value.filter((e) => {
      const statusId = filter.value.status?.val?.id;
      const branchesId = filter.value.branches?.val?.id;
      const areasId = filter.value.area?.val?.id;
      const positionId = filter.value.position?.val?.id;

      const isStatusSelected = statusId != null;
      const isBranchesSelected = branchesId != null;
      const isAreasSelected = areasId != null;
      const isPositionSelected = positionId != null;
      return (
        (isStatusSelected || isBranchesSelected || isAreasSelected || isPositionSelected) &&
        e._state != null &&
        e._store != null &&
        e.rol != null &&
        e.rol.area != null &&
        (isStatusSelected ? e._state == statusId : true) &&
        (isBranchesSelected ? e._store == branchesId : true) &&
        (isAreasSelected ? e.rol.area.id == areasId : true) &&
        (isPositionSelected ? e.rol.id == positionId : true)
      );
    });
  }
});

const users = computed(() => userList.value.filter(e => (e.name + e.surnames).toLowerCase().includes(search.value.toLowerCase())))

const userArchived = computed(() => userListArchived.value.filter(e => (e.name + e.surnames).toLowerCase().includes(search.value.toLowerCase())));
const isMobile = computed(() => $q.platform.is.mobile);
const permissions = computed(() => piniaAccount.account.modules.filter((e) => e.module.root == '4f36'))
console.log(piniaAccount.account.modules)

const posopts = () => {
  filter.value.position.opts = filter.value.position.optsdb.filter((e) => e._area == filter.value.area.val.id)
}



const init = async () => {

  $q.loading.show({ message: "Cargando Usuarios..." });
  const resp = await uapi.index();
  if (resp.error) {
    console.log(resp);
    if(resp.error.status == 405){
      $router.push('/')
      $q.notify({message:'No tienes acceso a esta pagina',type:'negative',position:'center'})
    }
  } else {
    usuarios.value = resp.usuarios
    console.log(resp.usuarios)
    filter.value.status.opts = resp.status
    filter.value.area.opts = resp.area
    filter.value.position.optsdb = resp.position
    filter.value.branches.opts = resp.branches
    $q.loading.hide();
  }
};

const delfil = () => {
  filter.value.status.val = null
  filter.value.branches.val = null
  filter.value.area.val = null
  filter.value.position.val = null
}

const exportExcel = () => {
  excel.generateExcel(users.value);
}

onMounted(() => { init(); });
const isMob = computed(() => $q.platform.is.mobile);
</script>

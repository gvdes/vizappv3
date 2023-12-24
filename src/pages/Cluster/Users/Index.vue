<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <q-btn flat rounded icon="filter_alt" @click="filter.state = !filter.state" />
        <q-input v-model="search" type="text" label="Buscar"> <template v-slot:prepend><q-icon
              name="search" /></template></q-input>
        <div class="col anek-bld text-grey-9 q-pl-sm">Usuarios</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
          <q-btn flat rounded color="negative" icon="archive" @click="archived.state = !archived.state" />
        </div>
      </div>
    </div>
    <q-separator spaced inset vertical dark />

    <listuser :users="users" :roles="filter.position.optsdb" :areas="filter.area.opts" :branches="filter.branches.opts"/>

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

    <q-dialog v-model="archived.state">
      <q-card>
        <q-card-section>
          <q-table title="Table Title" :rows="userArchived" row-key="name" />
        </q-card-section>
      </q-card>
    </q-dialog>



    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab color="primary" icon="settings" position="bottom-right" direction="left">
        <q-fab-action color="purple" @click="addUser" icon="person_add" label="Agregar" />
        <q-fab-action color="blue" @click="exportUsers" icon="upgrade" label="Exportar" />
        <q-fab-action color="primary" @click="branches" icon="store" label="Sucursal" />
      </q-fab>
    </q-page-sticky>


  </q-page>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import listuser from 'src/components/Users/Index/UserList.vue';
import uapi from 'src/API/UserApi';
const $q = useQuasar();
const $router = useRouter();

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


const userArchived = computed(() => usuarios.value.filter((e) => e._state == 4));

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

const posopts = () => {
  filter.value.position.opts = filter.value.position.optsdb.filter((e) => e._area == filter.value.area.val.id)
}



const init = async () => {
  $q.loading.show({ message: "Cargando Usuarios..." });
  const resp = await uapi.index();
  if (resp.error) {
    console.log(resp);
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

const addUser = () => {
  console.log("Redirecciona al formulario");
  $router.replace(`/cluster/usuarios/create`);
}

const branches = () => {
  console.log("Redirecciona a branches");
  $router.replace(`/cluster/usuarios/branch`);
}

const exportUsers = () => {
  console.log("para exportarlos");
}


const delfil = () => {
  filter.value.status.val = null
  filter.value.branches.val = null
  filter.value.area.val = null
  filter.value.position.val = null
}


onMounted(() => { init(); });
const isMob = computed(() => $q.platform.is.mobile);
</script>

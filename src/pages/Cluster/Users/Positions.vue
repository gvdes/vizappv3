<template>
  <q-page padding>
    <div class="bg-white">

      <div class="q-pa-sm row items-center text-center text-h6">
        <div @click="$router.push('/cluster/usuarios')"> <q-icon size="30px" name="arrow_back" /></div>
        <div class="col anek-bld text-grey-9 q-pl-sm">Areas / Puestos</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
          <q-btn flat rounded icon="add" @click="newArea" />

        </div>
      </div>
    </div>
    <q-separator spaced inset vertical dark />
    <q-table :rows="areas" row-key="name" grid :filter="table.filter" :pagination="table.pagination"
      :columns="table.columns" v-if="areas.length > 0">

      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="table.filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card class="my-card" bordered flat>
            <q-card-section>
              <div class="text-h6">{{ props.row.name.toUpperCase() }}</div>
              <div class="text-subtitle2">Id: {{ props.row.id }}</div>
            </q-card-section>
            <q-card-actions align="center">
              <q-btn color="primary" icon="add" flat @click="addRol(props.row)" />
              <q-space />
              Puestos: {{ props.row.roles.length }}
              <q-space />
              <q-btn color="primary" round flat dense :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                @click="props.expand = !props.expand" />
            </q-card-actions>
            <q-slide-transition>
              <div v-show="props.expand">
                <q-separator />
                <q-card-section class="text-subtitle2" v-for="(roles, index) in props.row.roles" :key="index">
                  <q-list dense>
                    <q-item clickable v-ripple @click="mosPer(roles, props.row)">
                      <q-item-section>
                        <q-item-label overline> {{ roles.name }}</q-item-label>
                        <q-item-label caption>Jerarquia {{ roles.hierarchy }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </div>
            </q-slide-transition>
          </q-card>
        </div>
      </template>
    </q-table>

    <q-dialog v-model="wndArea.state" persistent>
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">Creacion de nueva Area</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit="addingArea" @reset="wndArea.val = ''" class="q-gutter-md">
            <q-input v-model="wndArea.val" type="text" label="Nombre de nueva Area" filled :error="eArea"
              error-message="El area ya existe :0" />
            <div class="flex justify-center">
              <q-btn type="reset" color="negative" flat class="q-ml-sm" icon="close" v-close-popup />
              <q-btn type="submit" color="positive" flat icon="check" :disable="eArea" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>


    <q-dialog v-model="add" persistent>
      <ViewPosition :addPuesto="addPuesto" :modulesC="modulesC" :area="area" :permissions="permissions"
        @termino="termino" @reset="reset">
      </ViewPosition>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAccountStore } from 'stores/Account';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import uapi from 'src/API/UserApi';
import ViewPosition from 'src/components/Position/viewPosition.vue';
const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();

const areas = ref([])
const shape = ref(1)

const area = ref([])
const permissions = ref([])
const modules = ref([])
const modulesC = ref(null)
const wndArea = ref({
  state: false,
  val: ''
})
const addPuesto = ref({
  name: '',
  description: '',
  type_rol: { val: null, opts: [{ id: 1, name: 'Administrativo' }, { id: 2, name: 'Operativo' },] },
  hierarchy: { valR: null, valP: null, val: null }
})
const add = ref(false)
const table = ref({
  filter: '',
  pagination: { rowsPerPage: 12 },
  columns: [
    { id: 'id', name: 'id', label: 'ID', field: row => row.id },
    { id: 'name', name: 'name', label: 'Nombre', field: row => row.name },
    { id: 'roles', name: 'rol', label: 'Roles', field: row => row.roles?.length }
  ]
})

const modulesP = computed(() => {
  function updatePermissions(modules) {
    modules.forEach(module => {
      module._permission = 0;
      if (module.children && module.children.length > 0) {
        updatePermissions(module.children);
      }
    })
  }
  updatePermissions(modules.value)
  return modules.value
});

const eArea = computed(() => areas.value.findIndex(e => e.name.toLowerCase() == wndArea.value.val.toLowerCase()) >= 0 ? true : false)


const init = async () => {
  $q.loading.show({ message: 'Cargando..' })
  const positions = await uapi.positions()
  if (positions.error) {
    $q.notify({ message: 'Hubo un problema con la recopilacion de datos', type: 'negative', position: 'center' })
  } else {
    areas.value = positions.areas
    permissions.value = positions.permissions
    modules.value = positions.modules
    $q.loading.hide()
  }
  console.log(positions);
}

const reset = () => {

  addPuesto.value = {
    name: '',
    description: '',
    type_rol: { val: null, opts: [{ id: 1, name: 'Administrativo' }, { id: 2, name: 'Operativo' },] },
    hierarchy: { valR: null, valP: null, val: null }
  }
  add.value = false
  function updatePermissions(modules) {
    modules.forEach(module => {
      module._permission = 0;
      if (module.children && module.children.length > 0) {
        updatePermissions(module.children);
      }
    });
  }
  updatePermissions(modulesC.value)
  console.log(modulesC.value)
}

const addRol = (row) => {
  add.value = true;
  modulesC.value = modulesP.value
  console.log(modulesC.value)
  area.value = row;
}
const newArea = () => {
  wndArea.value.state = true
  console.log('creacion nueva area')
}

const addingArea = async () => {

  const resp = await uapi.addArea({ name: wndArea.value.val.toUpperCase() })
  if (resp.error) {
    alert('No se pudo generar el area')
  } else {
    console.log(resp)
    $q.notify({
      message: 'Area Creada :)',
      type: 'positive',
      position: 'center'
    })
    wndArea.value.state = false
    wndArea.value.val = ''
    areas.value.push(resp)
  }
}

const mosPer = async (a, row) => {
  console.log(a.id)
  const resp = await uapi.getPermissionsRol(a.id)
  if (resp.error) {
    alert('No se obtuvieron permisos')
  } else {
    console.log(resp)
    if (resp.permissions.length > 0) {
      let rolePermissioMap = {}
      resp.permissions.forEach(e => {
        rolePermissioMap[e._module] = e._permission
      });

      function updatePermissions(modules) {
        modules.forEach(module => {
          if (rolePermissioMap.hasOwnProperty(module.id)) {
            module._permission = rolePermissioMap[module.id];
          } else {
            module._permission = 0;
          }
          if (module.children && module.children.length > 0) {
            updatePermissions(module.children);
          }
        });
      }
      let modulos = modules.value
      updatePermissions(modulos);
      modulesC.value = modulos
    }else{
      modulesC.value = modulesP.value
    }

    console.log(modulesC.value)

    area.value = row;
    addPuesto.value.id = resp.id
    addPuesto.value.name = resp.name
    addPuesto.value.description = resp.description
    addPuesto.value.type_rol.val = resp.type_rol
    addPuesto.value.hierarchy.val = resp.hierarchy
    // console.log(addPuesto.value)
    add.value = true;
  }
}

const termino = () => {
  add.value = false
  addPuesto.value = {
    name: '',
    description: '',
    type_rol: { val: null, opts: [{ id: 1, name: 'Administrativo' }, { id: 2, name: 'Operativo' },] },
    hierarchy: { valR: null, valP: null, val: null }
  }
  init()
}



init()
</script>

<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
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
                    <q-item clickable v-ripple @click="mosPer(roles)">
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
      <q-card class="my-card" style="width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6 text-center"> {{ area.name }} </div>
          <q-separator spaced inset vertical dark />
          <div class="text-subtitle2 text-center">Agregar Puesto al Area:</div>
        </q-card-section>
        <q-tabs v-model="tab" class="text-primary">
          <q-tab name="info" icon="info" label="Informacion" />
          <q-tab name="permissions" icon="settings" label="Permisos" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="info">
            <q-card-section>
              <q-input v-model="addPuesto.name" type="text" label="Nombre" filled />
              <q-separator spaced inset vertical dark />
              <q-input v-model="addPuesto.description" type="text" label="Descripcion" filled />
              <q-separator spaced inset vertical dark />
              <q-select v-model="addPuesto.type_rol.val" :options="addPuesto.type_rol.opts" label="Tipo de puesto"
                filled option-label="name" />
              <q-separator spaced inset vertical dark />
              <div class="row" v-if="area.roles.length > 0">
                <q-select v-model="addPuesto.hierarchy.valP" :options="area?.roles" label="Puesto" filled class="col"
                  option-label="name">
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.name }}</q-item-label>
                        <q-item-label caption class="text-overline">Jerarquia {{ scope.opt.hierarchy }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-separator spaced inset vertical dark />
                <q-select v-model="addPuesto.hierarchy.valR" :options="optionHierarchy" label="Rango" filled class="col"
                  :disable="addPuesto.hierarchy.valP ? false : true" />
              </div>
            </q-card-section>
          </q-tab-panel>
          <q-tab-panel name="permissions">
            <q-input dense v-model="search" type="text" label="Buscar" />
            <div class="row items-center">
              <div class="col col text-bold text-overline">Modulos</div>
              <div class="col">
                <div class="row">
                  <div class="col text-bold text-overline">C. Total</div>
                  <div class="col text-bold text-overline">Edicion</div>
                  <div class="col text-bold text-overline">Vista</div>
                </div>
              </div>
            </div>
            <q-separator />
            <q-tree :nodes="modulesP" node-key="id" label-key="name" :filter="search" children-key="children">
              <template v-slot:default-header="prop">
                <div class="row items-center" style="width: 228px;">
                  <q-icon :name="prop.node.icon || 'list'" color="primary" size="15px" class="q-mr-xs" />
                  <div class="text-weight-bold  text-left ">{{ prop.node.name }}</div>
                </div>
                <div class="row  flex justify-center" v-for="(permission, index) in permissions" :key="index">
                  <q-radio class="col q-mr-xl" dense v-model="prop.node._permission" :val="permission"
                    :color="permission.id == 1 ? 'positive' : permission.id == 2 ? 'warning' : 'negative'"
                    keep-color />
                </div>
              </template>
            </q-tree>
          </q-tab-panel>
        </q-tab-panels>

        <q-card-actions align="center">
          <q-btn flat icon="close" color="negative" type="reset" v-close-popup />
          <q-btn flat icon="check" type="submit" color="positive" @click="adding" />
        </q-card-actions>


      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAccountStore } from 'stores/Account';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import listuser from 'src/components/Users/Index/UserList.vue';
import uapi from 'src/API/UserApi';
const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();

const areas = ref([])
const shape = ref(1)
const search = ref('')
const tab = ref('info')
const area = ref([])
const permissions = ref([])
const modules = ref([])
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

const optionHierarchy = computed(() => {
  if (addPuesto.value.hierarchy.valP) {
    return addPuesto.value.hierarchy.valP.hierarchy <= 1 ? ['Igual', 'Menor'] : ['Menor', 'Igual', 'Mayor']
  }
  return ['Menor', 'Igual', 'Mayor']
})

const eArea = computed(() => areas.value.findIndex(e => e.name.toLowerCase() == wndArea.value.val.toLowerCase()) >= 0 ? true : false)
const modulesP = computed(() => {
  modules.value.map(a => a._permission = 0)
  return modules.value
});


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
}

const addRol = (row) => {
  add.value = true;
  area.value = row;
}
const adding = async () => {
  if (addPuesto.value.hierarchy.valR == 'Mayor') {
    addPuesto.value.hierarchy.val = addPuesto.value.hierarchy.valP.hierarchy - 1
  } else if (addPuesto.value.hierarchy.valR == 'Igual') {
    addPuesto.value.hierarchy.val = addPuesto.value.hierarchy.valP.hierarchy
  } else if (addPuesto.value.hierarchy.valR == 'Menor') {
    addPuesto.value.hierarchy.val = addPuesto.value.hierarchy.valP.hierarchy + 1
  } else {
    addPuesto.value.hierarchy.val = 1
  }
  let data = {
    rol: {
      name: addPuesto.value.name,
      description: addPuesto.value.description,
      type_rol: addPuesto.value.type_rol.val.id,
      hierarchy: addPuesto.value.hierarchy.val,
      _area: area.value.id,
    },
    permissions:modules.value.filter(e => e._permission.id > 0)
  }
  console.log(data);

  const resp = await uapi.addPuesto(data)
  if (resp.error) {
    alert('No se pudo generar el area')
  } else {
    console.log(resp)
    $q.notify({
      message: 'Puesto Creada :)',
      type: 'positive',
      position: 'center'
    })
    add.value = false
    addPuesto.value = {
      name: '',
      description: '',
      type_rol: { val: null, opts: [{ id: 1, name: 'Administrativo' }, { id: 2, name: 'Operativo' },] },
      hierarchy: { valR: null, valP: null, val: null }
    }
    init()
  }
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

const mosPer = async (a) => {
  console.log(a.id)
  const resp = await uapi.getPermissionsRol(a.id)
  if (resp.error) {
    alert('No se obtuvieron permisos')
  } else {
    console.log(resp)
  }

}


init()
</script>

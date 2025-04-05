<template>

  <q-card class="my-card" style="width: 520px; max-width: 80vw;">
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
          <q-select v-model="addPuesto.type_rol.val" :options="addPuesto.type_rol.opts" label="Tipo de puesto" filled
            option-label="name" />
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
          <div class=" text-bold text-overline q-mr-xl" style="width: 135px;">Modulos</div>

          <div class="col text-bold text-overline q-mr-sm">S.Permisos</div>
          <div class="col text-bold text-overline">C. Total</div>
          <div class="col text-bold text-overline">Edicion</div>
          <div class="col text-bold text-overline">Vista</div>

        </div>
        <q-separator />
        Cluster
        <q-tree :nodes="modulesClu" node-key="id" label-key="name" :filter="search" children-key="children">
          <template v-slot:default-header="prop">
            <div class="row items-center" style="width: 228px;">
              <q-icon :name="prop.node.icon || 'list'" color="primary" size="15px" class="q-mr-xs" />
              <div class="text-weight-bold  text-left ">{{ prop.node.name }}</div>
            </div>
            <div class="row  flex justify-center" v-for="(permission, index) in permissions" :key="index">
              <q-radio class="col q-mr-xl" dense v-model="prop.node._permission" :val="permission.id"
                :color="permission.id == 1 ? 'positive' : permission.id == 2 ? 'warning' : permission.id == 3 ? 'orange' : 'negative'"
                keep-color />
            </div>
          </template>
        </q-tree>

        Operativo
        <q-tree :nodes="modulesBof" node-key="id" label-key="name" :filter="search" children-key="children">
          <template v-slot:default-header="prop">
            <div class="row items-center" style="width: 228px;">
              <q-icon :name="prop.node.icon || 'list'" color="primary" size="15px" class="q-mr-xs" />
              <div class="text-weight-bold  text-left ">{{ prop.node.name }}</div>
            </div>
            <div class="row  flex justify-center" v-for="(permission, index) in permissions" :key="index">
              <q-radio class="col q-mr-xl" dense v-model="prop.node._permission" :val="permission.id"
                :color="permission.id == 1 ? 'positive' : permission.id == 2 ? 'warning' : permission.id == 3 ? 'orange' : 'negative'"
                keep-color />
            </div>
          </template>
        </q-tree>



      </q-tab-panel>
    </q-tab-panels>
    <q-card-actions v-if="exist" align="center">
      <q-btn flat icon="close" color="negative" @click="emit('reset')" />
      <q-btn flat icon="edit" color="warning" @click="modify" />
    </q-card-actions>
    <q-card-actions v-else align="center">
      <q-btn flat icon="close" color="negative" @click="emit('reset')" />
      <q-btn flat icon="check" color="positive" @click="adding" />
    </q-card-actions>
  </q-card>
</template>

<script setup>

import { ref, onMounted, computed } from 'vue';
import { useAccountStore } from 'stores/Account';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import uapi from 'src/API/UserApi';
const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();

const props = defineProps({
  modulesC: { type: Array, default: [] },
  addPuesto: { type: Object, default: {} },
  area: { type: Object, default: {} },
  permissions: { type: Object, default: {} }
})

const emit = defineEmits(['termino', 'reset'])

const tab = ref('info')
const search = ref('')

console.log(props.modulesC)

const modulesP = props.modulesC
const addPuesto = props.addPuesto
const area = props.area
const permissions = props.permissions

const modulesClu = computed(() => modulesP.filter(e => e.root == 'CLU'));
const modulesBof = computed(() => modulesP.filter(e => e.root == 'BOF'));


const optionHierarchy = computed(() => {
  if (addPuesto.hierarchy.valP) {
    return addPuesto.hierarchy.valP.hierarchy <= 1 ? ['Igual', 'Menor'] : ['Menor', 'Igual', 'Mayor']
  }
  return ['Menor', 'Igual', 'Mayor']
})

const exist = computed(() => {
  const inx = area.roles.findIndex(ar => ar.id == addPuesto.id)
  if (inx >= 0) {
    return true
  } else {
    return false
  }
})


const adding = async () => {
  if (addPuesto.hierarchy.valR == 'Mayor') {
    addPuesto.hierarchy.val = addPuesto.hierarchy.valP.hierarchy - 1
  } else if (addPuesto.hierarchy.valR == 'Igual') {
    addPuesto.hierarchy.val = addPuesto.hierarchy.valP.hierarchy
  } else if (addPuesto.hierarchy.valR == 'Menor') {
    addPuesto.hierarchy.val = addPuesto.hierarchy.valP.hierarchy + 1
  } else {
    addPuesto.hierarchy.val = 1
  }
  let data = {
    rol: {
      name: addPuesto.name,
      description: addPuesto.description,
      type_rol: addPuesto.type_rol.val.id,
      hierarchy: addPuesto.hierarchy.val,
      _area: area.id,
    },
    permissions: modulesP.filter(e => e._permission > 0)
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
    emit('termino')
  }
}

const modify = async () => {
  let data = {
    rol: {
      id: addPuesto.id,
      name: addPuesto.name,
      description: addPuesto.description ? addPuesto.description : '',
    },
    permissions: modulesP.filter(e => e._permission > 0)
  }
  console.log(data);

  const resp = await uapi.modifyPuesto(data)
  if (resp.error) {
    alert('No se modifico el puesto')
  } else {
    console.log(resp)
    $q.notify({
      message: 'Puesto Modificado :)',
      type: 'positive',
      position: 'center'
    })
    emit('termino')
  }
}
</script>

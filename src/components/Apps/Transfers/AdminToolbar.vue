<template>
  <div class="bg-blue-1">
    <q-btn color="primary" icon="add" label="Nuevo" @click="wndForm.state = true" />

    <q-dialog v-model="wndForm.state" persistent>
      <q-card>
        <q-card-section class="row items-center justify-between">
          <div class="text-blue-10">
            <q-icon name="add" class="fs-inc2"/>
            <span>NUEVO TRASPASO</span>
          </div>
          <q-btn round flat icon="close" color="negative" v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-md q-gutter-md" horizontal>
          <label class="col">
            <q-select
              v-model="wndForm.wh1"
              :options="optsOrigin"
              filled option-label="name"
              @update:model-value="checkDestiny"
              :label="wndForm.bidir ? 'Almacen' : 'Origen'"
            />
          </label>
          <q-btn flat color="primary"
            :icon="wndForm.bidir ? 'fas fa-right-left':'fas fa-right-long'"
            @click="wndForm.bidir = !wndForm.bidir"
          />
          <label class="col">
            <q-select
              v-model="wndForm.wh2"
              :options="optsTarget"
              filled option-label="name"
              :label="wndForm.bidir ? 'Almacen' : 'Destino'"
            />
          </label>
        </q-card-section>
        <q-card-section>
          <q-select
            filled
            v-model="wndForm.users"
            :options="usersav"
            label="Participantes"
            multiple
            option-label="name"
        >
          <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
            <q-item v-bind="itemProps">
              <q-item-section>
                <q-item-label>{{ `${opt.name} ${opt.surnames}` }}<br>({{opt.nick}})</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ opt.rol.name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn unelevated color="primary" icon="check" no-caps label="Crear" @click="create" v-if="showBtnSave"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import api from 'src/API/AppTransfers';

const wndForm = ref({
  state:false,
  wh1:undefined,
  wh2:undefined,
  users:[],
  bidir:false
})

const warehouses = ref([]);
const usersav = ref([]);
const optsOrigin = computed(() => warehouses.value);
const optsTarget = computed(() => wndForm.value.wh1 ? warehouses.value.filter( wh => wh.id!=wndForm.value.wh1.id):warehouses.value);
const transferists = computed(() => wndForm.value.users.map( u => u.id))
const showBtnSave = computed(() => transferists.value.length && wndForm.value.wh1 && wndForm.value.wh2)

const $emit = defineEmits(["created"]);

const checkDestiny = () => {
  (wndForm.value.wh2 && (wndForm.value.wh2.id == wndForm.value.wh1.id)) ? wndForm.value.wh2=undefined:null
}

const create = async() => {
  let data = {
    transferists:transferists.value,
    wh1:wndForm.value.wh1.id,
    wh2:wndForm.value.wh2.id,
    bidir:wndForm.value.bidir
  }

  const resp = await api.create(data);
  console.log(resp)
  $emit("created",resp)
}

const clear = () => {
  wndForm.value.wh1=undefined,
  wndForm.value.wh2.id=undefined,
  wndForm.value.bidir=false;
  wndForm.value.users=[];
  wndForm.value.state=false;
}

const init = async() => {
  /**
   * traer almacenes de esta sucursal
   * traer usuarios de esta sucursal
   */
  const resp = await api.adminview({store:1})

  warehouses.value = resp.warehouses
  usersav.value = resp.users
  console.log(resp)
}

defineExpose({ clear })
init();
</script>

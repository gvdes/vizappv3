<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div class="col anek-bld text-grey-9 q-pl-sm">Recursos Humanos</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
        </div>
      </div>
    </div>

    <q-table
      :rows="devices"
      :columns="table.columns"
      row-key="name"
      grid
      :filter="table.filter"
    >
    <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="table.filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card flat bordered  :style="`border: 3px solid ${props.row._status ? '#03C988':'#B80000'};`" @click="view(props.row)" >
            <q-card-section class="text-center">
              <div class="row">
                <div class="col">
                Sucursal
              <br>
              <strong>{{ props.row.store.name }}</strong>
              </div>
              <div class="col">
                Dispositivo
              <br>
              <strong>{{ props.row.name }}</strong>
              </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="text-center">
              <div class="row">
                <div class="col">
                Direccion Ip
              <br>
              <strong>{{ props.row.ip }}</strong>
              </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="text-center">
              <div class="row">
                <div class="col">
                Numero de Serie
              <br>
              <strong>{{ props.row.serial_number }}</strong>
              </div>
              </div>
            </q-card-section>
            <q-separator />
          </q-card>
        </div>
      </template>
  </q-table>
  </q-page>

  <q-dialog v-model="wndView" persistent>
    <q-card>
      <q-card-section class="items-center">
        <q-input v-model="device.store.name" type="text" label="Sucursal" filled disable />
        <q-separator spaced inset vertical dark />
        <q-input v-model="device.id" type="text" label="Id" filled disable />
        <q-separator spaced inset vertical dark />
        <q-input v-model="device.serial_number" type="text" label="Numero de serie" filled disable />
        <q-separator spaced inset vertical dark />
        <q-input v-model="device.name" type="text" label="Dispositivo" filled disable />
        <q-separator spaced inset vertical dark />
        <q-input v-model="device.nick_name" type="text" label="Nombre" filled />
        <q-separator spaced inset vertical dark />
        <q-input v-model="device.ip" type="text" label="IP" filled >
          <template v-slot:append>
            <q-btn color="primary" icon="sensors"  @click="ping(device.ip)" flat />
        </template>
        </q-input>


      </q-card-section>
      <q-card-actions align="center">
        <q-btn flat label="Cancel" color="negative" v-close-popup />
        <q-btn flat label="Editar" color="positive" @click="edit(device)" />
      </q-card-actions>
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
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import rhpi from 'src/API/RhApi';
import { useAccountStore } from 'stores/Account';
const $q = useQuasar();
const $router = useRouter();

const piniaAccount = useAccountStore();


const devices = ref([]);
const device = ref(null);
const wndView = ref(false)
const table = ref({
  columns:[
    {name:'id', label:'id',field: row => row.id},
    {name:'name', label:'Dispositivo',field:row => row.name},
    {name:'nick_name', label:'Nombre',field:row => row.nick_name},
    {name:'id', label:'Numero de Serie',field:row => row.serial_number},
    {name:'ip', label:'Direccion Ip',field:row => row.ip},
    {name:'store', label:'Sucursal',field:row => row.store.name}
  ],
  filter:''
})

const isMobile = computed(() => $q.platform.is.mobile);
const permissions = computed(() => piniaAccount.account.modules.filter((e) => e.module.root == '278j'))

const init = async() => {
  const resp = await rhpi.index()
  if(resp.error){
    console.log('No hay conexion');
  }else{
    console.log(resp);
    devices.value = resp

    pings(devices.value);
  }

}


const pings = async (devices) => {
  devices.forEach(e => {
    const resp = rhpi.ping(e.ip)
    resp.then(i =>{
      e._status = i })
  });
}

const ping = async (ip) => {
    $q.loading.show({message:'Haciendo Pin :P'});
    const resp = await rhpi.ping(ip)
    if(resp.error){
      console.log(resp)
    }else{
      let mssg = resp ? 'Con Conexion' : 'Sin Conexion';
      let type = resp ? 'positive' : 'negative';
      $q.notify({
        message:mssg,
        type:type,
        position:'center'
      })
      $q.loading.hide();
    }
}

const view = (row) => {
  wndView.value = true
  device.value = row
}
const edit =  async (device) => {
  $q.loading.show({message:'Editando'});
  const resp = await rhpi.edit(device);
  if(resp.error){
    console.log(resp);
  }else{
    console.log(resp);
    wndView.value = false;
    $q.notify({
      message:'Dispositivo Actualizado',
      type:'positive',
      position:'center'
    })
    $q.loading.hide();
    init()
  }
}


init()
</script>

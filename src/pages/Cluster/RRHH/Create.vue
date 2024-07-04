<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <q-btn flat rounded icon="arrow_back" @click="$router.push('/cluster/manpower')" />
        <div class="col anek-bld text-grey-9 q-pl-sm">Alta Dispositivo</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
        </div>
      </div>
    </div>

    <q-card>
      <q-card-section class="items-center">
        <q-input v-model="addDevice.ip" type="text" label="IP" filled :error="texterro" error-message="La direccion Ip ya esta esta en uso favor de intentar con otra" >
          <template v-slot:append>
            <q-btn color="primary" icon="sensors"  @click="ping" flat :disable="addDevice.ip == ''  ? true : false" v-if="!texterro"/>
        </template>
        </q-input>

        <div v-if="addDevice.state">
          <q-separator spaced inset vertical dark />

        <q-input v-model="addDevice.serial_number" type="text" label="Numero de serie" filled disable />
        <q-separator spaced inset vertical dark />
        <q-input v-model="addDevice.name" type="text" label="Dispositivo" filled disable />
        <q-separator spaced inset vertical dark />
        <q-select v-model="addDevice._store" :options="mosStor" label="Sucursal" filled option-label="name" option-value="id" />
        <q-separator spaced inset vertical dark />
        <q-input v-model="addDevice.nick_name" type="text" label="Nombre" filled />
        <q-separator spaced inset vertical dark />
        </div>
      </q-card-section>
      <q-card-actions align="center" v-if=" complete">
        <q-btn flat label="Cancel" color="negative" v-close-popup />
        <q-btn flat label="Agregar" color="positive"  @click="adding"/>
      </q-card-actions>
    </q-card>
  </q-page>
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
const stores = ref({
  opts:[],
  val:null
})
const addDevice = ref({
  state:false,
 ip:'',
 name:'',
 nick_name:'',
 serial_number:'',
 _store:'',
})

const texterro = computed(() => {
  let inx = devices.value.findIndex(e => e.ip === addDevice.value.ip)
  if(inx >= 0){
    return true
  }else{
    return false
  }
})
const mosStor = computed(() => {
  let StoreIds = devices.value.map(d => d._store)
  return stores.value.opts.filter(opt => !StoreIds.includes(opt.id))
})

const complete = computed(() =>
addDevice.value.state
&& addDevice.value.ip != ''
 && addDevice.value.name != ''
 && addDevice.value.nick_name != ''
  && addDevice.value.serial_number != ''
  && addDevice.value._store != ''
)


const init = async () => {
  const resp = await rhpi.newD();
  if(resp.error){
    console.log(resp)
  }else{
    console.log(resp)
    devices.value = resp.devices;
    stores.value.opts = resp.stores
  }
}
const ping = async () => {
  $q.loading.show({message:'Haciendo Ping :p'})
  const resp = await rhpi.pingN(addDevice.value.ip);
  if(resp.error){
    console.log(resp);
  }else{
    if(resp.data == false){
      $q.notify({
        message:'No tiene conexion el dipositivo o es otra ip',
        type:'negative',
        position:'center'
      })
      addDevice.value.ip =''
      console.log(resp)
    $q.loading.hide();
    }else{

    addDevice.value.state = true;
    addDevice.value.name = resp.data.name,
    addDevice.value.serial_number = resp.data.serial_number,
    console.log(resp)
    $q.loading.hide();
    }

  }
}
const adding = async() =>{

  const resp = await rhpi.addDevice(addDevice.value)
  console.log(resp);
  if(resp.error){
    console.log(resp)
  }else{
    $q.notify({
      message:`se creo correctamente el dispositivo con id ${resp.id}`,
      type:'positive',
      position:'center'
    })
    init()
    addDevice.value.state=false
    addDevice.value.ip=''
    addDevice.value.name=''
    addDevice.value.nick_name=''
    addDevice.value.serial_number=''
    addDevice.value._store=''

  }
}
init()
</script>

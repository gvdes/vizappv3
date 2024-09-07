<template>
  <q-page padding>

    <div class="flex justify-center">
      <div class="text-center " :style="`width: 50%;`">
        <q-form @submit="onSubmit">
          <q-input v-model="order" type="number" label="Pedido" :color="message == 1 ? 'green' : 'red'" autofocus
            :bg-color="message == 1 ? 'green-1' : 'red-1'" rounded outlined />
          <div :class="`text-center text-${message == 1 ? 'green' : 'red'}`">
            {{ message == 1 ? 'Servicio Encendido' : 'Servicio Apagado' }}
          </div>
        </q-form>
      </div>
    </div>

    <q-table
      :rows="orders"
      row-key="name"
      grid
      :pagination="pagination"
      hide-bottom
    >
    <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4" >
          <q-list bordered>
            <q-item clickable v-ripple @click="changeStatus(props.row)">
              <q-item-section>
                <q-item-label class="text-center text-bold">{{ props.row.id }}</q-item-label>
                <q-item-label class="text-center">{{ props.row.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </template>
    </q-table>


  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import pvtpi from 'src/API/PreordersApi.js'
import { $sktpvt } from 'boot/socket'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'stores/Account';
import PreordersApi from 'src/API/PreordersApi.js';
import Accounts from 'src/API/Accounts';
const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();

$sktpvt.connect();
$sktpvt.on('connect', () => {
  console.log('Conectado al servidor')
  $sktpvt.emit('ParametrosConexion', piniaAccount)
});

$sktpvt.on('changeStateConfig', (params) => {
  const id =  params._state_order
  console.log(params)
  if(id == 2){

    let inx = configs.value.findIndex(e => e._state_order == id)
    console.log()
    configs.value[inx] = params
    if(params.active == 1){
      getOrders()
      $q.notify({message:'Servicion Encendido',type:'positive',position:'center'})
    }else{
      console.log('cambia los pendientes')
      $q.notify({message:'Servicion Apagado',type:'negative',position:'center'})
    }
  }
})

$sktpvt.on('Checkin', (params)=>{
  console.log(params)
  orders.value.push(params)
})

const order = ref(null)

const orders = ref([]);
const configs = ref([]);
const pagination = ref({rowsPerPage:[0]})

const message = computed(() => configs.value.filter(c => c._state_order == 2)[0]?.active)

const init = async () => {
  const resp = await pvtpi.getConfig();
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp)
    configs.value = resp
    let act = configs.value.filter(c => c._state_order == 2)[0]?.active
    if(act == 1){
      getOrders();
    }
  }
}

const getOrders = async() => {
  console.log('pbteniendo ordenes :) ')
  const resp = await pvtpi.index()
  if(resp.error){
    console.log(resp)
  }else{
    console.log(resp);
    orders.value = resp.preorders.filter(e => e.state.id == 2);
  }
}
const changeMasive = () => {
  console.log('cambiando todos de status')
}

const onSubmit = () => {
  console.log('enviadisimo')
  let inx = orders.value.findIndex(e => e.id == order.value)
  if(inx >=0){
    changeStatus(orders.value[0])
  }else{
    $q.notify({message:'El pedido no existe', type:'negative', position:'center'})
    order.value = null
  }
}

const changeStatus = async (pedido) => {
  console.log(pedido)//se tiene que revisar primero la configuracion para ver a donde va primero el pedido si a por surtir o a por validar
  // $q.loading.show({message:'Guardando Pedido :p'});
  //el tipo es el 7 siempre en el proceso
  const resp = await pvtpi.changeStatus(pedido);
  if(resp.error){
    console.log(resp)
  }else{
    $sktpvt.emit('ChangeStatusOrder', resp)
    console.log(resp)
    let inx = orders.value.findIndex(e => e.id == resp.id)
    orders.value.splice(inx,1)

    order.value = null
    $q.notify({
      message:'Pedido enviado',
      type:'positive',
      position:'center'
    })
  }
}

init()
</script>

<template>
  <q-page>
    <div class="bg-white">
      <div class="q-pa-sm row items-center">
        <!-- <q-btn flat round dense icon="menu" /> -->
        <div class="col anek-bld text-grey-9 q-pl-sm">Peeventa</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
          <q-btn flat rounded icon="support" />
        </div>
      </div>
      <q-separator />
    </div>
    <q-separator spaced inset vertical dark />

    <q-dialog v-model="wndOrder" persistent>
      <q-card>
        <q-card-section class="row items-center bg-primary text-white">
          <q-icon name="list" />
          <span class="q-ml-sm">Nevo Pedido</span>
        </q-card-section>
        <q-card-section>
          <q-select v-model="client.val" :options="client.filter" option-label="name" label="Cliente" use-input
            input-debounce="0" @filter="filterFn" @new-value="createValue">
            <template v-slot:prepend>
              <q-btn color="primary" icon="person" title="client" flat @click="client.state = !client.state" />
            </template>
          </q-select>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat title="Cancelar" color="negative" v-close-popup icon="close" />
          <q-btn flat color="positive" icon="check" @click="createdOrder" />
        </q-card-actions>
      </q-card>
    </q-dialog>



    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn fab icon="add" color="primary" @click="newOrder" />
    </q-page-sticky>


  </q-page>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import pvtpi from 'src/API/PreordersApi.js'
import { $sktpvt } from 'boot/socket'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'stores/Account';

const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();

$sktpvt.connect();
$sktpvt.on('init', init => {
  console.log('----------------------------')
  console.log(`Se conecto el compa en preventa ${init}`)
  console.log('-----------------------------')
});
$sktpvt.on('creandoPedido', init => console.log(init));






const wndOrder = ref(false)
const client = ref({
  state: false,
  val: null,
  opts: [],
  filter: []
})
const init = async () => {
  $q.loading.show({ message: 'Cargando...' });

  const resp = await pvtpi.index()
  if (resp.error) {
    console.log(resp)
  } else {
    client.value.opts = resp.clients
    console.log(resp.clients)
    $q.loading.hide();
  }
}

const newOrder = () => {
  wndOrder.value = true
  let data = {
    usuario:'hugo',
    sucursal:'cedis'
  }
  $sktpvt.emit('creandoPedido', data)
}

const filterFn = (val, update) => {
  update(() => {
    if (val === '') {
      client.value.filter = client.value.opts
    }
    else {
      const needle = val.toLowerCase()
      client.value.filter = client.value.opts.filter(
        v => v.name.toLowerCase().indexOf(needle) > -1
      )
    }
  })
}

const createValue = (val, done) => {
  if (val.length > 2) {
    if (!client.value.opts.includes(val)) {
      done(val, 'add-unique')
    }
  }
}
const createdOrder = async () => {
  let data = {
    _client: typeof(client.value.val) ==='string' ? 0 : client.value.val.id,
    name: typeof(client.value.val) ==='string' ? client.value.val : client.value.val.name,
  }
  const resp = await pvtpi.create(data);
  if(resp.error){
    $q.notify({
      message:`${resp.error}`,
      type:'negative',
      position:'center'
    })
  }else{
    $q.notify({
      message:`El Pedido ${resp.id} se creo`,
      type:'positive',
      position:'center'
    })
    $router.push(`/store/${piniaAccount.join}/preorders/${resp.id}/`);
  }
}

init()
</script>

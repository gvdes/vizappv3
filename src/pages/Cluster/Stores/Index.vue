<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <q-btn flat rounded icon="filter_alt" @click="filter.state = !filter.state" />
        <div class="col anek-bld text-grey-9 q-pl-sm">Sucursales</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
        </div>
      </div>
    </div>

    <q-dialog v-model="filter.state">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6 text-center"><q-icon name="filter_alt" /> Filtros</div>
        </q-card-section>
        <q-card-section class=" row items-center">
          <q-separator spaced inset vertical dark />
          <q-select dense class="col" v-model="filter.conect.val" :options="filter.conect.opts" label="Conexion"
            option-label="name" filled outlined />
          <q-separator spaced inset vertical dark />
          <q-select dense class="col" v-model="filter.status.val" :options="filter.status.opts" label="Estado"
            option-label="name" filled outlined />
          <q-separator spaced inset vertical dark />
          <q-select dense class="col" v-model="filter.type.val" :options="filter.type.opts"
            label="Tipo" option-label="name" filled outlined />
          <q-separator spaced inset vertical dark />
          <q-select dense class="col" v-model="filter.price.val" :options="filter.price.opts" label="Tipo Precio"
            option-label="name" filled outlined />
          <q-separator spaced inset vertical dark />
          <q-icon name="close" @click="delfil" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <liststore :stores="stores" :filter="filter" :search="search"></liststore>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab color="primary" icon="settings" position="bottom-right" direction="left">
        <q-fab-action color="primary" @click="addStore" icon="add_business" label="Agregar" />
      </q-fab>
    </q-page-sticky>


  </q-page>
</template>

<script setup>
import axios from 'axios'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import sapi from 'src/API/StoresApi';
import liststore from 'src/components/Stores/Index/StoreList.vue';
const $q = useQuasar();
const $router = useRouter();


const stores = ref([])

const filter = ref({
  state: false,
  conect:{val:null, opts:[{id:true,name:'Con Conexion'},{id:false,name:'Sin Conexion'}]},
  status:{val:null, opts:null},
  type:{val:null, opts:null},
  price:{val:null, opts:null},
})
const search = ref('')



const init = async () => {
  $q.loading.show({ message: "Cargando Sucursales..." });
  const resp = await sapi.index();
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp)
    stores.value = resp
    filter.value.status.opts = resp.states
    filter.value.type.opts = resp.types
    filter.value.price.opts = resp.prices
    $q.loading.hide();
  }
  stores.value.stores.forEach((e)=> {
    let ip = e.local_domain+':'+e.local_port
    ping(ip, e.id);
  })
};

const ping = async (domain, e) => {
  const url = 'http://'+domain+'/addicted/public/api/resources/ping';
  try {
    const data =  await axios.get(url,{timeout:24000})
    // console.log(data)
    if(data.status == 200){
      let inx = stores.value.stores.findIndex((i) => i.id == e );
      stores.value.stores[inx].ping = true
    }
  }catch (error) {
  }
}


const delfil = () => {
  filter.value.conect.val = null;
  filter.value.status.val = null;
  filter.value.type.val = null;
  filter.value.price.val = null;
}

const addStore = () => {
  console.log("Redirecciona al formulario");
  $router.replace(`/cluster/stores/create`);
}


init()
</script>

<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div @click="$router.push('/cluster/stores')"> <q-icon size="30px" name="arrow_back" /></div>
        <div class="col anek-bld text-grey-9 q-pl-sm">Creacion de Sucursal</div>
      </div>
    </div>

    <div>

      <q-tabs v-model="tab" class="text-primary">
        <q-tab name="general" icon="settings" label="General" />
        <q-tab name="seasons" icon="view_cozy" label="Temporadas" />
      </q-tabs>


      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="general">
          <q-card-section>
            <q-input dense v-model="data.name" type="text" label="Nombre" error-message="El nombre ya esta en uso"
              :error="validname" />
            <q-separator spaced inset vertical dark />
            <q-input dense v-model="data.alias" type="text" label="Alias" error-message="El alias ya esta en uso"
              :error="validalias" mask="AAA" />
            <q-separator spaced inset vertical dark />
            <q-input v-model="data.access_file" type="text" label="Nombre Access"
              error-message="El archivo access ya esta en uso" :error="validacces" mask="AAA####"/>
            <q-separator spaced inset vertical dark />
            <div class="row">
              <q-input class="col" v-model="data.local_domain" type="text" label="Direccion IP"
                error-message="La ip y puerto ya estan en uso" :error="validlocal" />
              <q-separator spaced inset vertical dark />
              <q-input class="col" v-model="data.local_port" type="text" label="Puerto"
                error-message="La ip y puerto ya estan en uso" :error="validlocal" />
              <q-separator spaced inset vertical dark />
              <q-btn dense flat color="primary" icon="sensors" title="ping" @click="ping(data.local_domain,data.local_port)" />
            </div>
            <q-separator spaced inset vertical dark />
            <div class="row">
              <q-input class="col" v-model="data.domain" type="text" label="Dominio Externo"
                error-message="El dominio y puerto ya estan en uso" :error="validomain" />
              <q-separator spaced inset vertical dark />
              <q-input class="col" v-model="data.port" type="text" label="Puerto Externo"
                error-message="El dominio y puerto ya estan en uso" :error="validomain" />
              <q-separator spaced inset vertical dark />
              <q-btn dense flat color="primary" icon="sensors" title="ping" @click="ping(data.domain,data.port)" />
            </div>
            <q-separator spaced inset vertical dark />
            <div class="row">
              <q-select class="col" v-model="data.state" :options="stores.states" option-label="name" label="Estado"
                filled />
              <q-separator spaced inset vertical dark />
              <q-select class="col" v-model="data.type" :options="stores.types" option-label="name" label="Tipo" filled />
              <q-separator spaced inset vertical dark />
              <q-select class="col" v-model="data.price" :options="stores.prices" option-label="name" label="Tipo Precio"
                filled />
            </div>
          </q-card-section>
        </q-tab-panel>
        <q-tab-panel name="seasons">
          <q-option-group v-model="data.groupoption" :options="opts" color="primary" type="toggle" />
        </q-tab-panel>


      </q-tab-panels>
      <div class="flex justify-end">
        <q-btn class="full-width" outline rounded label="Enviar" color="primary" @click="onSubmit"
          :disable="validchange" />
      </div>


    </div>


  </q-page>
</template>

<script setup>
import axios from 'axios'
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar';
import sapi from 'src/API/StoresApi';
const $q = useQuasar();

const data = ref({
  name: '',
  alias: '',
  access_file: '',
  local_domain: '',
  local_port: '',
  domain: '',
  port: '',
  state: null,
  type: null,
  price: null,
  groupoption: []
})


const stores = ref({ stores: [], seasons: [] })

const tab = ref('general');



const validname = computed(() => {
  let nkmil = stores.value.stores.filter((e) => e.name.toUpperCase() == data.value.name.toUpperCase());
  return nkmil.length >= 1 ? true : false;
});
const validalias = computed(() => {
  let nkmil = stores.value.stores.filter((e) => e.alias.toUpperCase() == data.value.alias.toUpperCase());
  return nkmil.length >= 1 ? true : false;
});
const validacces = computed(() => {
  let nkmil = stores.value.stores.filter((e) => e.access_file.toUpperCase() == data.value.access_file.toUpperCase());
  return nkmil.length >= 1 ? true : false;
});
const validlocal = computed(() => {
  let nkmil = stores.value.stores.filter((e) => e.local_domain + e.local_port == data.value.local_domain + data.value.local_port);
  return nkmil.length >= 1 ? true : false;
});
const validomain = computed(() => {
  let nkmil = stores.value.stores.filter((e) => e.domain.toUpperCase() + e.port == data.value.domain.toUpperCase() + data.value.port);
  return nkmil.length >= 1 ? true : false;
});

const validchange = computed(() => {
  if (
  (data.value.name.length > 2) &&
  (data.value.alias.length == 3) &&
  (data.value.access_file.length == 7)&&
  (data.value.local_domain.length > 6) &&
  (data.value.local_port.length > 3) &&
  (data.value.domain.length > 6) &&
  (data.value.port.length > 3) &&
  (data.value.state)&&
  (data.value.price)&&
  (data.value.type) &&
  (data.value.groupoption.length >= 1)
  )  {
    if (validname.value || validalias.value || validacces.value || validlocal.value || validomain.value) {
      return true
    } else {
      return false
    }
  } else {
    return true
  }

})


const opts = computed(() => stores.value.seasons.map(o => {
  return { value: o.id, label: o.name }
}))


const init = async () => {
  $q.loading.show({ message: "Cargando Sucursales..." });
  const resp = await sapi.index(2);
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp)
    stores.value = resp
    $q.loading.hide();
  }
};

const onSubmit = async() => {
  $q.loading.show({ message: "Enviando Datos ..." });
  const resp = await sapi.addStore(data.value);
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp)
    $q.loading.hide();
    data.value.name= ''
    data.value.alias= ''
    data.value.access_file= ''
    data.value.local_domain= ''
    data.value.local_port= ''
    data.value.domain= ''
    data.value.port= ''
    data.value.state= null
    data.value.type= null
    data.value.price= null
    data.value.groupoption= []
    tab.value = 'general';
    $q.notify({
      type:'positive',
      message:`La sucursal ${resp.name} se creo correctamente con el id ${resp.id}`,
      position:'center'
    })
  }
}

const ping = async(domain,port) => {
  const notif = $q.notify({
          type: 'ongoing',
          message: 'Realizando Prueba de Conexion...',
          position:'center'
        })
  const url = 'http://'+domain +':'+ port+'/Addicted/public/api/resources/ping';
  try {
    const data =  await axios.get(url, {timeout:2000})
    console.log(data)
    if(data.status == 200){
      notif({
        type:'positive',
        message:'Conexion Exitosa',
        position:'center'
      })
    }
  }catch (error) {
    console.log(error)
    notif({
        type:'negative',
        message:'Sin Conexion',
        position:'center'
      })
  }
}

init();

</script>

<template>
  <q-page padding>
    <div v-for="(provider, index) in providers" :key="index">
      <q-card class="my-card" @click="prov(provider)">
        <q-card-section>
          <div class="text-h6">{{provider.fiscal_name}}</div>
          <div class="text-subtitle4"> Domicilio : {{JSON.parse(provider.address).domicilio}}</div>
          <div class="text-subtitle4"> Poblacion : {{JSON.parse(provider.address).poblacion}}</div>
          <div class="text-subtitle4"> Delegacion : {{JSON.parse(provider.address).delegacion}}</div>
          <div class="text-subtitle4"> C.P. : {{JSON.parse(provider.address).codigo_postal}}</div>
        </q-card-section>
      </q-card>
      <q-separator spaced inset vertical dark />
    </div>

    <q-dialog v-model="editprov.state" >
      <q-card class="my card" style="width: 500px;">
        <q-card-section class="flex justify-center">
          <q-avatar size="100px" font-size="52px" color="teal" text-color="white" icon="person" />
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-center">{{editprov.body.fiscal_name}}</div>
          <q-input v-model="editprov.body.fiscal_name" type="text" label="Nombre" />
          <q-input v-model="JSON.parse(editprov.body.address).domicilio" type="text" label="Domicilio" />
          <q-input v-model="JSON.parse(editprov.body.address).poblacion" type="text" label="Poblacion" />
          <q-input v-model="JSON.parse(editprov.body.address).delegacion" type="text" label="Delegacion" />
          <q-input v-model="JSON.parse(editprov.body.address).codigo_postal" type="text" label="Codigo Postal" />
        </q-card-section>
        <q-card-actions  align="right">
          <q-btn color="negative" label="Cancelar" v-close-popup />
          <q-btn color="positive" label="Enviar" :disable="verificar"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab color="primary" icon="settings" position="bottom-right" direction="left">
        <q-fab-action color="primary" @click="addprovider" icon="person_add" label="Agregar" />
      </q-fab>
    </q-page-sticky>


  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import papi from 'src/API/ProvidersApi';
const $q = useQuasar();
const $router = useRouter();

const providers = ref([]);
const editprov = ref({
  state:false,
  body:null
})

const verificar = computed(() => {
  return editprov.value.body.fiscal_name === providers.value.filter((e) => e.id === editprov.value.body.id)[0].fiscal_name
})

const prov = async(provider) =>{
  editprov.value.state = true;
  console.log(provider.id)
  let pro = providers.value.findIndex((e) => e.id == provider.id)
  editprov.value.body = JSON.parse(JSON.stringify(providers.value[pro]))
}

const addprovider = () =>{
  console.log("Redirecciona al formulario");
  $router.replace(`/cluster/providers/create`);
}



const init = async () => {
  $q.loading.show({ message: "Cargando Proveedores..." });
  const resp = await papi.index();
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp)
    providers.value = resp
    $q.loading.hide();
  }
};

init()
</script>

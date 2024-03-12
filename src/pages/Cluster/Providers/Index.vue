<template>
  <q-page padding>
    <q-input v-model="filpro" type="text" label="Buscar" />
    <div v-for="(provider, index) in listpro" :key="index">
      <q-separator spaced inset vertical dark />
      <q-card class="my-card" @click="prov(provider)">
        <q-card-section>
          <div class="row">
            <div class="text-h6 col">{{ provider.fiscal_name }}</div>
            <div class="flex justify-top">
              <q-badge align="middle" :color="provider.type.id == 1 ? 'primary' : 'secondary'">{{ provider.type.name }}</q-badge>
              <q-separator spaced inset vertical dark />
              <q-badge align="middle" :color="provider._state.id == 1 ? 'negative' : 'positive'">{{ provider._state == 1 ? "On" : "Off" }}</q-badge>
            </div>
          </div>
          <q-separator spaced inset vertical dark />
          <div class="text-subtitle4"> Domicilio : {{ JSON.parse(provider.address).domicilio }}</div>
          <q-separator spaced inset vertical dark />
          <div class="text-subtitle4"> Poblacion : {{ JSON.parse(provider.address).poblacion }}</div>
          <q-separator spaced inset vertical dark />
          <div class="text-subtitle4"> Delegacion : {{ JSON.parse(provider.address).delegacion }}</div>
          <q-separator spaced inset vertical dark />
          <div class="text-subtitle4"> C.P. : {{ JSON.parse(provider.address).codigo_postal }}</div>

        </q-card-section>
      </q-card>
      <q-separator spaced inset vertical dark />
    </div>

    <q-dialog v-model="editprov.state">
      <q-card class="my card" style="width: 500px;">
        <q-card-section class="flex justify-center">
          <q-avatar size="100px" font-size="52px" color="teal" text-color="white" icon="person" />
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-center">{{ editprov.body.fiscal_name }}</div>
          <q-list bordered>
            <q-item>
              <q-item-section class="text-center">
                <q-item-label caption> ID</q-item-label>
                <q-item-label>{{ editprov.body.id }}</q-item-label>
              </q-item-section>
              <q-item-section class="text-center">
                <q-item-label caption> ID FACTUSOL</q-item-label>
                <q-item-label v-if="editprov.body.fs_id == null">
                  <q-btn color="primary" flat label="ID FACTUSOL" @click="replyProv" />
                </q-item-label>
                <q-item-label v-else>{{ editprov.body.fs_id }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-input v-model="editprov.body.fiscal_name" type="text" label="Nombre" />
          <q-input v-model="JSON.parse(editprov.body.address).domicilio" type="text" label="Domicilio" />
          <q-input v-model="JSON.parse(editprov.body.address).poblacion" type="text" label="Poblacion" />
          <q-input v-model="JSON.parse(editprov.body.address).delegacion" type="text" label="Delegacion" />
          <q-input v-model="JSON.parse(editprov.body.address).codigo_postal" type="text" label="Codigo Postal" />
          <q-separator spaced inset vertical dark />
          <q-list bordered>
            <q-item>
              <q-item-section class="text-center">
                <q-item-label >Tipo</q-item-label>
                <q-item-label >
                  <q-select v-model="editprov.body.type" :options="types" option-label="name" label="Tipo" filled />
                </q-item-label>
              </q-item-section>
              <q-item-section class="text-center">
                <q-item-label >Estado</q-item-label>
                <q-select v-model="states.val" :options="states.opts" option-label="name" label="Standard" filled />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="negative" label="Cancelar" v-close-popup />
          <q-btn color="positive" label="Enviar" @click="envform"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab color="primary" icon="settings" position="bottom-right" direction="left">
        <q-fab-action color="primary" @click="addprovider" icon="person_add" label="Agregar" />
      </q-fab>
    </q-page-sticky>

    <q-dialog v-model="state" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="change_circle" color="primary" text-color="white" />
          <span class="q-ml-sm">Desea aplicar los cambios?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="No" color="negative" v-close-popup />
          <q-btn flat label="Si" color="positive" @click="changedb"/>
        </q-card-actions>
      </q-card>
    </q-dialog>


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
const state = ref(false);
const editprov = ref({
  state: false,
  body: null
})
const filpro = ref('')

const types = ref([]);

const states = ref({
  val:null,
  opts:[{
    name:'On',
    id:1
  },{
    name:'Off',
    id:0
  }]
})

const listpro = computed(() => providers.value.filter(e => e.fiscal_name.toLowerCase().includes(filpro.value.toLowerCase())));

const prov =  (provider) => {
  editprov.value.state = true;
  console.log(provider.id)
  states.value.val = provider._state == 1 ? {id:provider._state, name:'On'} : {id:provider._state, name:'Off'}
  editprov.value.body = provider
}

const addprovider = () => {
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
    providers.value = resp.providers
    types.value = resp.types
    $q.loading.hide();
  }
};

const replyProv = async () => {
  console.log('envia proveedores')
}

const envform = async() =>{
  state.value = true;
}

const changedb = async() => {
  console.log(editprov.value.body);
  const resp = await papi.update(editprov.value.body);
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp)
  }
}

init()
</script>

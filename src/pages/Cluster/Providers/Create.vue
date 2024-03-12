<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div @click="$router.push('/cluster/providers')"> <q-icon size="30px" name="arrow_back" /></div>
        <div class="col anek-bld text-grey-9 q-pl-sm">Creacion de Proveedores</div>
      </div>
    </div>

    <q-form
      @submit="onSubmit"
      class="q-gutter-md"
    >
    <q-card class="my-card">
      <q-card-section>
            <q-input dense v-model="data.fiscal_name" type="text" label="Nombre" :error="!validname" :error-message="`El Nombre ${data.fiscal_name} ya esta en uso`"/>
            <q-separator spaced inset vertical dark />
            <q-input dense v-model="data.address.domicilio" type="text" label="Domicilio" />
            <q-separator spaced inset vertical dark />
            <q-input v-model="data.address.poblacion" type="text" label="Poblacion" />
            <q-separator spaced inset vertical dark />
            <q-input v-model="data.address.delegacion" type="text" label="Delegacion" />
            <q-separator spaced inset vertical dark />
            <q-input v-model="data.address.codigo_postal" type="text" label="Codigo Postal" mask="######" />
            <q-separator spaced inset vertical dark />
            <q-select v-model="data._type" :options="types" option-label="name" label="Tipo Proveedor" filled />

      </q-card-section>
    </q-card>

      <div>
        <q-btn :disable="!validform"  class="full-width" rounded label="Enviar" type="submit" color="primary"/>
        <!-- <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" /> -->
      </div>
    </q-form>

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
const types = ref([])

const validname = computed(() => {
  let inx = providers.value.findIndex((e) => e.fiscal_name.toUpperCase() == data.value.fiscal_name.toUpperCase())
  if(inx < 0){
    return true
  }else{
    return false
  };
})

const validform = computed(() => {
  if(data.value.fiscal_name.length > 1 && data.value.address.domicilio && data.value.address.poblacion && data.value.address.delegacion && data.value.address.codigo_postal && data.value._type && (validname.value == true) ){
    return true
  }else{
    return false
  }
 })

const data = ref({
  fiscal_name:'',
  address:{
    domicilio:null,
    poblacion:null,
    delegacion:null,
    codigo_postal:null
  },
  _type:null
})

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

const onSubmit = async() => {
  console.log(data.value);
  $q.loading.show({message:"Enviando Informacion"});
  const resp = await papi.create(data.value);
  if (resp.error) {
    console.log(resp);
    $q.notify({
      type:'negative',
      message:resp,
      icon:'close',
      position:'center'
    })
  } else {
    console.log(resp)
    data.value.fiscal_name = ''
    data.value.address.domicilio = null
    data.value.address.poblacion = null
    data.value.address.delegacion = null
    data.value.address.codigo_postal = null
    data.value._type = null
    $q.loading.hide();
    $q.notify({
      type:'positive',
      message:`Proveedor Creado id ${resp.id}`,
      icon:'check',
      position:'center'
    })
    providers.value.push(resp)
  }
}

init();
</script>

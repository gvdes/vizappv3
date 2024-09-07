<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div class="col anek-bld text-grey-9 q-pl-sm">Formularios</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
          <q-btn flat rounded icon="add" @click="viewNewForm = !viewNewForm" />

        </div>
      </div>
    </div>




    <q-list bordered>
      <q-item clickable v-ripple v-for="(form, index) in forms" :key="index">
        <q-item-section @click="openForm(form.id)" >
          <q-item-label >{{ form.name }}</q-item-label>
          <q-item-label caption> {{ form.description }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>



    <q-dialog v-model="viewNewForm" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="text-bold text-center">
          Nuevo Formulario
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
          >
          <q-input v-model="nweForm.name" type="text" label="Nombre" filled />
          <q-separator spaced inset vertical dark />
          <q-input v-model="nweForm.description" type="text" label="Desctipcion" filled/>
          <q-separator spaced inset vertical dark />
          <q-select v-model="nweForm._type" :options="types" label="Tipo" filled  option-label="name"/>
          <q-separator spaced inset vertical dark />
          <q-select v-model="nweForm._responsible" :options="responsibles" label="Quien debe contestar" filled  option-label="name"/>
            <div class="flex justify-center">
              <q-btn label="Cancelar" type="reset" color="negative" flat  />
              <q-btn label="Crear" type="submit" color="positive" flat class="q-ml-sm" :disable="!validForm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, watch, onBeforeMount, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, LocalStorage, Loading } from 'quasar';
import { useAccountStore } from 'stores/Account';
import indpi from 'src/API/IndicatorApi.js'

const $q = useQuasar();
const $route = useRoute();
const $router = useRouter()
const piniaAccount = useAccountStore();

const forms = ref([])
const types = ref([])
const responsibles = ref([])

const nweForm = ref({
  name:null,
  description:null,
  _type:null,
  _responsible:null
})

const viewNewForm = ref((false));

const validForm = computed(() => (nweForm.value.name != null  && nweForm.value.description != null &&  nweForm.value._type != null && nweForm.value._responsible != null))


const init = async() => {
  const resp = await indpi.getForms()
  if(resp.error){
    console.log(resp)
  }else{
    console.log(resp);
    forms.value = resp.forms
    types.value = resp.types
    responsibles.value = resp.responsibles
  }
}

const onSubmit = async() => {
  console.log(nweForm.value)
  const resp = await indpi.addForm(nweForm.value);
  if(resp.error){
    console.log(resp)
  }else{
    console.log(resp)
    forms.value.push(resp)
    $q.notify({message:`Formulario ${resp.name} creado`, type:'positive', position:'center'});
    $router.push(`/cluster/indicators/forms/${resp.id}/`);
  }

}

const openForm = (id) => {
  console.log(id)
  $router.push(`/cluster/indicators/forms/${id}/`);
}

const onReset = () => {
  nweForm.value = {
  name:null,
  description:null,
  _type:null,
  _responsible:null
}
  viewNewForm.value = false
}



init()

</script>

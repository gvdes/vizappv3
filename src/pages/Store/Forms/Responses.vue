<template>
  <q-page padding>
    <q-card class="my-card" v-if="form">
      <q-card-section>
        <div class="text-h5 text-bold text-center">{{ form.name }}</div>
        <div class="text-subtitle2 text-overline text-center">{{ form.description }}</div>
        <div class="text-subtitle text-overline text-center">{{ `Tipo ${form.type?.name} , Contesta
          ${form.responsible?.name}` }}</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md ">

          <div class="flex justify-center">
            <q-card class="my-card">
              <q-card-section v-for="(question,index) in form.question">
                <div class="text-h6">{{ question.question }}</div>
                <div class="text-h6" v-if="question._type == 1"> <q-input v-model="question._response" type="text" label="Label" /></div>
                <div class="text-h6" v-if="question._type == 2"> <q-select v-model="question._reponse" :options="question.options" label="Opciones" option-label="option" filled /></div>\
                <div v-if="question._type == 2 && question._" ></div>
                <div class="text-h6" v-if="question._type == 4"> <q-select v-model="question._response" :options="colaborators" label="Standard" filled /> </div>
                <div class="text-h6" v-if="question._type == 3"> <q-uploader
                  url="http://localhost:4444/upload"
                  color="teal"
                  flat
                  bordered
                  style="max-width: 300px"
                /> </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="flex justify-center">
            <q-btn label="Enviar" type="submit" color="positive" flat />
            <q-btn label="Cancelar" type="reset" color="negative" flat class="q-ml-sm" />
          </div>
        </q-form>

      </q-card-section>
    </q-card>

  </q-page>
</template>

<script setup>
import { ref, watch, onBeforeMount, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, LocalStorage, Loading } from 'quasar';
import { useAccountStore } from 'stores/Account';
import indpi from 'src/API/IndicatorApi.js'
import AddProduct from 'src/components/Preorder/addProduct.vue';
import EditorProduct from 'src/components/Warehouse/EditorProduct.vue';



const $q = useQuasar();
const $route = useRoute();
const $router = useRouter()
const piniaAccount = useAccountStore();

const form = ref([]);
const colaborators = ref([])

console.log(piniaAccount.account.id)
const usersBranch = computed(() => colaborators.value.filter(e => e._store == piniaAccount.account._store && e._state == 2 && e.id != piniaAccount.account.id))

const init = async () => {
  console.log($route.params.fid)
  const resp = await indpi.getFormResp($route.params.fid)
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp)
    form.value = resp.formulario;
    form.value.question.forEach(e => e._response
    )
    colaborators.value = resp.usuarios
  }
}

const onSubmit = () => {

}

const onReset = () => {

}

init();
</script>

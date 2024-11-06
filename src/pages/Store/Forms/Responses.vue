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

          <div class="flex justify-center" v-for="(question, index) in form.question" :key="index">
            <responses :question="question" :colaborators="colaborators"></responses>

          </div>
          <div class="flex justify-center">
            <q-btn label="Enviar" type="submit" color="positive" flat />
            <q-btn label="Cancelar" type="reset" color="negative" flat class="q-ml-sm" />
          </div>
        </q-form>

      </q-card-section>
    </q-card>
    {{ form.question?.map(e => {
      return { id: e.id, response: e._response, condresp: e.conresp }
    }) }}

    <!-- {{form.question}} -->
  </q-page>
</template>

<script setup>
import { ref, watch, onBeforeMount, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, LocalStorage, Loading } from 'quasar';
import { useAccountStore } from 'stores/Account';
import indpi from 'src/API/IndicatorApi.js'
import responses from 'src/components/Form/responseQuestion.vue';



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
    form.value.question.forEach(e => e._response = null)
    colaborators.value = resp.usuarios
  }
}

const onSubmit = async () => {

 const formData = new FormData();

 formData.append('_user',piniaAccount.account.id);
 formData.append('_form',form.value._form);

 form.value.question.forEach((question, index) => {
  // Agrega los datos de la pregunta
  // console.log(question)
  formData.append(`question[${index}][id]`, question.id);
  if(question._type== 2){
    console.log(question._response?.condition)
    let condition = question._response?.condition ? null : question._response?.condition
    if(condition){
      console.log(condition)
    }else{

    }
    formData.append(`question[${index}][_response]`, question._response);
  }else{
    formData.append(`question[${index}][_response]`, question._response);
  }



  // Si hay archivos de evidencia, los agregamos también
  if (question.evidence && question.evidence.length > 0) {
    question.evidence.forEach((file, fileIndex) => {
      formData.append(`question[${index}][evidence][${fileIndex}]`, file);
    });
  }
});



//  let files =  form.value.question.filter((e, i) => e.evidence.length > 0 );
//  files[0].evidence.forEach(i => {
//   formData.append('files[]',i);
//  })
//  formData.append('id',101);

  // console.log(formData)
  // const resp = await indpi.addResponse(formData)
  // console.log(resp)

}

const onReset = () => {

}

init();
</script>

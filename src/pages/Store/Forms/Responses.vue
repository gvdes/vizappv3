<template>
  <q-page padding>


    <q-btn icon="arrow_back" @click="$router.push(`/`)" flat title="regreso" />

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
  console.log(form.value.question)
  formData.append('_user', piniaAccount.account.id);
  formData.append('_form', form.value.id);

  form.value.question.forEach((question, index) => { //inicio foreach de questions

    formData.append(`question[${index}][id]`, question.id);
    if (question._type == 2) {// pregunta tipo opciones
      let condition = question.conresp ? question.conresp : null // se pregunta si tiene respuesta dee condiciones
      if (condition) {// si hay pregunta de condiciones
        formData.append(`question[${index}][_condition]`, question.conresp); // se agrega una llave llamada condition
      }
      formData.append(`question[${index}][_option]`, question._response?.id);// se agrega la opcion
      formData.append(`question[${index}][text]`, question._response?.option);// se agrega el texto de la opion

    } else if (question._type == 3) {// pregunta tipo evidencia

    } else if (question._type == 4) {
      formData.append(`question[${index}][text]`, JSON.stringify(question._response.map(e => e.id)));
    } else {
      formData.append(`question[${index}][text]`, question._response);
    }

    if (question.evidence && question.evidence.length > 0) {
      question.evidence.forEach((file, fileIndex) => {
        formData.append(`question[${index}][evidence][${fileIndex}]`, file);
      });
    }

  }); //termino foreach de questions


  console.log(formData)
  const resp = await indpi.addResponse(formData)
  if (resp.error) {
    alert(resp);
  } else {
    $q.notify({ message: 'El formulario fue enviado', type: 'positive', position: 'center' })
  }

}

const onReset = () => {

}

init();
</script>

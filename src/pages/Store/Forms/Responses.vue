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
            <responses :question="question" :colaborators="usersBranch"></responses>

          </div>
          <div class="flex justify-center">
            <q-btn label="Enviar" type="submit" color="positive" flat
              :disable="validFormQuestion?.length > 0 || validFormCondition?.length > 0" />
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
import responses from 'src/components/Form/responseQuestion.vue';



const $q = useQuasar();
const $route = useRoute();
const $router = useRouter()
const piniaAccount = useAccountStore();

const form = ref([]);
const colaborators = ref([])
const usersBranch = computed(() => colaborators.value.filter(e => e._store == piniaAccount.join && [1,2,5].includes(e._state) && e.id != piniaAccount.account.id))


const validFormQuestion = computed(() => form.value?.question?.filter(e => e._required == 1 && e._response == null));

const validFormCondition = computed(() => {
  if (!form.value?.question) return [];

  return form.value.question
    .map(e => {
      if (e._response) {
        const condition = JSON.parse(e._response?.condition || "[]");
        if (condition.length > 0) {
          return {
            condition: condition,
            response: JSON.parse(e.conresp || "[]")
          };
        }
      }
      return null; // Evita valores nulos en caso de no cumplir la condición
    })
    .filter(e => e !== null) // Filtra elementos nulos
    .flatMap(entry => {
      const requiredQuestions = entry.condition
        .filter(item => item._required === 1)
        .map(item => item.question);

      const respondedQuestions = entry.response.map(r => r.question);

      return requiredQuestions.filter(
        question => !respondedQuestions.includes(question)
      );
    });
});


const init = async () => {
  console.log($route.params.fid)
  let sid =  piniaAccount.join

  const resp = await indpi.getFormResp($route.params.fid,sid)
  if (resp.error) {
    console.log(resp.error)
    $q.notify({message:resp.error.data, type:'negative', position:'center'})
    $router.push(`/`)
  } else {
    console.log(resp)
    form.value = resp.formulario;
    form.value.question.forEach(e => e._response = null)
    colaborators.value = resp.usuarios
  }
}

const onSubmit = async () => {
  $q.loading.show({message:'Enviando Formulario'});
  const formData = new FormData();
  console.log(form.value.question)
  formData.append('_user', piniaAccount.account.id);
  formData.append('_form', form.value.id);
  formData.append('_store', piniaAccount.join);
  form.value.question.forEach((question, index) => { //inicio foreach de questions

    formData.append(`question[${index}][id]`, question.id);
    if (question._type == 2) {// pregunta tipo opciones
      let condition = question.conresp ? question.conresp : null // se pregunta si tiene respuesta dee condiciones
      if (condition) {// si hay pregunta de condiciones
        formData.append(`question[${index}][_condition]`, question.conresp); // se agrega una llave llamada condition
      }
      if (question._response) {
        formData.append(`question[${index}][_option]`, question._response?.id);// se agrega la opcion
        formData.append(`question[${index}][text]`, question._response?.option);// se agrega el texto de la opion
      }else{
        formData.append(`question[${index}][text]`, '');// se agrega el texto de la opion
      }
    } else if (question._type == 3) {// pregunta tipo evidencia

    } else if (question._type == 4) {
      console.log(question._response)
      formData.append(`question[${index}][text]`, question._response != null ? JSON.stringify(question._response.map(e => {
        if (e.col) {
          return { col: e.col.id, qualified: e.qualified?.map(e => e.option).join(", ") }
        } else {
          return e.id
        }
      })) : '');
    } else {
      formData.append(`question[${index}][text]`, question._response ? question._response : '' );
    }

    if (question.evidence && question.evidence.length > 0) {
      question.evidence.forEach((file, fileIndex) => {
        formData.append(`question[${index}][evidence][${fileIndex}]`, file);
      });
    }

  }); //termino foreach de questions


  console.log(formData)
  let sid =  piniaAccount.join
  const resp = await indpi.addResponse(formData,sid)
  if (resp.error) {
    alert(resp);
  } else {
    $q.notify({ message: 'El formulario fue enviado', type: 'positive', position: 'center' })
    $router.push(`/`)
    $q.loading.hide()
  }

}

const onReset = () => {
  $router.push(`/`)
}

init();
</script>

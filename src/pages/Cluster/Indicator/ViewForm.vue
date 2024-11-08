<template>
  <q-page padding>
    <div class="bg-white">
      <div class="">
        <q-btn icon="arrow_back" @click="$router.push(`/cluster/indicators/forms`)" flat />
      </div>
    </div>

    <q-separator spaced inset vertical dark />
    <div class="row" style="width: 60%; margin: 0 auto;">
      <div style="width: 60%; margin: 0 auto;" class="col">
        <div>
          <q-card class="my-card" v-if="form">
            <q-card-section class="bg-blue-11 text-white">
            </q-card-section>
            <q-card-section>
              <div class="text-h5 text-bold text-center">{{ form.name }}</div>
              <div class="text-subtitle2 text-overline text-center">{{ form.description }}</div>
              <div class="text-subtitle text-overline text-center">{{ `Tipo ${form.type.name} , Contesta
                ${form.responsible.name}` }}</div>
            </q-card-section>
            <q-card-actions>

              <q-space />

              <q-btn color="grey" round flat dense :icon="expanded ? 'keyboard_arrow_up' : 'settings'"
                @click="expanded = !expanded" />
            </q-card-actions>
            <q-slide-transition>
              <div v-show="expanded">
                <q-separator />
                <q-card-section class="text-subtitle2">
                  <q-toggle v-model="form._qualified" color="primary" :trueValue="1" :falseValue="0" left-Label label="El formulario sera calificado ?"/>
                </q-card-section>
              </div>
            </q-slide-transition>
          </q-card>
        </div>

        <q-separator spaced inset vertical dark />
        <div>
          <div v-for="(question, index) in questions" :kew="index">
            <q-separator spaced inset vertical dark />
            <q-list bordered v-if="question._edit == 0">
              <q-item clickable v-ripple @click="edit(index)">
                <q-item-section>{{ `${index + 1}.- ${question.question}` }}</q-item-section>
                <q-item-section>{{ question.type.name }}</q-item-section>
                <q-item-section>{{ question._edit }}</q-item-section>
              </q-item>
            </q-list>

            <div v-if="question._edit == 1">
              <div class="row">
                <div class="col">
                  <Preguntas :question="question" :typeQuestion="typeQuestion" :isCondit="false" @delete="deleteQuest" :qualified="form._qualified">
                  </Preguntas>
                </div>
                <q-separator spaced inset vertical dark />
                <div>
                  <div> <q-btn push color="white" icon="add" dense rounded class="text-black" title="agregar pregunta"
                      @click="newQue" /></div>
                  <q-separator spaced inset vertical dark />
                </div>

              </div>
              <q-separator spaced inset vertical dark />
            </div>
          </div>
        </div>


      </div>
      <q-separator spaced inset vertical dark />
      <div>
        <div v-if="form?.question.length == 0"> <q-btn push color="white" icon="add" dense rounded class="text-black"
            title="agregar pregunta" @click="newQue" /></div>
        <q-separator spaced inset vertical dark />
      </div>



    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, onBeforeMount, onBeforeUnmount, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, LocalStorage, Loading } from 'quasar';
import { useAccountStore } from 'stores/Account';
import indpi from 'src/API/IndicatorApi.js'
import Preguntas from 'src/components/Form/questions.vue';


const $q = useQuasar();
const $route = useRoute();
const $router = useRouter()
const piniaAccount = useAccountStore();

const form = ref(null);

const questions = ref([])
const typeQuestion = ref([])
const expanded = ref(false)
const addQuestion = ref({
  question: 'Pregunta',
  type: { id: 1, name: 'Texto' },
  _required: 0,
  _edit: 1,
  options: [],
})


const newQue = async () =>{
  initEdit();
  $q.loading.show({ message: 'Agregando Pregunta' })
  addQuestion.value._form = $route.params.fid
  console.log(addQuestion.value)
  questions.value.forEach((e) => e._edit = 0);
  const resp = await indpi.AddQuestion(addQuestion.value);

  if (resp.error) {
    console.log(resp.error.data)
    alert(resp.error.data.message)
  } else {
    console.log(resp)

    resp._edit = 1
    questions.value.push(resp)
    $q.loading.hide()
  }

}




const init = async () => {
  console.log($route.params.fid)
  const resp = await indpi.getForm($route.params.fid)
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp)
    form.value = resp.form;
    questions.value = resp.form.question
    questions.value.forEach((e, i) => { i == 0 ? e._edit = 1 : e._edit = 0; })
    typeQuestion.value = resp.typequestion
  }
}



const edit = (index) => {
  // console.log(index)
  initEdit();
  questions.value.forEach((e, i) => e._edit = (i === index) ? 1 : 0);
  // console.log(questions.value)

}

const initEdit = async () => {
  console.log(questions.value.filter(e => e._edit == 1))
  const qu = questions.value.filter(e => e._edit == 1)
  if (qu.length > 0) {
    let data = qu[0];
    console.log(data)
    const resp = await indpi.editQuest(data)
    console.log(resp)

  } else {
    console.log('No hay bro')
  }

}

const deleteQuest = async (q) => {
  console.log(q)
  const resp = await indpi.deleteQuest(q)
  console.log(resp)
  if (resp.fail) {
    console.log(resp)
  } else {
    $q.notify({ message: resp.message, type: `${resp.delete ? 'positive' : 'negative'}`, position: 'center' })
    if (resp.delete) {
      let inx = questions.value.findIndex(e => e.id == q.id)
      questions.value.splice(inx, 1)
    }
  }
}

init()
</script>

<template>
  <q-page padding>
    <div class="bg-white">
      <div class="">
        <q-btn icon="arrow_back" @click="$router.push(`/cluster/indicators/forms`)"  flat/>
      </div>
    </div>
    <q-card class="my-card" v-if="form">
      <q-card-section>
        <div class="text-h5 text-bold text-center">{{ form.name }}</div>
        <div class="text-subtitle2 text-overline text-center">{{ form.description }}</div>
        <div class="text-subtitle text-overline text-center">{{ `Tipo ${form.type.name} , Contesta
          ${form.responsible.name}` }}</div>

        <div class="flex justify-center">
          <q-btn color="primary" icon="add" flat>
            <q-menu>
              <q-list style="min-width: 100px" v-for="(type, index) in typeQuestion" :key="index">
                <q-item clickable v-close-popup @click="addQuestion._type = type">
                  <q-item-section>{{ type.name }}</q-item-section>
                </q-item>
                <q-separator />
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-card-section>

      <q-card-section v-if="addQuestion._type">
        <div class="text-bold text-center text-overline  flex justify-center">Tipo de pregunta : <q-select
            v-model="addQuestion._type" :options="typeQuestion" filled option-label="name" dense /></div>
        <q-separator spaced inset vertical dark />
        <q-input v-model="addQuestion.question" type="text" label="Pregunta" filled dense />
        <q-separator spaced inset vertical dark />
        <div v-if="addQuestion._type.id == 2">
          <q-select label="agregar opciones" filled v-model="optionsQuestion" use-input use-chips multiple
            hide-dropdown-icon input-debounce="0" @new-value="createValue" dense />
          <q-separator spaced inset vertical dark />
          <q-btn v-if="optionsQuestion.length > 0" color="primary" flat :icon="addCondition.state ? 'remove' : 'add'" :label="addCondition.state ? 'Quitar condicion' : 'Agregar condicion'"
            @click="addCondition.state = !addCondition.state" />
        </div>
      </q-card-section>

      <q-card-section v-if="addCondition.state">
        <div class="text-bold  text-overline  flex justify-start row">Si la respuesta es <q-select
            v-model="addCondition.condition" :options="optionsQuestion" dense filled class="col" /> entonces:</div>
        <div class="flex justify-center" v-if="addCondition.condition">
          <q-btn color="primary" icon="add" flat>
            <q-menu>
              <q-list style="min-width: 100px" v-for="(type, index) in typeQuestion" :key="index">
                <q-item clickable v-close-popup @click="addCondition._type = type">
                  <q-item-section>{{ type.name }}</q-item-section>
                </q-item>
                <q-separator />
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-card-section>

      <q-card-section v-if="addCondition._type" class="bg-grey-4">
        <div class="text-bold text-center text-overline  flex justify-center">Tipo de pregunta : <q-select
            v-model="addCondition._type" :options="typeQuestion" filled option-label="name" dense /></div>
        <q-separator spaced inset vertical dark />
        <q-input v-model="addCondition.question" type="text" label="Pregunta" filled dense />
        <q-separator spaced inset vertical dark />
        <div v-if="addCondition._type.id == 2">
          <q-select label="agregar opciones" filled v-model="optionsQuestionCondition" use-input use-chips multiple
            hide-dropdown-icon input-debounce="0" @new-value="createValue" dense />
          <q-separator spaced inset vertical dark />
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="Agregar" color="positive" @click="addQuestionForm" />
        <q-btn flat label="Cancelar" color="negative" @click="reset" />
      </q-card-actions>

      <q-separator spaced inset vertical dark />

    </q-card>

    <q-card class="my-card">
      <q-card-section>
        <q-list bordered  dense >
          <q-item clickable v-ripple>
            <q-item-section avatar>

            </q-item-section>
            <q-item-section>Pregunta</q-item-section>
            <q-item-section>Tipo</q-item-section>
            <q-item-section>
            Opciones
            </q-item-section>
            <q-item-section>
              Condicion
            </q-item-section>

          </q-item>
        </q-list>
        <q-list bordered  dense v-for="(question, index) in questions" :key="index">
          <q-separator spaced inset vertical dark />
          <q-item clickable v-ripple @click="editQuestion(question)">
            <q-item-section avatar>
              <q-icon color="primary" name="question_mark" />
            </q-item-section>
            <q-item-section>{{ question.question }}</q-item-section>
            <q-item-section>{{ question.type.name }}</q-item-section>
            <q-item-section>
            <q-item-label overline v-for="(option,index) in question.options" :key="index">{{ option.option }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label overline  v-for="(option,index) in question.options" :key="index"> {{ option.condition ? `Condicion :${JSON.parse(option.condition).quest.condition}` : '' }}</q-item-label>
              <q-item-label overline  v-for="(option,index) in question.options" :key="index">{{ option.condition ? `Pregunta :${JSON.parse(option.condition).quest.question}` : '' }}</q-item-label>
              <q-item-label overline  v-for="(option,index) in question.options" :key="index">{{ option.condition ? `Tipo :${JSON.parse(option.condition).quest._type.name}` : '' }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced inset vertical dark />
        </q-list>
      </q-card-section>
    </q-card>

    <q-dialog v-model="editQuest" >
      <q-card style="width: 70%;">
        <q-card-section class="row items-center">
          <q-avatar icon="question_mark" color="primary" text-color="white" />
          <span class="q-ml-sm">Edicion de Pregunta :)</span>
        </q-card-section>
        <q-card-section>
          <q-select v-model="quest.type" :options=" typeQuestion" label="Tipo de Pregunta" option-label="name"  filled />
          <q-separator spaced inset vertical dark />
          <q-input v-model="quest.question" type="text" label="Pregunta" filled/>
          <q-separator spaced inset vertical dark />
          <q-select  v-if="quest.type.id == 2" v-model="quest.options"  label="Opciones" option-label="option"  filled use-input use-chips multiple
          hide-dropdown-icon input-debounce="0" @new-value="createValue" dense />
          <q-separator spaced inset vertical dark />

          <div v-if="quest.type.id == 2 && quest.options.filter(e => e.condition != null ).length > 0 ">
            <q-card-section>
              <div class="text-center"> Condiciones </div>
              <div>
                <q-select v-model="quest.options.map(e => JSON.parse(e.condition))[0].quest._type" :options="typeQuestion" label="Tipo de Pregunta" option-label="name"  dense filled />
                <q-separator spaced inset vertical dark />
                <q-input v-model="quest.options.map(e => JSON.parse(e.condition))[0].quest.question" type="text" label="Pregunta" filled dense/>
                <q-separator spaced inset vertical dark />
                <q-select v-if="quest.options.map(e => JSON.parse(e.condition))[0].quest._type.id == 2"  v-model="quest.options.map(e => JSON.parse(e.condition))[0].quest.opts"  label="Opciones" option-label="option"  filled use-input use-chips multiple
                  hide-dropdown-icon input-debounce="0" @new-value="createValue" dense />
              </div>

            </q-card-section>
          </div>



        </q-card-section>
        <!-- <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Turn on Wifi" color="primary" v-close-popup />
        </q-card-actions> -->
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
import AddProduct from 'src/components/Preorder/addProduct.vue';
import EditorProduct from 'src/components/Warehouse/EditorProduct.vue';



const $q = useQuasar();
const $route = useRoute();
const $router = useRouter()
const piniaAccount = useAccountStore();

const form = ref(null);

const questions = ref([])

const addQuestion = ref({
  question: null,
  _type: null,

})

const addCondition = ref({
  state: false,
  condition: null,
  question: null,
  _type: null
})


const optionsQuestion = ref([]);
const optionsQuestionCondition = ref([])

const typeQuestion = ref([])
const editQuest = ref(false);
const quest = ref(null)


const init = async () => {
  console.log($route.params.fid)
  const resp = await indpi.getForm($route.params.fid)
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp)
    form.value = resp.form;
    questions.value = resp.form.question
    typeQuestion.value = resp.typequestion
  }
}

const createValue = (val, done) => {
  done(val.toUpperCase(), 'add-unique')
}

const addQuestionForm = async () => {
  let data = {
    form: form.value,
    question: {quest:addQuestion.value, opts:optionsQuestion.value},
    condition: {quest:addCondition.value, opts:optionsQuestionCondition.value}
  }
  const resp = await indpi.AddQuestion(data)
  if(resp.error){
    console.log(resp)
  }else{
    console.log(resp)
    questions.value.push(resp);
    reset();
  }

}

const reset = () => {
  addQuestion.value = {
    question: null,
    _type: null,

  }
  addCondition.value = {
    state: false,
    condition: null,
    question: null,
    _type: null

  }
  optionsQuestion.value = []
  optionsQuestionCondition.value = []
}

const editQuestion = (question) => {
  editQuest.value = true
  quest.value = question;
  console.log(question)
}

const deleteQuestion = (question) => {
  console.log(question)
}


init()
</script>

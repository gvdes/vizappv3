<template>


  <q-card class="my-card">
    <q-card-section>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col"><q-input v-model="question.question" type="text" filled placeholder="Pregunta" /></div>
        <q-separator spaced inset vertical dark />
        <div class="col"><q-select v-model="question.type" :options="typeQuestion" option-label="name" :option-disable="(item) => isCondit ? item.id== 3  : null" filled /></div>
      </div>
    </q-card-section>
    <q-card-section v-if="question.type?.id == 1">
      <q-input dense readonly label="TEXTO DE RESPUESTA" />
    </q-card-section>
    <q-card-section v-if="question.type?.id == 2">
      <div v-for="(option, index) in question.options" :key="index" v-if="question.options?.length > 0">
        <q-separator spaced inset vertical dark />
        <q-input v-model="question.options[index].option" type="text" dense outlined>
          <template v-slot:append>
            <q-btn color="primary" icon="close" @click="(index) => { question.options.splice(index, 1) }" flat round
              runded title="eliminar" />
              <q-checkbox v-if="qualified == 1"  v-model="option._correct" :true-value="1" :false-value="0" />
          </template>
        </q-input>
      </div>
      <div class="q-mt-lg">
        <q-form
          @submit="() => { question.options?.push({ option: noption.val, condition: noption.condition, _correct: noption._correct }); noption.val = ''; noption.condition = JSON.stringify([]); noption._correct = 0 }"
          @reset="() => { noption.val = ''; noption.condition = [];  noption._correct = 0 }" class="q-gutter-md">
          <q-input v-model="noption.val" type="text" dense outlined placeholder="Opcion" />
        </q-form>
      </div>
    </q-card-section>
    <q-card-section v-if="question.type?.id == 3">
      <q-btn icon="ios_share" label="Anadir Archivo" disable color="grey-1" text-color="grey-14" />
    </q-card-section>
    <q-card-section v-if="question.type?.id == 4">
      <q-btn icon="person_add" label="Colaboradores" disable color="grey-1" text-color="grey-14" />
      <q-separator spaced inset vertical dark />
      <q-toggle v-model="question._breach" color="primay" label="Agregar Calificaciones" left-label :true-value="1"
        :false-value="0" />
      <q-slide-transition>
        <div v-show="question._breach == 1">
          <q-card-section>
            <div v-for="(option, index) in question.options" :key="index" v-if="question.options?.length > 0">
              <q-separator spaced inset vertical dark />
              <q-input v-model="question.options[index].option" type="text" dense outlined>
                <template v-slot:append>
                  <q-btn color="primary" icon="close" @click="(index) => { question.options.splice(index, 1) }" flat
                    round runded title="eliminar" />
                </template>
              </q-input>
            </div>
            <div class="q-mt-lg">
              <q-form
                @submit="() => { question.options?.push({ option: noption.val, condition: noption.condition }); noption.val = ''; noption.condition = JSON.stringify([]); }"
                @reset="() => { noption.val = ''; noption.condition = [] }" class="q-gutter-md">
                <q-input v-model="noption.val" type="text" dense outlined placeholder="Opcion" />
              </q-form>
            </div>
          </q-card-section>
        </div>
      </q-slide-transition>

    </q-card-section>
    <q-card-actions align="right">
      <q-btn color="grey" round flat dense :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="expanded = !expanded"
        v-if="question._type == 2 && question.options ? question.options.filter(e => JSON.parse(e.condition).length > 0).length > 0 : null || expanded == true && !isCondit" />
      <q-space />
      <q-btn flat icon="add_circle" title="Agregar Condicion"
        v-if="(question.type?.id == 2 && !expanded && question.options ? question.options.filter(e => JSON.parse(e.condition).length > 0).length <= 0 : null) && !isCondit"
        @click="expanded = !expanded" />
      <q-input v-model="question._points" type="number" label="Puntos Calificacion" v-if="qualified == 1 && question.type?.id == 2"  filled dense />
      <q-separator spaced inset vertical dark />
      <q-input v-model="question._retained" type="number" label="Puntos Retenidos" v-if="qualified == 1 && question.type?.id == 2"  filled dense />

      <q-btn flat icon="delete" title="eliminar"
        @click="isCondit ? deleteCondition(question) : deleteQuestion(question)" />
      <q-toggle v-model="question._required" color="primay" label="Obligatorio" left-label :true-value="1"
        :false-value="0" />
    </q-card-actions>
    <q-card-section>
      <q-slide-transition>
        <div v-show="expanded || addCondition.state">
          <q-card-section>
            <div class="row">
              <div> Si la respuesta es</div>
              <q-separator spaced inset vertical dark />
              <div class="col"><q-select v-model="optionCondition" :options="question.options" label="Respuestas" filled
                  dense option-label="option" @update:model-value="updateOptions" /></div>
              <q-separator spaced inset vertical dark />
              <div>entonces:</div>
            </div>
          </q-card-section>
          <div v-for="(condicion, index) in condition" :key="index" v-if="optionCondition">
            <Preguntas :question="condicion" :typeQuestion="typeQuestion" :isCondit="true"
              @deleteCondition="removeCondition"></Preguntas>
          </div>

          <div class="flex justify-center">
            <q-btn color="primary" icon="add" flat @click="addConditionToOption" v-if="optionCondition" />
          </div>
        </div>
      </q-slide-transition>
    </q-card-section>
    <q-separator spaced inset vertical dark />


  </q-card>




</template>

<script setup>

import { ref, onMounted, computed, watch } from 'vue';
import { useAccountStore } from 'stores/Account';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import uapi from 'src/API/UserApi';
import Preguntas from 'src/components/Form/questions.vue';
const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();



const props = defineProps({
  question: { type: Object, default: {} },
  typeQuestion: { type: Array, default: [] },
  isCondit: { type: Boolean, default: true },
  qualified: { type: Number, default: 1 },
})
console.log(props.question)

console.log(props.question)

const emit = defineEmits(['delete', 'deleteCondition']);
const condition = ref([]);

const noption = ref({ val: '', condition: JSON.stringify([]), _correct:0 })
const expanded = ref(false)



const addCondition = ref({
  condition: null,
  question: 'Condicion',
  type: { id: 1, name: 'Texto' },
  _required: 0,
  _breach: 0,
  options: []
})

const optionCondition = ref(null)

onMounted(() => {
  if (props.question._type == 2) {
    // console.log( props.question.options.filter(e => JSON.parse(e.condition).length > 0))
    let option = props.question.options.filter(e => JSON.parse(e.condition).length > 0)
    if (option.length > 0) {
      optionCondition.value = option[0]
      condition.value = JSON.parse(optionCondition.value.condition)
    }

  }
})


const parsedCondition = () => {
  let parse = optionCondition.value ? JSON.parse(optionCondition.value.condition) : null
  if (parse.length > 0) {
    condition.value = parse
    return condition.value
  }
}

const deleteQuestion = (q) => {
  emit('delete', q)
}

const deleteCondition = (q) => {
  emit('deleteCondition', q)
}

const removeCondition = (q) => {
  let inx = condition.value.findIndex(e => e.question == q.question && e.type == q.type)
  condition.value.splice(inx, 1)
}

const addConditionToOption = () => {
  let adding = JSON.parse(optionCondition.value.condition)
  adding.push(addCondition.value)
  optionCondition.value.condition = JSON.stringify(adding)
  console.log('jpo')
  parsedCondition()

}

watch(() => condition.value,
  (newCondition) => {
    if (optionCondition.value) {
      // console.log(optionCondition.value)
      optionCondition.value.condition = JSON.stringify(newCondition);
    }
  },
  { deep: true } // Esto observa los cambios dentro del array condition
)

const updateOptions = () => {

  if (props.question._type == 2) {
    let option = props.question.options.filter(e => JSON.parse(e.condition).length > 0)
    if (option.length > 0) {
      console.log(option)
      optionCondition.value.condition = (option[0].condition)
      option[0].condition = JSON.stringify([])
      console.log(optionCondition.value);
      condition.value = JSON.parse(optionCondition.value.condition)
    }
  }
}


</script>

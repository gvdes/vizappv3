<template>
    <q-card class="my-card" style="width: 50%;">
      <q-card-section >
        <div class="text-h6">{{ question.question }}</div>
        <div dense class="text-h6" v-if="question._type == 1"> <q-input v-model="question._response" type="text"
          :placeholder="question.question" filled  /></div>
        <div dense class="text-h6" v-if="question._type == 2"><q-select v-model="question._response"
            :options="question.options" label="Opciones" option-label="option"  filled /></div>
        <div dense class="text-h6" v-if="question._type == 3">
          <q-uploader
                hide-upload-btn
                color="primary"
                bordered
                style="width: 99%"
                :label="question.question"
                accept=".jpg, image/*"
                ref="reference"
                @rejected="onRejected"
                @added="insertimage"
                :url="uapi.addFile"
                :headers="headers"
                @failed="failed"
                @uploading="subiendo"
                field-name="file"
                @uploaded="subido"
                @removed="remove"
                :form-fields="formFields"
                multiple
              />
        </div>
        <div dense class="text-h6" v-if="question._type == 4"> <q-select v-model="question._response"
            :options="colaborators" label="Standard" filled :option-label="i => (`${i.name} ${i.surnames}`)" /> </div>
          <q-separator spaced inset vertical dark />
        <div v-if="question._response && question._type == 2 && JSON.parse(question._response?.condition).length > 0">
          <q-card class="my-card">
            <q-card-section v-for="(condition, index) in JSON.parse(question._response?.condition)">
            <div  >{{ condition.question }}</div>
            <div dense class="text-h6" v-if="condition.type.id == 1"> <q-input v-model="question.conresp"
                type="text" label="Label" /></div>
            <div dense class="text-h6" v-if="condition.type.id == 2"><q-select v-model="question.conresp"
                :options="condition.options" label="Opciones" option-label="option" filled /></div>
            <div dense class="text-h6" v-if="condition.type.id == 3"> <q-uploader  url="http://localhost:4444/upload"
                color="teal" flat bordered style="width: 100%" /> </div>
            <div dense class="text-h6" v-if="condition.type.id == 4"> <q-select v-model="question.conresp"
                :options="colaborators" multiple use-chips use-input :label="condition.question" filled :option-label="i => (`${i.name} ${i.surnames}`)"  /> </div>
          </q-card-section>
          </q-card>
          <q-separator spaced inset vertical dark />
        </div>
      </q-card-section>
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
  colaborators: { type: Array, default: [] },
  isCondit: { type: Boolean, default: true }
})



const reference = ref(null)
const headers = ref([{name:'Authorization', value:`Bearer ${piniaAccount.token}`} ])
const formFields = ref([{name:'idms', value:null}])

const onRejected = () => {
  $q.notify({message:'No se acepta este archivo', type:'negative',position:'center'})
};

const insertimage = (files) => {
  console.log(files);
  props.question._response = files[0].name
  props.question.evidence = files;
}

const remove = () => {

}



const failed = (files) => {
  $q.notify({message:'No se logro subir la evidencia',type:'negative',position:'center'})
}

const subiendo = (files) => {
  $q.loading.show({message:'Subiendo Archivo'})
}
const subido = async (files) => {
  $q.loading.hide();
  $q.notify({message:'Evidencia Enviada',type:'positive',position:'center'})
  reference.value.reset();

}




</script>

<template>
  <q-card class="my-card" style="width: 100%;">
    <q-card-section>
      <div class="row">
        <div class="row">
          <div class="text-h6">{{ question.question }}</div>
          <div class="text-h6 text-red" v-if="question._required == 1">*</div>
        </div>

        <div class="text-right text-red col text-overline" v-if="question._required == 1 && question._response == null">
          Pregunta Obligatoria</div>

      </div>

      <div dense class="text-h6" v-if="question._type == 1"> <q-input v-model="question._response" type="text"
          :placeholder="question.question" filled /></div>
      <div dense class="text-h6" v-if="question._type == 2"><q-select v-model="question._response"
          :options="question.options" label="Opciones" option-label="option" filled /></div>
      <div dense class="text-h6" v-if="question._type == 3">
        <q-card class="my-card ">
          <q-card-section>
            <q-uploader hide-upload-btn color="white" text-color="grey" style="height: auto; width: 100%"
              :label="question.question" accept=".jpg, image/*" ref="reference" @rejected="onRejected"
              @added="insertimage" :url="uapi.addFile" :headers="headers" @failed="failed" @uploading="subiendo"
              field-name="file" @uploaded="subido" @removed="remove" :form-fields="formFields" multiple flat>

              <template v-slot:header="scope">
                <div class="row no-wrap items-center q-pa-sm q-gutter-xs text-center "
                  style="border-radius: 8px; padding: 16px;" @click="scope.pickFiles">
                  Haz clic para subir los archivos o arrastra y suelta los archivos aquí
                  <q-uploader-add-trigger />
                </div>
              </template>

              <template v-slot:list="scope">

                <q-table :rows="scope.files" grid hide-bottom :pagination="{rowsPerPage: 0}">
                  <template v-slot:item="props">
                    <div style="position: relative; border: 1px solid #EEEEEE;
                       border-radius: 10px;
                       width: 100px;
                       height: 100px;
                       margin: 5px
                       ">
                      <div @mouseover="hoveredItem = props.row" @mouseleave="hoveredItem = null"
                        :style="hoveredItem == props.row ? 'opacity: 0.7;' : null" style="margin:12px;">
                        <q-avatar size="75px" square>
                          <q-img :src="props.row.__img.src" style="height: 75px; width: 75px">
                          </q-img>
                        </q-avatar>
                        <q-btn size="sm" icon="delete" color="white" class="absolute" text-color="black"
                          style="top: 5px; left: 5px; z-index: 10; width: 10px; "
                          v-if="hoveredItem == props.row ? true : false" @click="removeEvidence(scope, props)" />
                      </div>
                    </div>
                  </template>
                </q-table>
              </template>
            </q-uploader>
          </q-card-section>
        </q-card>

      </div>
      <div dense class="text-h6" v-if="question._type == 4">
        <div v-if="question._breach == 1">

          <div class="text-h6" v-if="question._response?.length > 0" v-for="(col, index) in question._response"
            :key="index">
            <q-list dense>
              <q-item>
                <q-item-section class="text-caption">{{ `${col.col.name} ${col.col.surnames}` }}</q-item-section>
                <q-item-section class="text-caption">{{ `(${col.qualified?.map(e => e.option).join(", ")})`
                  }}</q-item-section>
                <q-item-section> <q-btn color="primary" icon="close"
                    @click="() => { question._response.splice(index, 1) }" flat title="eliminar" /></q-item-section>
              </q-item>
            </q-list>
          </div>
          <q-separator spaced inset vertical dark />
          <q-form
            @submit="() => { response.push({ col: selectColaborator, qualified: selectBreach }); selectColaborator = null; selectBreach = null; question._response = response }"
            @reset="() => { selectColaborator = null; selectBreach = null }">
            <div class="row">
              <q-select class="col" v-model="selectColaborator" :options="colaborators" label="Colaborador" filled
                :option-label="i => (`${i.name} ${i.surnames}`)" dense />
              <q-separator spaced inset vertical dark />
              <q-select class="col" v-model="selectBreach" :options="question.options" label="Que no cumplio?" filled
                option-label="option" :disable="!selectColaborator" multiple use-chips dense />
              <q-separator spaced inset vertical dark />

              <q-btn push type="submit" icon="check" color="positive" flat rounded
                :disable="!selectBreach || !selectColaborator" />
              <q-btn push type="reset" icon="close" color="negative" :disable="!selectBreach || !selectColaborator" flat
                rounded />

            </div>
          </q-form>

        </div>
        <div v-else>
          <q-select v-model="question._response" :options="colaborators" multiple use-chips use-input
            :label="question.question" filled :option-label="i => (`${i.name} ${i.surnames}`)" dense />
        </div>


      </div>
      <q-separator spaced inset vertical dark />
      <div v-if="question._response && question._type == 2 && JSON.parse(question._response?.condition).length > 0">
        <q-card class=" bg-light-blue-1">

          <!-- <q-card-section v-for="(condition, index) in JSON.parse(question._response?.condition)"> -->
          <q-card-section v-for="(condition, index) in conditions">
            <div class="row">
              <div class="row">
                <div class="text-h6">{{ condition.question }}</div>
                <div class="text-h6 text-red" v-if="condition._required == 1">*</div>
              </div>

              <div class="text-right text-red col text-overline"
                v-if="condition._required == 1 && condition.response == null">Pregunta Obligatoria</div>

            </div>
            <div dense class="text-h6" v-if="condition.type.id == 1"> <q-input v-model="condition.response" type="text"
                :label="condition.question" filled /></div>
            <div dense class="text-h6" v-if="condition.type.id == 2"><q-select v-model="condition.response"
                :options="condition.options" label="Opciones" option-label="option" filled dense /></div>
            <div dense class="text-h6" v-if="condition.type.id == 3"> <q-uploader url="http://localhost:4444/upload"
                color="teal" flat bordered style="width: 100%" /> </div>
            <div dense class="text-h6" v-if="condition.type.id == 4">
              <div v-if="condition._breach == 1">
                <div class="text-h6" v-if="condition.response?.length > 0" v-for="(col, index) in condition.response"
                  :key="index">
                  <q-list dense>
                    <q-item>
                      <q-item-section class="text-caption">{{ `${col.col.name} ${col.col.surnames}` }}</q-item-section>
                      <q-item-section class="text-caption">{{ `(${col.qualified?.map(e => e.option).join(", ")})`
                        }}</q-item-section>
                      <q-item-section> <q-btn color="primary" icon="close"
                          @click="() => { condition.response.splice(index, 1) }" flat
                          title="eliminar" /></q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <q-separator spaced inset vertical dark />
                <q-form
                  @submit="() => { response.push({ col: selectColaborator, qualified: selectBreach }); selectColaborator = null; selectBreach = null; condition.response = response }"
                  @reset="() => { selectColaborator = null; selectBreach = null }">
                  <div class="row">
                    <q-select class="col" v-model="selectColaborator" :options="colaborators" label="Colaborador" filled
                      :option-label="i => (`${i.name} ${i.surnames}`)" dense />
                    <q-separator spaced inset vertical dark />
                    <q-select class="col" v-model="selectBreach" :options="condition.options" label="Que no cumplio?"
                      filled option-label="option" :disable="!selectColaborator" dense multiple use-chips />
                    <q-separator spaced inset vertical dark />

                    <q-btn push type="submit" icon="check" color="positive" flat rounded
                      :disable="!selectBreach || !selectColaborator" />
                    <q-btn push type="reset" icon="close" color="negative" flat rounded
                      :disable="!selectBreach || !selectColaborator" />

                  </div>
                </q-form>
              </div>
              <div v-else>
                <q-select v-model="condition.response" :options="colaborators" multiple use-chips use-input
                  :label="question.question" filled :option-label="i => (`${i.name} ${i.surnames}`)" dense />
              </div>
            </div>
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


// const conditionResponse = ref([])

const conditions = ref([]);
const reference = ref(null)
const headers = ref([{ name: 'Authorization', value: `Bearer ${piniaAccount.token}` }])
const formFields = ref([{ name: 'idms', value: null }])
const selectColaborator = ref(null);
const selectBreach = ref(null);
const response = ref([]);
const hoveredItem = ref(null)

const onRejected = () => {
  $q.notify({ message: 'No se acepta este archivo', type: 'negative', position: 'center' })
};

const insertimage = (files) => {
  console.log(files);
  props.question._response = files[0].name
  props.question.evidence = files;
}

const remove = () => {

}

const failed = (files) => {
  $q.notify({ message: 'No se logro subir la evidencia', type: 'negative', position: 'center' })
}

const subiendo = (files) => {
  $q.loading.show({ message: 'Subiendo Archivo' })
}
const subido = async (files) => {
  $q.loading.hide();
  $q.notify({ message: 'Evidencia Enviada', type: 'positive', position: 'center' })
  reference.value.reset();

}
const removeEvidence = (scope, rows) => {
  scope.removeFile(rows.row);
  let inx = props.question.evidence?.findIndex(e => e.__key == rows.row.__key);

  if (inx >= 0) {
    props.question.evidence?.splice(inx, 1);
    if (props.question.evidence.length == 0) {
      props.question._response = null
    }
  }
}

onMounted(() => {
  if (props.question._type == 2) {
    let condition = props.question.options.filter(e => JSON.parse(e.condition).length > 0)
    if (condition.length > 0) {
      conditions.value = JSON.parse(condition[0].condition)
    }

  }
})

watch(() => conditions.value,
  (newCondition) => {

    if (newCondition) {
      props.question.conresp = JSON.stringify(newCondition.filter(e => e.response ? e : null).map(e => {
        let response = null
        if (e.type.id == 4) {
          console.log(e.response);
          response = e.response.map(i => {
            if (i.col) {
              return { col: i.col.id, qualified: i.qualified?.map(e => e.option).join(", ") }
            } else {
              return i.id
            }
          });
        } else if (e.type.id == 3) {
          response = e.response = null
        } else if (e.type.id == 2) {
          response = e.response.option
        } else {
          response = e.response
        }
        return { question: e.question, response: response }
      }))
    }
  },
  { deep: true }
)
</script>

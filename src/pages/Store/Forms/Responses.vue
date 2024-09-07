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
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">

          <div v-for="(question, index) in form.question" :key="index">

            <div>{{ question.question }}</div>
            <div v-if="question.type.id == 1"> <!-- Texto -->
              <q-input v-model="question.response" type="text" :label="question.question" />
            </div>
            <div v-else-if="question.type.id == 2"> <!-- Opciones -->
              <q-select v-model="question.response" :options="question.options" :label="question.question"
                option-label="option" />
              <!-- {{ question.response }} -->



              <div v-if="question.response?.condition">

                {{ JSON.parse(question.response.condition).response }}
                <div class="text-bold">{{ JSON.parse(question.response.condition).quest.question }}</div>

                <div v-if="JSON.parse(question.response.condition).quest._type.id == 1"> <!-- Texto -->
                  <q-input v-model="question.condresp" type="text" :label="question.question" />
                </div>


                <div v-else-if="JSON.parse(question.response.condition).quest._type.id == 2"> <!-- Opciones -->
                  <q-select v-model="question.condresp"
                    :options="JSON.parse(question.response.condition).opts" :label="question.question"
                    option-label="option" />
                </div>


                <div v-else-if="JSON.parse(question.response.condition).quest._type.id == 3"> <!-- Archivo -->
                  <q-uploader
                    url="http://localhost:4444/upload"
                    color="teal"
                    flat
                    bordered
                    style="max-width: 300px"
                  />
                </div>


                <div v-else-if="JSON.parse(question.response.condition).quest._type.id == 4"> <!-- Colaboradores -->
                  <q-select v-model="question.condresp" :options="usersBranch" label="Colaboradores" :option-label=" item => (item === null ? 'Null value' : `${item.name} ${item.surnames}`)" >
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-item-label>{{ `${scope.opt.name} ${scope.opt.surnames}` }}</q-item-label>
                          <q-item-label caption>{{ scope.opt.nick }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>
            </div>




            <div v-else-if="question.type.id == 3"> <!-- Archivo -->
              <q-uploader
                    url="http://localhost:4444/upload"
                    color="teal"
                    flat
                    bordered
                    style="max-width: 300px"
                  />
            </div>


            <div v-else-if="question.type.id == 4"> <!-- Colaboradores -->
              <q-select v-model="question.response" :options="usersBranch" label="Colaboradores">
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ `${scope.opt.name} ${scope.opt.surnames}` }}</q-item-label>
                      <q-item-label caption>{{ scope.opt.nick }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>

              </q-select>
            </div>
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
    colaborators.value = resp.usuarios
  }
}

const onSubmit = () => {

}

const onReset = () => {

}

init();
</script>

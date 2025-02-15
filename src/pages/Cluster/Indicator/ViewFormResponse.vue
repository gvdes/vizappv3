<template>
  <q-page padding v-if="response != null">
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div class="bg-white">
          <div class="q-pa-sm row items-center text-center text-h6">
            <div @click="$router.push('/cluster/indicators/reports')"> <q-icon size="30px" name="arrow_back" /></div>
          </div>
        </div>
        <div class="col anek-bld text-grey-9 q-pl-sm text-bold text-h5">{{ response.form.name }}</div>
        <div>
        </div>
      </div>
    </div>

    <q-card class="my-card">
      <q-card-section class="row">
        <div class="col text-center text-bold ">RESPONDIO: {{ response.user.name }}</div>
        <div class="col text-center text-bold ">SUCURSAL: {{ response.store.name }}</div>
        <div class="col text-center text-bold ">CREADO: {{ dayjs(response.created_at).format('DD/MM/YYYY HH:mm:ss') }}
        </div>
        <div class="col text-center text-bold ">PUNTOS: {{ totalPoints }} </div>
      </q-card-section>
    </q-card>

    <q-separator spaced inset vertical dark />

    <q-card class="my-card">
      <q-card-section v-for="(response, index) in response.responses">
        <div class="text-left text-bold row">
          <div class="col"> {{ `${index + 1} .-` }} {{ response.question.question }} </div>
          <div class="col text-right text-caption "> P. {{ response.question.options.filter(e => e.id ==
            response._option)[0]?._correct == 1 ? response.question._points : 0 }} </div>
        </div>
        <q-separator spaced inset vertical dark />
        <div v-if="response.question._type == 1" class="text-bold">{{ response.text }}</div>
        <div v-else-if="response.question._type == 2">
          <div class="row">
            <div class="text-bold col">{{ response.text }}</div>
            <div v-if="JSON.parse(JSON.parse(response.condition))?.length > 0"> <q-btn rounded color="grey-7" flat
                :icon="response.expand ? 'arrow_drop_up' : 'arrow_drop_down'"
                @click="response.expand = !response.expand" /></div>

          </div>
          <q-separator spaced inset vertical dark />

          <q-slide-transition>
            <div v-show="response.expand">
              <q-separator />
              <q-card-section v-for="(condition, index) in JSON.parse(JSON.parse(response.condition))" :key="index">
                <div class="row">
                  <div class="col">{{ condition.question }}</div>
                  <div class="col" v-if="hasObjectResponse(condition.response)">QUE NO CUMPLIO</div>
                </div>
                <q-separator spaced inset vertical dark />
                <div v-if="Array.isArray(condition.response)" class="text-bold">
                  <div v-for="(respon, index) in condition.response" :key="index">
                    <div v-if="typeof respon === 'object'" class="row">
                      <div class="col"> {{ getUserName(respon.col) }}</div>
                      <div class="col">{{ respon.qualified }}</div>
                    </div>
                    <div v-else-if="typeof respon === 'number'">
                      {{ getUserName(respon) }}
                    </div>

                  </div>
                </div>
                <div v-else class="text-bold">
                  {{ condition.response }}
                </div>
              </q-card-section>
            </div>
          </q-slide-transition>
        </div>
        <div v-else-if="response.question._type == 3">
          <div class="row no-wrap q-gutter-xs">
            <div v-for="(file, index) in response.files" :key="index" @click="mosImages(response.files)">
              <div
                style="position: relative; border: 1px solid #EEEEEE; border-radius: 15px; width: 50px; height: 50px;">
                <q-avatar size="50px" square>
                  <q-img :src="`${vizmedia}/${file}`" style="height: 25px; width: 25px"></q-img>
                </q-avatar>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="response.question._type == 4"></div>

        <q-separator />
      </q-card-section>

    </q-card>
    <q-dialog v-model="image.state">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="q-pa-md">
            <q-carousel swipeable animated v-model="slide" thumbnails infinite>
              <q-carousel-slide :name="index" :img-src="`${vizmedia}/${file}`" v-for="(file, index) in image.files"
                :key="index" />
            </q-carousel>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>




  </q-page>
</template>

<script setup>
import { ref, watch, onBeforeMount, onBeforeUnmount, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, LocalStorage, Loading } from 'quasar';
import { useAccountStore } from 'stores/Account';
import indpi from 'src/API/IndicatorApi.js'
import dayjs from 'dayjs';
import { vizmedia } from 'boot/axios'


const $q = useQuasar();
const $route = useRoute();
const $router = useRouter()
const piniaAccount = useAccountStore();

const response = ref(null)
const image = ref({
  state: false,
  files: null
});
const slide = ref(0)
const users = ref([])
// const trans = ref(false);


const totalPoints = computed(() => {
  return response.value.responses.reduce((sum, res) => {
    const selectedOption = res.question.options.find(e => e.id === res._option);
    return sum + (selectedOption?._correct === 1 ? res.question._points || 0 : 0);
  }, 0);
});

const getUserName = (userId) => {
  const user = users.value.find(e => e.id === userId);
  return user ? `${user.name} ${user.surnames}` : '';
}

const hasObjectResponse = (response) => {
  return Array.isArray(response) && response.some(respon => typeof respon === 'object');
};

const init = async () => {
  $q.loading.show({ message: 'Obteniendo Respuestas' });
  console.log($route.params.fid)
  const resp = await indpi.viewResponseForm($route.params.fid)
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp)
    response.value = resp.responses
    users.value = resp.usuarios
    $q.loading.hide();
  }
}

const mosImages = (files) => {
  // console.log(files)
  image.value.state = true
  image.value.files = files
}

init();
</script>

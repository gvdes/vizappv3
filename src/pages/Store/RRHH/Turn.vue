<template>
  <q-page padding>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">

    </q-form>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h4 text-center text-bold">Turnos</div>
        <div class="text-h6 text-center">Modulo para subir los turnos pertenecientes a la semana actual</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="time" type="time" filled mask="fulltime">
          <template v-slot:after>
            <q-btn round dense flat icon="send" @click="turns.push({turn:time, colab:null}); time=''" :disable="time.length <= 0" />
          </template>
        </q-input>

      </q-card-section>
      <q-card-section>
        <div v-for="(turn, index ) in turns" :key="index">
          <div class="row">
            <div class=" text-center text-bold text-h5">
              <div class="text-caption">Horario</div>
            {{ turn.turn }}
            </div>
            <q-separator spaced inset vertical dark />
            <div class="col">
              <q-select v-model="turn.colab" :options="options" label="Colaboradores" filled/>
            </div>

          </div>
          <q-separator spaced inset vertical dark />
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn label="Enviar" type="submit" color="positive" flat />
        <q-btn label="Cancelar" type="reset" color="negative" flat class="q-ml-sm" />
      </q-card-actions>
    </q-card>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import rhpi from 'src/API/RhApi';
import dayjs from 'dayjs';
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";

import pdf from 'src/PDF/proceeding';
import useApi from 'src/API/UserApi';
import { useAccountStore } from 'stores/Account';
const $q = useQuasar();
const $router = useRouter();
dayjs.extend(weekOfYear);
dayjs.extend(weekday);



const turns = ref([]);
const time = ref('');
const insert = ref({
  turns: []
})

const init = async () => {
  const resp = await rhpi.getTurnsWeek();
  console.log(resp)
}


const onSubmit = () => {

}

const onReset = () => {

}

init()
</script>

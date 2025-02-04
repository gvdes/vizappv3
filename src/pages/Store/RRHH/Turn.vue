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
            <q-btn round dense flat icon="send" @click="addTurn" :disable="time.length <= 0" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section>
        <div v-for="(turn, index) in turnos" :key="index">
          <div class="row">
            <div class="text-center text-bold text-h5">
              <div class="text-caption">Horario</div>
              {{ turn.turno }}
            </div>
            <q-separator spaced inset vertical dark />
            <div class="col">
              <q-select v-model="turn.colab" :options="options" label="Colaboradores" filled  :option-label="i => (`${i.name} ${i.surnames}`)"/>
            </div>
          </div>

          <div v-if="turn.users.length > 0">
            <div class="q-mt-md text-caption">Colaboradores asignados:</div>
            <ul>
              <li v-for="(user, idx) in turn.users" :key="idx">{{ user.name }} {{ user.surnames }}</li>
            </ul>
          </div>

          <q-separator spaced inset vertical dark />
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn label="Enviar" type="submit" color="positive" flat />
        <q-btn label="Cancelar" type="reset" color="negative" flat class="q-ml-sm" />
      </q-card-actions>
    </q-card>
    {{ turnos }}
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import rhpi from 'src/API/RhApi';
import dayjs from 'dayjs';
const turns = ref([]);
const time = ref('');
const options = ref([]);
const simon = ref(null);
const turnos = ref({})

const init = async () => {
  const resp = await rhpi.getTurnsWeek();
  console.log(resp);
  turns.value = resp.turns;
  options.value = resp.users
  simon.value = turns.value.forEach((item) => {
    const turnoKey = item.hour_hand;

    if (!turnos.value[turnoKey]) {
      turnos.value[turnoKey] = {
        turno: item.hour_hand,
        year: item._year,
        week: item._week,
        users: [],
        colab:null
      };
    }

    const user = item.users;
    if (!turnos.value[turnoKey].users.some(u => u.id === user.id)) {
      turnos.value[turnoKey].users.push(user);
    }
  });
  turnos.value = simon.value
}

// const simon = computed(() => {
  // const turnos = {};
  // turns.value.forEach((item) => {
  //   const turnoKey = item.hour_hand;

  //   if (!turnos[turnoKey]) {
  //     turnos[turnoKey] = {
  //       turno: item.hour_hand,
  //       year: item._year,
  //       week: item._week,
  //       users: [],
  //       colab:null
  //     };
  //   }

  //   const user = item.users;
  //   if (!turnos[turnoKey].users.some(u => u.id === user.id)) {
  //     turnos[turnoKey].users.push(user);
  //   }
  // });
  // return Object.values(turnos);
// });

const addTurn = () => {
  if (time.value) {
    const newTurn = {
      hour_hand: `${time.value}:00`,
      users: []
    };

    turns.value.push(newTurn);
    time.value = '';
  }
}

const onSubmit = () => {
  // Lógica para enviar los datos
}

const onReset = () => {
  // Lógica para resetear el formulario
}

init();
</script>

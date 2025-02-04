<template>
  <q-page padding>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">


      <q-card class="my-card">
        <q-card-section>
          <div class="text-h4 text-center text-bold">Turnos</div>
          <div class="text-h6 text-center">Modulo para subir los turnos pertenecientes a la semana actual</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="time" type="time" filled mask="HH:mm">
            <template v-slot:after>
              <q-btn round dense flat icon="send" @click="addTurn(`${time}:00`)" :disable="time.length <= 0" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section>
          <div v-for="(turn, turnoKey) in turnos" :key="turnoKey">
            <div class="row">
              <div class="text-center text-bold text-h5">
                <div class="text-caption">Horario</div>
                {{ turn.turno }}
              </div>
              <q-separator spaced inset vertical dark />
              <div class="col">
                <q-select v-model="turn.colab" :options="usrOpts" label="Colaboradores" filled
                  :option-label="i => (`${i.name} ${i.surnames}`)"
                  @update:model-value="(val) => assignUser(turnoKey, val)" />
              </div>
            </div>

            <div v-if="turn.users.length > 0">
              <div class="q-mt-sm text-caption">Colaboradores asignados:</div>
              <div v-for="(user, idx) in turn.users" :key="idx" class="row">
                <q-btn size="sm" color="negative" icon="close" flat @click="deleteUser(turnoKey, user)" />
                <div class="text-bold q-mt-xs col"> ~{{ user.name }} {{ user.surnames }}</div>
              </div>
            </div>

            <q-separator spaced inset vertical dark />
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn label="Enviar" type="submit" color="positive" flat :disable="!formValid" />
          <q-btn label="Cancelar" type="reset" color="negative" flat class="q-ml-sm" />
        </q-card-actions>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import rhpi from 'src/API/RhApi';
import dayjs from 'dayjs';
import pdf from 'src/PDF/proceeding';
import useApi from 'src/API/UserApi';
import { useAccountStore } from 'stores/Account';
const $q = useQuasar();
const $router = useRouter();

const turns = ref([]);
const time = ref('');
const options = ref([]);
const turnos = ref({});

const init = async () => {
  const resp = await rhpi.getTurnsWeek();
  console.log(resp);
  turns.value = resp.turns;
  options.value = resp.users;
  turns.value.forEach(item => {
    addTurn(item.hour_hand, item.users, item._year, item._week);
  });
};

const usrOpts = computed(() => {
  const assignedUserIds = Object.values(turnos.value)
    .flatMap(turn => turn.users.map(user => user.id));

  return options.value.filter(user => !assignedUserIds.includes(user.id));
});

const formValid = computed(() => Object.values(turnos.value).length > 0 && Object.values(turnos.value).filter(e => e.users.length > 0).length > 0)



const addTurn = (hour, user = {}, year = null, week = null) => {
  if (!hour) return;
  if (!turnos.value[hour]) {
    turnos.value[hour] = {
      turno: hour,
      year: year,
      week: week,
      users: [],
      colab: null
    };
  }
  time.value = ''
  if (user && user.id && !turnos.value[hour].users.some(u => u.id === user.id)) {
    turnos.value[hour].users.push(user);
  }
};
const assignUser = (turnoKey, user) => {
  if (!turnos.value[turnoKey].users.some(u => u.id === user.id)) {
    turnos.value[turnoKey].users.push(user);
  }
  turnos.value[turnoKey].colab = null
};

const deleteUser = (turnoKey, user) => {
  if(turnos.value[turnoKey].users.some(u => u.id === user.id)){
    user = turnos.value[turnoKey].users.findIndex(u => u.id === user.id)
    turnos.value[turnoKey].users.splice(user,1);
  }

}

const onSubmit = async () => {
  $q.loading.show({message:'Actualizando Turnos'})
  const turns = Object.values(turnos.value).flatMap(e => e.users.map(i => { return { _user: i.id, hour_hand: e.turno } }))
  const resp = await rhpi.addTurnsWeek({ turns });
  if(resp.error){
    console.log(resp);
  }else{
    $q.loading.hide();
    console.log(resp)
  }
};

const onReset = () => {
};

init();
</script>

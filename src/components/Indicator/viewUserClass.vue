<template>
  <q-card style="width:75%">
    <q-card-section>
      <div class="flex justify-center">
        <q-avatar size="170px"> <q-img :src="`${vizmedia}/profiles/${viewUser.val.id}/${viewUser.val.avatar}`" />
        </q-avatar>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="text-h6 text-center">{{ viewUser.val.name.toUpperCase() + ' ' +
        viewUser.val.surnames.toUpperCase() }}</div>
      <div class="flex justify-center">
        <q-badge color="primary">
          {{ viewUser.val.nick }}
        </q-badge>
      </div>
    </q-card-section>
    <q-card-section class="items-center">
      <!-- <q-input v-model="" type="date" label="Label" /> -->
       <div class="bg-grey-3">
        <div class="q-px-sm text-grey-7 ">Ultima Actualizacion</div>
        <span class="text-bold q-px-sm">{{ dayjs(viewUser.val.classification.updated_at).format('DD/MM/YYYY HH:mm:ss') }}</span>
       </div>

      <q-separator spaced inset vertical dark />
      <q-select v-model="viewUser.val.classification.classification" :options="classifications" label="Clasificacion"
        filled option-label="name" />
      <q-separator spaced inset vertical dark />
      <q-select v-model="viewUser.val.classification.store" :options="stores" label="Sucursal de Clasificacion" filled
        :option-label="i => (`${i.store.name} (${i.clasification.name}) `)">
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.store.name }}</q-item-label>
              <q-item-label caption>{{ scope.opt.clasification.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-card-section>
    <q-card-section>
      <q-list>
        <q-item>
          <q-item-section>
            <q-item-label class="text-center">Bono Total</q-item-label>
            <q-item-label class="text-center text-bold text-subtitle1">
              <q-btn flat size="lg" :label="`$ ${(viewUser.val.classification.classification.percentage / 100) *
                (viewUser.val.classification.import) * 4}`" @click="changeValue = !changeValue" />
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label class="text-center">Bono Semanal</q-item-label>
            <q-item-label class="text-center text-bold text-subtitle1">$
              {{ (viewUser.val.classification.classification.percentage / 100) *
                (viewUser.val.classification.import / 2) }} </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-center">Bono Mensual</q-item-label>
            <q-item-label class="text-center text-bold text-subtitle1">$ {{
              ((viewUser.val.classification.classification.percentage / 100) *
                (viewUser.val.classification.import / 2)) * 4 }} </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-section v-if="viewUser.val.class">
      <q-card class="my-card">
        <q-card-section>

          <q-list bordered>
            <q-item>
              <q-item-section>
                <q-item-label class="text-center">Clasificacion:</q-item-label>
                <q-item-label class="text-center text-bold">{{classifications.find(e => e.id ==
                  viewUser.val.class.classification).name }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-center">Porcentaje:</q-item-label>
                <q-item-label class="text-center text-bold">{{ viewUser.val.class.percentage }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-center">Puntos Asistencia: </q-item-label>
                <q-item-label class="text-center text-bold">{{ viewUser.val.class.puntosAsistencia }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-center">Puntos Checklist:</q-item-label>
                <q-item-label class="text-center text-bold">{{ viewUser.val.class.puntosChecklist }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card class="my-card">
          <q-card-section>
            <q-table :rows="viewUser.val.class?.asistencia" hide-bottom separator="cell" />
          </q-card-section>
        </q-card>

        <q-card-section v-if="viewUser.val.class.responses.length > 0">
          <div v-for="(response, index) in viewUser.val.class.responses" :key="index">
            <q-list bordered>
              <q-item>
                <q-item-section>
                  <q-item-label>Formulario</q-item-label>
                  <q-item-label>{{ response.form }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Fecha</q-item-label>
                  <q-item-label>{{ response.fecha_hora }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Pregunta</q-item-label>
                  <q-item-label>{{ response.question }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="response.qualified.length > 0">
                <q-item-section>
                  <q-item-section>
                    <q-item-label>No Cumple</q-item-label>
                    <q-item-label>{{ response.qualified }}</q-item-label>
                  </q-item-section>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-section>
                    <q-item-label>Obervacion</q-item-label>
                    <q-item-label>{{ response.observacion }}</q-item-label>
                  </q-item-section>
                </q-item-section>
              </q-item>
            </q-list>
            <q-separator spaced inset vertical dark />
          </div>
        </q-card-section>
      </q-card>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat icon="close" color="negative" v-close-popup />
      <q-btn flat icon="check" color="positive" @click="validChange" :disable="detectedChange" />
    </q-card-actions>
  </q-card>

  <q-dialog v-model="changeValue" persistent>
    <q-card>
      <q-card-section class="items-center">
        <span class="text-center text-bold text-h5">
          Cambio total de bono
          <div class="text-overline">Semanal</div>
        </span>

      </q-card-section>
      <q-card-section>
        <q-input v-model="viewUser.val.classification.import" type="number" label="Importe"
          :error="viewUser.val.classification.import.length <= 0" filled />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat icon="close" color="negative" v-close-popup />
        <q-btn flat icon="check" color="positive" @click="changeBonus" />
      </q-card-actions>
    </q-card>
  </q-dialog>


  <q-dialog v-model="prop" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="warning" text-color="black" />
        <span class="q-ml-sm text-bold text-center">Deseas ajustar el importe de el bono a como esta en la
          sucursal?</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="negative" v-close-popup />
        <q-btn flat label="No" color="warning" @click="editColaboratorStore(false)" />
        <q-btn flat label="Si" color="positive" @click="editColaboratorStore(true)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar';
import indpi from 'src/API/IndicatorApi';
import { useAccountStore } from 'stores/Account';
import dayjs from 'dayjs';
import { vizmedia } from 'boot/axios'
const $q = useQuasar();
const piniaAccount = useAccountStore();
const changeValue = ref(false);
const prop = ref(false);
const props = defineProps({
  viewUser: { type: Object },
  classifications: { type: Array },
  stores: { type: Array },
  week: { type: Array },
  users: { type: Array }
})


const changeClassifications = computed(() => JSON.stringify(props.users.filter(e => e.id == props.viewUser.val.id)[0].classification.classification) == JSON.stringify(props.viewUser.val.classification.classification));
const changeBranch = computed(() => JSON.stringify(props.users.filter(e => e.id == props.viewUser.val.id)[0].classification.store) == JSON.stringify(props.viewUser.val.classification.store))
const detectedChange = computed(() => JSON.stringify(props.users.filter(e => e.id == props.viewUser.val.id)[0]) == JSON.stringify(props.viewUser.val))



const init = async () => {
  $q.loading.show({ message: "Cargando Usuario..." });
  const resp = await indpi.getCalculateClassUser(props.viewUser.val);
  if (resp.error) {
    console.log(resp)
  } else {
    // console.log(resp);
    props.viewUser.val.class = resp
    console.log(props.viewUser.val)
  }
  $q.loading.hide({ message: "Cargando Usuario..." });
};

const validChange = () => {
  if (!changeClassifications.value && !changeBranch.value) {
    console.log('SE MODIFICARON LOS DOS');
    editColaboratorClassification()
    prop.value = !prop.value;

  } else if (!changeClassifications.value && changeBranch.value) {
    console.log('Solo se modifico la clasificacion')
    editColaboratorClassification()
  } else if (!changeBranch.value && changeClassifications.value) {
    console.log('solo se modifico la sucursal')
    prop.value = !prop.value;

  }
}

const editColaboratorClassification = async () => {
  console.log(props.viewUser.val.classification)
  $q.loading.show({ message: 'Editando Clasificacion' });
  const resp = await indpi.editUserClass(props.viewUser.val.classification)
  if (resp.error) {
    console.log(resp);

  } else {
    console.log(resp)
    let inx = props.users.findIndex(e => e.id == resp.id);
    props.users[inx] = resp
    $q.loading.hide();
    if (changeBranch.value) {
      props.viewUser.state = false
    }
  }
}

const editColaboratorStore = async (change) => {
  props.viewUser.val.classification.chBonus = change
  console.log(props.viewUser.val.classification)
  $q.loading.show({ message: 'Editando Sucursal' })
  const resp = await indpi.editUserStore(props.viewUser.val.classification)
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp)
    let inx = props.users.findIndex(e => e.id == resp.id);
    props.users[inx] = resp
    $q.loading.hide();
    props.viewUser.state = false
    prop.value = !prop.value
  }
}

const changeBonus = async () => {
  $q.loading.show({ message: 'Modificando Bono' })
  console.log(props.viewUser.val.classification)
  const resp = await indpi.changeUserBonues(props.viewUser.val.classification)
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp)
    let inx = props.users.findIndex(e => e.id == props.viewUser.val.id);
    props.users[inx] = props.viewUser.val
    changeValue.value = false
    props.viewUser.state = false
    $q.loading.hide()
  }
}


init();
</script>

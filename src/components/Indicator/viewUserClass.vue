<template>
  <q-card style="width:75%">
    <q-card-section>
      <div class="flex justify-center">
        <q-avatar size="170px"> <q-img :src="`${vizmedia}/profiles/${viewUser.val.id}/${viewUser.val.avatar}`" />
        </q-avatar>
      </div>

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
      <div class="bg-grey-3 col">
        <div class="q-px-sm text-grey-7 ">Ultima Actualizacion</div>
        <span class="text-bold q-px-sm">{{ dayjs(viewUser.val.classification.updated_at).format('DD/MM/YYYY HH:mm:ss')
          }}</span>
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
    <q-card-section>
      <div class="row">
        <q-btn outline rounded icon="event" color="primary" class="col">
          <q-menu fit>
            <q-card class="my-card">
              <q-card-section>
                <div class="text-bold text-h6 text-center"> {{ typeof (mostDate) == 'object' ? `Del ${mostDate.from} a
                  ${mostDate.to}` : fechas.date }}</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <q-input dense class="col" v-model="range.min" type="number" label="Min" filled />
                  <q-separator spaced inset vertical dark />
                  <q-input dense class="col" v-model="range.max" type="number" label="Max" filled />
                  <q-separator spaced inset vertical dark />
                  <q-select dense v-model="anio.val" :options="anio.opts" label="Ano" filled />
                </div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn flat color="primary" label="Obtener" @click="getReportFilter" />
              </q-card-actions>
            </q-card>
          </q-menu>
        </q-btn>
        <q-separator spaced inset vertical dark />
        <q-btn  outline rounded  class="col" color="primary" icon="download" @click="downloadExcel" />
        <!-- <q-separator spaced inset vertical dark />
        <q-btn flat class="col" color="primary" icon="picture_as_pdf" @click="downloadPDF" /> -->
      </div>
    </q-card-section>
    <q-card-section>
      <div v-for="(seman, index) in viewUser.val.class" :key="index">
        <q-separator spaced inset vertical dark />
        <viewHistory :seman="seman" :index="index" :classifications="classifications" />
      </div>
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
import viewHistory from 'components/Indicator/viewHistory.vue'
// import pdf from 'src/PDF/Indicators/userClassHistory.js';
import excel from 'src/EXCEL/Indicators/userClassHistory.js';
import dayjs from 'dayjs';
import { vizmedia } from 'boot/axios'
const date = new Date();
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

const semanas = ref([]);
const anio = ref({
  val: null,
  opts: [],
});
const range = ref({
  min: 0,
  max: 0
})

const mostDate = computed(() => {
  let simon = semanas.value.filter(e => e.week >= range.value.min && e.week <= range.value.max && e.anio == anio.value.val);
  console.log(simon)
  let init = 0;
  let ultm = simon.length - 1;
  return { from: simon[init]?.fecha, to: simon[ultm]?.fecha }
})

const changeClassifications = computed(() => JSON.stringify(props.users.filter(e => e.id == props.viewUser.val.id)[0].classification.classification) == JSON.stringify(props.viewUser.val.classification.classification));
const changeBranch = computed(() => JSON.stringify(props.users.filter(e => e.id == props.viewUser.val.id)[0].classification.store) == JSON.stringify(props.viewUser.val.classification.store))
const detectedChange = computed(() => JSON.stringify(props.users.filter(e => e.id == props.viewUser.val.id)[0]) == JSON.stringify(props.viewUser.val))



const init = async () => {
  $q.loading.show({ message: "Cargando Usuario..." });
  console.log(props.viewUser.val)
  const resp = await indpi.getCalculateClassUser(props.viewUser.val);
  if (resp.error) {
    console.log(resp)
  } else {
    // console.log(resp);
    console.log(resp.resumen);
    props.viewUser.val.class = resp.resumen
    semanas.value = resp.fechas;
    let semAct = semanas.value.find(e => e.fecha == dayjs(date).format('YYYY-MM-DD'));
    anio.value.opts = [...new Set(semanas.value.map(item => item.anio))];
    range.value.min = semAct.week
    range.value.max = semAct.week
    anio.value.val = semAct.anio
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

const getReportFilter = async () => {
  $q.loading.show({ message: "Cargando Usuario..." });
  console.log(props.viewUser.val)
  let data = {
    "user": props.viewUser.val,
    "min": range.value.min,
    "max": range.value.max,
    "year": anio.value.val
  }
  console.log(data);
  const resp = await indpi.getCalculateClassUserFilter(data);
  if (resp.error) {
    console.log(resp)
  } else {
    // console.log(resp);
    console.log(resp);
    props.viewUser.val.class = resp.resumen
  }
  $q.loading.hide({ message: "Cargando Usuario..." });
}

const downloadExcel = async () => {
  excel.generateExcel(props.viewUser.val,props.classifications);
}

const downloadPDF = () => {

}


init();
</script>

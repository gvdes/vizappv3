<template>
  <q-page padding>
    <div class="bg-white">

      <div class="q-pa-sm row items-center text-center text-h6">
        <q-btn flat rounded icon="arrow_back" @click="$router.push(`/cluster/indicators/classifications`)" />
        <div class="col anek-bld text-grey-9 q-pl-sm">Clasificaciones Sucursales</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
        </div>
      </div>
    </div>

    <q-table title="Clasificacion Sucursales" :rows="stores" grid :columns="table.columns"
      :pagination="table.pagination" @row-click="edit" />


    <q-dialog v-model="editStore.state" persistent>
      <q-card>
        <q-card-section class="text-center text-bold text-h5 ">
          Edicion de clasificacion de Sucursal
        </q-card-section>
        <q-card-section class=" items-center">
          <q-input v-model="editStore.val.name" type="text" label="SUCURSAL" filled disable />
          <q-separator spaced inset vertical dark />
          <q-input v-model="editStore.val.alias" type="text" label="NICK" filled disable="" />
          <q-separator spaced inset vertical dark />
          <q-select v-model="editStore.val.classification.clasification" :options="classifications" label="CLASIFICACION" option-label="name" filled :option-disable="i => i._store_type !=  editStore.val._type"></q-select>
          <q-separator spaced inset vertical dark />
          <div v-for="(bonus, index) in editStore.val.classification.clasification.bonuses" :key="index">
            <div v-if="editStore.val._type == 1 && [3,4].includes(bonus._hierarchy)">
              <q-input v-model="bonus.import" type="number" :label="`Bonus Semanal Jerarquia ${bonus._hierarchy}`" filled disable   />
              <q-separator spaced inset vertical dark />
            </div>
            <div v-else-if="editStore.val._type == 2 && [2,3,4].includes(bonus._hierarchy)">
              <q-input v-model="bonus.import" type="number" :label="`Bonus Semanal Jerarquia ${bonus._hierarchy}`" filled disable  />
              <q-separator spaced inset vertical dark />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat icon="close" color="negative" v-close-popup />
          <q-btn flat icon="check" color="positive" @click="prop = !prop" :disable="detectedChange" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="prop" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="black" />
          <div class="text-center text-bold">SE MODIFICARAN LOS BONOS DE LOS COLABORADORES QUE ESTEN EN ESTA SUCURSAL</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Confirmar" color="positive" @click="editStoreClass" />
        </q-card-actions>
      </q-card>
    </q-dialog>


  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAccountStore } from 'stores/Account';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import indpi from 'src/API/IndicatorApi';
const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();

const stores = ref([]);
const classifications = ref([]);
const prop = ref(false);

const editStore = ref({
  state: false,
  val: null
})

const table = ref({
  columns: [
    { id: 'name', label: 'Sucursal', field: r => r.name },
    { id: 'alias', label: 'Nick', field: r => r.alias },
    { id: 'classification', label: 'Clasificacion', field: r => r.classification?.clasification?.name },
  ],
  pagination: { rowsPerPage: 0 }
})


const detectedChange = computed(() => JSON.stringify(stores.value.filter(e => e.id == editStore.value.val.id)[0]) == JSON.stringify(editStore.value.val))


const init = async () => {
  $q.loading.show({ message: 'Obteniendo datos' });
  const resp = await indpi.getClassStore();
  if (resp.error) {

  } else {
    console.log(resp);
    stores.value = resp.stores;
    classifications.value = resp.classifications
    $q.loading.hide();
  }
}

const edit = (a, b) => {

  editStore.value.state = true;
  editStore.value.val = JSON.parse(JSON.stringify(b))
}



const editStoreClass = async () => {
  console.log(editStore.value.val.classification)
  $q.loading.show({ message: 'Editango Sucursal' })
  const resp = await indpi.editClassStore(editStore.value.val.classification)
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp)
    editStore.value.state = false;
    let inx = stores.value.findIndex(e => e.id == resp.id);
    stores.value[inx] = resp
    $q.notify({ message: 'Edicion completada', type: 'positive', position: 'center' })
    $q.loading.hide()
    prop.value = false
  }
}


init()
</script>

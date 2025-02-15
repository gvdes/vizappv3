<template>
  <q-page padding>
    <div class="bg-white">

      <div class="q-pa-sm row items-center text-center text-h6">
        <q-btn flat rounded icon="arrow_back" @click="$router.push(`/cluster/indicators`)" />
        <div class="col anek-bld text-grey-9 q-pl-sm">Clasificaciones</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init"/>
        </div>
      </div>
    </div>

    <q-table
      title="Clasificaciones"
      :rows="classifications"
      grid
      @row-click="mosRow"
      :columns="table.columns"
    />
    <q-dialog v-model="editClass.state" persistent>
      <q-card>
        <q-card-section class="text-center text-bold text-h5">
          Edicion de clasificacion
        </q-card-section>
        <q-card-section class="items-center">
          <q-input v-model="editClass.val.id" type="text" label="ID" disable />
          <q-separator spaced inset vertical dark />
          <q-input v-model="editClass.val.name" type="text" label="CLASIFICACION" disable />
          <q-separator spaced inset vertical dark />
          <q-input v-model="editClass.val.percentage" type="number" label="PORCENTAGE" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat icon="close" color="negative" v-close-popup />
          <q-btn flat icon="check" color="positive" @click="edit"/>
        </q-card-actions>
      </q-card>
    </q-dialog>



  </q-page>
</template>

<script setup >
import { ref, onMounted, computed } from 'vue';
import { useAccountStore } from 'stores/Account';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import indpi from 'src/API/IndicatorApi';
const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();


const classifications = ref([])
const editClass = ref({
  state:false,
  val:null
})

const table = ref({
  columns:[
    {name:'id', label:'ID',field:row => row.id},
    {name:'name', label:'CLASIFICACION',field:row => row.name},
    {name:'perdentage', label:'PORCENTAGE',field:row => row.percentage},

  ]
})

const init = async ( ) => {
  $q.loading.show({message:'Obteniendo Clasificaciones'})
  const resp = await indpi.getClass()
  if(resp.error){
    console.log(resp);
  }else{
    console.log(resp)
    classifications.value = resp;
    $q.loading.hide();
  }
}

const mosRow = (a, b) => {
  editClass.value.state = true;
  editClass.value.val =  {...b}
  console.log(b);
}

const edit = async () => {
  $q.loading.show({message:'Editando clasificacion'});
  console.log(editClass.value.val)
  const resp = await indpi.editClass(editClass.value.val);
  if(resp.error){
    console.log(resp)
  }else{
    console.log(resp)
    let inx = classifications.value.findIndex(e => e.id == resp.id);
    classifications.value[inx] = resp;
    editClass.value.state = false
    $q.loading.hide()
  }
}
init();
</script>

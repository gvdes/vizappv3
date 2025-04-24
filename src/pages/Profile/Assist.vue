<template>
  <q-page padding>
    <q-table title="Asistencias" :rows="report" row-key="ID" flat bordered :separator="'cell'" dense
        :filter="filter" no-data-label="No hay nada Aun">
        <template v-slot:top>

          <q-separator spaced inset vertical dark />
          <div class="row items-center">
            <div class="col">Reporte de Asistencias</div>
          </div>
          <q-space />

          <q-input borderless dense debounce="300" color="primary" v-model="filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import rhpi from 'src/API/RhApi';
import { useAccountStore } from 'stores/Account';
import ExcelJS from 'exceljs';
const $q = useQuasar();
const piniaAccount = useAccountStore();
const $router = useRouter();

const report = ref([])
const filter = ref('');


const init = async () => {
  console.log(piniaAccount.joinedStore.name)
  const resp = await  rhpi.getReportWeekStore();
  if(resp.error){
    if(resp.error.status == 405){
      $router.push('/')
      $q.notify({message:'No tienes acceso a esta pagina',type:'negative',position:'center'})
    }
  }else{
    report.value = resp.report.filter(e => e.SUCURSAL === piniaAccount.joinedStore.name && e.ID === piniaAccount.account.RC_id);
  }
}
init()
</script>

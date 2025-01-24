<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <q-btn rounded icon="arrow_back"   />
        <div class="col anek-bld text-grey-9 q-pl-sm">Calculo Nomina</div>
        <div>
          <q-btn  rounded icon="autorenew" title="Iniciar de nuevo"  />
          <q-btn  rounded icon="download" title="Descargar Archivo"  />
          <q-btn  rounded icon="publish" @click="clickFile" title="Importar Archivo" />
        </div>
      </div>
    </div>
    <q-separator spaced inset vertical dark />
    <!-- <q-btn color="primary" icon="upload_file" flat title="Subir Etiquetas" @click="clickFile" /> -->
    <input type="file" ref="inputFile" id="inputFile" @input="readFile" hidden accept=".xlsx,.xls" />



  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import rhpi from 'src/API/RhApi';
import { useAccountStore } from 'stores/Account';
const $q = useQuasar();
const $router = useRouter();


const inputFile = ref(null)

const clickFile = () => {
  inputFile.value.click()
}




</script>

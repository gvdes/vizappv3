<template>
  <div>

    <div>
      <q-card flat>
        <q-card-section horizontal class="justify-between items-center">
          <q-card-section>
            <q-btn color="primary" flat round icon="fas fa-rotate-right" @click="initComp" />
          </q-card-section>

          <q-card-section class="row">
            <q-select dense v-model="report" :options="reportsOpts" label="Seleccione" option-label="name" option-value="rep" outlined />
            <q-btn color="primary" outline label="Generar" @click="genReport" v-if="report" />
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>

    <q-inner-loading :showing="reporting">
      <q-spinner-dots size="5em" color="primary" />
      <div class="bg-white q-pa-md">Generando reporte... espere</div>
    </q-inner-loading>

    <q-inner-loading :showing="!readyComp">
      <q-spinner-gears size="50px" color="primary" />
      <div>Cargando datos...</div>
    </q-inner-loading>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import Comparatool from 'src/API/ComparatoolApi';

  const $route = useRoute();
  const $q = useQuasar();

  const sid = $route.params.idstore;
  const wid = $route.params.wid;

  const $props = defineProps({
    store:{type:Object, default:{}},
    warehouse:{type:Object, default:{}}
  });

  const readyComp = ref(false); // cuando el componente esta re/cargando el inicio, muestra el inner loading
  const reporting = ref(false); // cuando un reporte se esta generando, muestra el inner loading
  const report = ref(null); // almacena el tipo de reporte a generar

  const destBranch = ref(null);
  const destWarehouse = ref(null);

  const reportsOpts = [
    { rep:"A", name:"Minimos y Maximos", description:"Productos que estan agotados o por agotarse", group:"cds" },
    { rep:"B", name:"Modelos Faltantes", description:"Productos que no tenemos pero CEDIS si", group:"cds" }
  ];

  const initComp = async() => {
    // readyComp.value = false;
    // console.log("Vamo a traer los datos para la comparacion de almacenes");
    // const resp = await Comparatool.index(wid);
    // console.log(resp);

    // storesDB.value = resp.stores;

    readyComp.value = true;
  }

  const genReport = async () => {
    reporting.value = true;
    let repid = report.value.rep;// id del reporte
    const resp = await Comparatool.getReport(wid, repid);
    console.log(resp);

    // table1.value.data = resp.products;

    reporting.value = false;
  }

  onMounted(() => {
    initComp();
  });

</script>

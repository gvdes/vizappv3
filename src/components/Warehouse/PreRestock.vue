<template>
  <div class="">

    <div>
      <q-card flat>
        <q-card-section horizontal class="justify-between items-center">
          <q-card-section>
            <!-- Aqui podemos poner muchas otras opciones para los reportes -->
          </q-card-section>

          <q-card-section class="row">
            <q-select dense v-model="report" :options="reportsOpts" label="Seleccione" option-label="name" option-value="rep" outlined >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-btn color="primary" outline label="Generar" @click="genReport" v-if="report" />
            <div></div>
          </q-card-section>
        </q-card-section>
      </q-card>

      <q-separator />

      <q-card v-if="responseReport" flat>
        <q-card-section>
          <div class="text-h6">{{ report.name }}</div>
          <div class="text-subtitle2">{{ report.description }}</div>
        </q-card-section>
        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </q-card-section>
      </q-card>
    </div>

    <q-inner-loading :showing="reporting">
      <div class="column items-center">
        <q-spinner-dots size="50px" color="primary" />
        <div>Generando reporte, espere...</div>
      </div>
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
    categories:{type:Array, default:[]},
    store:{type:Object, default:{}},
    warehouse:{type:Object, default:{}}
  });

  const reporting = ref(false);
  const report = ref(null); // almacena el tipo de reporte a generar

  const responseReport = ref(false)

  const reportsOpts = [
    { rep:"A", name:"Minimos y Maximos", description:"Productos que estan agotados o por agotarse", group:"cds" },
    { rep:"B", name:"Modelos Faltantes", description:"Productos que no tenemos pero CEDIS si", group:"cds" }
  ];

  const initComp = async() => {
    // console.log("Vamo a traer los datos para la comparacion de almacenes");
    // const resp = await Comparatool.index(wid);
    // console.log(resp);

    // storesDB.value = resp.stores;
    console.log($props.categories);
  }

  const genReport = async () => {
    console.log();
    reporting.value = true;
    let repid = report.value.rep;// id del reporte
    const resp = await Comparatool.getReport(wid, repid);
    responseReport.value = true;
    console.log(resp);

    // table1.value.data = resp.products;

    reporting.value = false;
  }

  onMounted(() => {
    initComp();
  });

</script>

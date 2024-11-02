<template>
  <q-card class="my-card">
    <q-card-section horizontal class="row justify-between items-center">
      <q-card-section class="text-h6">Nuevo Pedido</q-card-section>
      <q-card-section>
        <div class="row items-center q-gutter-md">
          <q-select v-model="restockType" :options="reqtypes" dense filled option-label="name" option-value="id" @update:model-value="reqTypeChange" :disable="formState==2"/>
          <!-- <q-select v-if="inaCds" v-model="ctxRestock.opt" dense :options="ctxRestock.opts" filled /> -->
           <q-btn outline round color="red" icon="close" @click="cancel" v-if="formState==1"/>
        </div>
      </q-card-section>
    </q-card-section>
    <q-separator />

    <template v-if="settingsforcedis">
      <q-card-section >
        <div class="row q-gutter-md items-center">
          <q-select v-model="whrSrc" :options="mywarehouses" label="Almacen Origen" option-label="name" filled class="col"/>
          <div v-if="whrSrc" class="col"> Se realizara el comparativo contra los almacenes {{ mywarehouses.filter( w => w.id!=whrSrc.id ).map( w => w.name ).join(",") }}</div>
        </div>
      </q-card-section>
    </template>

    <!-- <q-separator />
    <div>{{ stores_std.map( s => s.alias ) }}</div>
    <div>{{ stores_cds.map( s => s.alias ) }}</div>
    <div>{{ mystore.name }}</div>
    <div>{{ mywarehouses.map( w => w.alias ) }}</div>
    <div>{{ vsCedis }}</div>
    <q-separator /> -->

    <q-tab-panels v-model="restockType.shortname" animated>
      <q-tab-panel name="MAN" class="q-pa-none">
        <FormBlank
          :warehouses_cedis="warehouses_cedis"
          @creating="creating"
          @created="created"
          :restock_type="restockType"
        />
      </q-tab-panel>

      <q-tab-panel name="AVZ" class="q-pa-none">
        <FormAdvance
          :warehouses_cedis="warehouses_cedis"
          :restock_type="restockType"
          :wrs_src="whrSrc"
          @creating="creating"
          @created="created"
          @previewLoading="previewLoading"
          @previewLoaded="previewLoaded"
        />
      </q-tab-panel>

      <q-tab-panel name="VFSOL" class="q-pa-none">
        <FormImport />
      </q-tab-panel>

      <q-tab-panel name="PVT" class="q-pa-none">
        agregar form para importar desde preventa
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useQuasar } from 'quasar';
  import { useRoute } from 'vue-router';
  import RestockApi from 'src/API/RestockApi';
  import FormBlank from './_createBlank.vue'
  import FormAdvance from './_createAdvance.vue'
  import FormImport from './_createBlank.vue'

  const $route = useRoute();
  const $q = useQuasar();

  const $sid = $route.params.idstore;
  const formState = ref(1);

  const $props = defineProps({
    reqtypes:{type:Array, default:[]},
    inaCds:{type:Boolean, default:false},
    storesdb:{type:Array, default:[]},
  });

  const whrSrc = ref(null);
  const vsCedis = ref(null);
  const srcBranch = ref(null);
  const restockType = ref({id: 1, name: 'Manual', shortname: 'MAN'});

  const stores_std = computed(() => $props.storesdb.filter( s => s._type==2));
  const stores_cds = computed(() => $props.storesdb.filter( s => s._type==1));
  const mystore = computed(() => $props.storesdb.filter( s => s.id==$sid)[0]);
  const mywarehouses = computed(() => mystore.value.warehouses.filter( w => w._state==1 && w._type==4));
  const warehouses_cedis = computed(() => stores_cds.value.flatMap( s => s.warehouses).filter( w => w._state==1 && w._type==4));
  const settingsforcedis = computed(() => ($props.inaCds && [1,2].includes(restockType.value.id)));

  const $emit = defineEmits(["creating", "created", "previewLoading", "previewLoaded", "scale", "cancel"]);

  const reqTypeChange = type => $emit("scale",type.id);

  const creating = () => {
    formState.value = 2;
    $emit("creating");
  };

  const created = order => {
    formState.value = 1;
    $emit("created", order);
  };

  const previewLoading = () => {
    formState.value = 2;
    $emit("previewLoading");
  }

  const previewLoaded = (scale=false) => {
    formState.value = 1;
    $emit("previewLoaded",scale);
  }

  const cancel = () => $emit("cancel");

</script>

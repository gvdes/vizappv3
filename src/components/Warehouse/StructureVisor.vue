<template>

  <div>
    <!--
      A este componente, aun le faltan cosas como:
      Eliminar o deshabilitar ubicaciones
      Cargar los productos de la seccion activa
     -->

    <div class="row q-gutter-md">

      <div class="col">
        <q-card class="my-card">
          <q-card-section horizontal>
            <q-card-section v-if="section.location">
              <!-- <pre>{{ section.location }}</pre> -->
              <div class="row items-center text-h6">
                <q-btn color="primary" flat dense icon="home" @click="resetLocs" />
                <q-btn v-for="(path,idx) in paths_locs" :key="idx"
                  flat dense
                  :label="paths_locs.length==(idx+1) ? `${path.name} (${path.path})` : path.name"
                  :icon-right="paths_locs.length!=(idx+1) ? 'chevron_right' : '' "
                  :disable="paths_locs.length==(idx+1)"
                  @click="openSection(null,path)"
                />
              </div>
            </q-card-section>
            <q-card-section v-else>
              <div class="text-h6">Ubicaciones</div>
            </q-card-section>

            <q-card-section class="col text-right">
              <q-btn color="primary" icon="fas fa-tag">
                <q-menu>
                  <q-list style="min-width: 100px">
                    <q-item clickable v-close-popup>
                      <q-item-section>Todas</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup>
                      <q-item-section>
                        <q-item-label>{{ section.location.path }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
              <q-btn color="primary" icon="add" @click="wndSectionator.state = true"/>
            </q-card-section>
          </q-card-section>
          <q-table
            :loading="table.loading"
            :rows="rowsLocs"
            :columns="table.cols"
            row-key="name"
            :pagination="table.pagination"
            @row-click="openSection"
          />
        </q-card>
      </div>

      <!-- Despues... vamoa poner los productos -->
      <!-- <div class="col" v-if="section.data">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Productos</div>
            <div class="text-subtitle2">by John Doe</div>
          </q-card-section>
          <q-table
            :rows="$props.sections"
            :columns="table.cols"
            row-key="name"
          />
        </q-card>
      </div> -->

    </div>

    <q-dialog v-model="wndSectionator.state" :persistent="wndSectionator.block">
      <SectionatorLoc :sections="rowsLocs" :location="section.location" @add="sectionate"/>
    </q-dialog>

  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Wapi from 'src/API/WarehouseApi';
  import Lapi from 'src/API/WrhsLocation';
  import SectionatorLoc from 'src/components/Warehouse/SectionatorLoc.vue';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();
  const $route = useRoute();
  const $router = useRouter();

  const $props = defineProps({
    roots:{ type:Array, default:[] }
  });

  const $emit = defineEmits(['rootsNews']);

  const paths_locs = ref([]); // almacena los encabezados de las ubicaciones

  const table = ref({
    cols:[
      { name:"id", label:"ID", field:"id", },
      { name:"name", label:"Nombre", field:"name", },
      { name:"alias", label:"Alias", field:"alias", },
      { name:"path", label:"Ubicacion", field:"path", },
    ],
    filter:"",
    pagination:{
      rowsPerPage:50
    },
    loading:false
  });

  // almacena la seccion que se visualiza en pantalla
  const section = ref({
    location:null,
    sections:[],
    products:[]
  });

  watch($props.roots, (newVal, oldVal) => {
    paths_locs.value = []
    $props.roots = newVal
  });

  const wndSectionator = ref({state:false,block:false});

  // almacena las ubicaciones que se renderizaran en la tabla principal
  const rowsLocs = computed(() => paths_locs.value.length==0 ? $props.roots : section.value.sections);

  const resetLocs = () => {
    paths_locs.value = []
    section.value.location = null;
    section.value.sections = [];
  }

  const openSection = async(a,row) => {
    // $q.loading.show({ message:"Espera..." });
    table.value.loading = true

    let idx = paths_locs.value.findIndex( p => p.id==row.id);
    let droppos = (paths_locs.value.length)

    const resp = await Wapi.section($route.params.wid,row.id);

    (idx>=0) ? paths_locs.value.splice(idx,droppos) : void 0;

    section.value.location = resp.location;
    section.value.sections = resp.sections;

    paths_locs.value.push(resp.location)
    // $q.loading.hide();
    table.value.loading = false
  }

  const sectionate = async (data) => {
    // console.log(data)
    wndSectionator.value.block = true;

    let idwrhs = $route.params.wid

    if(section.value.location){
      console.log("Vamo a crear una rama")
      let idloc = section.value.location.id
      const resp = await Lapi.sectionate(data,idwrhs,idloc);
      console.log(resp)

      resp.createds.forEach( l => section.value.sections.push(l))
    }else{
      console.log("Vamoa crear una raiz")
      const resp = await Wapi.sectionate(data,idwrhs);
      console.log(resp)

      $emit("rootsNews",resp.createds)
    }

    $q.notify({
      icon:'done',
      color:'positive',
      message:`Seccionamiento completado!`
    });

    wndSectionator.value.block = false;
    wndSectionator.value.state = false;
  }

</script>

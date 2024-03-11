<template>
  <div class="row">

    <div class="q-pr-md">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">Categorias ({{ seasons.length }})</div>
        </q-card-section>
        <q-separator />
        <q-card-actions>
          <q-btn color="primary" label="Marcar todo" dense no-caps flat @click="treeSeasons.ticked = idscats"/>
          <q-btn color="primary" label="Borrar todo" dense no-caps flat @click="treeSeasons.ticked = []"/>
        </q-card-actions>
        <q-separator />
        <q-card-section>
          <q-tree class="col-12 col-sm-6"
            :nodes="treeSeasons.nodes"
            v-model:ticked="treeSeasons.ticked"
            v-model:expanded="treeSeasons.expanded"
            node-key="idcat"
            tick-strategy="leaf-filtered"
            color="primary"
          />
        </q-card-section>
        <q-separator />
        <q-card-actions>
          <q-btn color="primary" label="Marcar todo" dense no-caps flat @click="treeSeasons.ticked = idscats"/>
          <q-btn color="primary" label="Borrar todo" dense no-caps flat @click="treeSeasons.ticked = []"/>
        </q-card-actions>
      </q-card>
    </div>

    <div class="col">
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Filtros</div>
        </q-card-section>
        <q-separator />
        <q-card-section horizontal class="items-center">

          <q-card-section class="col q-pa-sm">
            <q-select v-model="filters.gstate.opt" :options="filters.gstate.opts" label="Estado (catalogo)" filled />
          </q-card-section>

          <q-separator vertical />
          <q-card-section class="col q-pa-sm">
            <q-select v-model="filters.lstate.opt" :options="filters.lstate.opts" label="Estado (almacen)" filled />
          </q-card-section>

          <q-separator vertical />
          <q-card-section class="col q-pa-sm">
            <q-select v-model="filters.stock.opt" :options="filters.stock.opts" label="Stock" filled />
          </q-card-section>

          <q-separator vertical />
          <q-card-section class="col q-pa-sm">
            <q-select v-model="filters.locations.opt" :options="filters.locations.opts" label="Ubicaciones" filled />
          </q-card-section>

          <q-separator vertical />
          <q-card-section class="col q-pa-sm">
            <q-select v-model="filters.limits.opt" :options="filters.limits.opts" label="Minimos / Maximos" filled />
          </q-card-section>

          <template v-if="usingFilters">
            <q-separator vertical />
            <q-card-section>
              <q-btn color="negative" flat icon="backspace" round @click="resetFilters"/>
            </q-card-section>
          </template>
        </q-card-section>

        <q-separator />
        <q-card-section horizontal class="justify-between">
          <q-card-section>
            Productos: {{ productsShow.length }} <span v-if="usingFilters" class="text-grey"> de {{ $props.products.length }}</span>
          </q-card-section>

          <q-card-section>
            tools
          </q-card-section>
        </q-card-section>
      </q-card>

      <q-table
        flat bordered ref="tableprods"
        :rows="productsShow"
        :columns="table.columns"
        row-key="id"
        :pagination="table.pagination"
        :filter="table.filter"
      >
        <template v-slot:top>
          <q-input outlined rounded v-model="table.filter" type="text" label="Buscar" dense debounce="300ms"/>
        </template>
      </q-table>
    </div>
    <!-- Productos: {{ $props.products.length }} -->
  </div>
</template>

<script setup>
  import { ref, computed, reactive, watch } from 'vue';

  const $props = defineProps({
    products:{type:Array,default:[]},
    seasons:{type:Array,default:[]}
  });

  let treeSeasons = reactive({
    ticked: [],
    expanded:[],
    nodes:[]
  });

  let temp = ref([]);

  const table = ref({
    columns:[
      { name:"id", label:"UID", field:"id", },
      { name:"description", label:"Descripcion", align:"left", field: row => row.description },
      { name:"code", label:"Codigo", field: row => row.code, align:"left", sortable:true },
      { name:"category", label:"Categoria", field: row => row.category.name, align:"left" },
      { name:"shortcode", label:"Codigo Corto", field: row => row.short_code, align:"left" },
      { name:"locations", label:"Ubicaciones", align:"center", field: row => row.locations.length, sortable:true },
      { name:"gstate", label:"Estado (catalogo)", field: row => row.state.name, align:"center" },
      { name:"lstate", label:"Estado (almacen)", field: row => row.stock.state.name, align:"center" },
      { name:"relateds", label:"Relacionados", field: row => row.relateds.length, align:"left", sortable:true },
      { name:"available", label:"Disponible", field:row => row.stock._current, align:"center", classes: row => row.stock._current<= 0 ? 'text-red':'text-blue', sortable:true },
      { name:"current", label:"Actual (real)", field:row => row.stock.available, align:"center", classes: row => row.stock._current<= 0 ? 'text-red':'text-blue', sortable:true },
      { name:"min", label:"Maximo", field:row => row.stock._max, align:"center" },
      { name:"min", label:"Minimo", field:row => row.stock._min, align:"center" },
      { name:"min", label:"Por llegar", field:row => row.stock.in_coming, align:"center" },
      { name:"min", label:"Reservado", field:row => row.stock.reserved, align:"center" },
      { name:"ipack", label:"PxC", field: row => row.pieces, classes: row => row.pieces ? '':'text-red anek-bld', align:"center" },
      { name:"unitrestock", label:"Un. surtido", align:"center", field: row => row.unitsupply ? row.unitsupply.name:'X', classes: row => row.unitsupply ? '':'text-red anek-bld' },
    ],
    filter:"",
    pagination:{
      rowsPerPage:50
    }
  });

  const filters = ref({
    gstate:{
      opt:{id:0, label:"Todo"},
      opts:[
        {id:0, label:"Todo"},
        {id:1, label:"Disponible"},
        {id:2, label:"Descatalogado"},
        {id:3, label:"Bloqueado"},
        {id:4, label:"Eliminado"},
      ]
    },
    lstate:{
      opt:{id:0, label:"Todo"},
      opts:[
        {id:0, label:"Todo"},
        {id:1, label:"Disponible"},
        {id:2, label:"Descatalogado"},
        {id:3, label:"Bloqueado"},
        {id:4, label:"Eliminado"},
      ]
    },
    stock:{
      opt:{id:0, label:"Todo"},
      opts:[
        {id:0, label:"Todo"},
        {id:1, label:"Con stock"},
        {id:2, label:"Agotado"},
        {id:3, label:"Negativo"},
      ]
    },
    locations:{
      opt:{id:0, label:"Todo"},
      opts:[
        {id:0, label:"Todo"},
        {id:1, label:"Con ubicaciones"},
        {id:2, label:"Sin ubicaciones"}
      ]
    },
    limits:{
      opt:{id:0, label:"Todo"},
      opts:[
        {id:0, label:"Todo"},
        {id:1, label:"Con Minimo y Maximo"},
        {id:2, label:"Sin Minimo y/o Maximo"}
      ]
    }
  });

  const usingFilters = computed(() => Object.keys(filters.value).map( filter => filters.value[filter].opt.id).reduce((ac,cu) => (ac+cu),0) );

  const productsShow = computed(() => usingFilters.value ?
      $props.products.filter( p =>
        (
          (filters.value.gstate.opt.id==0 ? true : p._state == filters.value.gstate.opt.id) &&
          (filters.value.lstate.opt.id==0 ? true : p.stock._state == filters.value.lstate.opt.id) &&
          (filters.value.locations.opt.id==0 ? true :
            filters.value.locations.opt.id==1 ? p.locations.length>0 :
              filters.value.locations.opt.id==2 ? p.locations.length==0 : true
          ) &&
          (filters.value.limits.opt.id==0 ? true :
            filters.value.limits.opt.id==1 ? (p.stock._min>0 && p.stock._max>0) :
              filters.value.limits.opt.id==2 ? (p.stock._min==0 || p.stock._max==0) : true
          ) &&
          (filters.value.stock.opt.id==0 ? true :
            filters.value.stock.opt.id==1 ? (p.stock._current>0 || p.stock.available>0) :
              filters.value.stock.opt.id==2 ? (p.stock._current==0 || p.stock.available==0) :
                filters.value.stock.opt.id==3 ? (p.stock._current<0 || p.stock.available<0) : true
          ) &&
          (treeSeasons.ticked.includes(p._category))
        )
      ) : $props.products.filter( p => treeSeasons.ticked.includes(p._category))
  );

  const seasons = computed(() => $props.seasons.map(s => s.parent)); // categorias raiz

  const categories = computed(() => $props.seasons.map( s => s.children).flat()); // categorias hijas

  const idscats = computed(() => categories.value.concat(seasons.value.map( c => c.category)).map( c => c.id));

  const resetFilters = () => {
    for (const filter in filters.value) { filters.value[filter].opt = filters.value[filter].opts[0]; }
  }

  const buildTreeSeason = () => {
    treeSeasons.nodes = seasons.value.map( s =>
        ({
          label:`${s.category.name}`,
          idcat:s._season,
          children:getChildren(s._season)
        })
      );
  }

  const getChildren = idc => {
    return categories.value.filter( c => c.root == idc)
      .map( c => ({
        label:`${c.name}`,
        idcat:c.id,
        children:getChildren(c.id)
      }));
  }

  buildTreeSeason();
  treeSeasons.ticked = idscats.value;

  watch($props.products, (newVal, oldVal) => $props.products = newVal);
  watch($props.seasons, (newVal, oldVal) => {
    $props.seasons = newVal;
    buildTreeSeason();
  });

</script>

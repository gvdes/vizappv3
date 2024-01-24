<template>
  <div class="">

    <div>
      <q-card class="q-mb-md">
        <q-card-section horizontal class="items-center">
          <!-- <q-card-section>
            <q-select v-model="reports.opt" :options="reports.opts" label="Vista" filled >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.desc }}</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-item-label>{{ scope.opt.id }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section> -->

          <q-card-section class="col">
            <q-select v-model="filters.lstate.opt" :options="filters.lstate.opts" label="Estado" filled />
          </q-card-section>

          <q-separator vertical />
          <q-card-section class="col">
            <q-select v-model="filters.stock.opt" :options="filters.stock.opts" label="Stock" filled />
          </q-card-section>

          <q-separator vertical />
          <q-card-section class="col">
            <q-select v-model="filters.locations.opt" :options="filters.locations.opts" label="Ubicaciones" filled />
          </q-card-section>

          <q-separator vertical />
          <q-card-section class="col">
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
            Elementos: {{ productsShow.length }}
          </q-card-section>

          <q-card-section>
            tools
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>

    <q-table
      flat bordered ref="tableprods"
      :rows="productsShow"
      :columns="table.columns"
      row-key="id"
      :pagination="table.pagination"
      :filter="table.filter"
    >
      <template v-slot:top>
        <q-input v-model="table.filter" type="text" label="Buscar" dense/>
      </template>
    </q-table>
    <!-- Productos: {{ $props.products.length }} -->
  </div>
</template>

<script setup>
  import { ref, computed, reactive, watch } from 'vue';

  const $props = defineProps({
    products:{type:Array,default:[]}
  });

  const table = ref({
    columns:[
      { name:"id", label:"UID", field:"id", },
      { name:"description", label:"Descripcion", align:"left", field: row => row.description },
      { name:"code", label:"Codigo", field: row => row.code, align:"left" },
      { name:"shortcode", label:"Codigo Corto", field: row => row.short_code, align:"left" },
      { name:"locations", label:"Ubicaciones", align:"center", field: row => row.locations.length, sortable:true },
      { name:"state", label:"Estatus Global", field: row => row.state.name, align:"center" },
      { name:"state", label:"Estatus Tienda", field: row => row.stock.state.name, align:"center" },
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
          )
        )
      ) : $props.products
  );

  const resetFilters = () => {
    for (const filter in filters.value) { filters.value[filter].opt = filters.value[filter].opts[0]; }
  }

  watch($props.products, (newVal, oldVal) => $props.products = newVal)
</script>

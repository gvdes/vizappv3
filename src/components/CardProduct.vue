<template>
  <q-card class="my-card">
    <q-card-section class="row items-start justify-between">
      <div class="text-h4">{{ item.code }}</div>
      <div class="text-h6 text-right">{{ item.short_code }}</div>
    </q-card-section>
    <q-card-section>
      <div>ID: {{ item.id }}</div>
      <div>{{ item.description }}</div>
    </q-card-section>

    <q-separator />

    <q-tabs v-model="tab" no-caps>
      <q-tab name="tab_stocks" label="Stock" />
      <q-tab name="tab_locs" :label="`Ubicaciones (${locations.length })`" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="tab_stocks">
        <q-table flat
          :rows="stock"
          :columns="tbl_stock.cols"
          row-key="name"
        />
      </q-tab-panel>

      <q-tab-panel name="tab_locs">
        <q-table flat
          :rows="locations"
          :columns="tbl_locs.cols"
          row-key="name"
        />
      </q-tab-panel>
    </q-tab-panels>

  </q-card>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';

  const props = defineProps({
    item:{ type:Object, default:{} }
  });

  const tbl_stock = ref({
    cols:[
      { name:"warehouse", label:"Almacen", field: row => row.warehouse.name },
      { name:"current", label:"Stock Actual", field: "_current" },
      { name:"available", label:"Stock Disponible", field: "available" },
      { name:"reserved", label:"Stock Reservado", field: "reserved" },
      { name:"incomming", label:"Por Llegar", field: "in_coming" },
      { name:"min", label:"Stock Minimo", field: "_min" },
      { name:"max", label:"Stock Maximo", field: "_max" },
      { name:"prdstate", label:"Estatus (del producto)", field: "_state" },
    ]
  });

  const tbl_locs = ref({
    cols:[
      { name: "location", label:"Ubicacion", field:"path" },
      { name: "nameloc", label:"Nombre", field:"name" },
      { name: "alias", label:"Alias", field:"alias" },
      { name: "idloc", label:"ID (ubicacion)", field:"id" },
    ]
  });

  const item = ref(props.item);
  const tab = ref("tab_stocks");

  const stock = computed(() => item.value.stocks);
  const locations = computed(() => item.value.locations);

  console.log(stock.value);
  console.log(locations.value);

</script>

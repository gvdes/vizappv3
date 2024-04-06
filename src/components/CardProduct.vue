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
      <q-tab name="tab_locs" label="Ubicaciones" />
      <q-tab name="tab_adjust" label="Ajustes" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="tab_stocks">
        <q-markup-table title="Stocks" flat v-if="item.stocks.length">
          <thead>
            <tr class="text-center anek-bld">
              <th class="text-left">Almacen</th>
              <th>Estado</th>
              <th>Actual</th>
              <th>Disponible</th>
              <th>Minimo</th>
              <th>Maximo</th>
              <th>Reservado</th>
              <th>Por llegar</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-center" v-for="(stock,idx) in item.stocks" :key="idx">
              <td class="text-left">{{stock.warehouse.name}}</td>
              <td>{{stock._state}}</td>
              <td>{{stock._current}}</td>
              <td>{{stock.available}}</td>
              <td>{{stock._min}}</td>
              <td>{{stock._max}}</td>
              <td>{{stock.reserved}}</td>
              <td>{{stock.in_coming}}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-tab-panel>

      <q-tab-panel name="tab_locs">
        <div class="text-h6">Ubicaciones</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>

      <q-tab-panel name="tab_adjust">
        <div class="text-h6">Ajustes</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>

  </q-card>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';

  const props = defineProps({
    item:{ type:Object, default:{} }
  });

  const item = ref(props.item);
  const tab = ref("tab_stock");

  const stock = computed(() => item.value.stocks);
  const locations = computed(() => item.value.locations);

  console.log(stock.value);
  console.log(locations.value);

</script>

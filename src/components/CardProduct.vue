<template>
  <div>
    <!-- <div>image</div> -->

    <div>

      <div class="q-pb-md row">
        <!-- <div>image</div> -->
        <div>
          <div class="text-h6 anek-bld">{{item.code}}</div>
          <div>{{item.description}}</div>
        </div>
      </div>

      <div class="row justify-between q-pb-md">
        <div>
          <div class="anek-bld">{{item.short_code}}</div>
          <div class="text-caption">Codigo corto</div>
        </div>

        <div>
          <div>{{item.barcode}}</div>
          <div class="text-caption">Codigo de barras</div>
        </div>
      </div>

      <div class="text-overline">Stock</div>
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

      <div class="text-overline">Ubicaciones</div>
      <q-item v-if="item.locations.length">
        <q-item-section avatar v-for="(location,idx) in item.locations" :key="idx">
          <q-item-label caption>{{location.id}}</q-item-label>
          <q-item-label class="anek-bld">{{location.path}}</q-item-label>
          <q-item-label class="text-h6">{{location.warehouse.alias}}</q-item-label>
          <!-- <q-item-label caption>{{item.locations}}</q-item-label> -->
        </q-item-section>
      </q-item>
      <q-item v-else>
        <q-item-section top avatar>
          <q-avatar color="primary" text-color="white" icon="fas fa-warning" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Sin ubicaciones</q-item-label>
          <!-- <q-item-label caption lines="2">Secondary line text.</q-item-label> -->
        </q-item-section>
      </q-item>

    </div>

    <!-- <div>tabs</div> -->
  </div>

  <!-- <div class="text-caption"><pre>{{item}}</pre></div> -->
</template>

<script setup>
  import { ref, computed, watch } from 'vue';

  const props = defineProps({
    item:{ type:Object, default:{} }
  });

  const item = ref(props.item);

  watch(props, (newVal, oldVal) => {
    // console.log(props.item);
    item.value = props.item;
  });

</script>

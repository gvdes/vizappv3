<template>
  <q-card class="my-card">
    <q-card-section>
      <div><span class="text-h6">Estado</span> <span>(V1)</span></div>
      <div class="text-subtitle2">Resumen para: {{ totalList }} productos</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-markup-table flat bordered>
        <tbody>
          <tr>
            <td class="text-left">Operativos</td>
            <td class="text-right" >{{ avls.length }}</td>
          </tr>
          <tr>
            <td class="text-left">Con stock disponible | actual</td>
            <td class="text-right">{{ avls_stock_avl.length }} | {{ avls_stock_cur.length }}</td>
          </tr>
          <tr :class="avls_stockout.length ? alertLine:''">
            <td class="text-left">Agotados | Negativo</td>
            <td class="text-right">{{ avls_stockout.length }} | {{ avls_stock_neg.length }}</td>
          </tr>
          <tr>
            <td class="text-left">min. y max. establecido</td>
            <td class="text-right">{{ avls_minmax.length }}</td>
          </tr>
          <tr>
            <td class="text-left">min. y/o max. no establecido</td>
            <td class="text-right">{{ avls_notminmax.length }}</td>
          </tr>
          <tr>
            <td class="text-left">Ubicados</td>
            <td class="text-right">{{ avls_locateds.length }}</td>
          </tr>
          <tr class="">
            <td class="text-left">Sin ubicar</td>
            <td class="text-right">{{ avls_nolocateds.length }}</td>
          </tr>
          <tr>
            <td class="text-left">Sobre stock</td>
            <td class="text-right">{{ avls_stockover.length }}</td>
          </tr>
          <!-- <tr>
            <td><q-icon name="fas fa-circle" :color="score[3]" /></td>
            <td class="text-left">Por agotarse</td>
            <td class="text-right">{{ avls_for_stockout.length }}</td>
          </tr> -->
          <tr>
            <td class="text-left">En transtio</td>
            <td class="text-right">{{ avls_arriving.length }}</td>
          </tr>
          <tr>
            <td class="text-left">Bloqueados en catalogo</td>
            <td class="text-right">{{ avls_shuldblock.length }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-markup-table flat dense>
        <tbody>
          <tr>
            <td class="text-left" colspan="2">No operativos</td>
            <td class="text-right" >{{ nAvls.length }}</td>
          </tr>
          <tr>
            <td><q-icon name="fas fa-circle" :color="score[3]" /></td>
            <td class="text-left">Con stock disponible / actual</td>
            <td class="text-right">{{ nAvls_stock_avl.length }} / {{ nAvls_stock_cur.length }}</td>
          </tr>
          <tr>
            <td><q-icon name="fas fa-circle" :color="score[3]" /></td>
            <td class="text-left">min. y max. establecido</td>
            <td class="text-right">{{ nAvls_minmax.length }}</td>
          </tr>
          <tr>
            <td><q-icon name="fas fa-circle" :color="score[3]" /></td>
            <td class="text-left">Sobrestock</td>
            <td class="text-right">{{ nAvls_stockover.length }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>

  </q-card>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';

  const $props = defineProps({
    productsdb:{ type:Array, default:[] }
  });

  const products = ref([]);
  const alertLine = "bg-amber-1 text-amber-10";

  let score = ["primary","positive","negative","orange"];

  let totalList = computed(() => products.value.length);
  let avls = computed(() => products.value.filter( p => p.stock._state==1 ));
  let avls_minmax = computed(() => avls.value.filter( p => p.stock._min>0 && p.stock._max>0 ));
  let avls_notminmax = computed(() => avls.value.filter( p => p.stock._min<1 || p.stock._max<1 ));
  let avls_stock_avl = computed(() => avls.value.filter( p => p.stock.available>0 ));
  let avls_stock_cur = computed(() => avls.value.filter( p => p.stock._current>0 ));
  let avls_locateds = computed(() => avls.value.filter( p => p.locations.length>0 ));
  let avls_nolocateds = computed(() => avls.value.filter( p => p.locations.length==0 ));
  let avls_stock_neg = computed(() => avls.value.filter( p => p.stock._current<0 ));
  let avls_stockout = computed(() => avls.value.filter( p => p.stock._current==0 ));
  // let avls_for_stockout = computed(() => avls.value.filter( p => p.stock._current==0 ));
  let avls_stockover = computed(() => avls.value.filter( p => p.stock._current>p.stock._max ));
  let avls_arriving = computed(() => avls.value.filter( p => p.stock.in_coming>0 ));
  let avls_shuldblock = computed(() => avls.value.filter( p => p._state!=1 ));


  let nAvls = computed(() => products.value.filter( p => p.stock._state!=1 ));
  let nAvls_stock_avl = computed(() => nAvls.value.filter( p => p.stock.available>0 ));
  let nAvls_stock_cur = computed(() => nAvls.value.filter( p => p.stock._current>0 ));
  let nAvls_minmax = computed(() => nAvls.value.filter( p => p.stock._min>0 && p.stock._max>0 ));
  let nAvls_stockover = computed(() => nAvls.value.filter( p => p.stock._current>p.stock._max ));


  // let pNotAvl = computed(() => products.value.filter());

  /**
   * 1.- Productos disponibles en almacen con stock
   * 2.- Productos disponibles en almacen con stock, con minimo y maximo
   * 3.- Productos disponibles en almacen, con stock, sin minimo y/o maximo
   * 4.- Productos disponibles en almacen con stock y ubicados
   * 5.- Productos disponibles en almacen con stock y sin ubicar
   * 6.- Productos disponibles por agotarse
   * 7.- Productos no disponibles en almacen
   * 8.- Productos no disponibles en almacen con stock
   * 9.- Productos no disponibles en almacen con minimos y maximos
   * 10.- Productos en almacen sin stock
   * 11.- Productos en almacen en negativos
   * 12.- Productos en almacen sin stock y ubicados
   * 0.- productos disponibles en almacen
   */

   watch(() => $props.productsdb, (newVal, oldVal) => products.value = newVal );
</script>

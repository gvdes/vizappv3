<template>
  <q-card>
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>Nuevo pedido</q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup/>
    </q-toolbar>
    <q-card-section>
      <q-select v-model="dtForm.type" :options="orderTypes" label="Tipo" filled />
      <q-select v-model="dtForm.targetStore" :options="branchTargets" option-value="id" option-label="name" label="Proveedor" filled />

      <template v-if="sameTarget">
        <q-separator spaced />
        <q-select v-model="dtForm.warehouse" :options="wrhsOpts" label="Almacen (es) Fuente" option-label="name" option-value="id" filled />
      </template>
      <!-- <template v-else>
        <div>
          Es otra sucursal, (solo se puede solicitar al almacen general)
        </div>
      </template> -->
    </q-card-section>
    <!-- <q-card-section><pre>{{ {KKKK:wrhsOpts, sameTarget, fromStore:$props.store, toStore:dtForm.targetStore } }}</pre> </q-card-section> -->
    <q-card-actions align="right">
      <q-btn color="primary" label="Iniciar" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
  import { ref, computed } from 'vue';

  const $props = defineProps({
    stores:{type:Array, default:[]},
    typeStore:{type:Number, default:2},
    store:{type:Number, default:0},
  });

  let dtForm = ref({
    type:null,
    targetStore:null,
    targetWarehouse:null
  });

  const orderTypes = [
    { id:1, label:"Manual" },
    { id:2, label:"Automatico" },
  ];

  const branchTargets = $props.stores;

  const sameTarget = computed(() => dtForm.value.targetStore ? ($props.store == dtForm.value.targetStore.id) : false);

  const wrhsOpts = computed(() => sameTarget.value ? branchTargets.find( b => b.id == $props.store).warehouses : [] );

</script>

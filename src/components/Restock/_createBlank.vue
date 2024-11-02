<template>
    <q-card flat>
      <q-card-section class="text-center column q-gutter-md">
        <q-select v-model="wrhTo" :options="warehouses_cedis" :disable="state==2" filled dense label="Proveedor" option-label="name" />
        <q-btn color="primary" label="Iniciar pedido en blanco" @click="create" :loading="state==2" v-if="wrhTo"/>
      </q-card-section>
    </q-card>
</template>

<script setup>
  import { ref } from 'vue';
  import RestockApi from 'src/API/RestockApi';

  const $props = defineProps({
    warehouses_cedis:{type:Array, default:[]},
    restock_type:{type:Object, default:{}}
  })

  const $emit = defineEmits(["creating","created"]);

  const wrhTo = ref(null);
  const state = ref(1);

  const create = async () => {
    console.log("Creando pedido (inBlankOrder)");
    state.value = 2;
    $emit('creating');

    let data = {
      type:$props.restock_type,
      to:wrhTo.value,
      folio:null,
      avz_params:{type:null,sections:[]}
    }

    const resp = await RestockApi.create(data);
    $emit('created', resp);
  }
</script>

<template>
  <q-table
    flat bordered
    :columns="cols"
    :rows="transfers"
    row-key="id"
    @row-click="open"
  />
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { date } from 'quasar'

  const now = Date.now();

  const cols = [
    { name:'id', label:'ID', field:'id' },
    { name:'state', label:'Estado', field: r => r.state.name },
    { name:'whfrom', label:'Almacen Origen', field: r => r.from.name },
    { name:'whto', label:'Almacen Destino', field: r => r.to.name },
    { name:'createdby', label:'Creador', field: r => r.created_by.name },
    { name:'transferists', label:'Responsables', field: r => r.transferists.map( u => u.account.nick ).join(', ') },
    { name:'createdat', label:'Creacion', field: r => date.formatDate(r.created_at, 'MMM DD, YYYY (HH:mm)') },
  ];

  let $props = defineProps({
    transfers:{type:Array, default:[]}
  });

  const $emit = defineEmits(["open"]);

  let transfers = ref($props.transfers)

  watch(() => $props.transfers, list => { transfers.value = list });

  const open = (evt,row,idx) => $emit("open",row);
</script>

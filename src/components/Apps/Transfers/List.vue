<template>
  <q-table
    flat bordered
    :rows="transfers"
    row-key="id"
  />
</template>

<script setup>
  import { ref, watch } from 'vue'

  let $props = defineProps({
    transfers:{type:Array, default:[]}
  });

  let transfers = ref($props.transfers)

  watch(() => $props.transfers, list => { transfers.value = list });
</script>

<template>
  <q-list separator class="bg-blue-grey-1">
    <q-item>
      <q-item-section>ID:</q-item-section>
      <q-item-section>{{ transfer.id }}</q-item-section>
    </q-item>
    <q-item>
      <q-item-section>Origen:</q-item-section>
      <q-item-section>{{ transfer.from.name }}</q-item-section>
    </q-item>
    <q-item>
      <q-item-section>Destino:</q-item-section>
      <q-item-section>{{ transfer.to.name }}</q-item-section>
    </q-item>
    <q-item>
      <q-item-section>Creacion:</q-item-section>
      <q-item-section class="column">
        <div>{{ transfer.created_by.name }}</div>
        <div>{{ date.formatDate(transfer.created_at, "MMM DD, HH:mm a") }}</div>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>Estado:</q-item-section>
      <q-item-section>{{ transfer.state.name }}</q-item-section>
    </q-item>
    <q-item>
      <q-item-section>Productos:</q-item-section>
      <q-item-section>{{ basketSize }}</q-item-section>
    </q-item>
    <q-item>
      <q-item-section>Responsables:</q-item-section>
      <q-item-section>{{ transfer.transferists.map( t => t.account.name ).join(', ') }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref } from "vue";

const $props = defineProps({
  transfer:{},
  date:{},
  basketSize:0
});

const transfer = ref($props.transfer)
const date = ref($props.date)
const basketSize = ref($props.basketSize)
</script>

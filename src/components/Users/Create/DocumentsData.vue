<template>
  <q-card class="my-card">
    <q-card-section class="my-card text-primary bg-white">
      <div class="text-h4">
        <q-icon name="person" class="q-mr-xs" />
        Documentos
      </div>
    </q-card-section>
    <q-card-section>
      <div class="q-pa-md row between" v-for="(file, index) in files" :key="index" >
        <q-file filled bottom-slots v-model="file.val" :label="file.label" counter style="width: 300px"
          class="col">
          <template v-slot:prepend>
            <q-icon name="cloud_upload" @click.stop.prevent />
          </template>
          <template v-slot:append>
            <q-icon name="close" @click.stop.prevent="file.val = null" class="cursor-pointer" />
          </template>
          <template v-slot:hint>
            {{file.label}}
          </template>
        </q-file>
        <q-separator spaced inset vertical dark />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  files:{type:Array}
})
</script>

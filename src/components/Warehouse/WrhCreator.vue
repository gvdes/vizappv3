<template>
  <template v-if="state=='w'">
    <q-form @submit="tryCreate">
      <div class="q-pa-md">Nuevo Almacen
      </div>
      <q-separator/>
      <div class="q-pa-xs">
        <div class="row">
          <q-input dense v-model="name" type="text" label="Nombre" input-class="text-uppercase" maxlength="25" />
          <q-input dense v-model="alias" type="text" label="Alias" input-class="text-uppercase" maxlength="5" />
        </div>
        <q-btn label="crear" flat type="submit" color="primary" :loading="btn" v-if="showBtnCreate"/>
      </div>
    </q-form>

    <div v-if="dup" class="bg-red text-white q-pa-sm">{{ dup }}</div>
  </template>

  <template v-if="state=='l'">
    <div class="text-center q-pa-md">
      <q-spinner-gears color="primary" size="3rem" :thickness="5" />
      <div>Espera...</div>
    </div>
  </template>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import Wapi from 'src/API/WarehouseApi';

  let name = ref("");
  let alias = ref("");
  let btn = ref(false);
  let state = ref("w");
  let dup = ref(undefined);

  const showBtnCreate = computed(() => name.value&&alias.value )

  const $emit = defineEmits(['created']);

  const tryCreate = async() => {
    console.log("Creando almacen");
    state.value='l';
    dup.value = undefined;

    let data = {
      name:name.value.toUpperCase(),
      alias:alias.value.toUpperCase()
    }
    const resp = await Wapi.create(data);
    console.log(resp);

    if(resp.error){
      console.error(resp.error.data);
      console.error(resp.error.status);
      dup.value = resp.error.data;
      state.value = 'w';
    }else{
      let isdup = resp.duplicate;
      let wrh = resp.warehouse;

      if(isdup){
        dup.value = `El almacen ${wrh.name} con alias ${wrh.alias} ya existe en esta Sucursal`;
      }else{
        $emit("created",wrh)
        name.value = "";
        alias.value = "";
      }

      state.value='w';
    }
  }
</script>

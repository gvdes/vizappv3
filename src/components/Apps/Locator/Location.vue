<template>
  <div class="q-pb-sm row">
    <div class="fw-bold text-grey-7 fs-inc1 col">Ubicacion</div>
    <q-btn v-if="location.section" dense color="red" icon="close" @click="clear"/>
  </div>

  <q-form v-if="!location.section"
    @submit="validateLocation"
    autocorrect="off"
    autocapitalize="off"
    autocomplete="off"
    spellcheck="false"
    class="row"
  >
    <q-input autofocus
      class="col"
      input-class="anek-bld text-h6 text-center text-uppercase"
      v-model="location.target"
      ref="inputbox"
      type="text"
      icon="fas fa-map-location-dot"
      filled
    >
      <template v-slot:prepend><q-icon name="fas fa-map-location-dot" /></template>
    </q-input>
    <q-btn squared color="primary" icon="search" @click.stop unelevated/>
  </q-form>

  <div v-else>
    <div class="row items-center">
      <div class="text-h5 col">{{location.section.path}}</div>
    </div>

    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label caption>ID: {{location.section.id}}</q-item-label>
          <q-item-label>{{location.section.name}}</q-item-label>
          <q-item-label>Almacen: <span class="anek-bld">{{location.warehouse.alias}}</span> ({{location.warehouse.name}})</q-item-label>
          <q-item-label>Sucursal: <span class="anek-bld">{{location.warehouse.store.name}}</span> ({{location.warehouse.store.alias}})</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-separator spaced/>
    <div class="text-center fw-sbold text-negative q-pa-md" v-if="location.products.length==0">SIN PRODUCTOS</div>
    <div v-else class="q-pa-md text-right">Productos: {{ location.products.length }}</div>

    <q-list>
      <q-item v-for="product in location.products" :key="product.id">
        <q-item-section>
          <q-item-label><span class="fw-sbold">{{ product.code }}</span> - <span class="text-grey-6">{{ product.id }}</span></q-item-label>
          <q-item-label caption>{{ product.description }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn color="red" size="sm" round flat icon="fas fa-trash" @click="unlink(product.id,location.section.id)" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>

  <q-inner-loading :showing="innerloading" class="bg-white">
    <q-spinner-tail size="50px" color="primary" />
    <div class="text-center">Espera ...</div>
  </q-inner-loading>
</template>

<script setup>
  import { ref, computed, nextTick, defineExpose } from "vue";
  import { useQuasar } from "quasar"
  import Locator from 'src/API/LocatorApi';

  const $q = useQuasar();
  const $emit = defineEmits(["set", "clear", "unlink"]);

  let inputbox = ref(null)
  let innerloading = ref(false)

  const location = ref({
    target:null,
    warehouse:null,
    section:null,
    parents:null,
    products:[]
  });

  const validateLocation = async () => {
    if(location.value.target){
      console.log("buscando ubocacion");
      innerloading.value = true
      const resp = await Locator.location(location.value.target);
      innerloading.value = false
      console.log(resp);

      if(resp.id){
        location.value.section = resp;
        location.value.warehouse = resp.warehouse;
        location.value.products = resp.products;
        $emit("set", location.value);
      }else{
        location.value.target = null;
        $q.notify({
          message:'Lo siento vaquero, no encontre la ubicacion!',
          icon:'fas fa-close',
          color:'negative'
        });
      }
    }
  }

  const clear = () => {
    location.value.target = null;
    location.value.section = null;
    location.value.warehouse = null;
    location.value.products = [];
    nextTick(() => inputbox.value.focus());
    $emit("clear");
  }

  const newLink = pro => {
    console.log("Add Link: ", pro);
    location.value.products.unshift(pro);
  }

  const remLink = pid => {
    let idx = location.value.products.findIndex( p => p.id == pid );
    idx >= 0 ? location.value.products.splice(idx, 1) : null;
  }

  const unlink = async (pid, lid) => {
    $emit("unlink", {pid,lid});
  }

  defineExpose({inputbox, clear, newLink, remLink})
</script>

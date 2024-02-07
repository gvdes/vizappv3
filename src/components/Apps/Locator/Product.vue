<template>
    <div class="q-pb-sm row">
      <div class="fw-bold text-grey-7 fs-inc1 col">Producto</div>
      <q-btn v-if="product.data" dense color="red" icon="close" @click="clear"/>
    </div>

  <q-form v-if="!product.data"
    @submit="productFinder"
    autocorrect="off"
    autocapitalize="off"
    autocomplete="off"
    spellcheck="false"
    class="row"
  >
    <q-input
      class="col"
      input-class="anek-bld text-h6 text-center text-uppercase"
      v-model="product.target"
      ref="inputbox"
      type="text"
      filled
    >
      <template v-slot:prepend><q-icon name="fas fa-barcode" /></template>
    </q-input>
    <q-btn squared color="primary" icon="search" @click.stop unelevated/>
  </q-form>

  <div v-else>
    <div class="row items-center">
      <div class="text-h5 col">{{product.data.code}}</div>
    </div>
    <!-- <q-separator spaced /> -->
    <q-list>
      <q-item v-if="product.additional" class="bg-yellow-14">
        <q-item-section avatar><q-icon name="warning" /></q-item-section>
        <q-item-section>
          <q-item-label>
            El codigo <span class="anek-bld text-uppercase">{{product.target}}</span> es un asociado a <span class="anek-bld text-uppercase">{{product.data.code}}</span>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label caption>{{product.data.description}}</q-item-label>
          <q-item-label>CC: {{product.data.short_code}}</q-item-label>
          <q-item-label v-if="product.data.barcode">CB: {{product.data.barcode}}</q-item-label>
          <q-item-label v-else class="text-red anek-bld">CB: --- </q-item-label>
          <q-item-label caption>ID: {{product.data.id}}</q-item-label>
          <!-- <q-item-label>
            <q-btn dense flat no-caps color="primary" class="anek-bld" :label="`Stock: ${glstocks}`" @click="displayStocks()"/>
          </q-item-label> -->
        </q-item-section>
      </q-item>
      <q-separator spaced/>
      <div class="text-center fw-sbold text-negative q-pa-md" v-if="product.locations.length==0">SIN UBICACIONES</div>
      <div v-else class="q-pa-md text-right">Ubicaciones: {{ product.locations.length }}</div>

      <q-list>
        <q-item class="q-px-none" v-for="(location) in product.locations" :key="location.id">
          <q-item-section>
            <q-item-label><span class="text-grey-6">{{ location.id }}</span> - <span class="fw-sbold">{{ location.path }}</span></q-item-label>
            <q-item-label caption>Almacen: {{ location.warehouse.name }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn color="red" size="sm" round flat icon="fas fa-trash" @click="unlink(product.data.id,location.id)" />
          </q-item-section>
        </q-item>
      </q-list>
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

	let product = ref({
		target:null,
		data:null,
    additional:null,
		locations:[],
    stocks:[],
    relateds:[]
	});

  let glstocks = computed(() => product.value.stocks.reduce(( carry, w) => carry+w._current, 0) )

  const productFinder = async () => {
    if(product.value.target){
      console.log("Buscano producto");
      innerloading.value = true
      const resp = await Locator.product(product.value.target);
      innerloading.value = false
      console.log(resp);

      if(resp.product){
        product.value.data = resp.product;
        product.value.locations = resp.product.locations;
        product.value.additional = resp.additional;
        product.value.stocks = resp.product.stocks;
        product.value.relateds = resp.product.relateds;
        $emit("set", product.value);
      }else{
        inputbox.value.select()
        $q.notify({
          message:'Lo siento vaquero, no encontre el producto!',
          icon:'fas fa-close',
          color:'negative'
        });
      }
    }
  }

  const clear = () => {
    product.value.target = null;
    product.value.data = null;
    product.value.additional = null;
    product.value.locations = [];
    nextTick(() => inputbox.value.focus());
    $emit("clear");
  }

  const newLink = loc => {
    console.log("Add Link: ", loc);
    product.value.locations.unshift(loc);
  }

  const remLink = lid => {
    let idx = product.value.locations.findIndex( l => l.id == lid);
    idx >= 0 ? product.value.locations.splice(idx, 1) : null;
  }

  const unlink = async (pid, lid) => {
    $emit("unlink", {pid,lid});
  }

  defineExpose({inputbox, clear, newLink, remLink})

</script>

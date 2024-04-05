<template>
  <q-page padding>
    <div class="row">
      <q-select v-model="state.val" :options="state.opts" label="Estado" option-label="name" class="col" />
      <q-separator spaced inset vertical dark />
      <q-select v-model="filters.secciones" :options="secciones" label="Seccion" option-label="name" class="col"
        @update:model-value="() => { filters.familias = null; filters.categorias = null }">
        <template v-slot:after v-if="filters.secciones">
          <q-btn icon="close" dense flat
            @click="() => { filters.secciones = null; filters.familias = null; filters.categorias = null }" />
        </template>
      </q-select>
      <q-separator spaced inset vertical dark />
      <q-select v-model="filters.familias" :options="familias" label="Familia" option-label="name" class="col"
        @update:model-value="filters.categorias = null">
        <template v-slot:after v-if="filters.familias">
          <q-btn icon="close" dense flat @click="() => { filters.familias = null; filters.categorias = null }" />
        </template>
      </q-select>

      <q-separator spaced inset vertical dark />
      <q-select v-model="filters.categorias" :options="categorias" label="Categoria" option-label="name" class="col">
        <template v-slot:after v-if="filters.categorias">
          <q-btn icon="close" dense flat @click="() => { filters.categorias = null }" />
        </template>
      </q-select>

    </div>

    <q-separator spaced inset vertical dark />
    <q-table dense separator="cell" flat bordered class="my-sticky-header-column-table" title="Productos" virtual-scroll
      :rows="profil" :columns="table.columns" row-key="code" :rows-per-page-options="[50]" :filter="filter" @row-click="editrow">
      <template v-slot:top>
        <div>Producto</div>
        <q-space />
        <q-input borderless dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>

    <q-dialog v-model="product.state" persistent  :position="'right'" full-height>
      <viewproduct :product="product.body" :providers="providers" :status="state.opts" :units="units" :categories="categories" ></viewproduct>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import prapi from 'src/API/Products';
import viewproduct from 'src/components/Products/ProducView.vue';
const $q = useQuasar();
const $router = useRouter();

const filter = ref(null)
const state = ref({
  val: { id: 1, name: 'Disponible' },
  opts: []
});
const products = ref([]);
const categories = ref([]);
const providers= ref([]);
const units = ref([]);
const filters = ref({
  secciones: null,
  familias: null,
  categorias: null
})

const product = ref({
  state:false,
  body:null
})

const table = ref({
  columns: [
    { id: 1, name: 'code', label: 'Codigo', align: 'left', field: row => row.code, sortable: true },
    { id: 2, name: 'ccorto', label: 'Codigo Corto', sortable: true, align: 'left', field: row => row.short_code },
    { id: 3, name: 'barcode', label: 'Codigo Barras', sortable: true, align: 'left', field: row => row.barcode },
    { id: 4, name: 'description', label: 'Descripcion', sortable: true, align: 'left', field: row => row.description },
    { id: 5, name: 'status', label: 'Estado', sortable: true, align: 'left', field: row => row.state.name },
    { id: 6, name: 'section', label: 'Seccion', sortable: true, align: 'left', field: row => row.category.familia.seccion.name },
    { id: 7, name: 'family', label: 'Familia', sortable: true, align: 'left', field: row => row.category.familia.name },
    { id: 8, name: 'category', label: 'Categoria', sortable: true, align: 'left', field: row => row.category.name },

  ]
})

const fillist = computed(() => products.value.filter(e => e._state == state.value.val.id))
const secciones = computed(() => categories.value.filter((e) => e.deep == 0));
const familias = computed(() => {
  if (filters.value.secciones == null) {
    return categories.value.filter((e) => secciones.value.map(e => e.id).includes(e.root))
  } else {
    return categories.value.filter((e) => e.root == filters.value.secciones.id)
  }

});
const categorias = computed(() => {
  if (filters.value.familias == null) {
    return categories.value.filter((e) => familias.value.map(e => e.id).includes(e.root))
  } else {
    return categories.value.filter((e) => e.root == filters.value.familias.id)
  }
});

const profil = computed(() => {
  if (filters.value.categorias == null) {
    return fillist.value.filter(e => categorias.value.map(e => e.id).includes(e._category))
  } else {
    return fillist.value.filter(e => e._category == filters.value.categorias.id)
  }

})

const editrow = (a,row) => {
  console.log(row);
  product.value.state = true
  product.value.body = row

}



const init = async () => {
  $q.loading.show({ message: 'Cargando Productos' })
  const resp = await prapi.index()
  console.log(resp)
  if (resp.error) {
    console.log(resp)
  } else {
    products.value = resp.products;
    state.value.opts = resp.states;
    categories.value = resp.categories;
    providers.value = resp.providers;
    units.value = resp.units;
    console.log(resp.products);
    $q.loading.hide();
  }

}
init()
</script>

<style lang="sass">
.my-sticky-header-column-table
  td:first-child
    background-color: $blue-1


  tr th
    position: sticky
    z-index: 2
    background: $blue-1


  thead tr:last-child th

    top: 48px
    z-index: 3
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:first-child th:first-child
    z-index: 3

  td:first-child
    z-index: 1

  td:first-child, th:first-child
    position: sticky
    left: 0

</style>

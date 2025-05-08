<template>
  <q-page padding>
    <div class="row">
      <q-select v-model="state.val" :options="state.opts" label="Estado" option-label="name" class="col">
        <template v-slot:after v-if="state.val">
          <q-btn icon="close" dense flat @click="() => { state.val = null }" />
        </template>
      </q-select>
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
      :rows="profil" :columns="table.columns" row-key="code" :pagination="{ rowsPerPage: 50 }" :filter="filter"
      @row-click="editrow">
      <template v-slot:top>
        <div>Producto</div>
        <q-space />
        <div class="row">
          <q-input class="col" borderless dense debounce="300" color="primary" v-model="filter" placeholder="Buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <q-separator spaced inset vertical dark />
        <q-btn color="primary" icon="add" flat rounded title="Agregar Articulo" />
        <q-separator spaced inset vertical dark />
        <q-btn color="primary" icon="upload" flat rounded title="Subir Archivo" />
        <q-separator spaced inset vertical dark />
        <q-btn color="primary" icon="download" flat rounded title="Descargar Datos" />
      </template>
    </q-table>

    <q-dialog v-model="searhProduct" persistent>
      <q-card style="width: 700px;">
        <q-form @submit="searching">
          <q-card-section>
            <div class="text-h6 text-bold text-center">Buscar</div>
          </q-card-section>
          <q-card-section>
            <div class="row">
              <div class="text-center q-mt-sm">Buscar En</div>
              <q-separator spaced inset vertical dark />
              <q-select class="col" v-model="query.Campo" :options="table.columns" label="Buscar En" filled dense
                @update:model-value="() => { query.val = '' }" />
            </div>
            <q-separator spaced inset vertical dark />
            <div class="row">
              <div class="text-center q-mt-sm q-mr-md">Buscar</div>
              <q-separator spaced inset vertical dark />
              <div class="col" v-if="[1, 2, 3, 4].includes(query.Campo.id)">
                <q-input autofocus v-model="query.val" type="text" :label="query.Campo.label" dense filled />
              </div>
              <div v-else class="col">
                <q-select v-model="query.val"
                  :options="query.Campo.id == 5 ? state.opts : query.Campo.id == 6 ? secciones : query.Campo.id == 7 ? familias : query.Campo.id == 8 ? categorias : []"
                  :label="query.Campo.label" filled option-label="name"
                  @update:model-value="query.Campo.id == 5 ? state.val = query.val : query.Campo.id == 6 ? filters.secciones = query.val : query.Campo.id == 7 ? filters.familias = query.val : query.Campo.id == 8 ? filters.categorias = query.val : []" />
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn flat label="Buscar" type="submit" color="primary" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="product.state" persistent >
      <viewproduct :product="product.body" :providers="providers" :status="state.opts" :units="units"
        :categories="categories" :edit="product.edit" :makers="maker" ></viewproduct>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import prapi from 'src/API/Products';
import viewproduct from 'src/components/Products/ProducView.vue';
import { layoutCluster } from 'stores/layoutCluster'
const $q = useQuasar();
const $router = useRouter();
const layout = layoutCluster()
const filter = ref(null)
const state = ref({
  val: null,
  opts: []
});
const products = ref([]);
const maker = ref([])
const categories = ref([]);
const providers = ref([]);
const units = ref([]);
const filters = ref({
  secciones: null,
  familias: null,
  categorias: null
})
const searhProduct = ref(false)
const product = ref({
  state: false,
  body: null,
  edit:false
})
const query = ref({
  val: '',
  Campo: { id: 1, name: 'code', label: 'CODIGO', align: 'left', field: row => row.code, sortable: true },
})

const table = ref({
  columns: [
    { id: 1, name: 'code', label: 'CODIGO', align: 'left', field: row => row.code, sortable: true },
    { id: 2, name: 'short_code', label: 'CODIGO CORTO', sortable: true, align: 'left', field: row => row.short_code },
    { id: 3, name: 'barcode', label: 'CODIGO DE BARRAS', sortable: true, align: 'left', field: row => row.barcode },
    { id: 4, name: 'description', label: 'DESCRIPCION', sortable: true, align: 'left', field: row => row.description },
    { id: 5, name: '_status', label: 'ESTADO', sortable: true, align: 'left', field: row => row.state.name },
    { id: 6, name: 'section', label: 'SECCION', sortable: true, align: 'left', field: row => row.category.familia.seccion.name },
    { id: 7, name: 'family', label: 'FAMILIA', sortable: true, align: 'left', field: row => row.category.familia.name },
    { id: 8, name: 'category', label: 'CATEGORIA', sortable: true, align: 'left', field: row => row.category.name },

  ]
})
const fillist = computed(() => {
  if (state.value.val == null) {
    return products.value
  } else {
    return products.value.filter(e => e._state == state.value.val.id)
  }
})
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

const editrow = (a, row) => {
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
    state.value.opts = resp.states;
    categories.value = resp.categories;
    providers.value = resp.providers;
    units.value = resp.units;
    maker.value = resp.makers;
    $q.loading.hide();
  }

}

const handleKeyDown = (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === 'b') {
    e.preventDefault()
    if (!$q.dialog.isActive) {
      searhProduct.value = true
    }
  }
}

const searching = async () => {
  $q.loading.show({ message: 'Buscando...' })
  console.log(query.value)
  const resp = await prapi.searchProd(query.value);
  if (resp.error) {
    console.log(resp)
  } else {
    products.value = resp;
    searhProduct.value = false;
    query.value = {
      val: '',
      Campo: { id: 1, name: 'code', label: 'CODIGO', align: 'left', field: row => row.code, sortable: true },
    }
    $q.loading.hide()
  }
}


onMounted(() => {
  init()
  window.addEventListener('keydown', handleKeyDown)
  layout.setTitle('Productos')
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
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

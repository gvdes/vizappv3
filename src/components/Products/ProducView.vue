<template>

  <q-card style="width: 1000px; max-width: 100vw;">
    <div class="q-mt-sm text-center text-bold q-ml-sm"> {{ props.product.description }} - Articulo</div>
    <q-card-section class="row">
      <div class="col"><q-input v-model="product.code" type="text" filled :disable="!edit" label="Codigo"
          label-color="primary" />
        <q-separator spaced inset vertical dark />
        <q-input v-model="product.barcode" type="text" filled label="Codigo de Barras" label-color="primary">
          <template v-slot:append>
            <q-btn icon="qr_code_2" flat title="Generar codigo de barras" :disable="product.barcode.length > 0" />
          </template>
        </q-input>
      </div>

      <q-separator spaced inset vertical dark />
      <div class="col">
        <div class="row">
          <div class="col"><q-input v-model="product.reference" type="text" filled label="Referencia"
              label-color="primary" />
          </div>
          <q-separator spaced inset vertical dark />
          <div class="col"><q-select v-model="product.state" :options="status" label="Proveedor" filled
              option-label="name" label-color="primary" /></div>
        </div>

        <q-separator spaced inset vertical dark />
        <div class="row">
          <div class="col"><q-input v-model="product.pieces" type="number" filled label="PXC" label-color="primary" />
          </div>
          <q-separator spaced inset vertical dark />
          <div class="col"><q-input v-model="product.short_code" type="text" filled label="Codigo Corto"
              label-color="primary" disable /></div>
        </div>
      </div>

      <q-separator spaced inset vertical dark />

      <div v-if="product.picture">
        <q-avatar square size="120px">
          <q-img :src="`${product.picture.url}`" spinner-color="primary">
            <q-menu touch-position>
              <q-list>
                <q-item clickable v-close-popup @click="clickFile">
                  <q-item-section>
                    <q-item-label><q-icon name="edit" /> <span
                        class="text-bold text-center">Editar</span></q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="viewImage = !viewImage">
                  <q-item-section> <q-item-label><q-icon name="visibility" /> <span
                        class="text-bold text-center">Ver</span>
                    </q-item-label></q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-img>
        </q-avatar>
      </div>
      <div v-else>
        <q-btn flat class="bg-grey-3" icon="add_photo_alternate" @click="clickFile" size="47px" />
      </div>
    </q-card-section>

    <q-card-section>
      <q-tabs v-model="tab" class="text-primary">
        <q-tab name="general" icon="settings" label="GENERAL" />
        <q-tab name="prices" icon="attach_money" label="PRECIOS" />
      </q-tabs>
    </q-card-section>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="general">
        <q-card-section class="row">
          <div class="col"><q-select v-model="product.category.familia.seccion" :options="secciones" label="Seccion"
              filled option-label="name" label-color="primary" />
          </div>
          <q-separator spaced inset vertical dark />
          <div class="col"><q-select v-model="product.category.familia" :options="familias" label="Familia" filled
              option-label="name" label-color="primary" /></div>
          <q-separator spaced inset vertical dark />
          <div class="col"><q-select v-model="product.category" :options="categorias" label="Categorias" filled
              option-label="name" label-color="primary" /></div>
        </q-card-section>
        <q-card-section class="row">
          <div class="col"><q-input v-model="product.description" type="text" filled label="Descripcion"
              label-color="primary" /></div>
        </q-card-section>
        <q-card-section class="row">
          <div class="col"><q-select v-model="product.provider" :options="providers" label="Proveedor" filled
              option-label="fiscal_name" label-color="primary" />
          </div>
          <q-separator spaced inset vertical dark />
          <div class="col"><q-select v-model="product.maker" :options="makers" label="Fabricando" filled
              option-label="name" label-color="primary" /></div>
        </q-card-section>
      </q-tab-panel>
      <q-tab-panel name="prices">

        <q-card-section>
          <div> <q-input v-model="product.cost" type="text" filled label="Descripcion" label-color="primary" /></div>
          <q-separator spaced inset vertical dark />
          <div v-if="product" class="row">
            <div class="col">
              <div class="text-center text-h5">Locales</div>
              <q-separator spaced inset />
              <div v-for="(price, index) in product.prices.filter(e => e._type == 1)" :key="index">
                <q-separator spaced inset vertical dark />
                <div class="row">
                  <q-separator spaced inset vertical dark />
                  <div class="col">
                    {{ price.rates.name }}
                  </div>
                  <div class="col">
                    <q-input v-model="price.price" type="number" label="Precio" dense filled outline />
                  </div>
                </div>
              </div>
              <q-separator spaced inset />
            </div>
            <q-separator spaced inset vertical />

            <div class="col">
              <div class="text-center text-h5">Foraneos</div>
              <q-separator spaced inset />

              <div v-for="(price, index) in product.prices.filter(e => e._type == 2)" :key="index">
                <q-separator spaced inset vertical dark />
                <div class="row">
                  <q-separator spaced inset vertical dark />
                  <div class="col">
                    {{ price.rates.name }}
                  </div>

                  <div class="col">
                    <q-input v-model="price.price" type="price" label="Precio" dense filled outline />
                  </div>
                </div>
              </div>
              <q-separator spaced inset />
            </div>
          </div>
        </q-card-section>
      </q-tab-panel>
    </q-tab-panels>

  </q-card>
  <input type="file" ref="inputFile" id="inputFile" @input="readFile" hidden accept="image/*" />

  <q-dialog v-model="viewImage">
    <q-img :src="`${product.picture.url}`" spinner-color="primary" spinner-size="82px" />
  </q-dialog>

</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from 'vue'
import { useQuasar, LocalStorage } from 'quasar';
import prapi from 'src/API/Products';

const $q = useQuasar();
const product = ref(null)
const viewImage = ref(false);
const tab = ref('general')
const inputFile = ref(null)


const props = defineProps({ product: { type: Object }, status: { type: Array }, categories: { type: Object }, units: { type: Object }, providers: { type: Object }, edit: { type: Boolean }, makers: { type: Array } })

const secciones = computed(() => props.categories.filter((e) => e.deep == 0));
const familias = computed(() => {
  if (product.value.category.familia.seccion == null) {
    return props.categories.filter((e) => secciones.value.map(e => e.id).includes(e.root))
  } else {
    return props.categories.filter((e) => e.root == product.value.category.familia.seccion.id)
  }
});
const categorias = computed(() => {
  if (product.value.category.familia == null) {
    return props.categories.filter((e) => familias.value.map(e => e.id).includes(e.root))
  } else {
    return props.categories.filter((e) => e.root == product.value.category.familia.id)
  }
});

const readFile = () => {
  let inputFile = document.getElementById("inputFile").files;
  console.log(inputFile);
  if (inputFile.length > 0) {
    let url = {
      file: inputFile[0],
      url: URL.createObjectURL(inputFile[0])
    };
    console.log(url);
    product.value.picture = url;
  }
}


const clickFile = () => {
  inputFile.value.click()
}

onBeforeMount(() => {
  product.value = JSON.parse(JSON.stringify(props.product))
  console.log(product.value)
})

</script>

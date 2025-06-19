<template>

  <q-card style="width: 1000px; max-width: 100vw;">
    <div class="q-mt-sm text-center text-bold q-ml-sm"> {{ props.product.description }} - Articulo</div>
    <q-card-section class="row">

      <div class="col">
        <q-input v-model="product.code" type="text" filled :disable="edit" label="Codigo" label-color="primary"
          maxlength="13" @blur="blurCode" :loading="loadCode" />
        <q-separator spaced inset vertical dark />
        <q-input v-model="product.barcode" type="text" filled label="Codigo de Barras" label-color="primary"
          @blur="blurBarcode" :loading="loadBarcode" :error="barcodeError.state" :error-message="barcodeError.message">
          <template v-slot:append v-if="!loadBarcode">
            <q-btn icon="qr_code_2" flat title="Generar codigo de barras" :disable="product.barcode.length > 0"
              @click="genBarcode" />
            <q-btn flat color="primary" icon="add" :disable="product.barcode.length == 0"
              @click="barcodeAdd.state = !barcodeAdd.state" />
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
          <div class="col"><q-select v-model="product.state" :options="status" label="Estado" filled option-label="name"
              label-color="primary" /></div>
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
          <div class="col"><q-input v-model="product.description" type="text" filled label="Descripcion"
              label-color="primary" /></div>
        </q-card-section>
        <q-card-section class="row">
          <div class="col"><q-select v-model="filters.secciones" :options="secciones" label="Seccion" filled
              option-label="name" label-color="primary"
              @update:model-value="() => { filters.familias = null; filters.categorias = null }">
              <template v-slot:append v-if="filters.secciones">
                <q-btn icon="close" dense flat
                  @click="() => { filters.secciones = null; filters.familias = null; filters.categorias = null }" />
              </template>
            </q-select>
          </div>
          <q-separator spaced inset vertical dark />
          <div class="col"><q-select v-model="filters.familias" :options="familias" label="Familia" filled
              option-label="name" label-color="primary" @update:model-value="filters.categorias = null">
              <template v-slot:append v-if="filters.familias">
                <q-btn icon="close" dense flat @click="() => { filters.familias = null; filters.categorias = null }" />
              </template></q-select></div>
          <q-separator spaced inset vertical dark />
          <div class="col"><q-select v-model="filters.categorias" :options="categorias" label="Categorias" filled
              option-label="name" label-color="primary">
              <template v-slot:append v-if="filters.familias">
                <q-btn icon="close" dense flat @click="() => { filters.categorias = null }" />
              </template>
            </q-select></div>
        </q-card-section>
        <q-card-section class="row">
          <div class="col"><q-select v-model="product.provider" :options="providers" label="Proveedor" filled
              option-label="fiscal_name" label-color="primary" />
          </div>
          <q-separator spaced inset vertical dark />
          <div class="col"><q-select v-model="product.maker" :options="makers" label="Fabricando" filled
              option-label="name" label-color="primary" /></div>
          <q-separator spaced inset vertical dark />
          <div class="col"><q-input v-model="product.attributes" type="text" filled label="Atributos"
              label-color="primary" /></div>
        </q-card-section>
      </q-tab-panel>

      <q-tab-panel name="prices">
        <q-card-section>
          <div> <q-input v-model="product.cost" type="number" filled label="Costo" label-color="primary" /></div>
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
                    <q-input v-model="price.price" type="number" label="Precio" dense filled outline />
                  </div>
                </div>
              </div>
              <q-separator spaced inset />
            </div>
          </div>
        </q-card-section>
      </q-tab-panel>

    </q-tab-panels>

    <q-card-actions align="center">
      <q-btn flat icon="save" color="primary" @click="send" />
      <q-btn flat icon="close" color="negative" @click="reset" />
    </q-card-actions>
  </q-card>



  <input type="file" ref="inputFile" id="inputFile" @input="readFile" hidden accept="image/*" />


  <q-dialog v-model="viewImage">
    <q-img :src="`${product.picture.url}`" spinner-color="primary" spinner-size="82px" />
  </q-dialog>

  <q-dialog v-model="barcodeAdd.state" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-form @submit="addBarcode" class="q-gutter-md">
          <q-input v-model="barcodeAdd.val" type="text" filled label="CB ADICIONAL" />
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-list bordered v-for="(related, index) in product.relateds" :key="index">
          <q-item>
            <q-item-section>{{ related.additional_barcode }}</q-item-section>
            <q-item-section avatar>
              <q-btn color="negative" icon="close" flat @click="product.relateds.splice(index, 1)" />
            </q-item-section>
          </q-item>
        </q-list>

      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="barcodeError.state" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="warning" text-color="with" />
        <span class="q-ml-sm">El codigo de barras ya existe en:</span>
      </q-card-section>
      <q-card-section>

        <q-list bordered>
          <q-item v-for="(articulo, index) in barcodeError.body" :key="index">
            <q-item-section>
              {{ articulo.code }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="codeError.state" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="warning" text-color="with" />
        <span class="q-ml-sm">El codigo de barras ya existe en:</span>
      </q-card-section>
      <q-card-section>

        <q-list bordered>
          <q-item v-for="(articulo, index) in codeError.body" :key="index">
            <q-item-section>
              {{ articulo.code }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>


</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from 'vue'
import { useQuasar, LocalStorage } from 'quasar';
import prapi from 'src/API/Products';
const $q = useQuasar();
const product = ref(null)
const hoveredItem = ref(null)
const viewImage = ref(false);
const tab = ref('general')
const inputFile = ref(null)
const filters = ref({
  secciones: null,
  familias: null,
  categorias: null
})
const barcodeAdd = ref({
  state: false,
  val: null

})
const barcodeError = ref({
  state: false,
  message: null,
  body: null
})

const codeError = ref({
  state: false,
  message: null,
  body: null
})

const loadBarcode = ref(false);
const loadCode = ref(false)
const props = defineProps({ product: { type: Object }, status: { type: Array }, categories: { type: Object }, units: { type: Object }, providers: { type: Object }, edit: { type: Boolean }, makers: { type: Array } })
const emit = defineEmits(['reset'])
const secciones = computed(() => props.categories.filter((e) => e.deep == 0));
const familias = computed(() => {
  if (filters.value.secciones == null) {
    return props.categories.filter((e) => secciones.value.map(e => e.id).includes(e.root))
  } else {
    return props.categories.filter((e) => e.root == filters.value.secciones.id)
  }
});
const categorias = computed(() => {
  if (filters.value.familias == null) {
    return props.categories.filter((e) => familias.value.map(e => e.id).includes(e.root))
  } else {
    return props.categories.filter((e) => e.root == filters.value.familias.id)
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

const addBarcode = async () => {
  if (barcodeAdd.value.val) {
    const resp = await prapi.searchBarcode({ barcode: barcodeAdd.value.val })
    if (resp.error) {
      console.log(resp)
    } else {
      console.log(resp);
      if (resp.length > 0) {
        $q.notify({ message: 'El codigo de barras esta duplicado', type: 'negative', position: 'bottom' })
        barcodeAdd.value.val = null
      } else {
        product.value.relateds.push({additional_barcode:barcodeAdd.value.val})
        barcodeAdd.value.val = null
      }
    }
  }
}
const send = async () => {
  product.value.category = filters.value.categorias
  const resp = await prapi.editProduct(product.value)
  console.log(resp)

}
const clickFile = () => {
  inputFile.value.click()
}
const reset = () => {
  filters.value = {
    secciones: null,
    familias: null,
    categorias: null
  }
  barcodeAdd.value = {
    state: false,
    val: null
  }
  emit('reset')
}

const blurBarcode = async () => {
  if (product.value.barcode.length > 0 && (product.value.barcode != props.product.barcode)) {
    loadBarcode.value = true
    const resp = await prapi.searchBarcode({ barcode: product.value.barcode })
    if (resp.error) {
      console.log(resp)
      loadBarcode.value = false;
    } else {
      console.log(resp);
      if (resp.length > 0) {
        $q.notify({ message: 'El codigo de barras esta duplicado', type: 'negative', position: 'bottom' })
        barcodeError.value.state = true
        barcodeError.value.message = `El codigo ya existe ${resp.length} articulo`;
        barcodeError.value.body = resp
      }
      loadBarcode.value = false;
    }
  }
}

const blurCode = async () => {
  if (product.value.code.length > 0 && !props.edit) {
    loadCode.value = true
    const resp = await prapi.searchBarcode({ barcode: product.value.code })
    if (resp.error) {
      console.log(resp)
      loadCode.value = false;
    } else {
      console.log(resp);
      if (resp.length > 0) {
        $q.notify({ message: 'El codigo ya existe', type: 'negative', position: 'bottom' })
        // codeError.value.state = true
        // codeError.value.message = `El codigo de barras esta en ${resp.length} articulo`;
        // codeError.value.body = resp
        product.value.code = '';
      }
      loadCode.value = false;
    }
  }
}


const genBarcode = async () => {
  if (filters.value.secciones && filters.value.familias && filters.value.categorias) {
    const resp = await prapi.genBarcode(filters.value);
    if (resp.error) {
      console.log(resp)
    } else {
      console.log(resp);
      product.value.barcode = resp;
    }
  } else {
    $q.notify({ message: 'Selecciona categorias para poder generar el codigo de barras', type: 'negative', position: 'bottom' })
  }
}

onBeforeMount(() => {
  product.value = JSON.parse(JSON.stringify(props.product))
  console.log(product.value)
  if (props.edit) {
    filters.value.secciones = product.value.category.familia.seccion;
    filters.value.familias = product.value.category.familia;
    filters.value.categorias = product.value.category;
  }

})

</script>

<template>
  <q-card style="width: 1000px; max-width: 100vw;">
    <div class="row">
      <div class="col">
        <q-card-section class="flex justify-center">
          <q-avatar rounded size="150px" font-size="60px" color="primary" text-color="white"> <img
              :src="props.product.picture"></q-avatar>
        </q-card-section>
        <q-card-section>
          <div class="text-h4 text-center">{{ props.product.code }}</div>
        </q-card-section>
      </div>

      <div class="col">
        <q-tabs v-model="tab" class="text-primary">
          <q-tab name="setting" icon="settings" label="General" />
          <q-tab name="prices" icon="attach_money" label="Precios" />
          <q-tab name="kits" icon="archive" label="kits" />
        </q-tabs>


        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="setting">
            <div class="text-h6">Mails</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>


          <q-tab-panel name="prices">
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

                <div v-for="(price, index) in product.prices.filter(e => e._type == 1)" :key="index">
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
          </q-tab-panel>



          <q-tab-panel name="kits">
            <div class="text-h6">Movies</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
      </div>

    </div>






    <q-card-actions align="center">
      <q-btn flat label="Cancelar" v-close-popup />
      <q-btn flat label="Editar" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from 'vue'
import { useQuasar, LocalStorage } from 'quasar';
import prapi from 'src/API/Products';

const $q = useQuasar();
const product = ref(null)
const tab = ref('prices')

const props = defineProps({ product: { type: Object }, status: { type: Array }, categories: { type: Object }, units: { type: Object }, providers: { type: Object } })

const init = async () => {
  $q.loading.show({ message: 'Cargando Articulo....' })
  const resp = await prapi.getProduct(props.product.id);
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp)
    product.value = resp
    $q.loading.hide()
  }
}
onBeforeMount(() => {
  init()
})

</script>

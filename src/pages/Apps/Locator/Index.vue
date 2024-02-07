<template>
  <q-page>
    <div class="q-pa-md">
      <q-card>
        <template v-if="locandpro">
          <q-card-actions align="center">
            <q-btn-group rounded>
              <q-btn color="red" rounded glossy icon="close" @click="clear" />
              <q-btn :color="linked ? 'negative':'primary'" rounded glossy :icon="linked ? 'link_off':'add_link'" @click="toggleLink" :disable="toggling" :loading="toggling" />
            </q-btn-group>
          </q-card-actions>
          <q-separator/>
        </template>

        <q-card-section horizontal>
          <q-card-section class="col">
            <Location @set="locSet" @clear="locClear" @unlink="unlink" ref="refloc"/>
          </q-card-section>
          <q-separator vertical />
          <q-card-section class="col">
            <Product @set="prodSet" @clear="prodClear" @unlink="unlink" ref="refpro"/>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>

    <!-- <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <History />
        </q-card-section>
      </q-card>
    </div> -->
  </q-page>
</template>

<script setup>
  import { ref, computed, nextTick } from 'vue';
  import { useQuasar } from 'quasar';
  import { useRoute, useRouter } from 'vue-router';
  import { useAccountStore } from 'stores/Account';
  import Locator from 'src/API/LocatorApi';
  import History from 'src/components/Apps/Locator/History.vue'
  import Location from 'src/components/Apps/Locator/Location.vue'
  import Product from 'src/components/Apps/Locator/Product.vue'

  const $q = useQuasar();

  let product = ref(null);
  let location = ref(null);
  let toggling = ref(false);
  const refpro = ref(null);
  const refloc = ref(null);

  let locandpro = computed(() => product.value&&location.value);
  let linked = computed(() => locandpro.value ? (location.value.products.find( p => p.id == product.value.data.id ) ? true : false) : false);

  const init = async () => {
    $q.loading.show({ message:'Cargando ubicador...' })
    // aqui vamo aintentar crear un servicio rest para obtener algo
    // como un resumen de lo que se ha ubicado, cuando etc.. algo asi
    $q.loading.hide();
  }

  const prodSet = p => {
    console.log("Producto Seteado: ",p)
    product.value = p
    location.value ? null : refloc.value.inputbox.select()
  }

  const prodClear = () => {
    console.log("Producto Removido: ")
    product.value = null
  }

  const locSet = l => {
    console.log("Ubicacion Seteada: ",l)
    location.value = l
    product.value ? null : refpro.value.inputbox.select()
  }

  const locClear = () => {
    console.log("Ubicacion Removida: ")
    location.value = null
  }

  const clear = () => {
    refpro.value.clear();
    refloc.value.clear();
  }

  const toggleLink = async () => {

    toggling.value = true;
    let data = { pid:product.value.data.id, lid:location.value.section.id  }
    let resp = await Locator.toggle(data);
    toggling.value = false;
    console.log(resp)

    if(resp.linked){
      console.log("Vinculo creado");
      let link = resp.linked;
      refpro.value.newLink(link.location);
      refloc.value.newLink(link.product);
    }else if(resp.unlinked){
      console.log("Vinculo removido");
      refpro.value.remLink(resp.lid);
      refloc.value.remLink(resp.pid);
    }
  }

  const unlink = async data => {
    let resp = await Locator.unlink(data);
    console.log(resp);
    refpro.value.remLink(resp.lid);
    refloc.value.remLink(resp.pid);
  }

  init();
</script>

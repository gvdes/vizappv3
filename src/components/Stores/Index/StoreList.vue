<template>
  <div class="q-pa-md row items-start q-gutter-s">
    <div v-for="(store, index) in liststores" :key="index">
      <q-list>
        <q-item clickable v-ripple @click="storeview(store)">
          <q-item-section>
            <q-card flat class="mycard" bordered :style="`width: 255px; max-width: 230vw; height: 230px;`">
              <q-card-section>
                <div class="text-subtitle1 text-center">{{ store.name.toUpperCase() }}
                </div>
                <div class="flex justify-center">
                  <q-badge color="primary">
                    {{ store.alias }}
                  </q-badge>
                </div>
                <q-separator spaced inset vertical dark />
                <div class="row">
                  <div class="col">Conexion:</div>
                  <div class="col">
                    <q-badge :color="`${store.ping == true ? 'positive' : 'negative'}`"><q-icon
                        :name="`${store.ping == true ? 'mood' : 'mood_bad'}`" /></q-badge>
                  </div>
                </div>
                <div class="row">
                  <div class="col">Estado:</div>
                  <div :class="`col text-${store.state.id == 1 ? 'positive' : 'negative'}`"> {{ store.state.name }}</div>
                </div>
                <div class="row">
                  <div class="col">Tipo:</div>
                  <div class="col"> {{ store.type.name }}</div>
                </div>
                <div class="row">
                  <div class="col">Tipo Precio:</div>
                  <div class="col"> {{ store.price.name }}</div>
                </div>
                <div class="row">
                  <div class="col">Dominio:</div>
                  <div class="col"> {{ store.local_domain }}</div>
                </div>
                <div class="row">
                  <div class="col">Puerto:</div>
                  <div class="col"> {{ store.local_port }}</div>
                </div>
                <q-separator spaced inset vertical dark />
              </q-card-section>
            </q-card>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>

  <q-dialog v-model="useStore.state" persistent>
    <viewStore :useStore="useStore" :stores="stores" />
  </q-dialog>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from 'vue'
import viewStore from 'src/components/Stores/Index/StoreView.vue';
const props = defineProps({ stores: { type: Object }, filter:{type: Object}, search:{type:String}})

const useStore = ref({
  state: false,
  body: null
});

const storeview = (store) => {
  useStore.value.state = true
  useStore.value.body = store
}

const liststores = computed(() => {
  if (
    props.filter.conect.val == null &&
    props.filter.status.val == null &&
    props.filter.type.val == null &&
    props.filter.price.val == null
  ) {
    return props.stores.stores;
  } else {
    return props.stores.stores.filter((e) => {
      const statusId = props.filter.conect?.val?.id;
      const branchesId = props.filter.status?.val?.id;
      const areasId = props.filter.type?.val?.id;
      const positionId = props.filter.price?.val?.id;

      const isStatusSelected = statusId != null;
      const isBranchesSelected = branchesId != null;
      const isAreasSelected = areasId != null;
      const isPositionSelected = positionId != null;

      // Asegurarse de que todas las propiedades existan
      const validProperties = e._state != null && e._type != null && e._price_type != null && e.ping != null;

      return (
        validProperties &&
        (isStatusSelected ? e.ping == statusId : true) &&
        (isBranchesSelected ? e._state == branchesId : true) &&
        (isAreasSelected ? e._type == areasId : true) &&
        (isPositionSelected ? e._price_type == positionId : true)
      );
    })
  }
})



</script>

<template>
  <div class="q-pa-md">
    {{piniaWarehouse.$state}}
    <q-card flat bordered>
      <q-card-section horizontal class="items-center">
        <q-card-section class="col" v-if="sectionsdb.length">Buscar</q-card-section>
        <q-card-section class="col text-right" ><q-btn color="primary" icon="add" /></q-card-section>
      </q-card-section>

      <q-separator />

      <q-list v-if="sectionsdb.length" class="q-py-md">
        <q-item clickable v-ripple v-for="(section) in sectionsdb" :key="section.id" @click="open(section.id)">
          <q-item-section side>
            <q-item-label class="text-grey-7">{{section.id}}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-item-label class="anek-bld">{{section.path}}</q-item-label>
          </q-item-section>
          <q-item-section>
            <!-- <q-item-label caption class="text-grey-6">{{warehouse.type.name}}</q-item-label> -->
            <q-item-label>{{section.name}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="fas fa-chevron-right" size="10px" color="secondary"/>
          </q-item-section>
        </q-item>
      </q-list>
      <q-card-section v-else class="text-center">
        Sin estructura
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
  import { ref, watch, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar, LocalStorage, Loading } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import { useWarehouseStore } from 'stores/Warehouse';
  import Lapi from 'src/API/WrhsLocation';

  const $q = useQuasar();
  const $route = useRoute();
  const $router = useRouter();
  const piniaAccount = useAccountStore();
  const piniaWarehouse = useWarehouseStore();
  const sectionsdb = ref([]);

  const $emit = defineEmits(['setloc']);

  onBeforeMount(async() => { init(); });

  const init = async () => {
    $q.loading.show({ message:"Cargando seccion" });

    const resp = await Lapi.structure($route.params.wid,$route.params.lid);
    console.log(resp);

    sectionsdb.value = resp.sections;

    $q.loading.hide();

  };

  const open = (lid) => $router.push(`/store/${piniaAccount.join}/almacenes/${$route.params.wid}/seccion/${lid}/estructura`);

</script>

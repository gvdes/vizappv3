<template>
  <div class="q-pa-md">
    <q-card flat bordered>
      <q-card-section horizontal class="items-center">
        <q-card-section class="col" v-if="sectionsdb.length">Buscar</q-card-section>
        <q-card-section class="col text-right"><q-btn color="primary" icon="add" @click="wndSectionator.state = true"/></q-card-section>
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
            <q-item-label>{{section.name}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="fas fa-chevron-right" size="10px" color="secondary"/>
          </q-item-section>
        </q-item>

      </q-list>
      <q-card-section v-else class="text-center text-grey-6">
        <div class="q-pa-md">
          <q-icon name="fas fa-kiwi-bird" size="xl" />
          <div>nada por aqui</div>
        </div>
      </q-card-section>
    </q-card>
  </div>

  <q-dialog v-model="wndSectionator.state" :persistent="wndSectionator.block">
    <SectionatorLoc :sections="sectionsdb" @add="sectionate"/>
  </q-dialog>
</template>

<script setup>
  import { ref, watch, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar, LocalStorage, Loading } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import { useWarehouseStore } from 'stores/Warehouse';

  import Wapi from 'src/API/WarehouseApi';
  import SectionatorLoc from 'src/components/Warehouse/SectionatorLoc.vue';

  const $q = useQuasar();
  const $route = useRoute();
  const $router = useRouter();
  const piniaAccount = useAccountStore();
  const sectionsdb = ref([]);
  const wndSectionator = ref({state:false,block:false});

  onBeforeMount(async() => { init(); });

  const init = async () => {
    $q.loading.show({message:"Cargando Almacen..."});

    const resp = await Wapi.structure($route.params.wid);
    console.log(resp);

    if(resp.error){
      let ercode = resp.error.status;
      wndRestringed.value.state = true;
    }else{
      sectionsdb.value = resp.sections;
    }

    $q.loading.hide();
  }

  const open = (lid) => {
    $router.push(`/store/${piniaAccount.join}/almacenes/${$route.params.wid}/seccion/${lid}/estructura`);
  }

  const sectionate = async (data) => {
    wndSectionator.value.block = true;

    const resp = await Wapi.sectionate(data,$route.params.wid);

    resp.createds.forEach(loc => { sectionsdb.value.push(loc); });
    $q.notify({
      icon:'done',
      color:'positive',
      message:`Seccionamiento completado!`
    });
    wndSectionator.value.state = false;
  }
</script>

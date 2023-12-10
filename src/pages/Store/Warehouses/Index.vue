<template>
  <q-page>
    <div class="bg-white">
      <div class="q-pa-sm row items-center">
        <!-- <q-btn flat round dense icon="menu" /> -->
        <div class="col anek-bld text-grey-9 q-pl-sm">ALMACENES</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
          <q-btn flat rounded icon="add" v-if="canCreate">
            <q-menu square ref="creator">
              <WrhCreator @created="created" />
            </q-menu>
          </q-btn>
          <q-btn flat rounded icon="support" />
        </div>
      </div>
      <q-separator/>
    </div>

    <div class="q-pa-md">
      <q-card class="q-mb-md" flat bordered>
        <q-card-section class="col-xs-12">
          <ProductFinder @itemtapped="finderFound" with-locations />
        </q-card-section>

        <q-separator />

        <q-card-section v-if="pfinder.product">
          <CardProduct :item="pfinder.product"/>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mb-md">
        <q-list v-if="warehousesdb.length" class="q-py-md">
          <q-item clickable v-ripple v-for="(warehouse) in warehousesdb" :key="warehouse.id" @click="open(warehouse.id)">
            <q-item-section side>
              <q-item-label class="text-grey-7">{{warehouse.id}}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-item-label class="anek-bld">{{warehouse.alias}}</q-item-label>
            </q-item-section>
            <q-item-section>
              <!-- <q-item-label caption class="text-grey-6">{{warehouse.type.name}}</q-item-label> -->
              <q-item-label>{{warehouse.name}}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="fas fa-chevron-right" size="10px" color="secondary"/>
            </q-item-section>
          </q-item>
        </q-list>
        <q-card-section v-else>
          No hay almacenes aqui
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
  import { ref, watch, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar, LocalStorage, Loading } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import Wapi from 'src/API/WarehouseApi';
  import ProductFinder from 'src/components/ProductFinder.vue';
  import CardProduct from 'src/components/CardProduct.vue';
  import WrhCreator from 'src/components/Warehouse/WrhCreator.vue';

  /** R E F E R E N C E S */

  const $q = useQuasar();
  const $router = useRouter();
  const piniaAccount = useAccountStore();
  const warehousesdb = ref([]);
  const types = ref([]);
  const iptsearch = ref(null);
  const pfinder = ref({ product:null });
  const creator = ref(null)

  /** H O O K S  */

  /** C O M P U T E D S */
  const isMobile = computed(() => $q.platform.is.mobile);
  const canCreate = computed(() => ( [1,2,11].includes(piniaAccount.rol.id)) )

  /** M E T H O D S  */
  const init = async () => {
    $q.loading.show({message:"Cargando Almacenes..."});

    const resp = await Wapi.index();

    if(resp.error){
      console.error(resp.error);
    }else{
      warehousesdb.value = resp.warehouses;
      types.value = resp.types;
    }

    $q.loading.hide();
    console.log("%cPase por el index de los almacenes","font-size:1.5em;color:yellow;");
  }

  const open = (id) => {
    console.log(id);
    $router.push(`/store/${piniaAccount.join}/almacenes/${id}/inicio`);
  }

  const finderFound = (item) => {
    console.log("a product was getted");
    console.log(item);
    pfinder.value.product = item;
  }

  const created = wrh => {
    warehousesdb.value.unshift(wrh);

    $q.notify({
      message:`Nuevo almacen creado!`,
      color:"positive",
      icon:"done",
      position:"center"
    });

    creator.value.hide();
  }

  init();

</script>

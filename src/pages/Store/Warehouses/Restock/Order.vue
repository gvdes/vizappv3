<template>
  <q-page>
  <!-- H e a d e r -->
    <div class="bg-white">
      <div class="row items-center">
        <div class="col anek-bld text-grey-9 row items-center">
          <q-btn color="primary" flat icon="fas fa-chevron-left" dense @click="$router.replace(`/store/${piniaAccount.join}/resurtido`)" label="Resurtido" no-caps/>
          <span class="q-pl-md">{{$resid}}</span>
        </div>
        <div class="row items-center">
          <q-tabs v-model="tab" dense inline-label>
            <q-tab name="log" icon="fas fa-list-check"/>
            <q-tab name="basket" icon="fas fa-boxes-packing"/>
          </q-tabs>
          <q-separator vertical/>
          <q-btn flat icon="autorenew" @click="init" />
        </div>
      </div>
      <q-separator/>
    </div>

    <div class="q-pa-md">
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="basket" class="q-pa-none">
          <OrderBody
            :wrhsComps="wrhsComps"
            :wrhOrg="wrhOrg"
            :products="basketDB"
            :ssz="ssz"
            :ostate="state"
            :auths="auths"
            :order="$resid"
            @onSetLine="setLine"
            @onDiscard="discard"
          />
        </q-tab-panel>
        <q-tab-panel name="log">
          <OrderLog />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup>
  import { ref, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import RestockApi from 'src/API/RestockApi';
  import dayjs from 'dayjs';
  import OrderBody from 'src/components/Restock/OrderBody.vue';
  import OrderLog from 'src/components/Restock/OrderLog.vue';

  /** R E F E R E N C E S */
  const $q = useQuasar();
  const $route = useRoute();
  const $router = useRouter();
  const piniaAccount = useAccountStore();

  const $resid = parseInt($route.params.resid);
  const $sid = $route.params.idstore;
  const orderDB = ref(null);
  const basketDB = ref([]);
  const tab = ref(null);
  const isMbl = $q.platform.is.mobile? true:false;
  const ssz = computed(() => $q.screen.name); // Screen Size
  const wrhs = ref(null);

  /** H O O K S */
  onBeforeMount(() => { init(); });

  /** C O M P U T E D S */
  const state = computed(() => orderDB.value ? orderDB.value.state:null);
  const owner = computed(() => orderDB.value ? orderDB.value.owner:false);
  const isOwner = computed(() => owner.value ? piniaAccount.account.id==owner.value.id: false);
  const wrhOrg = computed(() => orderDB.value ? orderDB.value.origin_wrh : null);
  const wrhSrc = computed(() => orderDB.value ? orderDB.value.source_wrh : null);
  const storeOrg = computed(() => orderDB.value ? wrhOrg.value.store:null );
  const storeSrc = computed(() => orderDB.value ? wrhSrc.value.store:null );
  const isOrgStore = computed(() => orderDB.value ? (storeOrg.value.id==$sid) : null);
  const wrhsComps = computed(() => wrhs.value ? wrhs.value.warehouses_comp : []);

  const auths = computed(() => {
    //auths  C,R,U,D
    let a = [0,1,0,0];

    if (orderDB.value){
      if(orderDB.value._state==1 && isOwner.value && isOrgStore.value){
        a = [1,1,1,1];
      }
    }

    return a;
  });

  /** M E T H O D S */
  const init = async () => {
    $q.loading.show({ message:"Cargando orden" });
    console.log("Abriendo orden"+$resid);
    tab.value = "basket";

    const resp = await RestockApi.Open($resid);
    console.log(resp);

    orderDB.value = resp.order;
    basketDB.value = resp.order.products;
    wrhs.value = resp.warehouses;

    $q.loading.hide();
  }

  const setLine = el => {
    console.log("Set product");
    console.log(el);
  }

  const discard = async () => {
    $q.loading.show({ message:"Descartando orden, espera..." });
    console.log("Vamo a liberar las reservas y descartar el pedido");
    const resp = await RestockApi.Discard($resid);

    console.log(resp);
  }
</script>

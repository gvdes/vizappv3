<template>
  <q-page padding>
    <q-drawer
      side="left"
      v-model="drawerLeft"
      bordered
      :breakpoint="500"
      content-class="bg-grey-3"
    >
      <TransferPanel v-if="transfer" :transfer="transfer" :date="date" :basketSize="basketdb.length" />
    </q-drawer>

    <q-card class="bg-blue-grey-1">
      <q-card-section>
        <div class="row q-gutter-md">
          <q-select dense outlined v-model="basketfiltrator.opt" :options="basketfiltrator.opts" label="De" option-label="name" option-value="id" class="bg-white"/>
          <q-input dense outlined v-model="iptfiltrator" type="text" label="Filtro" class="bg-white"/>
        </div>
      </q-card-section>
    </q-card>

    <div class="q-py-md">
      <TransferBasket
        :basket="basket"
        :date="date"
        :user="$user.account"
        :state="trState"
      />
    </div>

    <q-dialog v-model="wndFinder.state" position="bottom" :persistent="wndFinder.block">
      <Pusher
        ref="pusher"
        :warehouses="[transfer.from.id,transfer.to.id]"
        :screen="$screen"
        :platform="$platform"
        :mybasket="mybasket"
        @set="tryTransfer"
        @close="closeTransfer"
      />
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18,18]" v-if="addAndEdit && !wndFinder.state">
      <q-btn color="primary" icon="add" label="agregar" rounded @click="wndFinder.state=true" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { date, useQuasar } from "quasar";
import { ref, computed, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from 'src/API/AppTransfers';
import TransferPanel from 'src/components/Apps/Transfers/TransferPanel.vue'
import TransferBasket from 'src/components/Apps/Transfers/Basket.vue'
import Pusher from 'src/components/Apps/Transfers/Pusher.vue'
import { useAccountStore } from 'stores/Account';

const $user = useAccountStore();
const $q = useQuasar();
const $screen = $q.screen;
const $platform = $q.platform;
const $route = useRoute();
const tid = ref(parseInt($route.params.tid));
const drawerLeft = ref(true);
const transfer = ref(undefined);
const basketdb = ref([]);
const pusher = ref(null);
const iptfiltrator = ref(null);
const basketfiltrator = reactive({ opt:{id:0,name:"Todos"}, opts:[] });
const transferists = ref([]);
const wndFinder = reactive({state:false, block:false})

const trState = computed(() => transfer.value ? transfer.value.state : {id:0,name:"Loading"});
const basket = computed(() => basketdb.value.filter( p =>
    (iptfiltrator.value ? ( p.product.short_code.toString().includes(iptfiltrator.value) || p.product.code.toString().toLowerCase().includes(iptfiltrator.value) || p.product.description.toLowerCase().includes(iptfiltrator.value) ) : true) &&
    (basketfiltrator.opt.id ? ( p._user==basketfiltrator.opt.id ) : true)
  )
);
const mybasket = computed(() => basket.value.filter(l => l._user == $user.account.id))
const uAdmin = computed(() => [1,9,10].includes($user.account.rol.id));
const uTransferist = computed(() => transferists.value.map(t=>t.id).includes($user.account.id) );
const addAndEdit = computed(() =>
  (trState.value.id==1 && (uTransferist.value||uAdmin.value)) ||
  (trState.value.id==2 && uAdmin.value)
);

const tryTransfer = async item => {
  console.log("Vamo a validar el producto", item)
  wndFinder.block = true;
  const resp = await api.transfer(tid.value,item);
  console.log(resp)
  if(resp.action=="update"){
    let row = resp.row;
    let pr = basketdb.value.find( p => p._product==row._product && p._user==row._user);
    pr.amount = row.amount;
  }else{
    basketdb.value.push(resp.row);
  }
  wndFinder.block = false;
  wndFinder.state = false;
  pusher.value.restart();
}

const closeTransfer = () => {
  wndFinder.block = false;
  wndFinder.state = false;
  pusher.value.restart();
}

const init = async() => {
  $q.loading.show({ message:'Cargando Traspaso '+tid.value });
  const resp = await api.open(tid.value);
  console.log(resp);

  if(resp.error){
    console.log(resp.error.response.status)
  }else{
    transfer.value = resp.transfer;
    basketdb.value = resp.transfer.basket;
    transferists.value = transfer.value.transferists.map(t=>t.account);
    basketfiltrator.opts = [{id:0,name:"Todos"}].concat(transferists.value)
  }

  $q.loading.hide();
}

init();

</script>

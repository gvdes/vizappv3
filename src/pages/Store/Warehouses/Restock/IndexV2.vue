<template>
  <q-page>
    <div class="bg-white">
      <div class="q-pa-sm row items-center">
        <!-- <q-btn flat round dense icon="menu" /> -->
        <div class="col anek-bld text-grey-9 q-pl-sm">Resurtido</div>
        <div class="row items-center q-gutter-sm">
          <q-select v-model="view" :options="views" dense filled @update:model-value="setViewDates" label="Vista" />
          <q-select v-model="viewOrderState" :options="ordsStates" dense filled label="Estado de pedido" option-label="name" option-value="id"/>
          <q-btn dense flat rounded icon="autorenew" @click="init" />
          <!-- <q-btn flat rounded icon="add">
            <q-menu style="min-width:200px;">
              <q-card-section class="column anek-bld">Nuevo Pedido</q-card-section>
              <q-separator />
              <q-form
                class="q-gutter-md"
              >
                <q-card-section>
                  <q-select v-model="neworder.to" :options="storesdb" label="Proveedor" option-value="id" option-label="name" :disable="storesdb.length==1" />
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn color="primary" icon="done" label="Crear" no-caps @click="create"/>
                </q-card-actions>
              </q-form>
            </q-menu>
          </q-btn> -->
          <!-- <q-btn flat rounded icon="fas fa-heart-pulse" @click="wndMinMax.state = true;"/> -->
          <q-btn flat rounded icon="support" dense />
        </div>
      </div>
      <q-separator/>
    </div>

    <div class="q-pa-md">
      <q-table flat bordered
        title="Table Title"
        :data="ordersdb"
        row-key="name"
      >
        <template v-slot:top>
          <div class="full-width row items-center justify-between">
            <div class="text-h6">Pedidos</div>
            <div>
              <q-btn color="primary" icon="add" @click="wndCreate.state = true" />
            </div>
          </div>
        </template>
      </q-table>

      <!-- <q-card v-if="reqsbyme.length" class="q-mb-md">
        <q-card-section>Pedidos</q-card-section>
        <q-list separator>
          <q-item clickable v-ripple v-for="(order) in reqsbyme" :key="order.id" @click="$router.push(`/store/${piniaAccount.join}/almacenes/resurtido/${order.id}`)">
            <q-item-section>FOLIO (GLB): {{order.id}}</q-item-section>
            <q-item-section>Folio (DIA): {{order.num_ticket}}</q-item-section>
            <q-item-section>Folio (SUC): {{order.num_ticket_store}}</q-item-section>
            <q-item-section>Solicita: {{order.owner.nick}}</q-item-section>
            <q-item-section>Origen: {{order.from_store.name}}</q-item-section>
            <q-item-section>Destino: {{order.to_store.name}}</q-item-section>
            <q-item-section>Status: {{order.state.name}}</q-item-section>
            <q-item-section><q-item-label>{{easyDate(order.created_at)}}</q-item-label></q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <q-card v-if="reqstome.length" class="q-mb-md">
        <q-card-section>Mis pedidos</q-card-section>
        <q-list separator>
          <q-item clickable v-ripple v-for="(order) in reqstome" :key="order.id" @click="$router.push(`/store/${piniaAccount.join}/almacenes/resurtido/${order.id}`)">
            <q-item-section>FOLIO (GLB): {{order.id}}</q-item-section>
            <q-item-section>Folio (DIA): {{order.num_ticket}}</q-item-section>
            <q-item-section>Folio (SUC): {{order.num_ticket_store}}</q-item-section>
            <q-item-section>Solicita: {{order.owner.nick}}</q-item-section>
            <q-item-section>Origen: {{order.from_store.name}}</q-item-section>
            <q-item-section>Destino: {{order.to_store.name}}</q-item-section>
            <q-item-section>Status: {{order.state.name}}</q-item-section>
            <q-item-section><q-item-label>{{easyDate(order.created_at)}}</q-item-label></q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <q-dialog persisten no-esc-dismiss no-backdrop-dismiss v-model="wndMinMax.state">
        <div class="bg-white">
          <div class="row q-pa-md items-center justify-between">
            <span>Productos agotados o por agotarse</span>
            <q-btn dense flat unelevated color="primary" icon="close" v-close-popup />
          </div>
          <q-separator />
          <HealthStockViewer :stores="storesdb" @startorder="setOrderAuto"/>
        </div>
      </q-dialog> -->
    </div>

    <q-dialog v-model="wndCreate.state" :persistent="wndCreate.persist">
      <FormOrderCreate :stores="storesdb" :type-store="typeStore" :store="joinstore"/>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import RestockApi from 'src/API/RestockApi';
  import HealthStockViewer from 'src/components/Warehouse/HealthStockViewer.vue';
  import dayjs from 'dayjs';
  import FormOrderCreate from 'src/components/Restock/FormOrderCreate.vue';

  const $q = useQuasar();
  const $route = useRoute();
  const $router = useRouter();
  const piniaAccount = useAccountStore();
  // const wndMinMax = ref({ state:false });
  const wndCreate = ref({ state:false, persist:false });

  const typeStore = piniaAccount.joinedStore._type;
  const joinstore = piniaAccount.joinedStore.id;

  const views = [
    { id:"day", label:"Hoy" },
    { id:"week", label:"Semana" },
    { id:"month", label:"Mes" }
  ];

  const lapse = ref({
    init:dayjs(Date.now()).startOf('day'),
    end:dayjs(Date.now()).endOf('day')
  });

  const ordsStates = ref([]);
  const viewOrderState = ref({id: 0, name: 'Todo', active: 1, allow: 0});
  const ordersdb = ref([]);
  const storesdb = ref([]);
  const neworder = ref({ to:null, type:1 });
  const view = ref(views[0]);
  const rangeDates = ref({ from: null, to: null });

  const dispDateInit = computed(() => lapse.value.init.format("YYYY/MM/DD"));
  const dispDateEnd = computed(() =>  lapse.value.end.format("YYYY/MM/DD"));
  const reqsbyme = computed(() => ordersdb.value.length ? ordersdb.value.filter( o => o._store_from==o._store_to) : []);
  const reqstome = computed(() => ordersdb.value.length ? ordersdb.value.filter( o => o._store_from!=o._store_to) : []);
  const easyDate = computed(() => { return date => dayjs(date).format("YYYY/MM/DD HH:mm"); });

  const init = async () => {
    $q.loading.show({message:"Cargando vista"});
    rangeDates.value.from = dispDateInit.value;
    rangeDates.value.to = dispDateEnd.value;

    const resp = await RestockApi.index(lapse.value.init.format("YYYY/MM/DD"),lapse.value.end.format("YYYY/MM/DD"));
    console.log(resp);
    resp.states.unshift({id: 0, name: 'Todo', active: 1, allow: 0});
    ordsStates.value = resp.states;
    ordersdb.value = resp.orders;
    storesdb.value = resp.stores;
    // neworder.value.to = storesdb.value.length == 1 ? storesdb.value[0]: null;
    $q.loading.hide();
  }

  const setOrderAuto = (data) => {
    console.log(data);
    console.log("Iniciando pedido automatico");
    neworder.value = data;

    create();
  }

  const create = async () => {
    $q.loading.show({message:"Creando, porfavor espera"});

    let data = { origin:neworder.value.to.id, type:neworder.value.type };
    const resp = await RestockApi.create(data);
    // ordersdb.value.push(resp.order);
    $router.push(`/store/${piniaAccount.join}/alma cenes/resurtido/${resp.order.id}`)
    $q.loading.hide();
  }

  const setViewDates = (v) => {
    lapse.value.init = dayjs(Date.now()).startOf(v.id);
    init();
  };

  init();
</script>

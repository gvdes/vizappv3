<template>
  <q-page>
    <div class="bg-white">
      <div class="q-pa-sm row items-center">
        <!-- <q-btn flat round dense icon="menu" /> -->
        <div class="col anek-bld text-grey-9 q-pl-sm">Resurtido</div>
        <div class="row items-center">
          <div class="row items-stretch">
            <q-select v-model="view"  :options="views" dense filled @update:model-value="setViewDates" >
              <!-- <template v-slot:append>
                <q-btn flat dense color="primary" icon="fas fa-calendar-days" @click.stop disable>
                  <q-menu>
                    <q-date v-model="rangeDates" range  minimal />
                  </q-menu>
                </q-btn>
              </template> -->
            </q-select>
          </div>
          <q-btn flat rounded icon="autorenew" @click="init" />
          <q-btn flat rounded icon="add">
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
          </q-btn>
          <q-btn flat rounded icon="fas fa-heart-pulse" @click="wndMinMax.state = true;"/>
          <q-btn flat rounded icon="support" />
        </div>
      </div>
      <q-separator/>
    </div>

    <div class="q-pa-md">
      <q-card v-if="!ordersdb.length" flat class="text-center transparent text-grey-6">
        <q-card-section> -- v a c i o -- </q-card-section>
      </q-card>

      <q-card v-if="reqsbyme.length" class="q-mb-md">
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
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
  import { ref, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import RestockApi from 'src/API/RestockApi';
  import HealthStockViewer from 'src/components/Warehouse/HealthStockViewer.vue';
  import dayjs from 'dayjs';

  const $q = useQuasar();
  const $route = useRoute();
  const $router = useRouter();
  const piniaAccount = useAccountStore();
  const wndMinMax = ref({ state:false });

  const views = [
    { id:"day", label:"Hoy" },
    { id:"week", label:"Semana" },
    { id:"month", label:"Mes" }
  ];

  const lapse = ref({
    init:dayjs(Date.now()).startOf('day'),
    end:dayjs(Date.now()).endOf('day')
  });

  const states = ref([]);
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

  onBeforeMount(() => {
    init();
  });

  const init = async () => {
    $q.loading.show({message:"Cargando vista"});
    rangeDates.value.from = dispDateInit.value;
    rangeDates.value.to = dispDateEnd.value;

    const resp = await RestockApi.index(lapse.value.init.format("YYYY/MM/DD"),lapse.value.end.format("YYYY/MM/DD"));

    console.log(resp);
    states.value = resp.states;
    ordersdb.value = resp.orders;
    storesdb.value = resp.stores;
    neworder.value.to = storesdb.value.length == 1 ? storesdb.value[0]: null;
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
    console.log(resp);
    // ordersdb.value.push(resp.order);
    // $router.push(`/store/${piniaAccount.join}/alma cenes/resurtido/${resp.order.id}`)
    $q.loading.hide();
  }

  const setViewDates = (v) => {
    lapse.value.init = dayjs(Date.now()).startOf(v.id);
    init();
  };
</script>

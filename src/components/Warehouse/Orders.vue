<template>

  <div>
    <q-card class="q-mb-md">
      <q-card-section class="q-pa-sm">
        <div class="row items-center justify-end q-gutter-md">
          <q-select v-model="viewLapse" :options="viewsLapse" dense filled @update:model-value="setViewDates" label="Vista" />
          <q-select v-model="viewOrderState" :options="statesordsdb" dense filled label="Estado de pedido" option-label="name" option-value="id"/>
          <q-btn dense flat rounded icon="autorenew" @click="initComp"/>
          <q-btn flat rounded icon="support" dense />
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-gutter-md">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">Stats</div>
          <div class="text-subtitle2">[ V1 ]</div>
        </q-card-section>
      </q-card>

      <div class="col">
        <q-table
          row-key="id"
          clas
        >
          <template v-slot:top>
            <div class="full-width text-right">
              <q-btn flat rounded color="primary" label="Nuevo Pedido" icon="fas fa-truck">
                <q-menu>
                  <q-form class="q-pa-sm q-gutter-sm" style="min-width:200px;">
                    <div>
                      <q-select :label="labelProvSelect" :options="storesProviders" v-model="newOrder.provider" option-label="name" option-value="id" filled @update:model-value="newOrder.warehouse = null"/>
                      <q-select label="Almacen" :options="wrhs_opts" v-model="newOrder.warehouse" option-label="name" option-value="id" filled />
                    </div>
                    <div class="text-right">
                      <q-btn label="Iniciar" type="submit" color="primary"/>
                    </div>
                  </q-form>
                </q-menu>
              </q-btn>
            </div>
          </template>
        </q-table>
        <q-separator spaced inset vertical dark />
        <div>{{ typeStore }}</div>
        {{ storesdb.map( s => s.name ).join(",") }}
        <div>{{ storesProviders.map( s => s.name ).join(",")  }}</div>
        <div>{{ newOrder.provider  }}</div>
      </div>
    </div>

    <q-inner-loading :showing="!readyComp"
      label="Descargando pedidos..."
      label-style="font-size: 1.2em"
    />
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import dayjs from 'dayjs';
  import RestockApi from 'src/API/RestockApi';

  const wndCreate = ref({
    state:false,
    persist:false
  });

  const $props = defineProps({
    sid:{type:Number, default:0},
    wid:{type:Number, default:0}
  });

  const store = ref(null);
  const ordersdb = ref([]);
  const statesordsdb = ref([]);
  const storesdb = ref([]);
  const readyComp = ref(false);

  const viewsLapse = [
    { id:"day", label:"Hoy" },
    { id:"week", label:"Semana" },
    { id:"month", label:"Mes" }
  ];

  const viewLapse = ref(viewsLapse[0]);
  const viewOrderState = ref({id: 0, name: 'Todo', active: 1, allow: 0});

  const lapse = ref({
    init:dayjs(Date.now()).startOf('day'),
    end:dayjs(Date.now()).endOf('day')
  });

  const setViewDates = (v) => {
    lapse.value.init = dayjs(Date.now()).startOf(v.id);
    // init();
  };

  const newOrder = ref({
    provider:null,
    warehouse:null,
  });

  // const orderTypes = [
  //   { type:1, name:"Manual", group:"cds" },
  //   { type:2, name:"Minimos y Maximos", group:"cds" },
  //   { type:3, name:"Faltantes contra Proveedor", group:"cds" }
  // ];

  const typeStore = computed(() => store.value ? store.value._type : null ); // tipo de tienda (Cedis || Sucursal)
  const warehouses = computed(() => store.value ? store.value.warehouses : [] ); // almacenes de la tienda
  const warehouse = computed(() => warehouses.value.length ? warehouses.value.find( w => w.id == $props.wid ) : null ); // almacen de la tienda en el que estamos posicionados
  const storesProviders = computed(() => (typeStore.value && typeStore.value != 1) ? storesdb.value.filter( s => s.id==$props.sid || s._type==1 ) : storesdb.value ); // Sucursales disponibles para Resurtido
  const wrhs_opts = computed(() => newOrder.value.provider ? newOrder.value.provider.warehouses.filter( w => w.id!=$props.wid) : []);
  const labelProvSelect = computed(() => {
    if(typeStore.value && typeStore.value==1){
      return (newOrder.value.provider && newOrder.value.provider._type == 1) ? "Proveedor":"Cliente"
    }else{ return "Proveedor"; }
  });

  const initComp = async () => {
    readyComp.value = false;
    ordersdb.value = [];
    statesordsdb.value = [];
    storesdb.value = [];
    store.value = null;

    console.log(`Trayendo los pedidos para sid:${$props.sid} -- wid:${$props.wid} `);
    const resp = await RestockApi.index();
    console.log("Restock its ready!");
    console.log(resp);

    ordersdb.value = resp.orders;
    statesordsdb.value = resp.states;
    statesordsdb.value.unshift({id: 0, name: 'Todo', active: 1, allow: 0});
    storesdb.value = resp.stores;
    store.value = storesdb.value.find( s => s.id == $props.sid );

    readyComp.value = true;
  }

  const startOrder = () => {
    
  }

  onMounted(() => {
    console.log("Orders Component montado...");
    initComp();
  });
</script>

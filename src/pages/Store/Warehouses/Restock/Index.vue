<template>
  <q-page>
    <div class="bg-white">
      <div class="q-pa-sm row items-center">
        <!-- <q-btn flat round dense icon="menu" /> -->
        <div class="col anek-bld text-grey-9 q-pl-sm">Resurtido</div>
        <div class="row items-center">
          <div class="row items-stretch">
            <q-select v-model="view" :options="views" dense filled @update:model-value="setViewDates" >
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
          <q-btn flat rounded icon="add" @click="wndNewReq.state = true" />
          <q-btn flat rounded icon="support" />
        </div>
      </div>
      <q-separator/>
    </div>

    <div class="q-pa-md">
      <q-table
        :rows="ordersView"
        row-key="name"
        :columns="tblRestock.cols"
        :pagination="tblRestock.paginate"
        @row-click="rowRestockClicked"
      />

      <q-dialog v-model="wndNewReq.state"
        :persistent="wndNewReq.persistent"
        :full-width="wndNewReq.fullSize"
        :full-height="wndNewReq.fullSize"
        @hide="resetDialogCreate"
      >
        <FromOrderCreate
          :reqtypes="reqTypes"
          :inaCds="inaCds"
          :storesdb="storesdb"
          @cancel="restockCancel"
          @scale="restockScaleForm"
          @creating="restockCreating"
          @created="restockCreated"
          @previewLoading="restockPreviewLoading"
          @previewLoaded="restockPreviewLoaded"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
  import { ref, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { ClosePopup, useQuasar } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import RestockApi from 'src/API/RestockApi';
  // import HealthStockViewer from 'src/components/Restock/HealthStockViewer.vue';
  import FromOrderCreate from 'src/components/Restock/FormOrderCreate.vue';
  import dayjs from 'dayjs';

  const $q = useQuasar();
  const $route = useRoute();
  const $router = useRouter();
  const piniaAccount = useAccountStore();
  // const wndMinMax = ref({ state:false });

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
  const wndNewReq = ref({ state:false, persistent:false, fullSize:false, fullWidth:false, fullHeight:false });
  const view = ref(views[0]);
  const rangeDates = ref({ from: null, to: null });
  const reqTypes = ref([]);

  const dispDateInit = computed(() => lapse.value.init.format("YYYY/MM/DD"));
  const dispDateEnd = computed(() =>  lapse.value.end.format("YYYY/MM/DD"));
  const ordersView = computed(() => ordersdb.value);
  const easyDate = computed(() => { return date => dayjs(date).format("YYYY/MM/DD HH:mm"); });
  const inaCds = computed(() => piniaAccount.joinedStore._type == 1 );

  const tblRestock = ref({
    cols:[
      { name:"oid", label:"ID", field:"id" },
      { name:"consday", label:"Cons. dia", field:"num_ticket" },
      { name:"conssucday", label:"Cons. Suc", field:"num_ticket_store" },
      { name:"conssucday", label:"Tipo", field:row=>row.type.name },
      { name:"storereq", label:"Suc. Origen", field:row=>row.origin_wrh.store.alias },
      { name:"wrhreq", label:"Alm. Origen", field:row=>row.origin_wrh.name },
      { name:"storesrc", label:"Suc. Fuente", field:row=>row.source_wrh.store.alias },
      { name:"wrhsrc", label:"Alm. Fuente", field:row=>row.source_wrh.name },
      { name:"state", label:"Estado", field:row=>row.state.name },
    ],
    paginate:{
      rowsPerPage:10
    }
  });

  onBeforeMount( async () => { await init(); });

  const init = async () => {
    $q.loading.show({message:"Cargando vista"});
    rangeDates.value.from = dispDateInit.value;
    rangeDates.value.to = dispDateEnd.value;

    const resp = await RestockApi.index(lapse.value.init.format("YYYY/MM/DD"),lapse.value.end.format("YYYY/MM/DD"));

    console.log(resp);
    states.value = resp.states;
    ordersdb.value = resp.orders;
    storesdb.value = resp.stores;
    reqTypes.value = resp.reqTypes;
    // neworder.value.to = storesdb.value.length == 1 ? storesdb.value[0]: null;
    $q.loading.hide();
  }

  const restockScaleForm = id => {
    if(id == 1){
      wndNewReq.value.fullSize = false;
    }
  }

  const setViewDates = (v) => {
    lapse.value.init = dayjs(Date.now()).startOf(v.id);
    init();
  };

  const rowRestockClicked = (evt, row, idx) => $router.push(`resurtido/${row.id}`);

  const restockCreating = () => wndNewReq.value.persistent = true;

  const restockCreated = order => {
    console.log(order);
    let newOrderId = order.resp.id;
    wndNewReq.value.persistent = false;
    wndNewReq.value.state = false;

    $router.push(`resurtido/${newOrderId}`);
  };

  const restockPreviewLoading = () => {
    console.log("Cargando preview");
    wndNewReq.value.persistent = true;
  }

  const restockPreviewLoaded = scale => {
    console.log("Preview finalizo carga");
    wndNewReq.value.persistent = false;
    wndNewReq.value.fullSize = scale;
  }

  const restockCancel = () => wndNewReq.value.state = false;
  const resetDialogCreate = () => wndNewReq.value.fullSize = false;
</script>

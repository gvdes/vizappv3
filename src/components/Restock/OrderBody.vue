<template>
  <div id="tabla">
    <div class="full-width bg-white row items-center q-pa-md">
      <div class="col" v-if="ssz!='xs'">{{ auths }}</div>
      <div class="col"><q-input v-model="filter" type="text" dense label="Buscar" rounded outlined/></div>
      <div class="col row justify-end">
        <q-btn color="primary" icon="add" @click="addLine" v-if="auths[0]"/>
        <q-btn flat icon="fas fa-ellipsis-vertical">
          <q-menu>
            <q-list style="min-width: 100px" separator>
              <q-item clickable>
                <q-item-section top avatar> <q-avatar color="primary" text-color="white" icon="download" /> </q-item-section>
                <q-item-section> <q-item-label>Exportar (.csv)</q-item-label> </q-item-section>
              </q-item>
              <q-item clickable v-if="auths[3]" @click="confirmDiscard=true" v-close-popup>
                <q-item-section top avatar> <q-avatar color="red" text-color="white" icon="delete" /> </q-item-section>
                <q-item-section> <q-item-label>Descartar pedido</q-item-label> </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
    <q-separator />
    <q-table flat
      :rows="products"
      row-key="name"
      :filter="filter"
      :columns="cols"
      @row-click="setLine"
    />
  </div>

  <q-dialog v-model="dlgAdd.show" :persistent="dlgAdd.persist" position="bottom" @hide="dlgsReset">
    <AddProduct :auths="auths" :wrhsComps="wrhsComps" :wrhOrg="wrhOrg" :order="order" @reserving="reserving" @reserveSuccess="reserveSuccess"/>
  </q-dialog>

  <q-dialog v-model="dlgEdit.show" :persistent="dlgEdit.persist" position="bottom" @hide="dlgsReset">
    <EditProduct :auths="auths" :wrhsComps="wrhsComps" :wrhOrg="wrhOrg" :product="dlgEdit.product" />
  </q-dialog>

  <q-dialog v-model="confirmDiscard" persistent>
    <q-card class="bg-orange-6">
      <q-card-section class="row items-center" horizontal>
        <q-avatar icon="warning" size="40px" color="orange-2" text-color="orange-6" />
        <div class="text-h6 q-px-md text-orange-1">Descartar Orden?</div>
      </q-card-section>
      <q-card-section class="fs-inc1 fw-sbold text-grey-9">
        Esta operacion liberara tus reservas actuales, deseas continuar?
      </q-card-section>
      <q-card-actions align="between">
        <q-btn outline label="Si, descartar" icon="done" color="white" @click="discard"/>
        <q-btn outline label="Cancelar" icon="close" color="white" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import AddProduct from './AddProduct.vue';
  import EditProduct from './EditProduct.vue';

  const $props = defineProps({
    products:{type:Array, deafult:[]},
    ssz:{type:String, deafult:"xs"},
    ostate:{type:Object, deafult:{}},
    auths:{type:Array, default:[0,0,0,0]},
    wrhsComps:{type:Array, deafult:[]},
    wrhOrg:{type:Object, deafult:{}},
    order:{type:Number, deafult:0}
  });

  const $emit = defineEmits(["onSetLine", "onDiscard", "onReserving"]);
  // const _modes = ["far fa-eye","fas fa-pencil","fas fa-plus"];
  const dlgAdd = ref({ show:false, persist:false });
  const dlgEdit = ref({ show:false, persist:false, product:null });
  const confirmDiscard = ref(false);

  const filter = ref("");
  const cols = [
    { name:"code", label:"Codigo", field:row => row.product.code, align:"left" },
    { name:"amount", label:"Sol. (uns)", field:row => row.amount, align:"center" },
    { name:"packs", label:"Sol. (emp)", field:row => (Math.floor(row.amount/row.product.pieces)), align:"center" },
    { name:"ipack", label:"UxE", field:row => row.product.pieces, align:"center" },
    { name:"descrp", label:"Codigo", field:row => row.product.description, align:"left" },
  ];

  const setLine = (ev,el,idx) => {
    dlgEdit.value.product = el;
    dlgEdit.value.show = true;
  };

  const addLine = () => {
    dlgAdd.value.show = true;
  };

  const dlgsReset = () => {

  }

  const discard = () => $emit("onDiscard");
  const reserving = () => dlgAdd.value.persist = true ;
  const reserveSuccess = () => dlgAdd.value.persist = false ;
</script>

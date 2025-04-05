<template>

  <q-card style="width: 700px; max-width: 80vw; height: 500px; max-width: 500px;">
    <q-tabs v-model="tab" class="text-primary">
      <q-tab name="gene" icon="tune" label="General" />
      <q-tab name="header" icon="view_headline" label="Encabezado" />
      <q-tab name="footer" icon="sports_soccer" label="Pie de ticket" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="gene">
        <q-card-section class="">
          <q-input v-model="tpv.name" type="text" label="Nombre" filled />
          <q-separator spaced inset vertical dark />
          <q-select v-model="tpv._client" :options="clients" label="Cliente" filled option-label="name" />
          <q-separator spaced inset vertical dark />
          <q-select v-model="tpv._warehouse" :options="warehouse" label="Almacen" filled :option-label="'store.name'">
            <template v-slot:selected>
              <div v-if="tpv._warehouse" class="text-overline">{{ tpv._warehouse.store.name }}
                (<span class="text-bold"> {{
                  tpv._warehouse.name }}</span>) </div>
              <div v-else></div>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.store.name }}</q-item-label>
                  <q-item-label caption>Almacen: {{ scope.opt.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-separator spaced inset vertical dark />

          <q-file v-model="tpv.logo" label="Logo" filled accept="image/*" @update:model-value="updateImage" />
          <q-separator spaced inset vertical dark />
          <!-- <q-img :src=tpv.urlval :ratio="16 / 3" spinner-color="primary" spinner-size="82px" /> -->

        </q-card-section>

      </q-tab-panel>
      <q-tab-panel name="header">
        <q-card-section>
          <div v-for="(header, index) in header" :key="index">
            <q-separator spaced inset vertical dark />
            <q-input v-model="header.val" type="text" :label="header.name" filled />
          </div>

        </q-card-section>
      </q-tab-panel>
      <q-tab-panel name="footer">
        <q-card-section>
          <div v-for="(footer, index) in footer" :key="index">
            <q-separator spaced inset vertical dark />
            <q-input v-model="footer.val" type="text" :label="footer.name" filled />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Enviar" color="positive" v-if="insert" @click="addTPV" />
          <q-btn flat label="Editar" color="positive" v-if="!insert" @click="EdtTPV" />
        </q-card-actions>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>




</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import cashApi from 'src/API/cashApi.js'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'stores/Account';
import PreordersApi from 'src/API/PreordersApi.js';
import Accounts from 'src/API/Accounts';
import { vizmedia } from "boot/axios"

const piniaAccount = useAccountStore();
const header = ref([])
const footer = ref([])
const emit = defineEmits(['reload']);

const $q = useQuasar();
const $router = useRouter();
const props = defineProps({
  tpv: { type: Object, default: {} },
  warehouse:{type:Array, default:[]},
  clients:{type:Array, default:[]},
  insert:{type:Boolean, defaul:false}
})


const tab = ref('gene')


const addTPV = async () => {
  $q.loading.show({ message: 'Agregando TPV' })
  const formData = new FormData();
  formData.append('name', props.tpv.name)
  formData.append('_client', props.tpv._client.id)
  formData.append('_warehouse', props.tpv._warehouse.id)
  formData.append('header_ticket', JSON.stringify(header.value))
  formData.append('footer_ticket', JSON.stringify(footer.value))
  formData.append('logo', props.tpv.logo);
  // console.log(inserTpv.value.val)
  const resp = await cashApi.addTPV(formData)
  if (resp.error) {
    console.log(resp)
  } else {
    // console.log(resp);
    $q.notify({ message: 'Insertado correctamente', type: 'positive', position: 'center' })
    emit('reload', resp)
    // tpv.value.push(resp);
    $q.loading.hide();
  }
}

const EdtTPV = async () => {
  $q.loading.show({ message: 'Editando TPV' })
  const formData = new FormData();
  formData.append('id', props.tpv.id)
  formData.append('name', props.tpv.name)
  formData.append('_client', props.tpv._client.id)
  formData.append('_warehouse', props.tpv._warehouse.id)
  formData.append('header_ticket', JSON.stringify(header.value))
  formData.append('footer_ticket', JSON.stringify(footer.value))
  if (props.tpv.logo instanceof File) {
    formData.append('logo', props.tpv.logo);
  }
  // formData.append('logo', props.tpv.logo);
  console.log(props.tpv)
  const resp = await cashApi.editTPV(formData)
  if (resp.error) {
    console.log(resp)
  } else {
    // console.log(resp);
    $q.notify({ message: 'Actualizado  correctamente', type: 'positive', position: 'center' })
    emit('reload',resp)
    // let inx = tpv.value.findIndex(e => e.id == resp.id);
    // tpv.value.splice(inx,1,resp);
    $q.loading.hide();
  }
}

const updateImage = ()=>{
  console.log(' se inserto una imagen')
  if (props.tpv.logo) {
    let file  =props.tpv.logo
    props.tpv.urlval  =  URL.createObjectURL(file)
  }
}

onMounted(() => {
 header.value =  props.insert ? props.tpv.header_ticket : JSON.parse(props.tpv.header_ticket)
 footer.value = props.insert ? props.tpv.footer_ticket :  JSON.parse(props.tpv.footer_ticket)
})

</script>

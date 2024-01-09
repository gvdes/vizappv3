<template>
  <div style="width: 700px; max-width: 80vw;">
    <div class="flex justify-center">
      <q-card class="my-card">
        <q-card-section>
          <div class="flex justify-center">
            <q-avatar size="100px"> <q-icon name="store" /> </q-avatar>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-center">{{ useStore.body.name.toUpperCase() }} </div>
          <div class="flex justify-center">
            <q-badge color="primary">
              {{ useStore.body.alias }}
            </q-badge>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <q-separator spaced />
    <div>
      <q-card class="my-card" style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <q-tabs v-model="tab" class="text-primary">
            <q-tab name="general" icon="settings" label="General" />
            <q-tab name="seasons" icon="view_cozy" label="Temporadas" />
            <q-tab name="directory" icon="lists" label="Directorio" />

          </q-tabs>
        </q-card-section>
      </q-card>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="general">
          <q-card-section>

            <q-input dense v-model="data.body.name" type="text" label="Nombre" error-message="El nombre ya esta en uso"
              :error="validname" />
            <q-separator spaced inset vertical dark />
            <q-input dense v-model="data.body.alias" type="text" label="Alias" error-message="El alias ya esta en uso"
              :error="validalias" />
            <q-separator spaced inset vertical dark />
            <q-input v-model="data.body.access_file" type="text" label="Nombre Access"
              error-message="El archivo access ya esta en uso" :error="validacces" />
            <q-separator spaced inset vertical dark />
            <div class="row">
              <q-input class="col" v-model="data.body.local_domain" type="text" label="Direccion IP"
                error-message="La ip y puerto ya estan en uso" :error="validlocal" />
              <q-separator spaced inset vertical dark />
              <q-input class="col" v-model="data.body.local_port" type="text" label="Puerto"
                error-message="La ip y puerto ya estan en uso" :error="validlocal" />
              <q-separator spaced inset vertical dark />
              <q-btn dense flat color="primary" icon="sensors" title="ping" @click="ping(data.body.local_domain,data.body.local_port)"/>
            </div>
            <q-separator spaced inset vertical dark />
            <div class="row">
              <q-input class="col" v-model="data.body.domain" type="text" label="Dominio Externo"
                error-message="El dominio y puerto ya estan en uso" :error="validomain" />
              <q-separator spaced inset vertical dark />
              <q-input class="col" v-model="data.body.port" type="text" label="Puerto Externo"
                error-message="El dominio y puerto ya estan en uso" :error="validomain" />
              <q-separator spaced inset vertical dark />
              <q-btn dense flat color="primary" icon="sensors" title="ping" @click="ping(data.body.domain,data.body.port)"/>
            </div>
            <q-separator spaced inset vertical dark />
            <div class="row">
              <q-select class="col" v-model="data.body.state" :options="stores.states" option-label="name" label="Estado"
                filled />
              <q-separator spaced inset vertical dark />
              <q-select class="col" v-model="data.body.type" :options="stores.types" option-label="name" label="Tipo"
                filled />
              <q-separator spaced inset vertical dark />
              <q-select class="col" v-model="data.body.price" :options="stores.prices" option-label="name"
                label="Tipo Precio" filled />
            </div>
          </q-card-section>
        </q-tab-panel>
        <q-tab-panel name="seasons">
          <q-option-group v-model="groupoption" :options="opts" color="primary" type="toggle" @update:model-value="changeseasons" />
        </q-tab-panel>

        <q-tab-panel name="directory">
          <div v-for="(user, index) in useStore.body.users" :key="index">
            <q-list bordered>
              <q-item clickable v-ripple @click="mostraruser(user)">
                <q-item-section>
                  {{ user.rol.name.toUpperCase() + ' ' }} : {{ ' ' + user.name + ' ' + user.surnames }}
                </q-item-section>
              </q-item>
            </q-list>
          </div>

        </q-tab-panel>
      </q-tab-panels>
      <q-card class="my-card">
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="black" @click="restore" v-close-popup :disable="!validchange" />
          <q-btn flat label="Restaurar" color="negative" @click="restore" :disable="validchange" />
          <q-btn flat label="Enviar" color="primary" @click="onSubmit" :disable="validchange" />
        </q-card-actions>
      </q-card>
      <q-dialog v-model="mosuser.state">
        <q-card style="width: 400px; max-width: 80vw;">
          <q-card-section>
            <div class="text-subtitle1 text-center">{{ mosuser.body.name.toUpperCase() }}
            </div>
            <div class="text-subtitle2 text-center"> {{ mosuser.body.surnames.toUpperCase() }}
              <div>
                <q-badge color="primary">
                  {{ mosuser.body.nick }}
                </q-badge>
              </div>
            </div>
             <q-separator spaced inset vertical dark />
            <div class="row">
              <div class="col">Celular:</div>
              <div class="col"> {{ mosuser.body.celphone }} </div>
            </div>
            <q-separator spaced inset vertical dark />
            <div class="row">
              <div class="col">Email:</div>
              <div class="col">{{ mosuser.body.email }}</div>
            </div>

            <q-separator spaced inset vertical dark />
            <div class="row">
              <div class="col">Area:</div>
              <div class="col">{{ mosuser.body.rol.area.name }}</div>
            </div>
            <q-separator spaced inset vertical dark />
            <div class="row">
              <div class="col">Puesto:</div>
              <div class="col"> {{ mosuser.body.rol.name }}</div>
            </div>
            <q-separator spaced inset vertical dark />
            <div class="flex justify-center" v-if="mosuser.body.avatar">
              <q-avatar size="170px"> <q-img :src="`src/assets/avatares/${mosuser.body.avatar}`" /> </q-avatar>
            </div>
            <div class="flex justify-center" v-else>
              <q-avatar size="170px"> <q-img :src="`src/assets/avatares/pokesnorlax.png`" /> </q-avatar>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import sapi from 'src/API/StoresApi';
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
const props = defineProps({ useStore: { type: Object }, stores: { type: Object } })
const $q = useQuasar();


const groupoption = ref([])
const mosuser = ref({
  state: false,
  body: null
})
const data = ref(JSON.parse(JSON.stringify(props.useStore)));
const tab = ref('general')

const opts = computed(() => props.stores.seasons.map(o => {
  return { value: o.id, label: o.name }
}))
const validname = computed(() => {
  let arr = props.stores.stores.filter((e) => e.id != data.value.body.id);
  let nkmil = arr.filter((e) => e.name.toUpperCase() == data.value.body.name.toUpperCase());
  return nkmil.length >= 1 ? true : false;
});
const validalias = computed(() => {
  let arr = props.stores.stores.filter((e) => e.id != data.value.body.id);
  let nkmil = arr.filter((e) => e.alias.toUpperCase() == data.value.body.alias.toUpperCase());
  return nkmil.length >= 1 ? true : false;
});
const validacces = computed(() => {
  let arr = props.stores.stores.filter((e) => e.id != data.value.body.id);
  let nkmil = arr.filter((e) => e.access_file.toUpperCase() == data.value.body.access_file.toUpperCase());
  return nkmil.length >= 1 ? true : false;
});
const validlocal = computed(() => {
  let arr = props.stores.stores.filter((e) => e.id != data.value.body.id);
  let nkmil = arr.filter((e) => e.local_domain + e.local_port == data.value.body.local_domain + data.value.body.local_port);
  return nkmil.length >= 1 ? true : false;
});
const validomain = computed(() => {
  let arr = props.stores.stores.filter((e) => e.id != data.value.body.id);
  let nkmil = arr.filter((e) => e.domain.toUpperCase() + e.port == data.value.body.domain.toUpperCase() + data.value.body.port);
  return nkmil.length >= 1 ? true : false;
});

const validchange = computed(() => {
  if (JSON.stringify(data.value) == JSON.stringify(props.useStore)) {
    return true
  } else {
    if ((validname.value || validalias.value || validacces.value || validlocal.value || validomain.value) || !(groupoption.value.length >= 1) ) {
      return true
    } else  {
      return false
    }
  }
})

const changeseasons = () => {
  groupoption.value.forEach((e) => {
    let inx = data.value.body.store_seasons.findIndex(((i) => i._season == e))
    if (inx !== -1) {
      data.value.body.store_seasons[inx]._state = 1
    }
  })
  data.value.body.store_seasons = data.value.body.store_seasons.filter((e) => {
    return groupoption.value.includes(e._season) || (e._state = 2);
  });
}

const mostraruser = (use) => {
  mosuser.value.state = true
  mosuser.value.body = use
}
const ping = async (domain,port) => {
  const notif = $q.notify({
          type: 'ongoing',
          message: 'Realizando Prueba de Conexion...',
          position:'center'
        })
  const url = 'http://'+domain +':'+ port +'/Addicted/public/api/resources/ping';
  try {
    const data =  await axios.get(url,{timeout:2000})
    console.log(data)
    if(data.status == 200){
      notif({
        type:'positive',
        message:'Conexion Exitosa',
        position:'center'
      })
    }
  }catch (error) {
    console.log(error)
    notif({
        type:'negative',
        message:'Sin Conexion',
        position:'center'
      })
  }
}


const init = () => {
  groupoption.value = props.useStore.body.store_seasons.filter((e) => e._state == 1).map(o => o._season)
}

const restore = () => {
  data.value = JSON.parse(JSON.stringify(props.useStore))
  groupoption.value = props.useStore.body.store_seasons.filter((e) => e._state == 1).map(o => o._season)
}

const onSubmit = async () => {
  $q.loading.show({ message: "Actualizanco Sucursal..." });
  const resp = await sapi.updateStore(data.value.body);
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp)
    $q.loading.hide();
    props.useStore.state = false
  }
}
init()
</script>

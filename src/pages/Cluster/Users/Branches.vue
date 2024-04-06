<template>
  <q-page padding>

    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <div @click="$router.push('/cluster/usuarios')"> <q-icon size="30px" name="arrow_back" /></div>
        <div class="col anek-bld text-grey-9 q-pl-sm">Usuarios X Sucursal</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="init" />
          <q-btn  rounded flat  :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            @click="expanded = !expanded" />
        </div>
      </div>
    </div>
    <q-separator spaced inset vertical dark />
    <div v-if="users" class="row items-start">
      <div v-for="(store, index) in branch" :key="index" @drop="onDrop($event, store.id)" @dragenter.prevent
        @dragover.prevent class="col-4 q-pa-xl">
        <q-card class="my-card">
          <q-card-section class="text-white bg-blue-8">
            <div class="text-h5 text-center" >
              <q-icon name="store" size="30px" />
              {{ store.name.toUpperCase()}} ({{ getlist(store.id).length }})
            </div>
          </q-card-section>
        </q-card>
        <q-slide-transition>
          <div v-show="expanded">
            <div v-for="item in getlist(store.id)" :key="item.id" :draggable="true" @dragstart="startDrag($event, item)">
              <q-card class="my-card">
                <q-card-section class="row between">

                  <div class=" col">{{ item.name }} {{ item.surnames }}
                  </div>
                    <div class="col">
                      <q-badge class="bg-blue-8">
                      {{ item.rol.name }}
                  </q-badge>
                    </div>

                  <q-separator />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-slide-transition>
      </div>
      <q-dialog v-model="drop" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
            <span class="q-ml-sm">You are currently not connected to any network.</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn flat label="Turn on Wifi" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>

  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import uapi from 'src/API/UserApi';
const $q = useQuasar();

const users = ref(null)
const branch = ref(null)
const expanded = ref(false)
const getlist = (list) => {
  return users.value.filter((e) => e._store == list)
}
const drop = ref(false);


const startDrag = (e, i) => {
  console.log(i)
  e.dataTransfer.dropEffect = 'move'
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('itemID', i.id)
}

const onDrop = async (e, l) => {
  const itemID = e.dataTransfer.getData('itemID');
  const item = users.value.find((user) => user.id == itemID)

  console.log(item._store);
  console.log(item.id);
  let mod = {
    user:item.id,
    store:l,
  }
  console.log(mod);

  // const resp = await uapi.changework(mod);
  // if (resp.error) {
  //   console.log(resp.error);
  // } else {
  //   console.log(resp)
  //   item._store = l
  //   $q.notify({
  //     type:'positive',
  //     message:resp
  //   })
  // }
}



const init = async () => {
  $q.loading.show({message:"Cargando Usuarios..."});
  const resp = await uapi.workus();
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp)
    users.value = resp.users;
    branch.value = resp.branches
    $q.loading.hide();
  }
};

init();
</script>

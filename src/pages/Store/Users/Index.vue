<template>
  <q-page padding>
    <div class="q-pa-sm row items-center text-center text-h6">
      <q-input v-model="search" type="text" label="Buscar"> <template v-slot:prepend><q-icon
            name="search" /></template></q-input>
      <div class="col anek-bld text-grey-9 q-pl-sm">Usuarios</div>
      <div>
        <q-btn flat rounded icon="autorenew" @click="init" />
      </div>
    </div>

    <div class="q-pa-md row items-start q-gutter-s">
      <div v-for="(use, index) in users" :key="index">
        <q-list>
          <q-item clickable v-ripple @click="editUser(use)">
            <q-item-section>
              <q-card flat class="mycard" bordered
                :style="`width: 250px; max-width: 230vw; height: 400px; border: 2px solid ${color(use)};`">
                <q-card-section>
                  <div class="text-subtitle1 text-center">{{ use.name.toUpperCase() }}
                  </div>
                  <div class="text-subtitle2 text-center"> {{ use.surnames.toUpperCase() }}
                    <div>
                      <q-badge color="primary">
                        {{ use.nick }}
                      </q-badge>
                    </div>
                  </div>
                  <q-separator spaced inset vertical dark />
                  <div class="row">
                    <div class="col">Sucursal:</div>
                    <div class="col"> {{ use.store.name }} </div>
                  </div>
                  <q-separator spaced inset vertical dark />
                  <div class="row">
                    <div class="col">Area:</div>
                    <div class="col">{{ use.rol.area.name }}</div>
                  </div>
                  <q-separator spaced inset vertical dark />
                  <div class="row">
                    <div class="col">Puesto:</div>
                    <div class="col"> {{ use.rol.name }}</div>
                  </div>
                  <q-separator spaced inset vertical dark />
                  <div class="flex justify-center" v-if="use.avatar">
                    <q-avatar size="170px"> <q-img :src="`${vizmedia}/profiles/${use.id}/${use.avatar}`" /> </q-avatar>
                  </div>
                  <!-- <div class="flex justify-center" v-else>
                  <q-avatar size="170px"> <q-img :src="`src/assets/avatares/pokesnorlax.png`" /> </q-avatar>
                </div> -->
                </q-card-section>
              </q-card>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>


    <q-dialog v-model="viewUser.state" persistent>
      <q-card class="my-card">
        <q-card-section>
          <div class="flex justify-center">

            <q-avatar size="170px"> <q-img :src="`${vizmedia}/profiles/${viewUser.val.id}/${viewUser.val.avatar}`" />
            </q-avatar>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-center">{{ viewUser.val.name.toUpperCase() + ' ' +
            viewUser.val.surnames.toUpperCase() }}
          </div>
          <div class="flex justify-center">
            <q-badge color="primary">
              {{ viewUser.val.nick }}
            </q-badge>
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn flat color="negative" icon="close" v-close-popup />
          <q-btn color="primary" label="Resetear Contrasena" rounded @click="resetPass" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAccountStore } from 'stores/Account';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import listuser from 'src/components/Users/Index/UserList.vue';
import { vizmedia } from 'boot/axios'
import uapi from 'src/API/UserApi';
const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();

const usuarios = ref([]);
const search = ref('');
const viewUser = ref({
  state: false,
  val: null
})


const users = computed(() => usuarios.value.filter(e => (e.name + e.surnames).toLowerCase().includes(search.value.toLowerCase())))

const permissions = piniaAccount.account.modules.filter(e => e._module === 'a08h')
console.log(permissions)

const init = async () => {
  $q.loading.show({ message: "Cargando Usuarios..." });
  const resp = await uapi.getUserForStore();
  if (resp.error) {

    console.log(resp)
    if (resp.error.status == 405) {
      $router.push('/')
      $q.notify({ message: 'No tienes acceso a esta pagina', type: 'negative', position: 'center' })
    }
  } else {
    usuarios.value = resp.usuarios
    console.log(resp.usuarios)
    $q.loading.hide();
  }
};


const color = (e) => {
  if (e._state == 1) {
    return '#00337C' // azul
  } else if (e._state == 2) {
    return '#03C988' // verde
  } else if (e._state == 3) {
    return '#E3651D' //naranja
  } else if (e._state == 4) {
    return '#B80000' // rojo
  } else if (e._state == 5) {
    return '#711DB0' // morado
  } else {
    return '#22092C' //negro default
  }
}

const editUser = (user) => {
  viewUser.value.state = true
  viewUser.value.val = user
  console.log(user)
}




const resetPass = async () => {
  $q.loading.show({ message: "Reseteando Contrasena de  Usuario..." });
  console.log(viewUser.value.val.id)
  const resp = await uapi.changePass(viewUser.value.val.id);
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp)
    $q.notify({ message: resp, type: 'positive', position: 'center' })
    $q.loading.hide();
  }
}


init()



</script>

<template>
<<<<<<< HEAD
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->

    <q-page-container>
      <!-- This is where pages get injected -->
      <q-page padding class="flex flex-center bg-primary">

        <q-card >
          <!-- <img src="https://cdn.quasar.dev/img/mountains.jpg"> -->
          <q-card-section class="bg-grey-3">
            <div class="text-h6">Perfil</div>
            <!-- <div class="text-subtitle2">by John Doe</div> -->
          </q-card-section>
          <q-separator />
          <div class="text-center q-pa-md bg-grey-2">
            <q-btn round flat>
              <q-avatar size="100px">
                <q-img :src="ndata.avatar.c"/>
              </q-avatar>
            </q-btn>
          </div>
          <q-card-section class="q-pa-none">
            <q-markup-table flat>
              <tbody>
                <tr>
                  <td>
                    <q-input borderless dense readonly v-model="ndata.nick.n" type="text" label="Nick" />
                  </td>
                </tr>

                <tr>
                  <td>
                    <q-input borderless dense readonly v-model="ndata.pass.n" :type="ndata.pass.type" label="Password" />
                  </td>
                </tr>

                <tr>
                  <td class="row">
                    <q-input borderless dense readonly v-model="ndata.nip.n" :type="ndata.nip.type" label="NIP" />
                    <!-- <q-btn color="primary" icon="check" label="OK" /> -->
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
            <hr />
            <q-markup-table flat id="tform">
              <tbody>
                <tr>
                  <td>
                    <div class="row">
                      <q-input borderless dense readonly type="text" v-model="ndata.names.n" label="Nombres" />
                      <q-input borderless dense readonly type="text" v-model="ndata.surnames.n" label="Apellidos" />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div class="row">
                      <q-input borderless dense readonly v-model="ndata.dob.n" type="text" label="Cumpleaños" />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div class="row">
                      <q-input borderless dense readonly v-model="ndata.phone.n" type="text" label="Telefono" mask="##-####-####"/>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <q-input borderless dense readonly v-model="ndata.email.n" type="text" label="Email"/>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>

      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script setup>
  import { LocalStorage } from 'quasar';
  import { ref, computed } from 'vue';
  import { useAccountStore } from 'stores/Account'

  const piniaAccount = useAccountStore();
  console.log(piniaAccount.account);

  const ndata = ref({
    nick:{c:"",n:""},
    pass:{c:"**********",n:"**********",type:"password"},
    nip:{c:"******",n:"******",type:"password"},
    names:{c:"",n:""},
    surnames:{c:"",n:""},
    dob:{c:"",n:""},
    phone:{c:"",n:"",confirm:false},
    email:{c:"",n:"",confirm:false},
    avatar:{c:"",n:""}
  });

  const init = () => {
    let cdata = LocalStorage.getItem("account");
    let acc = cdata.account;
    let rol = cdata.rol;
    let avatar = piniaAccount.avatar;

    ndata.value.nick.c = acc.nick;
    ndata.value.nick.n = acc.nick;

    ndata.value.names.c = acc.name;
    ndata.value.names.n = acc.name;

    ndata.value.surnames.c = acc.surnames;
    ndata.value.surnames.n = acc.surnames;

    ndata.value.dob.c = acc.dob;
    ndata.value.dob.n = acc.dob;

    ndata.value.phone.c = acc.celphone;
    ndata.value.phone.n = acc.celphone;
    ndata.value.phone.confirm = acc.phone_confirm;

    ndata.value.email.c = acc.email;
    ndata.value.email.n = acc.email;
    ndata.value.email.confirm = acc.email_confirm;

    ndata.value.avatar.c = avatar;
    ndata.value.avatar.n = avatar;
  };

  init();
</script>

<style lang="scss"></style>
=======
  <q-layout view="hHr LpR lFf">
    <q-page-container>
      <q-header>
        <q-card class="my-card">
          <q-card-section class="text-center bg-blue text-white text-weight-medium" >
            <q-btn  flat round @click="avatar"  class="q-mt-md"   >
              <div  @mouseover="change" @mouseout="hide">
                <q-avatar size="150px" >
                <!-- <q-img :src="piniaAccount.avatar"/> -->
                <div  >
                  <q-img
                    :src="addPersonImage"
                  />
                </div>
              </q-avatar>
              </div>

            </q-btn>



            <div class="text-h4">{{ account.name }} {{ account.surnames }}</div>

            <div class="text-h5">{{ account.nick }} </div>
            <div>
              <q-badge color="white" text-color="blue">
                {{ rol.name }}
              </q-badge>
            </div>
          </q-card-section>
          <div class="q-gutter-y-md">
            <q-tabs v-model="tab" dense inline-label class="bg-blue text-white">
              <q-route-tab name="mails" icon="person" label="Informacion personal" :to="'/profile'" />
              <q-route-tab name="estado" icon="work" label="Estado actual" :to="'/profile/status'" />
              <q-route-tab name="password" icon="password" label="Contraseña" :to="'/profile/changepass'" />
              <q-route-tab name="asssit" icon="co_present" label="Asistencia" :to="'/profile/assist'" />
              <q-route-tab name="sales" icon="receipt" label="Ventas" :to="'/profile/sales'" />
              <q-route-tab name="history" icon="work_history" label="Historia Laboral" :to="'/profile/historywork'" />
            </q-tabs>
          </div>
        </q-card>
      </q-header>
      <router-view />
    </q-page-container>
  </q-layout>
</template>




<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar, LocalStorage } from 'quasar';
import { useAccountStore } from 'stores/Account';
import treeModulesApp from 'src/components/TreeModulesApp.vue';
import addPersonImage from "@/assets/avatares/add-person.png";
const $q = useQuasar();
const $router = useRouter();
const piniaAccount = useAccountStore();

const state = ref(false);
const dialog = ref(false);
const tab = ref(null);
const showhover = ref(false)

/** C O M P U T E D S */

const account = computed(() => piniaAccount.account);
const rol = computed(() => piniaAccount.rol);
const accverified = computed(() => piniaAccount.verified);

/** M E T H O D S */
const avatar = () => console.log('Selecciona Avatar Nuevo')

const change = () => showhover.value = true;
const hide = () => showhover.value = false;



const toggle = () => { state.value = !state.value };




defineExpose({ toggle });
</script>

<style scope>
.hover-wrapper {
  position: relative;
  /* Otros estilos... */
}

</style>
>>>>>>> 2f7c3c0fd11ab4f2564c5345115f0e8dfd775595

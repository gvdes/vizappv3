<template>
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

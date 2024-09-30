<template>
  <q-page padding>

    <div class="row q-pa-md q-gutter-md">
      <div class="col">
        <div class="text-h3 text-grey-8 text-center">
          Hola <span class="text-primary">{{ piniaAccount.account.name }}</span>
        </div>

        <div class="text-center anek-lg text-h5 text-grey-6">{{ greeting }}</div>

        <div class="q-py-lg text-center">
          <q-img :src="piniaAccount.avatar" style="width: 170px;" />
        </div>
      </div>

      <div>
        <div>
          <MiniApps :apps="apps" />
        </div>
        <q-separator />
        <forms :apps="form" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAccountStore } from 'stores/Account';
import MiniApps from 'src/components/MiniApps.vue';
import { useQuasar, LocalStorage, Loading } from 'quasar';
import forms from 'src/components/Forms.vue';
import indpi from 'src/API/IndicatorApi.js'
import { $sktind } from 'boot/socket'
const $q = useQuasar();

$sktind.connect()

$sktind.on('NotifyForm', (param)=>{
  console.log(param)
      if (param._active === 1) {
        if (piniaAccount.account.rol._area == 15 && param._responsible == 3 || param._responsible == 1) {
          form.value.push(param)
          $q.notify({message:`El formulario ${param.name} esta disponible :)`, position:'center',type:'positive'})
        } else if ([1, 5, 7, 8].includes(piniaAccount.account.rol._area) && param._responsible == 2) {
          form.value.push(param)
          $q.notify({message:`El formulario ${param.name} esta disponible :)`, position:'center',type:'positive'})
        } else if( param._responsible == 3) {
          form.value.push(param)
          $q.notify({message:`El formulario ${param.name} esta disponible :)`, position:'center',type:'positive'})
        }

      }else if(param._active === 0){
        let inx = form.value.findIndex(e => e.id == param.id);
        form.value.splice(inx,1)
        $q.notify({message:`El formulario ${param.name} ya no  esta disponible :(`, position:'center',type:'negative'})

      }

})

const piniaAccount = useAccountStore();


const apps = piniaAccount.apps.map(a => a.app)
const form = ref(null)

const greetings = ref([
  "Que gusto verte!",
  "Excelente dia!",
  "Que sea un gran dia!",
  "Paciencia crack, paciencia.",
  "Como va todo?",
  "Empecemos...",
  "Manos a la obra!",
  "Exito!",
  "Vacaciones??... pff...",
  "Si buscas resultados distintos, no hagas siempre lo mismo.",
  "Quien tiene claro un porque? Puede superar casi cualquier cómo"
]);



const init = async () => {
  console.log(piniaAccount.account)
  const resp = await indpi.getForms()
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp);
    form.value = resp.forms.filter(e => {
      if (e._active === 1) {
        if (piniaAccount.account.rol._area == 15) {
          return e._responsible == 3 || e._responsible == 1;
        } else if ([1, 5, 7, 8, 15, 16, 17].includes(piniaAccount.account.rol._area)) {
          return e._responsible == 2 || e._responsible == 1 || e._responsible == 3;
        } else {
          return e._responsible == 3;
        }
      }
      return false;
    });
  }
}
const greeting = computed(() => greetings.value[Math.floor(Math.random() * greetings.value.length)]);
init()
</script>

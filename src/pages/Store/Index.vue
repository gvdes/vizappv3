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
import forms from 'src/components/Forms.vue';
import indpi from 'src/API/IndicatorApi.js'



const piniaAccount = useAccountStore();

console.log(piniaAccount.account.rol._area);
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

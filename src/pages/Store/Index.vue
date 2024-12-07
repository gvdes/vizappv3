<template>
  <q-page padding>

    <div class="row q-pa-md q-gutter-md">
      <div class="col">
        <div class="text-h3 text-grey-8 text-center">
          Hola <span class="text-primary">{{ piniaAccount.account.name }}</span>
        </div>

        <div class="text-center anek-lg text-h5 text-grey-6">{{ greeting }}</div>

        <div class="q-py-lg text-center">
          <q-img :src="`${vizmedia}/profiles/${piniaAccount.account.id}/${piniaAccount.account.avatar}`" style="width: 170px;" />
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
import { vizmedia } from 'boot/axios'
import forms from 'src/components/Forms.vue';
import indpi from 'src/API/IndicatorApi.js'
import { $sktind } from 'boot/socket'
const $q = useQuasar();

$sktind.connect()

$sktind.on('NotifyForm', (param) => {
  console.log(param);

// Desestructuración de los parámetros
const { _active, _responsible, _type, name, id } = param;
const { rol } = piniaAccount.account;
const { joinedStore } = piniaAccount;

// Notificación y manipulación del formulario
const notifyForm = (message, type) => $q.notify({ message, type });
const addToForm = () => form.value.push(param);
const removeFromForm = () => {
  const index = form.value.findIndex(e => e.id === id);
  if (index >= 0) form.value.splice(index, 1);
};

// Condiciones generales
const isAreaValid = [1, 2].includes(rol.hierarchy);
const isRoleIdValid = [2].includes(rol.type_rol);
const isGeneralArea = [0].includes(rol.hierarchy);
const isResponsibleValid = [1, 2, 3].includes(_responsible);

// Lógica para manejar formularios activos
const handleActive = () => {
  const isStoreType1 = joinedStore._type === 1;
  const validTypes = isStoreType1 ? [2, 3] : [1, 3];

  if (isAreaValid && isRoleIdValid) {
    if (([3, 1].includes(_responsible) && validTypes.includes(_type)) || (_responsible === 1 && _type === 3)) {
      notifyForm(`El formulario ${name} está disponible`, 'positive');
      addToForm();
    }
  } else if (isGeneralArea && isResponsibleValid) {
    notifyForm(`El formulario ${name} está disponible`, 'positive');
    addToForm();
  } else if (_responsible === 1) {
    notifyForm(`El formulario ${name} está disponible`, 'positive');
    addToForm();
  }
};

// Lógica para manejar formularios inactivos
const handleInactive = () => {
  const isStoreType1 = joinedStore._type === 1;
  const validTypes = isStoreType1 ? [2, 3] : [1, 3];

  if (isAreaValid && isRoleIdValid) {
    if (([3, 1].includes(_responsible) && validTypes.includes(_type)) || (_responsible === 1 && _type === 3)) {
      notifyForm(`El formulario ${name} ya no está disponible`, 'negative');
      removeFromForm();
    }
  } else if (isGeneralArea && isResponsibleValid) {
    notifyForm(`El formulario ${name} ya no está disponible`, 'negative');
    removeFromForm();
  } else if (_responsible === 1) {
    notifyForm(`El formulario ${name} ya no está disponible`, 'negative');
    removeFromForm();
  }
};

// Validación del estado activo/inactivo
if (_active === 1) {
  handleActive();
} else {
  handleInactive();
}
});


const piniaAccount = useAccountStore();

const apps = piniaAccount.apps.map(a => a.app)
const form = ref([])

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
  console.log(piniaAccount.avatar)
  const resp = await indpi.getForms()
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp);
    form.value = resp.forms.filter(e => {
      if (e._active === 1) {
        // console.log(piniaAccount.account.rol.id)
        // if ([15, 16, 17].includes(piniaAccount.account.rol._area)) {
        console.log(piniaAccount.rol)
        if ([1,2].includes(piniaAccount.account.rol.hierarchy)) {
          if ([2].includes(piniaAccount.account.rol.type_rol)) {
            // console.log(piniaAccount.joinedStore._type)
            if (piniaAccount.joinedStore._type == 1) {
              return (e._responsible == 3 || e._responsible == 1) && e._type == 2 || e._type == 3;
            } else {
              return (e._responsible == 3 || e._responsible == 1) && e._type == 1 || e._type == 3;

            }
          } else {
            return e._responsible == 1 && e._type == 3;
          }
        } else if ([0].includes(piniaAccount.account.rol.hierarchy)) {
          console.log(piniaAccount.joinedStore)
          return e._responsible == 2 || e._responsible == 1 || e._responsible == 3;
        } else {
          return e._responsible == 1;
        }
      }
      return false;
    });
  }
}
const greeting = computed(() => greetings.value[Math.floor(Math.random() * greetings.value.length)]);
init()
</script>

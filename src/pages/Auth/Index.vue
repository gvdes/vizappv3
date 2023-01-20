<template>
  <q-page padding class="flex flex-center bg-grey-3">
    <transition
      appear
      enter-active-class="animated fadeInUp"
      leave-active-class="animated fadeOutDown"
    >
      <div>
        <div class="text-center q-pb-md"><q-icon name="fab fa-atlassian fa-rotate-180" color="primary" size="50px"/></div>
        <q-card flat>
          <div v-if="errorForm" class="q-pa-md bg-negative row items-center text-grey-2">
            <q-icon size="sm" :name="errorsBank[errorForm].i" color="white"/>
            <span class="q-pl-md">{{errorsBank[errorForm].m}}</span>
          </div>

          <q-card-section class="text-h5 text-grey-7 anek-md">Acceso</q-card-section>

          <q-form @submit="trySignin">
            <q-card-section>
              <q-input flat v-model="nick.v"
                label="nick, telefono o email"
                autofocus
                autocapitalize="off"
                autocomplete="off"
                class="q-pb-md"
                ref="iptnick"
              />

              <q-input flat v-model="pass.v" input-class="exo"
                label="password"
                autocapitalize="off"
                autocomplete="off"
                :type="pass.h ? 'password':'text'"
                ref="iptpass"
                class="q-pb-md"
              >
                <template v-slot:append>
                  <q-btn dense flat
                    :color="pass.h ? 'primary':'negative'"
                    :icon="pass.h ? 'fas fa-lock':'fas fa-unlock'"
                    @click="pass.h=!pass.h"
                  />
                </template>
              </q-input>
            </q-card-section>

            <q-btn v-if="canTrySign"
              type="submit"
              unelevated
              label="Entrar"
              :loading="btnLogin.l"
              :disable="btnLogin.d"
              color="primary"
              class="full-width q-py-md"
            />
          </q-form>
        </q-card>

        <div class="q-pt-lg text-primary text-center" v-if="tries>=3">
          <q-icon name="fas fa-key" /> Recuperar acceso
        </div>
      </div>
    </transition>

    <q-dialog v-model="wndWelcome.state" no-backdrop-dismiss no-esc-dismiss>
      <q-card class="q-pa-sm">
        <q-card-section>
          <div class="anek-lg text-h4">Hola <span class="text-primary anek-md">{{account.name}}</span></div>
          <span class="text-h6 anek-lg">Bienvenido a VizApp!</span>
        </q-card-section>
        <q-card-section class="text-center">
          <q-icon name="fas fa-heart fa-beat" size="20px" color="red" style="--fa-animation-duration: 1.5s;"/>
        </q-card-section>
        <q-card-section class="text-center">
          porfavor espera...
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { useQuasar } from 'quasar'
  import { useRouter } from 'vue-router'
  import { ref, computed } from 'vue'
  import { useAccountStore } from 'stores/Account'
  import AuhtApi from 'src/API/Auth';

  const $q = useQuasar();
  const $router = useRouter();
  const piniaAccount = useAccountStore();

  const errorsBank = {
                    401:{ m:"Acceso bloqueado!",i:"fas fa-ban" },
                    404:{ m:"Credenciales erroneas!",i:"fas fa-user-secret" },
                    1000:{ m:"El servidor no responde!",i:"fas fa-cloud-bolt" }
                  };

  const iptnick = ref(null);
  const iptpass = ref(null);
  const nick = ref({ v:"" });
  const pass = ref({ v:"", h:true });
  const errorForm = ref(null);
  const btnLogin = ref({ l:false, d:false });
  const tries = ref(0);
  const wndWelcome = ref({ state:false });
  const account = ref(null);

  const trySignin = async () => {
    errorForm.value = null;
    console.log("Loging...");
    btnLogin.value.l = true;
    btnLogin.value.d = true;

    let params = {nick:nick.value.v, pass:pass.value.v};
    const resp = await AuhtApi.trySignin(params);

    if(resp.error){
      // console.log(resp);
      let erstate = resp.error.response ? resp.error.response.status : 1000;

      erstate == 404 ? tries.value++ : null;

      errorForm.value = erstate;
      btnLogin.value.l = false;
      btnLogin.value.d = false;

      iptnick.value.select();
      iptnick.value.focus();
    }else{
      console.log(resp);
      account.value = resp.account;
      piniaAccount.setJoin(account.value._store); // llena el join a la tienda (por default la tienda default del usuario logueado)
      piniaAccount.init(account.value, resp.token);// almacena los datos devueltos por el servidor en el inicio de sesion

      if(account.value._state==1){// si la cuenta es nueva, obliga al cambio de contraseña
        console.log("Contraseña nueva!!");
        wndWelcome.value.state = true;
        setTimeout(() => { $router.replace('/passconfig'); }, 3500);
      }else{
        console.log("Iniciando Sesion...");
        $q.loading.show({ message:`Hola <b>${account.value.nick}</b> ...`, html:true });
        setTimeout(() => $router.replace(`/store/${piniaAccount.join}`), 1000);
      }
    }
  };

  const canTrySign = computed(() => nick.value.v.length>3&&pass.value.v.length>4);
  const lg = computed(() => piniaAccount.lg);
</script>

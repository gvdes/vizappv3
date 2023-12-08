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
          <div v-if="failReq.state" class="q-pa-md bg-negative row items-center text-grey-2">
            <q-icon size="sm" :name="errorsBank[failReq.code].i" color="white"/>
            <span class="q-pl-md">{{errorsBank[failReq.code].m}}</span>
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
                :type="pass.dim ? 'password':'text'"
                ref="iptpass"
                class="q-pb-md"
              >
                <template v-slot:append>
                  <q-btn dense flat
                    :color="pass.dim ? 'primary':'negative'"
                    :icon="pass.dim ? 'fas fa-lock':'fas fa-unlock'"
                    @click="pass.dim=!pass.dim"
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
  </q-page>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { ref, computed } from 'vue'
  import { useAccountStore } from 'stores/Account'
  import AuhtApi from 'src/API/Auth';

  const $router = useRouter();
  const piniaAccount = useAccountStore();

  const errorsBank = {
                    401:{ m:"Acceso bloqueado!",i:"fas fa-ban" },
                    404:{ m:"Credenciales erroneas!",i:"fas fa-user-secret" },
                    1000:{ m:"El servidor no responde!",i:"fas fa-cloud-bolt" }
                  };

  const iptnick = ref(null); // hace referencia al elemento (input) del nick|tel|email
  const iptpass = ref(null); // hace referencia al elemento (input) de la contraseña
  const nick = ref({ v:"" }); // bind al dato del nick
  const pass = ref({ v:"", dim:true }); // bind al dato de la contraseña , dim: ofuscacion de contraseña
  const btnLogin = ref({ l:false, d:false }); // refiera al elemento boton y sus propiedades l:loading, d:disable
  const tries = ref(0); // numero de intentos de inisio de sesion
  const failReq = ref({state:false, code:0});// se activa cuando hubo intento fallido de inisio de sesion

  const trySignin = async () => {
    failReq.value.state = false; // regresa a un estado inicial el mensaje de error (si existe)
    btnLogin.value.d = true; // deshabilita la propiedad "disabled" del boton de inicio de sesion
    btnLogin.value.l = true; // deshabilita la propiedad "loading" del boton de inicio de sesion

    let params = { nick:nick.value.v, pass:pass.value.v }; // encapsula nick y password
    const resp = await AuhtApi.trySignin(params); // dispara la peticion al kraken para generar un token
    console.log(resp);

    if(resp.error){ // existio un problema de conexion o en el intento de logueo
      failReq.value.code =  resp.error.response ? resp.error.response.status : 1000;
      failReq.value.state = true;

      failReq.value.code == 404 ? tries.value++ : null;

      btnLogin.value.l = false;
      btnLogin.value.d = false;

      iptnick.value.select();
      iptnick.value.focus();
    }else{ // conexion correcta y cuenta encontrada
      let acc = resp.account;
      console.log(acc);

      piniaAccount.setToken(resp.token); // setea el token en los headers de vizapi (axios) para las posteriores peticones api
      piniaAccount.setAccount(acc);
      piniaAccount.setStore(acc.store.id);
      piniaAccount.setStores(acc.stores);
      piniaAccount.setModAuths(acc.modules);
      piniaAccount.setApps(acc.apps);
      piniaAccount.persist();

      if(acc._state==1){// si la cuenta es nueva, obliga al cambio de contraseña
        console.log(`%c¡¡ Cuenta nueva !!`,"color: #00d8d6; font-size:.9em; padding:5px 10px; border:1px solid #00d8d6; margin:5px 0; font-weight:bold; background: #1e272e;");
        $router.replace('/welcome');
      }else {
        console.log(`%cNueva sesion iniciada en ${piniaAccount.join}...`,"color: #706fd3; font-size:.9em; padding:5px 10px; border:1px solid #706fd3; margin:5px 0; font-weight:bold; background: #1e272e;");
        $router.replace(`/store/${piniaAccount.join}/`);
      }
    }
  };

  const canTrySign = computed(() => nick.value.v.length>3&&pass.value.v.length>4);
</script>

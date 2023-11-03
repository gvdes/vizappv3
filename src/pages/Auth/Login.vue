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
  const btnLogin = ref({ l:false, d:false });
  const tries = ref(0);
  const failReq = ref({state:false, code:0});

  const trySignin = async () => {
    failReq.value.state = false;
    btnLogin.value.l = true;
    btnLogin.value.d = true;

    let params = { nick:nick.value.v, pass:pass.value.v };
    const resp = await AuhtApi.trySignin(params);
    console.log(resp);

    if(resp.error){
      failReq.value.code =  resp.error.response ? resp.error.response.status : 1000;
      failReq.value.state = true;

      failReq.value.code == 404 ? tries.value++ : null;

      btnLogin.value.l = false;
      btnLogin.value.d = false;

      iptnick.value.select();
      iptnick.value.focus();
    }else{
      let acc = resp.account;
      console.log(acc);

      piniaAccount.setAccount(acc);
      piniaAccount.setToken(resp.token);
      piniaAccount.setJoin(acc.store.id);
      piniaAccount.setStores(acc.stores);
      piniaAccount.setModAuths(acc.modules);
      piniaAccount.persist();

      if(acc._state==1){// si la cuenta es nueva, obliga al cambio de contraseña
        console.log("%c¡¡ Cuenta nueva !!","color: #00d8d6; font-size:.8em; padding:5px 10px; border:1px solid #00d8d6; margin:5px 0; font-weight:bold; background: #1e272e;");
        $router.replace('/welcome');
      }else {
        console.log("Nueva sesion...","color: #706fd3; font-size:.8em; padding:5px 10px; border:1px solid #706fd3; margin:5px 0; font-weight:bold; background: #1e272e;");
        $router.replace(`/store/${piniaAccount.join}`);
      }
    }
  };

  const canTrySign = computed(() => nick.value.v.length>3&&pass.value.v.length>4);
</script>

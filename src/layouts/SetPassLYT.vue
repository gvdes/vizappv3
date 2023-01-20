<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->
    <q-page-container>
      <q-page class="flex flex-center bg-grey-3" padding>
        <q-card flat>
          <q-toolbar class="bg-primary text-white">
            <q-icon name="fas fa-key" size="25px" />
            <q-toolbar-title>
              Configurar contraseña
            </q-toolbar-title>
          </q-toolbar>

          <q-card-section v-if="acc._state==1" class="transparent">
            <span class="text-h6 anek-lg"><span class="text-primary anek-bld">{{ acc.name }}</span></span>, por favor configura una contraseña nueva:
          </q-card-section>
          <!-- <q-card-section >Para iniciar, debes configurar una contraseña...</q-card-section>
          <q-card-section v-else>Nueva contraseña</q-card-section> -->

          <q-card-section>
            <div :class="valLength?'text-positive':'text-negative anek-md'">La contraseña debe tener minimo 5 caracteres</div>
            <div :class="valContent?'text-positive':'text-negative anek-md'">Los campos deben coincidir</div>
          </q-card-section>

          <q-form
            @submit="trySetPass"
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
          >
            <q-card-section>
              <div class="text-center q-pb-md">
                <q-btn color="negative" flat rounded :icon="inputs.icon" @click="toggleInputs"/>
              </div>
              <q-input v-model="pass" :type="inputs.type" label="Nueva contraseña" ref="iptpass" input-class="text-center" autofocus/>
              <q-input v-model="passconfirm" :type="inputs.type" label="Confirmar contraseña" input-class="text-center" ref="iptpassconfirm"/>
            </q-card-section>
            <q-btn
              v-if="valContent"
              label="continuar"
              class="q-py-md full-width"
              unelevated
              type="submit"
              color="positive"
              :loading="btnNext.l"
              :disable="btnNext.d"
            />
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
  import { useQuasar } from 'quasar'
  import { useRouter } from 'vue-router'
  import { ref, computed } from 'vue'
  import { useAccountStore } from 'stores/Account'
  import AuhtApi from '../API/Auth';

  const $q = useQuasar();
  const $router = useRouter();
  const piniaAccount = useAccountStore();

  const iptpass = ref(null);
  const iptpassconfirm = ref(null);
  const btnNext = ref({ l:false, d:false});

  const pass = ref(null);
  const passconfirm = ref(null);

  const inputs = ref({type:'password',icon:"fas fa-eye"});

  const toggleInputs = () => {

    if(inputs.value.type=='password'){
      inputs.value.type = 'text';
      inputs.value.icon = 'far fa-eye-slash';
    }else{
      inputs.value.type = 'password';
      inputs.value.icon = 'far fa-eye';
    }

    iptpass.value.focus();
  };

  const trySetPass = async () => {
    console.log("Guardando cambios...");
    btnNext.value.l = true;
    btnNext.value.d = true;

    const resp = await AuhtApi.setPass({newpass:passconfirm.value});

    if(resp.error){
      console.log(resp.error);
      let erstate = resp.error.response ? resp.error.response.status : 1000;
      console.log(resp.error.response.data);
    }else{
      piniaAccount.fresh(resp);

      $q.notify({
        message:"Contraseña modificada",
        color:"positive",
        icon:"done",
        position:'center'
      });

      setTimeout(() => $router.replace(`/store/${piniaAccount.join}`), 1500);
    }
  };

  const valLength = computed(() => (pass.value&&pass.value.length>4) );
  const valContent = computed(() => (valLength.value&&(pass.value==passconfirm.value)) );
  const acc = computed(() => piniaAccount.account );
</script>

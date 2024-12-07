<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->
    <q-page-container>
      <q-page class="flex flex-center bg-grey-3" padding>
        <div>
          <div class="text-center q-gutter-md q-mb-md text-h5">
            <div>
              <!-- <span class="text-primary text-bold">{{ acc.nick }} </span> -->
              <span class="text-grey-7"> Bienvenid@ a</span> Viz<span class="text-primary text-bold">App</span>
            </div>
            <q-icon name="fas fa-heart fa-beat" color="red" style="--fa-animation-duration: 1.5s;"/>
          </div>

          <q-card flat style="max-width: 500px;">
            <q-card-section>
              Configura una nueva contraseña:
            </q-card-section>

            <q-card-section>
              <q-list dense>
                <q-item>
                  <q-item-section side>
                    <q-icon :color="valLength?'positive':'negative'" :name="valLength?'done':'close'" />
                  </q-item-section>
                  <q-item-section>Minimo 5 caracteres</q-item-section>
                </q-item>

                <q-item>
                  <q-item-section side>
                    <q-icon :color="valPass?'positive':'negative'" :name="valPass?'done':'close'" />
                  </q-item-section>
                  <q-item-section>Alfanumerico</q-item-section>
                </q-item>

                <q-item>
                  <q-item-section side>
                    <q-icon :color="samepass?'positive':'negative'" :name="samepass?'done':'close'" />
                  </q-item-section>
                  <q-item-section>Los campos coinciden</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>

            <q-form
              @submit="setFirstLogin"
              autocorrect="off"
              autocapitalize="off"
              autocomplete="off"
              spellcheck="false"
            >
              <q-card-section>
                <div class="text-center q-pb-md"><q-btn color="negative" flat rounded :icon="inputs.icon" @click="toggleInputs" :disable="btnNext.l" /></div>
                <q-input v-model.trim="pass" :type="inputs.type" label="Nueva contraseña" ref="iptpass" input-class="text-center" autofocus :readonly="btnNext.l" :error="validdo" error-message="La contrasena tiene numeros consecutivos ejemplo de contrasena a1b2c3"/>
                <q-input v-model.trim="passconfirm" :type="inputs.type" label="Confirmar contraseña" input-class="text-center" ref="iptpassconfirm" :readonly="btnNext.l"/>
              </q-card-section>

              <q-btn
                v-if="valSamepass"
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
        </div>
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
  const validpass = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/);
  // const validpass = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*(?:012|123|234|345|456|567|678|789))[A-Za-z\d]{5,}$/);


  const valLength = computed(() => (pass.value&&pass.value.length>4) );
  const validdo = computed(() => hasConsecutiveNumbers(pass.value));
  const valPass = computed(() => valLength.value && validpass.test(pass.value));
  const samepass = computed(() => pass.value==passconfirm.value)
  const valSamepass = computed(() => valLength.value&&(pass.value==passconfirm.value) && valPass.value && validdo );

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

  const setFirstLogin = async () => {
    console.log("Guardando cambios...");
    btnNext.value.l = true;
    btnNext.value.d = true;

    const resp = await AuhtApi.firstLogin({newpass:passconfirm.value});
    console.log(resp);

    if(resp.error){
      console.log(resp.error);
      console.log(resp.error.response.data);
    }else{
      piniaAccount.setAccount(resp.user);
      piniaAccount.persist();

      $q.notify({
        message:"Contraseña modificada",
        color:"positive",
        icon:"done",
        position:'center'
      });

      setTimeout(() => $router.replace(`/store/${piniaAccount.join}/`), 1500);
    }
  };

  const hasConsecutiveNumbers = (password)  => {
    for (let i = 0; i < password?.length - 2; i++) {
        if (!isNaN(password[i]) && !isNaN(password[i + 1]) && !isNaN(password[i + 2])) {
            const a = parseInt(password[i]);
            const b = parseInt(password[i + 1]);
            const c = parseInt(password[i + 2]);
            if (b === a + 1 && c === b + 1) {
                return true;
            }
        }
    }
    return false;
}
  console.log(piniaAccount.joinedStore)
</script>

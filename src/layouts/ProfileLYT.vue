<template>
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

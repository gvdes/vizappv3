<template>
  <q-layout view="hHr LpR lFf" container class="bg-white">
    <q-header>
      <div class="q-pa-md">Nueva Cuenta</div>
    </q-header>

    <q-page-container>
      <q-page>
        <q-form
          @submit="save"
          class="q-gutter-md"
          autocapitalize="off"
          autocomplete="off"
        >
          <q-list>
            <q-item-label header>Generales</q-item-label>

            <q-item>
              <q-item-section><q-input v-model="names" type="text" label="Nombre (s)" filled autocapitalize @keyup="nickBuilder" autofocus/></q-item-section>
              <q-item-section><q-input v-model="surnames" type="text" label="Apellido (s)" filled autocapitalize @keyup="nickBuilder"/></q-item-section>
            </q-item>

            <q-item>
              <q-item-section><q-input v-model="email" type="text" label="Correo Electronico" filled/></q-item-section>
            </q-item>

            <q-item>
              <q-item-section><q-input v-model="phone" type="tel" label="Tel. Movil" filled/></q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-select v-model="rol" :options="roles" label="Rol" filled option-label="name" behavior="menu"/>
              </q-item-section>

              <q-item-section>
                <q-select v-model="store" :options="stores" label="Sucursal" filled option-label="name" behavior="menu"/>
              </q-item-section>
            </q-item>

            <q-separator spaced />
            <q-item-label header>Credenciales</q-item-label>

            <q-item>
              <q-item-section><q-input v-model="nick" label="Nick" type="text" filled/></q-item-section>
              <q-item-section><q-input v-model="passcode" label="code" type="password" readonly disable/></q-item-section>
            </q-item>

          </q-list>

          <div class="text-center" v-if="cansave">
            <q-btn type="submit" color="primary" icon="done" label="Crear" />
          </div>
        </q-form>

        <q-dialog v-model="duplicate.state">
          <q-card class="bg-yellow-3 text-dark" flat>
            <q-card-section class="row items-start justify-between">
              <div class="col">
                <div class="text-h6"><q-icon name="warning" />Nick, correo o telefono duplicado.</div>
                <div class="text-subtitle2">Alguno de los datos ingresados ya fue registrado. Revise la siguiente lista de usuarios:</div>
              </div>
              <div><q-btn flat icon="close" @click="duplicate.state=false" dense /></div>
            </q-card-section>

            <q-table flat
              card-class="transparent"
              :rows="duplicate.rows"
              :columns="duplicate.cols"
              row-key="name"
            />
          </q-card>
        </q-dialog>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { v4 as uuidv4 } from 'uuid';
  import AccDB from 'src/API/Accounts';

  const $props = defineProps({
    stores:Array,
    roles:Array,
    user:Object
  });

  const names = ref("");
  const surnames = ref("");

  const nick = ref("");
  const passcode = uuidv4().split("-")[1];
  const phone = ref("");
  const email = ref("");
  const rol = ref(null);
  const store = ref(null);
  const duplicate = ref({
    rows:[],
    state:false,
    cols:[
      { name:"id", label:"ID", field:"id" },
      { name:"nick", label:"Nick", field:"nick" },
      { name:"email", label:"Email", field:"email" },
      { name:"phone", label:"Tel Movil", field:"celphone" },
      { name:"state", label:"Estado", field:row => row.state.name },
      { name:"store", label:"Sucursal", field:row => row.store.alias },
    ]
  });

  const roles = computed(() => $props.roles);
  const stores = computed(() => $props.stores);
  const cansave = computed(() => ( (names.value&&names.value.length>2) && (surnames.value&&surnames.value.length>2) && rol.value && store.value && nick.value && email.value ) ? true : false);

  const nickBuilder = (evt) => {

    if(names.value.length>=2&&surnames.value.length>=2){
      let f = names.value.split("",2).join("");
      let su = surnames.value.split(" ");

      let s = su.length==1 ? su[0] : su[0]+su[1].split("",2).join("");

      nick.value = `${f}${s}`.toLowerCase();
    }
  }

  const save = async () => {
    console.log("saving...");

    let data = {
      names:names.value,
      surnames:surnames.value,
      email:email.value,
      rol:rol.value.id,
      store:store.value.id,
      nick:nick.value,
      pass:passcode,
      phone:phone.value,
    }

    const resp = await AccDB.create(data);

    if(resp.error){
      if(resp.error.response.status==400){
        console.error("duplicate");
        console.warn(resp.error.response.data.exists);
        duplicate.value.rows = resp.error.response.data.exists;
        duplicate.value.state = true;
      }
    }else{
      console.log(resp);
    }

    console.log(resp);

  }

</script>

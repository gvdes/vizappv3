<template>
  <q-page padding>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <div>
        <q-splitter v-model="splitterModel">

          <template v-slot:before>
            <q-tabs v-model="tab" vertical class="text-primary">
              <q-tab name="person" icon="person" label="Datos Personales" style="height: 225px;" />
              <q-tab name="worker" icon="work" label="Datos Laborales" style="height: 225px;" />
              <q-tab name="documents" icon="folder" label="Documentos" style="height: 225px;" />
              <q-tab name="envuser" icon="addperson" label="Vista Previa" style="height: 225px;" />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up">
              <q-tab-panel name="person">
                <q-card class="my-card">
                  <q-card-section class="my-card text-primary bg-white">
                    <div class="text-h4">
                      <q-icon name="person" class="q-mr-xs" />
                      Datos Personales
                    </div>
                  </q-card-section>
                  <q-card-section>
                    <q-input rounded outlined v-model="personaldata.name" type="text" label="Nombre(s)" class="q-my-md" />
                    <q-input rounded outlined v-model="personaldata.surnames" type="text" label="Apellidos"
                      class="q-my-md" />
                    <div class="row q-my-md">
                      <q-input rounded outlined v-model="personaldata.dayofbirth.val" type="text" label="Fecha Nacimiento"
                        mask="##-##-####" class="col"><q-tooltip v-model="personaldata.dayofbirth.state"
                          class="bg-primary text-white">
                          DD-MM-YYYY
                        </q-tooltip>
                      </q-input>
                      <q-input rounded outlined v-model="personaldata.email" type="text" label="Correo Electronico"
                        class="col" />
                      <q-input rounded outlined v-model="personaldata.celphone" type="text" label="Telefono"
                        mask="##-####-####" class="col" />
                    </div>
                    <q-btn-toggle v-model="personaldata.gender.val" spread style="border: 1px solid #1c105a;" rounded
                      unelevated toggle-color="primary" color="white" text-color="primary"
                      :options="personaldata.gender.opts" />
                    <q-input rounded outlined v-model="personaldata.nick" type="text" label="Nick(alias)"
                      class="q-my-md" />
                  </q-card-section>
                </q-card>
              </q-tab-panel>
              <q-tab-panel name="worker">
                <q-card class="my-card">
                  <q-card-section class=" bg-white text-primary">
                    <div class="text-h4">
                      <q-icon name="person" class="q-mr-xs" />
                      Datos Personales
                    </div>
                  </q-card-section>
                  <q-card-section>
                    <div class="q-gutter-y-md">
                      <q-tabs v-model="tab2" dense class="bg-primary text-white">
                        <q-tab name="Rol" icon="lock" label="Rol" class="col" />
                        <q-tab name="Sucursales" icon="store" label="Sucursales" class="col" />
                        <q-tab name="Apps" icon="app_registration" label="Apps" class="col" />
                      </q-tabs>
                      <q-tab-panels v-model="tab2" animated>

                        <q-tab-panel name="Rol">
                          <q-card class="my-card">
                            <q-card-section>
                              <q-select v-model="roles.areas.val" :options="roles.areas.opts" label="Area" filled
                                option-label="name" />
                              <q-separator spaced inset vertical dark />
                              <div v-if="roles.areas.val">
                                <q-select v-model="roles.puesto.val" :options="roles.areas.val.roles" label="Puesto"
                                  filled class="q-my-md" option-label="name" />
                              </div>
                            </q-card-section>
                          </q-card>
                        </q-tab-panel>

                        <q-tab-panel name="Sucursales">
                          <q-card class="my-card">
                            <q-card-section>
                              <q-select v-model="workpoints.valfav" :options="workpoints.opts"
                                label="Selecciona Tienda Principal" filled @update:model-value="insfo" />
                            </q-card-section>
                            <q-card-section>
                              <div class="text-h6">Sucursales</div>
                              <q-option-group v-model="workpoints.val" :options="workpoints.opts" color="primary"
                                type="toggle" />
                            </q-card-section>
                          </q-card>
                        </q-tab-panel>

                        <q-tab-panel name="Apps">
                          <q-card class="my-card">
                            <q-card-section>
                              <div class="text-h6">APPS</div>
                              <q-option-group v-model="apps.val" :options="apps.opts" color="primary" type="toggle" />
                            </q-card-section>
                          </q-card>
                        </q-tab-panel>
                      </q-tab-panels>
                    </div>


                  </q-card-section>
                </q-card>
              </q-tab-panel>

              <q-tab-panel name="documents">
                <div class="text-h5 q-mb-s text-center">Documentos</div>
                <div class="q-pa-md row between">



                  <q-file filled bottom-slots v-model="files.solicitud" label="Solicitud de empleo" counter
                    style="width: 300px" class="col">
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon name="close" @click.stop.prevent="files.solicitud = null" class="cursor-pointer" />
                    </template>
                    <template v-slot:hint>
                      Solicitud de empleo
                    </template>
                  </q-file>
                  <q-separator spaced inset vertical dark />

                  <q-file filled bottom-slots v-model="files.identificacion" label="Identificacion" counter
                    style="width: 300px" class="col">
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon name="close" @click.stop.prevent="files.identificacion = null" class="cursor-pointer" />
                    </template>
                    <template v-slot:hint>
                      Identificacion
                    </template>
                  </q-file>

                  <q-separator spaced inset vertical dark />

                  <q-file filled bottom-slots v-model="files.identificacion" label="Identificacion" counter
                    style="width: 300px" class="col">
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon name="close" @click.stop.prevent="files.identificacion = null" class="cursor-pointer" />
                    </template>
                    <template v-slot:hint>
                      Identificacion
                    </template>
                  </q-file>

                </div>
              </q-tab-panel>

              <q-tab-panel name="envuser">
                <div class="text-h5 q-mb-s text-center">Vista Previa</div>
                <div>
                  <q-btn label="Submit" type="submit" color="primary" />
                  <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                </div>
              </q-tab-panel>

            </q-tab-panels>
          </template>
        </q-splitter>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, watch, onBeforeMount, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, LocalStorage, Loading } from 'quasar';
import { useAccountStore } from 'stores/Account';
import { useWarehouseStore } from 'stores/Warehouse';
import uapi from 'src/API/UserApi';
import { store } from 'quasar/wrappers';

const $q = useQuasar();
const $route = useRoute();
const $router = useRouter();
const piniaAccount = useAccountStore();
const piniaWarehouse = useWarehouseStore();

const users = ref(null);
const location = ref(null);
const fullpath = ref([]);

const personaldata = ref({
  name: null,
  surnames: null,
  dayofbirth: { val: null, state: false },
  celphone: null,
  email: null,
  nick: null,
  gender: {
    val: null, opts: [
      { value: 'M', label: "Masculino" },
      { value: 'F', label: "Femenino" },
      { value: 'I', label: "Indefinido" }
    ]
  }
})
const workdata = ref({
  permisos: null,
  sucursales: null,
  apps: null,
  avatar: null
});
const roles = ref({
  areas: { val: null, opts: null },
  puesto: { val: null, opts: null }
})
const workpoints = ref({
  val: [],
  valfav: null,
  opts: null,

})

const apps = ref({
  val: [],
  opts: null
})
const files = ref({
  solicitud: null,
  identificacion: null,
  acta: null,
  comprobantedom: null,
  comprobanteest: null,
  rfc: null,
  seguro: null,
  cartasreco: null,
  contanciasit: null,
  CUPR: null
});

const tab = ref('person');
const tab2 = ref(null);

const splitterModel = ref(20)


onMounted(() => { init(); });

const init = async () => {
  const resp = await uapi.opts();
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp);
    roles.value.areas.opts = resp.roles
    workpoints.value.opts = resp.workpoints
    apps.value.opts = resp.app
  }
};

const insfo = () => {
  workpoints.value.val = [];
  workpoints.value.val.push(workpoints.value.valfav.value)
}


const onSubmit = () => console.log("enviado");
const onReset = () => console.log("reseteo")

const isMob = computed(() => $q.platform.is.mobile);


</script>

<style scope>
.subrayado {
  text-decoration: underline;
}
</style>


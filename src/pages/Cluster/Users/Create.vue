<template>
  <q-page padding>

    <AppNavigator ref="main_menu" />

    <q-form @submit="onSubmit" class="q-gutter-md">
      <div>
        <q-splitter v-model="splitterModel">

          <template v-slot:before>
            <q-tabs v-model="tab" vertical class="text-primary">
              <q-tab name="person" icon="person" label="Datos Personales" style="height: 225px;" />
              <q-tab name="worker" icon="work" label="Datos Laborales" style="height: 225px;" />
              <q-tab name="documents" icon="folder" label="Documentos" style="height: 225px;" />
              <q-tab name="envuser" icon="addperson" label="Vista Previa" style="height: 225px;" v-if="formsvalid" />
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

                      <q-input rounded outlined v-model="personaldata.dayofbirth.val" label="Fecha Nacimiento" class="col"
                        mask="####-##-##" :error="!valifecha" error-message="anio-mes-dia alguno esta mal :(">
                        <template v-slot:prepend>
                          <q-btn color="primary" icon="event" @click="date = !date" flat round />
                        </template>
                      </q-input>

                      <q-dialog v-model="date">
                        <q-date v-model="personaldata.dayofbirth.val" minimal mask="YYYY-MM-DD" />
                      </q-dialog>

                      <q-input rounded outlined v-model="personaldata.email" type="text" label="Correo Electronico"
                        class="col" error-message="El correo ya esta en uso" :error="isValid" />
                      <q-input rounded outlined v-model="personaldata.celphone" type="text" label="Telefono"
                        mask="##-####-####" class="col" error-message="El numero de telefono ya esta en uso"
                        :error="celvalid" />
                    </div>
                    <q-btn-toggle v-model="personaldata.gender.val" spread style="border: 1px solid #1c105a;" rounded
                      unelevated toggle-color="primary" color="white" text-color="primary"
                      :options="personaldata.gender.opts" />
                    <q-input rounded outlined v-model="personaldata.nick" type="text" label="Nick(alias)" class="q-my-md"
                      error-message="El nick ya esta en uso" :error="nickvalid" />
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
                <q-card class="my-card">
                  <q-card-section class="my-card text-primary bg-white">
                    <div class="text-h4">
                      <q-icon name="person" class="q-mr-xs" />
                      Doumentos
                    </div>
                  </q-card-section>
                  <q-card-section>
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

                      <q-file filled bottom-slots v-model="files.acta" label="Acta de nacimiento" counter
                        style="width: 300px" class="col">
                        <template v-slot:prepend>
                          <q-icon name="cloud_upload" @click.stop.prevent />
                        </template>
                        <template v-slot:append>
                          <q-icon name="close" @click.stop.prevent="files.acta = null" class="cursor-pointer" />
                        </template>
                        <template v-slot:hint>
                          Acta de nacimiento
                        </template>
                      </q-file>

                    </div>
                    <div class="q-pa-md row between">


                      <q-file filled bottom-slots v-model="files.comprobantedom" label="Comprobante de domicilio" counter
                        style="width: 300px" class="col">
                        <template v-slot:prepend>
                          <q-icon name="cloud_upload" @click.stop.prevent />
                        </template>
                        <template v-slot:append>
                          <q-icon name="close" @click.stop.prevent="files.comprobantedom = null" class="cursor-pointer" />
                        </template>
                        <template v-slot:hint>
                          Comprobante de domicilio
                        </template>
                      </q-file>

                      <q-separator spaced inset vertical dark />

                      <q-file filled bottom-slots v-model="files.comprobanteest" label="Comprobante de estudios" counter
                        style="width: 300px" class="col">
                        <template v-slot:prepend>
                          <q-icon name="cloud_upload" @click.stop.prevent />
                        </template>
                        <template v-slot:append>
                          <q-icon name="close" @click.stop.prevent="files.comprobanteest = null" class="cursor-pointer" />
                        </template>
                        <template v-slot:hint>
                          Comprobante de estudios
                        </template>
                      </q-file>

                      <q-separator spaced inset vertical dark />

                      <q-file filled bottom-slots v-model="files.rfc" label="RFC" counter style="width: 300px"
                        class="col">
                        <template v-slot:prepend>
                          <q-icon name="cloud_upload" @click.stop.prevent />
                        </template>
                        <template v-slot:append>
                          <q-icon name="close" @click.stop.prevent="files.rfc = null" class="cursor-pointer" />
                        </template>
                        <template v-slot:hint>
                          RFC
                        </template>
                      </q-file>


                    </div>

                    <div class="q-pa-md row between">

                      <q-file filled bottom-slots v-model="files.seguro" label="Seguro" counter style="width: 300px"
                        class="col">
                        <template v-slot:prepend>
                          <q-icon name="cloud_upload" @click.stop.prevent />
                        </template>
                        <template v-slot:append>
                          <q-icon name="close" @click.stop.prevent="files.seguro = null" class="cursor-pointer" />
                        </template>
                        <template v-slot:hint>
                          Seguro
                        </template>
                      </q-file>
                      <q-separator spaced inset vertical dark />

                      <q-file filled bottom-slots v-model="files.cartasreco" label="Cartas de recomendacion" counter
                        style="width: 300px" class="col" multiple>
                        <template v-slot:prepend>
                          <q-icon name="cloud_upload" @click.stop.prevent />
                        </template>
                        <template v-slot:append>
                          <q-icon name="close" @click.stop.prevent="files.cartasreco = null" class="cursor-pointer" />
                        </template>
                        <template v-slot:hint>
                          Cartas de recomendacion
                        </template>
                      </q-file>

                      <q-separator spaced inset vertical dark />

                      <q-file filled bottom-slots v-model="files.contanciasit" label="Constancia Fiscal" counter
                        style="width: 300px" class="col">
                        <template v-slot:prepend>
                          <q-icon name="cloud_upload" @click.stop.prevent />
                        </template>
                        <template v-slot:append>
                          <q-icon name="close" @click.stop.prevent="files.contanciasit = null" class="cursor-pointer" />
                        </template>
                        <template v-slot:hint>
                          Constancia Fiscal
                        </template>
                      </q-file>

                    </div>

                    <div class="q-pa-md row between">

                      <q-file filled bottom-slots v-model="files.fotografia" label="Fotografia" counter
                        style="width: 300px" class="col">
                        <template v-slot:prepend>
                          <q-icon name="cloud_upload" @click.stop.prevent />
                        </template>
                        <template v-slot:append>
                          <q-icon name="close" @click.stop.prevent="files.fotografia = null" class="cursor-pointer" />
                        </template>
                        <template v-slot:hint>
                          Fotografia
                        </template>
                      </q-file>
                      <q-separator spaced inset vertical dark />

                      <q-file filled bottom-slots v-model="files.CUPR" label="CURP" counter style="width: 300px"
                        class="col">
                        <template v-slot:prepend>
                          <q-icon name="cloud_upload" @click.stop.prevent />
                        </template>
                        <template v-slot:append>
                          <q-icon name="close" @click.stop.prevent="files.CUPR = null" class="cursor-pointer" />
                        </template>
                        <template v-slot:hint>
                          CURP
                        </template>
                      </q-file>


                    </div>
                  </q-card-section>
                </q-card>



              </q-tab-panel>

              <q-tab-panel name="envuser">
                <q-card class="my-card">
                  <q-card-section class="text-center bg-primary text-white text-weight-medium">
                    <div>
                      <q-avatar size="150px">
                        <q-img :src="addPersonImage" />
                      </q-avatar>
                    </div>
                    <div class="text-h4 text-center">{{ personaldata.name + ' ' + personaldata.surnames }}</div>
                    <div class="text-center">
                      <q-badge color="white" class="text-center text-primary">
                        {{ personaldata.nick }}
                      </q-badge>
                    </div>
                  </q-card-section>
                  <div class="row">
                    <div class="col" style="">
                      <q-card-section>
                        <div class="text-h4 text-center text-white bg-primary"> Informacion Personal </div>
                      </q-card-section>
                      <q-card-section>
                        <div class="text-subtitle1 row">
                          <div class="col"> Correo : </div>
                          <div class="col"> {{ personaldata.email }}</div>
                        </div>
                        <q-separator />
                        <div class="text-subtitle1 row">
                          <div class="col"> Telefono : </div>
                          <div class="col"> {{ personaldata.celphone }}</div>
                        </div>
                        <q-separator />
                        <div class="text-subtitle1 row">
                          <div class="col"> Fecha Nac: </div>
                          <div class="col"> {{ personaldata.dayofbirth.val }}</div>
                        </div>
                        <q-separator />
                        <div class="text-subtitle1 row">
                          <div class="col"> Genero : </div>
                          <div class="col"> {{ personaldata.gender.val }}</div>
                        </div>
                      </q-card-section>
                    </div>
                    <div class="col" style="">
                      <q-card-section>
                        <div class="text-h4 text-center text-white bg-primary"> Informacion Laboral </div>
                      </q-card-section>
                      <q-card-section>
                        <div class="text-subtitle1 row">
                          <div class="col"> Area : </div>
                          <div class="col"> {{ area }}</div>
                        </div>
                        <q-separator />
                        <div class="text-subtitle1 row">
                          <div class="col"> Puesto : </div>
                          <div class="col"> {{ pos }}</div>
                        </div>
                        <q-separator />
                        <div class="text-subtitle1 row">
                          <div class="col"> Sucursal : </div>
                          <div class="col"> {{ work }}</div>
                        </div>
                        <q-separator />
                        <div class="text-subtitle1 row">
                          <div class="col"> Apps : </div>
                          <div class="col"> {{ appis }}</div>
                        </div>
                      </q-card-section>
                    </div>
                  </div>

                  <q-card-section>
                    <div class="text-h4 text-center text-white bg-primary"> Documentacion</div>
                  </q-card-section>
                  <div class="row">
                    <div class="col" style="">
                      <q-card-section>
                        <div class="text-subtitle1 row">
                          <div class="col"> Identificacion: </div>
                          <div class="col">{{ files.identificacion != null ? "OK" : '' }}</div>
                        </div>
                        <q-separator />
                        <div class="text-subtitle1 row">
                          <div class="col"> Solicitud de empleo: </div>
                          <div class="col"> {{ files.solicitud != null ? "OK" : '' }}</div>
                        </div>
                        <q-separator />
                        <div class="text-subtitle1 row">
                          <div class="col"> Acta Nacmienito : </div>
                          <div class="col"> {{ files.acta != null ? "OK" : '' }}</div>
                        </div>
                        <q-separator />
                        <div class="text-subtitle1 row">
                          <div class="col"> Comprobante domicilio : </div>
                          <div class="col"> {{ files.comprobantedom != null ? "OK" : '' }}</div>
                        </div>
                        <q-separator />
                        <div class="text-subtitle1 row">
                          <div class="col"> Comprobante estudios : </div>
                          <div class="col"> {{ files.comprobanteest != null ? "OK" : '' }}</div>
                        </div>
                        <q-separator />
                        <div class="text-subtitle1 row">
                          <div class="col"> fotografia : </div>
                          <div class="col"> {{ files.fotografia != null ? "OK" : '' }}</div>
                        </div>
                      </q-card-section>
                    </div>
                    <div class="col" style="">
                      <q-card-section>
                        <div class="text-subtitle1 row">
                          <div class="col"> RFC : </div>
                          <div class="col"> {{ files.rfc != null ? "OK" : '' }}</div>
                        </div>
                        <q-separator />
                        <div class="text-subtitle1 row">
                          <div class="col"> CURP : </div>
                          <div class="col"> {{ files.CUPR != null ? "OK" : '' }}</div>
                        </div>
                        <q-separator />
                        <div class="text-subtitle1 row">
                          <div class="col"> Seguro Social : </div>
                          <div class="col"> {{ files.seguro != null ? "OK" : '' }}</div>
                        </div>
                        <q-separator />
                        <div class="text-subtitle1 row">
                          <div class="col"> Cartas Recomentacion : </div>
                          <div class="col"> {{ files.cartasreco != null ? "OK" : '' }}</div>
                        </div>
                        <q-separator />
                        <div class="text-subtitle1 row">
                          <div class="col"> Constancia Fiscal : </div>
                          <div class="col"> {{ files.contanciasit != null ? "OK" : '' }}</div>
                        </div>
                      </q-card-section>
                    </div>
                  </div>
                </q-card>


                <div>
                  <q-btn unelevated rounded class="full-width" label="Enviar" type="submit" color="primary"
                    :loading="loading" />
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
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import AppNavigator from 'src/components/AppNavigator.vue';
import uapi from 'src/API/UserApi';
import addPersonImage from "src/assets/avatares/pikachu.png";

const $q = useQuasar();

const users = ref([]);
const loading = ref(false);
const date = ref(false);
const main_menu = ref(null);

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
  CUPR: null,
  fotografia: null
});

const tab = ref('person');
const tab2 = ref(null);

const splitterModel = ref(20)

const isValid = computed(() => {
  let eamil = users.value.filter((e) => e.email == personaldata.value.email);
  return eamil.length >= 1 ? true : false;
});
const celvalid = computed(() => {
  let num = personaldata.value.celphone ? personaldata.value.celphone.split('-').join('') : null
  let ciil = users.value.filter((e) => e.celphone == num);
  return ciil.length >= 1 ? true : false;
});
const nickvalid = computed(() => {
  let nkmil = users.value.filter((e) => e.nick == personaldata.value.nick);
  return nkmil.length >= 1 ? true : false;
});
const valifecha = computed(() => validafecha(personaldata.value.dayofbirth.val))
const pos = computed(() => roles.value.puesto.val ? roles.value.puesto.val.name : '')
const area = computed(() => roles.value.areas.val ? roles.value.areas.val.name : '')
const work = computed(() => workpoints.value.valfav ? workpoints.value.valfav.label : '')
const appis = computed(() => {
  let exapp = apps.value.val ? apps.value.val : [];
  return apps.value.opts.filter((e) => exapp.includes(e.value)).map((e) => e.label).join(', ')
})
const formsvalid = computed(() => personaldata.value.name && personaldata.value.surnames && personaldata.value.dayofbirth && personaldata.value.email && personaldata.value.celphone && personaldata.value.gender.val && personaldata.value.nick && roles.value.areas.val && roles.value.puesto.val && workpoints.value.valfav && (nickvalid.value == false) && (celvalid.value == false) && (isValid.value == false) && (valifecha.value) )
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
    users.value = resp.usuarios
  }
};

const insfo = () => {
  workpoints.value.val = [];
  workpoints.value.val.push(workpoints.value.valfav.value)
}

const onSubmit = async () => {
  console.log('Se creara el usuario');
  loading.value = true;
  let adduser = {
    name: personaldata.value.name,
    surnames: personaldata.value.surnames,
    dob: personaldata.value.dayofbirth.val,
    celphone: personaldata.value.celphone,
    nick: personaldata.value.nick,
    email: personaldata.value.email,
    gender: personaldata.value.gender.val,
    _rol: roles.value.puesto.val.id,
    _store: workpoints.value.valfav.value,
    stores: workpoints.value.val,
    apps: apps.value.val,
  }
  console.log(adduser);
  const addp = await uapi.adduser(adduser);
  if (addp.error) {
    console.log(addp)
  } else {
    console.log(addp)
    loading.value = false
    personaldata.value.name = null;
    personaldata.value.surnames = null;
    personaldata.value.dayofbirth.val = null;
    personaldata.value.celphone = null;
    personaldata.value.nick = null;
    personaldata.value.email = null;
    personaldata.value.gender.val = null;
    roles.value.puesto.val.id = null;
    workpoints.value.valfav.value = null;
    workpoints.value.val = [];
    apps.value.val = [];
    tab.value = 'person'
    $q.notify({
      type: 'positive',
      position: 'center',
      message: `Se Crea el usuario ${addp.id} con el nick ${addp.nick}`
    })
  }
};

const validafecha = (fecha) => {
  if (fecha == null || fecha.length < 10) {
    return true
  } else {
    const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;

    if (!formatoFecha.test(fecha)) {
      return false; // Formato de fecha incorrecto
    }

    const [year, month, day] = fecha.split('-');
    const parsedYear = parseInt(year, 10);
    const parsedMonth = parseInt(month, 10);
    const parsedDay = parseInt(day, 10);

    if (parsedYear < 1000 || parsedYear > 9999) {
      return false; // Año inválido
    }

    if (parsedMonth < 1 || parsedMonth > 12) {
      return false; // Mes inválido
    }

    const lastDayOfMonth = new Date(parsedYear, parsedMonth, 0).getDate();
    if (parsedDay < 1 || parsedDay > lastDayOfMonth) {
      return false; // Día inválido
    }

    return true; // Fecha válida
  }

}



const isMob = computed(() => $q.platform.is.mobile);


</script>

<style scope>
.subrayado {
  text-decoration: underline;
}
</style>


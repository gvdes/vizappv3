<template>
  <q-page padding>
    <div class="text-center">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">Justificaciones</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-select
              v-model="justification.user"
              :options="users"
              label="Colaborador"
              option-label="complete_name"
              filled
            />
            <div class="row">
              <q-input
                v-model="justification.start_date"
                type="date"
                class="col"
                filled
                label="Fecha Inicio"
                :stack-label=true
                :error="validfech"
                error-message="La fecha de inicio es mayor que la fecha de fin"
              />
              <q-separator spaced inset vertical dark />
              <q-input
                v-model="justification.final_date"
                type="date"
                class="col"
                filled
                hint="Fecha Fin"
                label="Fecha Inicio"
                :stack-label=true
                :error="validfech"
                error-message="La fecha de inicio es mayor que la fecha de fin"
              />
            </div>
            <q-input
              v-model="justification.notes"
              type="text"
              label="Motivo(especificar)"
              filled/>

              <q-uploader
                hide-upload-btn
                color="primary"
                bordered
                style="width: 99%"
                label="Evidencia / Justificacion "
                accept=".jpg, image/*"
                ref="reference"
                @rejected="onRejected"
                @added="insertimage"
                :max-files="1"
                :url="rhpi.addFile"
                :headers="headers"
                @failed="failed"
                @uploading="subiendo"
                field-name="file"
                @uploaded="subido"
                @removed="remove"
                :form-fields="formFields"
              />


            <div>
              <q-btn label="Enviar" type="submit" color="positive" flat :disable="!validform"  />
              <q-btn label="Cancelar" type="reset" color="negative" flat class="q-ml-sm"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup >
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import rhpi from "src/API/RhApi";
import { useAccountStore } from "stores/Account";
const $q = useQuasar();
const $router = useRouter();

const piniaAccount = useAccountStore();


const user = ref([]);
const reference = ref(null)
const headers = ref([{name:'Authorization', value:`Bearer ${piniaAccount.token}`} ])
const formFields = ref([{name:'idms', value:null}])
const justification = ref({
  user: null,
  start_date: null,
  final_date: null,
  notes: null,
  evidence:null,
});

const users = computed(() =>
  user.value.map((e) => {
    e.complete_name = `${e.name} ${e.surnames}`;
    return e;
  })
);

const validform = computed(() => justification.value.user && justification.value.start_date && justification.value.final_date && justification.value.notes && justification.value.evidence && !validfech.value)

const validfech = computed(() => {
  const start  = new Date(justification.value.start_date);
  const final = new Date(justification.value.final_date)
   return start > final})

const init = async () => {
  const resp = await rhpi.form();
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp);
    user.value = resp;
  }
};

const onSubmit = async() => {
  $q.loading.show({message:'Enviando formulario'})
  console.log(justification.value)
  const resp = await rhpi.addForm(justification.value)
  if(resp.error){
    console.log(resp)
  }else{
    console.log(resp)
    // reference.value.reset();
    $q.notify({message:'Formulario Enviado',type:'positive',position:'center'})
    formFields.value[0].value = resp.id
    $q.loading.hide()
    reference.value.upload();

    justification.value = {
    user: null,
    start_date: null,
    final_date: null,
    notes: null,
    evidence:null,
    };

  }
  // reference.value.upload();
};
const onReset = () => {
  justification.value = {
    user: null,
    start_date: null,
    final_date: null,
    notes: null,
    evidence:null,
    };
    reference.value.reset();
};

const onRejected = () => {
  $q.notify({message:'No se acepta este archivo', type:'negative',position:'center'})
};

const insertimage = (a) => {
  console.log(a[0].name);
  justification.value.evidence = a[0].name;
}
const remove = () => {
  justification.value.evidence = null;
}


const failed = (file) => {
  $q.notify({message:'No se logro subir la evidencia',type:'negative',position:'center'})
}

const subiendo = (file) => {
  $q.loading.show({message:'Subiendo Archivo'})
}
const subido = async (file) => {
  $q.loading.hide();
  $q.notify({message:'Evidencia Enviada',type:'positive',position:'center'})
  reference.value.reset();

}

init();
</script>

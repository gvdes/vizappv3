<template>
  <q-page padding>
    <div class="text-center">


      <q-tabs v-model="tab" class="text-primary bg-white">
        <q-tab name="form" icon="list" label="Formulario" />
        <q-tab name="justifications" icon="alarm" label="Justificaciones" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="form">

          <q-card class="my-card">
            <q-card-section>
              <div class="text-h6">Justificaciones</div>
            </q-card-section>
            <q-card-section>
              <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                <q-select v-model="justification.user" :options="optsUser" label="Colaborador"
                  option-label="complete_name" filled use-input @filter="filterFn" />
                <div class="row">
                  <q-input v-model="justification.start_date" type="date" class="col" filled label="Fecha Inicio"
                    :stack-label=true :error="validfech"
                    error-message="La fecha de inicio es mayor que la fecha de fin" />
                  <q-separator spaced inset vertical dark />
                  <q-input v-model="justification.final_date" type="date" class="col" filled hint="Fecha Fin"
                    label="Fecha Fin" :stack-label=true :error="validfech"
                    error-message="La fecha de inicio es mayor que la fecha de fin" />
                </div>
                <q-select v-model="justification._type" :options="types" label="Tipo de justificacion" filled
                  option-label="name" />
                <q-input v-model="justification.notes" type="text" label="Motivo(especificar)" filled />

                <q-card class="my-card">
                  <q-card-section class="text-left text-h6 text-bold">
                    Evidencia
                  </q-card-section>
                  <q-card-section>
                    <q-uploader hide-upload-btn color="white" text-color="grey" style="height: auto; width: 100%"
                      label="Evidencia" accept="image/*" ref="reference" @added="insertimage" field-name="file" multiple
                      flat @rejected="onRejected" max-files="3">

                      <template v-slot:header="scope">
                        <div class="row no-wrap items-center q-pa-sm q-gutter-xs text-center "
                          style="border-radius: 8px; padding: 16px;" @click="scope.pickFiles">
                          Haz clic para subir los archivos o arrastra y suelta los archivos aquí
                          <q-uploader-add-trigger />
                        </div>
                      </template>

                      <template v-slot:list="scope">

                        <q-table :rows="scope.files" grid hide-bottom :pagination="{ rowsPerPage: 0 }">
                          <template v-slot:item="props">
                            <div style="position: relative; border: 1px solid #EEEEEE;
                       border-radius: 10px;
                       width: 100px;
                       height: 100px;
                       margin: 5px
                       ">
                              <div @mouseover="hoveredItem = props.row" @mouseleave="hoveredItem = null"
                                :style="hoveredItem == props.row ? 'opacity: 0.7;' : null" style="margin:12px;">
                                <q-avatar size="75px" square>
                                  <q-img :src="props.row.__img.src" style="height: 75px; width: 75px">
                                  </q-img>
                                </q-avatar>
                                <q-btn size="sm" icon="delete" color="white" class="absolute" text-color="black"
                                  style="top: 5px; left: 5px; z-index: 10; width: 10px; "
                                  v-if="hoveredItem == props.row ? true : false"
                                  @click="removeEvidence(scope, props)" />
                              </div>
                            </div>
                          </template>
                        </q-table>
                      </template>
                    </q-uploader>
                  </q-card-section>
                </q-card>
                <div>
                  <q-btn label="Enviar" type="submit" color="positive" flat :disable="!validform" />
                  <q-btn label="Cancelar" type="reset" color="negative" flat class="q-ml-sm" />
                  <div class="text-red text-bold" v-if=" exostJusti.length > 0"> {{` Esta semana ya existe ${exostJusti.length} justificacion con los mismos parametros`}} </div>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-tab-panel>
        <q-tab-panel name="justifications">
          <q-table
            title="Justificaciones"
            :rows="justifications"
            :columns="table.columns"
          />

        </q-tab-panel>
      </q-tab-panels>


    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import rhpi from "src/API/RhApi";
import dayjs from 'dayjs';
import { useAccountStore } from "stores/Account";
const $q = useQuasar();
const $router = useRouter();

const piniaAccount = useAccountStore();


const user = ref([]);
const types = ref([]);
const tab = ref('form')
const hoveredItem = ref(null)
const reference = ref(null)
const optsUser = ref(user.value)
const headers = ref([{ name: 'Authorization', value: `Bearer ${piniaAccount.token}` }])
const formFields = ref([{ name: 'idms', value: null }])
const justifications = ref([]);
const justification = ref({
  user: null,
  start_date: null,
  final_date: null,
  _type: null,
  notes: null,
  evidence: [],
});

const table = ref({
  columns: [
    { name: 'id', label: 'Id', field: row => row.id, sortable: true, align:'center' },
    { name: 'user', label: 'Colaborador', field: row => `${row.user.name} ${row.user.surnames}`, sortable: true, align:'left' },
    { name: 'creacion', label: 'Creacion', field: row => row.created_at, sortable: true, align:'left' },
    { name: 'start_date', label: 'Fecha Inicio', field: row => row.start_date, sortable: true, align:'left' },
    { name: 'final_date', label: 'Fecha Final', field: row => row.final_date, sortable: true, align:'left' },
    { name: 'notes', label: 'Motivo', field: row => row.notes, sortable: true, align:'left' },
    { name: 'type', label: 'Tipo', field: row => row.type.name, sortable: true, align:'left' },
    { name: 'paymen', label: 'Porcetaje', field: row => row.paymen?.name, sortable: true, align:'left' },
    { name: 'state', label: 'Estado', field: row => row.state.name, sortable: true, align:'left' },
  ]
})

const users = computed(() =>
  user.value.map((e) => {
    e.complete_name = `${e.name} ${e.surnames}`;
    return e;
  })
);

const validform = computed(() => justification.value.user && justification.value.start_date && justification.value.final_date && justification.value._type && justification.value.notes && justification.value.evidence.length > 0 && !validfech.value && exostJusti.length > 0)


const exostJusti = computed(() => { return justifications.value.filter(e => e.user.id ==justification.value.user?.id && e.start_date == justification.value.start_date && e.final_date == justification.value.final_date )})


const validfech = computed(() => {
  const start = new Date(justification.value.start_date);
  const final = new Date(justification.value.final_date)
  return start > final
})

const init = async () => {
  const resp = await rhpi.form();
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp);
    user.value = resp.user;
    types.value = resp.types
    justifications.value = resp.justifications
  }
};

const filterFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase()
    optsUser.value = users.value.filter(v => `${v.name} ${v.surnames}`.toLowerCase().indexOf(needle) > -1)
  })
}

const onSubmit = async () => {
  $q.loading.show({ message: 'Enviando formulario' })

  const formData = new FormData();
  formData.append('user', justification.value.user.id);
  formData.append('start_date', justification.value.start_date);
  formData.append('final_date', justification.value.final_date);
  formData.append('_type', justification.value._type.id);
  formData.append('notes', justification.value.notes);
  justification.value.evidence.forEach((file, index) => {
    formData.append(`evidence[${index}]`, file);
  });
  console.log(formData);

  const resp = await rhpi.addForm(formData)
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp)
    $q.notify({ message: 'Formulario Enviado', type: 'positive', position: 'center' })
    $q.loading.hide()

    justification.value = {
      user: null,
      start_date: null,
      final_date: null,
      notes: null,
      evidence: [],
    };
    reference.value.reset();

  }
};
const onReset = () => {
  justification.value = {
    user: null,
    start_date: null,
    final_date: null,
    notes: null,
    evidence: [],
  };

};

const onRejected = () => {
  $q.notify({ message: 'No se acepta este archivo', type: 'negative', position: 'center' })
};

const insertimage = (file) => {
  justification.value.evidence = file;
}
const removeEvidence = (scope, rows) => {
  scope.removeFile(rows.row);
  let inx = justification.value.evidence.findIndex(e => e.__key == rows.row.__key);

  if (inx >= 0) {
    justification.value.evidence.splice(inx, 1);
  }
}
init();
</script>

<template>
  <q-page padding>

    <div class="q-pa-sm row items-center text-center text-h6">
      <q-btn flat rounded icon="filter_alt">
        <q-menu max-height="300px">
          <q-card class="my-card">
            <q-card-section>
              <q-select style="min-width: 200px" v-model="filter.class.val" :options="classifications"
                label="Clasificacion" option-label="name" filled>
                <template v-slot:after>
                  <q-btn round dense flat icon="close" @click="filter.class.val = null" />
                </template>
              </q-select>
              <q-separator spaced inset vertical dark />
              <q-select style="min-width: 200px" v-model="filter.branches.val" :options="stores" label="Sucursal"
                :option-label="i => (i.store.name)" filled>
                <template v-slot:after>
                  <q-btn round dense flat icon="close" @click="filter.branches.val = null" />
                </template>
              </q-select>
            </q-card-section>
          </q-card>
        </q-menu>
      </q-btn>
      <q-input v-model="search" type="text" label="Buscar"> <template v-slot:prepend><q-icon
            name="search" /></template></q-input>
      <div class="col anek-bld text-grey-9 q-pl-sm">Clasificacion Colaboradores</div>
      <div>
        <q-btn icon="download" flat rounded @click="generateExel" />
        <q-btn icon="picture_as_pdf" flat rounded @click="pdfCreate" />
        <q-btn flat rounded icon="autorenew" @click="init" />
        <q-btn flat rounded icon="font_download" @click="updateClass" />
      </div>
    </div>


    <div class="q-pa-md row items-start q-gutter-s">
      <div v-for="(use, index) in usuarios" :key="index">
        <q-list>
          <q-item clickable v-ripple @click="editUser(use)">
            <q-item-section>
              <q-card flat class="mycard" bordered
                :style="`width: 250px; max-width: 230vw; height: 410px; border: 2px solid ${color(use)};`">
                <q-card-section>
                  <div class="text-subtitle1 text-center">{{ use.name.toUpperCase() }}
                  </div>
                  <div class="text-subtitle2 text-center"> {{ use.surnames.toUpperCase() }}
                    <div>
                      <q-badge color="primary">
                        {{ use.nick }}
                      </q-badge>
                    </div>
                  </div>
                  <q-separator spaced inset vertical dark />
                  <div class="row">
                    <div class="col">Sucursal:</div>
                    <div class="col"> {{ use.classification?.store.store.name }} </div>
                  </div>

                  <q-separator spaced inset vertical dark />
                  <div class="row">
                    <div class="col">Puesto:</div>
                    <div class="col"> {{ use.rol.name }}</div>
                  </div>
                  <q-separator spaced inset vertical dark />
                  <div class="row q-mt-md">
                    <div class=" col">Clasificacion:</div>
                    <div class=" col text-bold text-h6">{{ use.classification?.classification.name }}</div>
                  </div>
                  <q-separator spaced inset vertical dark />
                  <div class="flex justify-center" v-if="use.avatar">
                    <q-avatar size="170px"><q-img :src="`${vizmedia}/profiles/${use.id}/${use.avatar}`" /></q-avatar>
                  </div>
                  <!-- <div class="flex justify-center" v-else>
                  <q-avatar size="170px"> <q-img :src="`src/assets/avatares/pokesnorlax.png`" /> </q-avatar>
                </div> -->
                </q-card-section>
              </q-card>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>



    <q-dialog v-model="viewUser.state" persistent full-width>
      <viewUserClass :viewUser="viewUser" :classifications="classifications" :stores="stores" :week="week"
        :users="users" />
    </q-dialog>

    <q-dialog v-model="viewUpdate.state" full-width persistent>
      <q-card>
        <q-card-section>
          <q-table :rows="viewUpdate.val" :columns="viewUpdate.table.columns">
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="name" :props="props">
                  {{ props.cols[0].value }}
                </q-td>
                <q-td :key="props.cols[1].name" :props="props">
                  {{ props.cols[1].value }}
                </q-td>
                <q-td :key="props.cols[2].name" :props="props">
                  {{ props.cols[2].value }}
                </q-td>

                <q-td :key="props.cols[3].name" :props="props">
                  {{ dayjs(props.cols[3].value).format('DD/MM/YYYY') }}
                </q-td>
                <q-td :key="props.cols[4].name" :props="props">
                  {{ props.cols[4].value }}
                </q-td>
                <q-td :key="props.cols[5].name" :props="props">
                  {{ props.cols[5].value }}
                </q-td>
                <q-td :key="props.cols[6].name" :props="props">
                  {{ props.cols[6].value }}
                </q-td>
                <q-td :key="props.cols[7].name" :props="props" class="text-bold">
                  {{classifications.find(e => e.id == props.cols[7].value).name}}
                </q-td>
                <q-td :key="props.cols[8].name" :props="props" class="text-bold">
                  {{classifications.find(e => e.id == props.cols[8].value).name}}
                </q-td>
                <q-td :key="props.cols[9].name" :props="props">
                  <q-icon
                    :name="props.cols[9].value == 'mayor' ? 'arrow_circle_up' : props.cols[9].value == 'menor' ? 'arrow_circle_down' : 'do_not_disturb_on'"
                    size="sm"
                    :color="props.cols[9].value == 'mayor' ? 'positive' : props.cols[9].value == 'menor' ? 'negative' : 'black'" />
                </q-td>
                <q-td :key="props.cols[10].name" :props="props">
                  <q-btn color="primary" flat rounded icon="check" @click="editColaboratorClassification(props.row)" />
                </q-td>
              </q-tr>
            </template>


          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="salir" color="positive" @click="viewUpdate.val = []; viewUpdate.state = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-fab color="primary" text-color="white" icon="keyboard_arrow_left" :direction="isMobile ? 'up' : 'left'">
        <template v-slot:label="{ opened }">
          <div :class="{ 'example-fab-animate--hover': opened !== true }">
            {{ opened !== true ? 'Opciones' : 'Cerrar' }}
          </div>
        </template>
        <div v-for="(modulo, index) in permissions" :key="index">
          <q-fab-action color="primary" :icon="modulo.module.icon" :to="`${modulo.module.path}`"
            :label="modulo.module.name" />
        </div>
      </q-fab>
    </q-page-sticky>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAccountStore } from 'stores/Account';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import indpi from 'src/API/IndicatorApi';
import pdf from 'src/PDF/Indicators/userclass.js';
import excel from 'src/EXCEL/Indicators/bonuses.js';

import dayjs from 'dayjs';
import viewUserClass from 'src/components/Indicator/viewUserClass.vue';
import { vizmedia } from 'boot/axios'
const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();

const users = ref([]);
const classifications = ref([]);
const stores = ref([])
const search = ref('');
const changeValue = ref(false);
const prop = ref(false);

const viewUser = ref({
  state: false,
  val: null
})

const filter = ref({
  state: false,
  class: { val: null, opts: null },
  branches: { val: null, opts: null },
});

const week = ref(null);

const userList = computed(() => {
  if (!filter.value.class.val && !filter.value.branches.val) {
    return users.value;
  } else {
    return users.value.filter((e) => {
      const statusId = filter.value.class?.val?.id;
      const branchesId = filter.value.branches?.val?.id;

      const isStatusSelected = statusId != null;
      const isBranchesSelected = branchesId != null;

      return (
        (isStatusSelected || isBranchesSelected) &&
        e.classification?.store?.id != null && // Verifica si `store.id` existe
        e.classification?.classification?.id != null && // Verifica si `classification.id` existe
        (isStatusSelected ? e.classification.classification.id == statusId : true) &&
        (isBranchesSelected ? e.classification.store.id == branchesId : true)
      );
    });
  }
});

const viewUpdate = ref({
  state: false,
  val: [],
  percentage: 0,
  usuarios: 0,
  table: {
    columns: [
      { name: 'name', label: 'Nombre', field: r => `${r.user.name} ${r.user.surnames}`, align: 'left', sortable: true },
      { name: 'store', label: 'Sucursal', field: r => r.user.classification.store.store.name, align: 'left', sortable: true },
      { name: 'position', label: 'Puesto', field: r => r.user.rol.name, align: 'left', sortable: true },
      { name: 'updated', label: 'Ult Act', field: r => r.user.classification.updated_at, align: 'left', sortable: true },
      { name: 'pointsCheck', label: 'P-Checklist', field: r => r.calculate.puntosChecklist, align: 'center', sortable: true },
      { name: 'pointsAssist', label: 'P-Asistencia', field: r => r.calculate.puntosAsistencia, align: 'center', sortable: true },
      { name: 'percentage', label: 'Porcentaje', field: r => r.calculate.percentage, align: 'center', sortable: true },
      { name: 'classAct', label: 'C-Actual', field: r => r.classAct, align: 'center', sortable: true },
      { name: 'classCal', label: 'C-Calculada', field: r => r.classCal, align: 'center', sortable: true },
      { name: 'icon', field: r => r.classAct > r.classCal ? 'mayor' : r.classAct < r.classCal ? 'menor' : 'igual', align: 'center', sortable: true },
      { name: 'action', align: 'center', sortable: true },
    ],
  }
})

const usuarios = computed(() => userList.value.filter(e => (e.name + e.surnames).toLowerCase().includes(search.value.toLowerCase())))
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const isMobile = computed(() => $q.platform.is.mobile);
const permissions = computed(() => piniaAccount.account.modules.filter((e) => e.module.root == 'v76v'))


const init = async () => {
  $q.loading.show({ message: 'Obteniendo colaboradores' });
  const resp = await indpi.getUserClass();
  if (resp.error) {
    console.log(resp.error)
  } else {
    users.value = resp.users;
    classifications.value = resp.classifications
    stores.value = resp.stores
    week.value = resp.week
    $q.loading.hide();
    console.log(resp);
  }
}

const editUser = (user) => {
  viewUser.value.state = true
  viewUser.value.val = JSON.parse(JSON.stringify(user))
}


const color = (e) => {
  if (e.classification?._classification == 1) {
    return 'green' // azul
  } else if (e.classification?._classification == 2) {
    return 'yellow' // verde
  } else if (e.classification?._classification == 3) {
    return 'red' //naranja
  }
}


const editColaboratorClassification = async (user) => {
  console.log(user)
  let data = {
    _user: user.user.id,
    classification: { id: user.calculate.classification }
  }
  console.log(data);
  $q.loading.show({ message: 'Editando Clasificacion' });
  const resp = await indpi.editUserClass(data)
  if (resp.error) {
    console.log(resp);

  } else {
    console.log(resp)
    let inx = users.value.findIndex(e => e.id == resp.id);
    if (inx >= 0) {
      users.value[inx] = resp
    }
    let inex = viewUpdate.value.val.findIndex(e => e.user.id == resp.id)
    if (inex >= 0) {
      viewUpdate.value.val.splice(inex, 1)
    }
    $q.notify({ message: 'Clasificacion Actualizada', type: 'positive', position: 'center' })
    $q.loading.hide();
  }
}

const pdfCreate = async () => {
  let sucursales = new Map();
  const totalUsers = usuarios.value.length;
  let index = 0;
  $q.loading.show({ message: `Progreso: 0/${totalUsers} (0%)` });

  for (const user of usuarios.value) {
    if (user.classification?.store) {
      let store = user.classification.store;
      let storeId = store.id;
      if (!sucursales.has(storeId)) {
        sucursales.set(storeId, { ...store, users: [] });
      }
      sucursales.get(storeId).users.push(user);
    }
    try {
      const resp = await indpi.getCalculateClassUser(user);
      if (resp.error) {
        console.log(resp);
      } else {
        user.class = resp;
      }
      index++
      $q.loading.show({
        message: `Progreso: ${index}/${totalUsers} (${((index / totalUsers) * 100).toFixed(2)}%)`
      });

      await sleep(500);
    } catch (error) {
      console.error("Error al obtener la clasificación:", error);
    }
  }

  $q.loading.hide()
  let sucursalesArray = [...sucursales.values()];
  pdf.firmasPdf(sucursalesArray, week.value);
  pdf.BonsPdf(sucursalesArray, week.value);
};

const updateClass = async () => {
  console.time("Tiempo total");
  const startTime = performance.now();
  viewUpdate.value.state = true;
  viewUpdate.value.usuarios = 0;
  const totalUsers = usuarios.value.length;
  $q.loading.show({ message: `Progreso: 0/${totalUsers} (0%)` });

  for (const e of usuarios.value) {
    const userStartTime = performance.now();
    const resp = await indpi.compareUserClassification(e.id);
    const userEndTime = performance.now();
    console.log(`Tiempo para ${e.id}: ${(userEndTime - userStartTime).toFixed(2)} ms`);

    if (!resp.error && !resp.match) {
      viewUpdate.value.val.push(resp);
      console.log(resp);
    }

    viewUpdate.value.usuarios++;
    $q.loading.show({
      message: `Progreso: ${viewUpdate.value.usuarios}/${totalUsers} (${((viewUpdate.value.usuarios / totalUsers) * 100).toFixed(2)}%)`
    });

    await sleep(500);
  }

  $q.loading.hide();
  const endTime = performance.now();
  console.log(`Tiempo total de ejecución: ${(endTime - startTime).toFixed(2)} ms`);
  console.timeEnd("Tiempo total");
};

const generateExel = async () => {
  let sucursales = new Map();
  const totalUsers = usuarios.value.length;
  let index = 0;
  $q.loading.show({ message: `Progreso: 0/${totalUsers} (0%)` });

  for (const user of usuarios.value) {
    if (user.classification?.store) {
      let store = user.classification.store;
      let storeId = store.id;
      if (!sucursales.has(storeId)) {
        sucursales.set(storeId, { ...store, users: [] });
      }
      sucursales.get(storeId).users.push(user);
    }
    try {
      const resp = await indpi.getCalculateClassUser(user);
      if (resp.error) {
        console.log(resp);
      } else {
        user.class = resp;
      }
      index++
      $q.loading.show({
        message: `Progreso: ${index}/${totalUsers} (${((index / totalUsers) * 100).toFixed(2)}%)`
      });


      await sleep(500);
    } catch (error) {
      console.error("Error al obtener la clasificación:", error);
    }
  }

  $q.loading.hide()
  let sucursalesArray = [...sucursales.values()];
  excel.generateExcel(sucursalesArray, week.value);
};

init()
</script>

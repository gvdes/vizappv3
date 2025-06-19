<template>
  <q-page padding>
    <div class="q-pa-sm row items-center text-center text-h6">
      <q-input v-model="search" type="text" label="Buscar"> <template v-slot:prepend><q-icon
            name="search" /></template></q-input>
      <div class="col anek-bld text-grey-9 q-pl-sm">Usuarios</div>
      <div>
        <q-btn flat rounded icon="autorenew" @click="init" />
      </div>
    </div>

    <div class="q-pa-md row items-start q-gutter-s">
      <div v-for="(use, index) in users" :key="index">
        <q-list>
          <q-item clickable v-ripple @click="editUser(use)">
            <q-item-section>
              <q-card flat class="mycard" bordered
                :style="`width: 250px; max-width: 230vw; height: 400px; border: 2px solid ${color(use)};`">
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
                    <div class="col"> {{ use.store.name }} </div>
                  </div>
                  <q-separator spaced inset vertical dark />
                  <div class="row">
                    <div class="col">Area:</div>
                    <div class="col">{{ use.rol.area.name }}</div>
                  </div>
                  <q-separator spaced inset vertical dark />
                  <div class="row">
                    <div class="col">Puesto:</div>
                    <div class="col"> {{ use.rol.name }}</div>
                  </div>
                  <q-separator spaced inset vertical dark />
                  <div class="flex justify-center" v-if="use.avatar">
                    <q-avatar size="170px"> <q-img :src="`${vizmedia}/profiles/${use.id}/${use.avatar}`" /> </q-avatar>
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


    <q-dialog v-model="viewUser.state" persistent>

      <q-card class="my-card">
        <q-card-section>
          <div class="flex justify-center">

            <q-avatar size="170px"> <q-img :src="`${vizmedia}/profiles/${viewUser.val.id}/${viewUser.val.avatar}`" />
            </q-avatar>
          </div>
        </q-card-section>

        <q-card-section>
          <q-tabs v-model="tab" class="text-primary">
            <q-tab name="user" icon="person" label="Usuario" />
            <q-tab name="assist" icon="alarm" label="Asistencia" />
            <q-tab name="sanctions" icon="bolt" label="Sanciones" />
          </q-tabs>
        </q-card-section>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="user">
            <q-card-section>
              <div class="text-h6 text-center">{{ viewUser.val.name.toUpperCase() + ' ' +
                viewUser.val.surnames.toUpperCase() }}
              </div>
              <div class="flex justify-center">
                <q-badge color="primary">
                  {{ viewUser.val.nick }}
                </q-badge>
              </div>
            </q-card-section>
          </q-tab-panel>
          <q-tab-panel name="assist">
            <div class="text-h6 text-center">Asistencias</div>
            <q-card-section>
              <div class="row">
                <q-input class="col" v-model="range.min" type="number" label="Min" filled />
                <q-separator spaced inset vertical dark />
                <q-input class="col" v-model="range.max" type="number" label="Max" filled />
                <q-separator spaced inset vertical dark />
                <q-btn color="primary" flat icon="send" @click="getReportFilter" />
              </div>
            </q-card-section>
            <q-card-section>
              <q-list bordered>
                <q-item clickable v-ripple>
                  <q-item-section>
                    <q-item-label class="text-center text-bold">Retardos</q-item-label>
                    <q-item-label class="text-center text-caption">{{report.reduce((a, v) => a + Number(v.RETARDOS), 0)
                    }}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-center text-bold">FALTAS</q-item-label>
                    <q-item-label class="text-center text-caption">{{report.reduce((a, v) => a + Number(v.FALTAS), 0)
                    }}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-center text-bold">VACACIONES</q-item-label>
                    <q-item-label class="text-center text-caption">{{report.reduce((a, v) => a + Number(v.VACACIONES),
                      0)
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-section>
              <q-table title="Asistencias" :rows="report" :columns="table.columns" row-key="ID" flat bordered
                :separator="'cell'" dense>
                <template v-slot:top>
                  <q-separator spaced inset vertical dark />
                  <div class="row items-center">
                    <q-btn @click="exportTable" color="primary" icon="cloud_download" :disable="report.length == 0"
                      flat />
                    <div class="col">Reporte de Asistencias</div>
                  </div>
                  <q-space />
                </template>
              </q-table>
            </q-card-section>
          </q-tab-panel>
          <q-tab-panel name="sanctions">
            <q-card-section>
              <q-table title="Sanciones" :rows="viewUser.val.sanctions" dense :columns="tableCol.columnsSan" />
              <q-separator spaced inset vertical dark />
              <q-table title="Actas" :rows="viewUser.val.proceeding" dense :columns="tableCol.columnsPro" />
              <q-separator spaced inset vertical dark />
              <q-table title="Cartas Compromiso" :rows="viewUser.val.commitment" dense :columns="tableCol.columnCom"  />
            </q-card-section>
          </q-tab-panel>
        </q-tab-panels>

        <q-card-actions align="center">
          <q-btn flat color="negative" icon="close" v-close-popup />
          <q-btn color="primary" label="Resetear Contrasena" rounded @click="resetPass" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAccountStore } from 'stores/Account';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import listuser from 'src/components/Users/Index/UserList.vue';
import { vizmedia } from 'boot/axios'
import rhpi from 'src/API/RhApi';
import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import uapi from 'src/API/UserApi';
const piniaAccount = useAccountStore();
const $q = useQuasar();
const $router = useRouter();

const usuarios = ref([]);
const date = new Date();
const search = ref('');
const tab = ref('user')
const viewUser = ref({
  state: false,
  val: null
})
const semanas = ref([]);
const anio = ref({
  val: null,
  opts: [],
});
const range = ref({
  min: 0,
  max: 0,
})
const report = ref([])

const table = ref({
  columns: [
    { name: 'week', label: 'SEMANA', field: r => r.semana, sortable: true, align: 'center' },
    { name: 'device', label: 'DISPOSITIVO', field: r => r.DISPOSITIVO, sortable: true, align: 'center' },
    { name: 'turn', label: 'TURNO', field: r => r.TURNO, sortable: true, align: 'center' },
    { name: 'sabado', label: 'SABADO', field: r => r.SABADO, sortable: true, align: 'center' },
    { name: 'domingo', label: 'DOMINGO', field: r => r.DOMINGO, sortable: true, align: 'center' },
    { name: 'lunes', label: 'LUNES', field: r => r.LUNES, sortable: true, align: 'center' },
    { name: 'martes', label: 'MARTES', field: r => r.MARTES, sortable: true, align: 'center' },
    { name: 'miercoles', label: 'MIERCOLES', field: r => r.MIERCOLES, sortable: true, align: 'center' },
    { name: 'jueves', label: 'JUEVES', field: r => r.JUEVES, sortable: true, align: 'center' },
    { name: 'viernes', label: 'VIERNES', field: r => r.VIERNES, sortable: true, align: 'center' },
  ]
})

const tableCol = ref({
  columnsPro:[
    {name:'id',label:'ID',field: r=> r.id, align: 'center'},
    {name:'created_at',label:'FECHA',field: r=>  dayjs(r.created_at).format('YYYY-MM-DD'), align: 'left'},
    {name:'reason',label:'OBSERVACION',field: r=> r.reason, align: 'left'},
  ],
    columnCom:[
    {name:'id',label:'ID',field: r=> r.id, align: 'center'},
    {name:'created_at',label:'FECHA',field: r=> dayjs(r.created_at).format('YYYY-MM-DD'), align: 'left'},
    {name:'reason',label:'OBSERVACION',field: r=> r.reason , align: 'left'},
  ],
    columnsSan:[
    {name:'id',label:'ID',field: r=> r.id, align: 'center'},
    {name:'created_at',label:'FECHA',field: r=> dayjs(r.created_at).format('YYYY-MM-DD'), align: 'left'},
    {name:'reason',label:'MOTIVO',field: r=>  r.sanction.name, align: 'left'},
    {name:'observation',label:'OBSERVACION',field: r=>  r.observation, align: 'left'},
    {name:'mount',label:'MONTO',field: r=>  r.mount, align: 'left'},


  ]
})


const users = computed(() => usuarios.value.filter(e => (e.name + e.surnames).toLowerCase().includes(search.value.toLowerCase())))

const permissions = piniaAccount.account.modules.filter(e => e._module === 'a08h')
console.log(permissions)

const init = async () => {
  $q.loading.show({ message: "Cargando Usuarios..." });
  const resp = await uapi.getUserForStore();
  if (resp.error) {

    console.log(resp)
    if (resp.error.status == 405) {
      $router.push('/')
      $q.notify({ message: 'No tienes acceso a esta pagina', type: 'negative', position: 'center' })
    }
  } else {
    usuarios.value = resp.usuarios
    console.log(resp.usuarios)
    $q.loading.hide();
  }
};


const color = (e) => {
  if (e._state == 1) {
    return '#00337C' // azul
  } else if (e._state == 2) {
    return '#03C988' // verde
  } else if (e._state == 3) {
    return '#E3651D' //naranja
  } else if (e._state == 4) {
    return '#B80000' // rojo
  } else if (e._state == 5) {
    return '#711DB0' // morado
  } else {
    return '#22092C' //negro default
  }
}

const editUser = (user) => {
  viewUser.value.state = true
  viewUser.value.val = user
  console.log(user)
  getReport()
}




const resetPass = async () => {
  $q.loading.show({ message: "Reseteando Contrasena de  Usuario..." });
  console.log(viewUser.value.val.id)
  const resp = await uapi.changePass(viewUser.value.val.id);
  if (resp.error) {
    console.log(resp);
  } else {
    console.log(resp)
    $q.notify({ message: resp, type: 'positive', position: 'center' })
    $q.loading.hide();
  }
}


const getReport = async () => {
  $q.loading.show({ message: 'Obteniendo Reporte' })
  const resp = await rhpi.getReportUserWeek({ user: viewUser.value.val.RC_id });
  console.log(viewUser.value.val.RC_id)
  if (resp.error) {
    console.log(resp)
    if (resp.error.status == 405) {
      $router.push('/')
      $q.notify({ message: 'No tienes acceso a esta pagina', type: 'negative', position: 'center' })
    }
  } else {
    console.log(resp)
    semanas.value = resp.fechas;
    let semAct = semanas.value.find(e => e.fecha == dayjs(date).format('YYYY-MM-DD'));
    anio.value.opts = [...new Set(semanas.value.map(item => item.anio))];
    range.value.min = semAct.week
    range.value.max = semAct.week
    anio.value.val = semAct.anio
    report.value = resp.report;
    $q.loading.hide();
  }
}


const getReportFilter = async () => {
  $q.loading.show({ message: 'Obteniendo Datos' })
  report.value = [];

  let data = {
    anio: anio.value.val,
    min: range.value.min,
    max: range.value.max,
    user: viewUser.value.val.RC_id
  }
  const resp = await rhpi.getReportUserWeekFilt(data)
  if (resp.error) {
    console.log(resp)
  } else {
    console.log(resp);
    report.value = resp
    $q.loading.hide();
  }
}

const exportTable = () => {
  const workbook = new ExcelJS.Workbook();
  const targetColumns = ['H', 'I', 'J', 'K', 'L', 'M', 'N'];

  const worksheet = workbook.addWorksheet(`Reporte`);
  worksheet.addRow(Object.keys(report.value[0]).map(i => i));
  report.value.forEach((row) => {
    worksheet.addRow([
      row.ANIO,
      row.semana,
      row.ID,
      row.NOMBRE,
      row.SUCURSAL,
      row.DISPOSITIVO,
      row.TURNO,
      row.SABADO,
      row.DOMINGO,
      row.LUNES,
      row.MARTES,
      row.MIERCOLES,
      row.JUEVES,
      row.VIERNES,
      Number(row.FALTAS),
      Number(row.RETARDOS),
      Number(row.VACACIONES)
    ])
  })


  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      const colLetter = worksheet.getColumn(colNumber).letter;
      if (targetColumns.includes(colLetter)) {
        if (cell.value == 'FALTA' || cell.value == 'string' && cell.value.includes('-0%')) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCCCC' } };
          cell.font = { color: { argb: 'FF990000' } };
        } else if (typeof cell.value == 'string' && cell.value.includes('-50%')) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFCC' } };
          cell.font = { color: { argb: 'FF999900' } };
        } else if (typeof cell.value == 'string' && cell.value.includes(' R')) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
          cell.font = { color: { argb: 'FFCC0000' } };
        } else if (typeof cell.value == 'string' && cell.value.includes('-100%')) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCFF' } };
          cell.font = { color: { argb: 'FF000099' } };
        } else if (cell.value == 'DESCANSO') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFCC' } };
          cell.font = { color: { argb: 'FF999900' } };
        }

        const regex = /\(([^)]+)\)/; // Expresión regular para encontrar texto entre paréntesis
        const match = typeof cell.value === 'string' ? cell.value.match(regex) : null;

        if (match) {
          // Añadir el texto entre paréntesis como comentario de la celda
          cell.note = match[1].trim(); // Usa trim() para eliminar espacios alrededor
          // Eliminar el texto entre paréntesis del valor de la celda
          cell.value = cell.value.replace(regex, '').trim() // trim() también aquí para limpiar
        }
      }
    });

  });
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength < 10 ? 10 : maxLength; // Ajusta el ancho mínimo y máximo
  });





  const downloadExcel = async () => {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  downloadExcel();
}


init()



</script>

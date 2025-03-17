<template>
  <q-page padding>
    <q-btn flat rounded icon="arrow_back" @click="$router.push('/cluster/manpower')" />
    <q-option-group v-model="devices.val" inline class="q-mb-md" :options="devices.opts" />


    <q-table title="Asistencias" :rows="mosconfil" row-key="ID" flat bordered :separator="'cell'" dense :filter="filter"
      no-data-label="No hay nada Aun">
      <template v-slot:top>

        <q-separator spaced inset vertical dark />
        <div class="row items-center">
          <q-btn @click="exportTable" color="primary" icon="cloud_download" :disable="mosconfil.length == 0" flat />
          <div class="col">Reporte de Asistencias</div>
        </div>
        <q-space />

        <q-input borderless dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn flat icon="event" color="primary">
          <q-menu fit>
            <q-card class="my-card">
              <q-card-section>
                <q-date v-model="mosDate" landscape minimal mask="YYYY-MM-DD" disable />
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <q-input class="col" v-model="range.min" type="number" label="Min" filled />
                  <q-separator spaced inset vertical dark />
                  <q-input class="col" v-model="range.max" type="number" label="Max" filled />
                  <q-separator spaced inset vertical dark />
                  <q-select v-model="anio.val" :options="anio.opts" label="Ano" filled />
                </div>
                <q-range :min="0" :max="53" v-model="range" :step="1" color="primary" disable  />
              </q-card-section>
              <q-card-actions  align="center">
                <q-btn flat label="Obtener" @click="getReportFilter" />
              </q-card-actions>
            </q-card>
          </q-menu>


        </q-btn>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import rhpi from 'src/API/RhApi';
import { useAccountStore } from 'stores/Account';
import ExcelJS from 'exceljs';
import dayjs from 'dayjs';
const $q = useQuasar();
const $router = useRouter();

const date = new Date();
const devices = ref({
  val: 'TODOS',
  opts: []
})
const semanas = ref([]);
const anio = ref({
  val:null,
  opts:[],
});
const range = ref({
  min: 0,
  max: 0
})

const report = ref([])
const filter = ref('');

const mosconfil = computed(() => {
  if (devices.value.val == 'TODOS') {
    return report.value
  } else {
    return report.value.filter((e) => {
      return e.DISPOSITIVO == devices.value.val
    })
  }
})

const mosDate  = computed(() => {
  let simon = semanas.value.filter(e => e.week >= range.value.min && e.week <= range.value.max  && e.anio == anio.value.val);
  console.log(simon)
  let init = 0;
  let ultm = simon.length -1;
  return {from:simon[init]?.fecha, to:simon[ultm]?.fecha}
})

const init = async () => {
  const resp = await rhpi.getReportWeek();
  if (resp.error) {
    console.log(resp)
    if (resp.error.status == 405) {
      $router.push('/')
      $q.notify({ message: 'No tienes acceso a esta pagina', type: 'negative', position: 'center' })
    }
  } else {
    console.log(resp)
    devices.value.opts = resp.devices.map(e => { return { value: e.nick_name, label: e.nick_name } })
    devices.value.opts.push({ label: 'TODOS', value: 'TODOS' })
    semanas.value = resp.fechas;
    let semAct = semanas.value.find(e => e.fecha == dayjs(date).format('YYYY-MM-DD'));
    anio.value.opts = [...new Set(semanas.value.map(item => item.anio))];
    range.value.min = semAct.week
    range.value.max = semAct.week
    anio.value.val = semAct.anio
    report.value = resp.report;
  }
}




const exportTable = () => {
  const workbook = new ExcelJS.Workbook();
  const targetColumns = ['H', 'I', 'J', 'K', 'L', 'M', 'N'];

  const worksheet = workbook.addWorksheet(`Reporte`);
  worksheet.addRow(Object.keys(mosconfil.value[0]).map(i => i));
  mosconfil.value.forEach((row) => {
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

const getReportFilter = async () => {
  $q.loading.show({message:'Obteniendo Datos'})
  report.value = [];

  let data = {
    anio:anio.value.val,
    min:range.value.min,
    max:range.value.max
  }
  const resp = await rhpi.getFiltReport(data)
  if(resp.error){
    console.log(resp)
  }else{
    console.log(resp);
    report.value = resp
    $q.loading.hide();
  }
}


init();
</script>

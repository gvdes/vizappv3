<template>
  <q-page padding>
    <div class="bg-white">
      <div class="q-pa-sm row items-center text-center text-h6">
        <q-btn flat rounded icon="arrow_back" />
        <div class="col anek-bld text-grey-9 q-pl-sm">Calculo Nomina</div>
        <div>
          <q-btn flat rounded icon="autorenew" @click="() => { init(); roster = [] }" title="Iniciar de nuevo" />
          <q-btn flat rounded icon="download" @click="exportTable" title="Descargar Archivo" :disabled="roster.length == 0" />
          <q-btn flat rounded icon="publish" @click="clickFile" title="Importar Archivo" :disabled="report.length == 0 || roster.length > 0" />
        </div>
      </div>
    </div>
    <div v-if="report.length > 0" class="q-mr-xl  text-center text-h6">
      Reporte Listo ({{ report.length }})
    </div>
    <q-separator spaced inset vertical dark />
    <input type="file" ref="inputFile" id="inputFile" @input="readFile" hidden accept=".xlsx,.xls" />
    <q-separator spaced inset vertical dark />
    <q-table :rows="roster" :columns="table.columns" />



  </q-page>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import rhpi from 'src/API/RhApi';
import { useAccountStore } from 'stores/Account';
const $q = useQuasar();
const $router = useRouter();
import ExcelJS from 'exceljs';
import indpi from 'src/API/IndicatorApi.js';
import dayjs from 'dayjs';

const staffs = ref([]);
const devices = ref({
  val: 'TODOS',
  opts: []
})
const report = ref([]);
const roster = ref([]);

const table = ref({
  columns: [
    { name: 'year', label: 'AÑO', field: r => r.anio, align: 'left' },
    { name: 'week', label: '#', field: r => r.semana, align: 'center' },
    { name: 'id', label: 'ID', field: r => r.id, align: 'center' },
    { name: 'name', label: 'NOMBRE', field: r => r.nombre, align: 'left' },
    { name: 'store', label: 'SUCURSAL', field: r => r.sucursal, align: 'center' },
    { name: 'device', label: 'DISPOSITIVO', field: r => r.device, align: 'left' },
    { name: 'absence', label: 'FALTAS', field: r => Number(r.faltasSem), align: 'center' },
    { name: 'retardment', label: 'RETARDOS', field: r => Number(r.retardosSem), align: 'center' },
    { name: 'vacation', label: 'VACACIONES', field: r => Number(r.vacacionesSem), align: 'center' },
    { name: 'descount', label: 'DESCUENTO', field: r => Number(r.descuentoExtra), align: 'center' },
    { name: 'faltas', label: 'T FALTAS', field: r => Number(r.descuentoFaltas), align: 'center' },
    { name: 'perception', label: 'T PERCEPCIONES', field: r => Number(r.totalPercepciones), align: 'center' },
    { name: 'deduccion', label: 'T DEDUCCIONES', field: r => Number(r.totalDeducciones), align: 'center' },
    { name: 'imss', label: 'IMSS', field: r => Number(r.imss), align: 'center' },
    { name: 'prestamo', label: 'PRESTAMO', field: r => Number(r.prestamo), align: 'center' },
    { name: 'neto', label: 'T NETO', field: r => Number(r.neto), align: 'center' },
  ]
})

const inputFile = ref(null)

const init = async () => {
  $q.loading.show({ message: 'Obteniendo Reporte' })
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
    report.value = resp.report;
    $q.loading.hide();
  }
}

const clickFile = () => {
  inputFile.value.click()
}

const readFile = () => {
  $q.loading.show({ message: 'Calculando' });
  const inputFile = document.getElementById("inputFile").files[0];
  let workbook = new ExcelJS.Workbook();

  workbook.xlsx.load(inputFile).then((workbook) => {
    const worksheet = workbook.worksheets[0];
    const headers = [];
    const excelData = {};

    worksheet.getRow(1).eachCell((cell, colNumber) => {
      headers.push(cell.value);
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const rowValues = row.values.slice(1)
      const rowObj = {};
      headers.forEach((header, i) => {
        rowObj[header] = rowValues[i] ?? 0;
      });

      const id = Number(rowObj["id"]);
      if (id) {
        excelData[id] = rowObj;
      }
    });

    const enrichedReport = report.value.map((r) => {
      const id = Number(r.ID);
      const excelRow = excelData[id];

      if (!excelRow) {
        const sueldo = 2500;
        const bono = 0;
        const incPagar = 0;
        const vacaciones = 0;
        const lentes = 0;
        const prestamo = 0;
        const imss = 0;
        const incDescontar = 0;
        const uniforme = 0;
        const pension = 0;
        const descuentoExtra = Number(r.SANCIONES) + Number((r.RETARDOS * 100));
        const faltas = Number(r.FALTAS || 0);
        const descuentoFaltas = parseFloat((sueldo / 7) * faltas).toFixed(2);
        const totalPercepciones = sueldo + bono + incPagar + vacaciones;
        const totalDeducciones = lentes + prestamo + imss + incDescontar + uniforme + pension + descuentoExtra + Number(descuentoFaltas);
        const neto = totalPercepciones - totalDeducciones;
        const anio = r.ANIO;
        const semana = r.semana;
        const nombre = r.NOMBRE;
        const sucursal = r.SUCURSAL;
        const faltasSem = faltas;
        const retardosSem = Number(r.RETARDOS);
        const vacacionesSem = Number(r.VACACIONES);
        const device =r.DISPOSITIVO;

        return {
          anio,
          semana,
          id,
          nombre,
          sucursal,
          device,
          faltasSem,
          retardosSem,
          vacacionesSem,
          descuentoExtra,
          descuentoFaltas,
          totalPercepciones,
          totalDeducciones,
          imss,
          prestamo,
          neto
        };


      } else {
        const sueldo = Number(String(excelRow["Sueldo"]).replace(/[^0-9.-]+/g, "") || 0);
        const bono = Number(String(excelRow["Bono"]).replace(/[^0-9.-]+/g, "") || 0);
        const vacaciones = Number(String(excelRow["VACACIONES"]).replace(/[^0-9.-]+/g, "") || 0);
        const incPagar = Number(String(excelRow["INCIDENCIAS X PAGAR"]).replace(/[^0-9.-]+/g, "") || 0);
        const lentes = Number(String(excelRow["Lentes"]).replace(/[^0-9.-]+/g, "") || 0);
        const prestamo = Number(String(excelRow["Prestamo"]).replace(/[^0-9.-]+/g, "") || 0);
        const imss = Number(String(excelRow["IMSS"]).replace(/[^0-9.-]+/g, "") || 0);
        const incDescontar = Number(String(excelRow["INCIDENCIAS X DESCONTAR"]).replace(/[^0-9.-]+/g, "") || 0);
        const uniforme = Number(String(excelRow["UNIFORME"]).replace(/[^0-9.-]+/g, "") || 0);
        const pension = Number(String(excelRow["PENSION"]).replace(/[^0-9.-]+/g, "") || 0);
        const descuentoExtra = Number(r.SANCIONES) + Number((r.RETARDOS * 100))
        const faltas = Number(r.FALTAS || 0);
        const descuentoFaltas = parseFloat((sueldo / 7) * faltas).toFixed(2);
        const totalPercepciones = sueldo + bono + incPagar + vacaciones;
        const totalDeducciones = lentes + prestamo + imss + incDescontar + uniforme + pension + descuentoExtra + Number(descuentoFaltas);
        const neto = totalPercepciones - totalDeducciones;
        const anio = r.ANIO;
        const semana = r.semana;
        // const idChecador = r.ID;
        const nombre = r.NOMBRE;
        const sucursal = r.SUCURSAL;
        const faltasSem = Number(r.FALTAS);
        const retardosSem = Number(r.RETARDOS);
        const vacacionesSem = Number(r.VACACIONES);
        const device = r.DISPOSITIVO;
        return {
          anio,
          semana,
          id,
          nombre,
          sucursal,
          device,
          faltasSem,
          retardosSem,
          vacacionesSem,
          descuentoExtra,
          descuentoFaltas,
          totalPercepciones,
          totalDeducciones,
          imss,
          prestamo,
          neto
        };
      }
    });
    console.log(enrichedReport);
    roster.value = enrichedReport;
    $q.loading.hide();
  });
}


const exportTable = () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`Reporte`);
  const keys = Object.keys(roster.value[0]).map(i => i)
  const columns = keys.map((key, index) => {
  const isLast = index === keys.length - 1;
  return {
    name: key.toUpperCase(),
    filterButton: true,
    totalsRowFunction: isLast ? 'sum' : undefined
  };
});
    worksheet.addTable({
    name: `Report_Nomina`,
    ref: 'A1',
    headerRow: true,
    totalsRow: true,
    style: { showRowStripes: true },
    columns: columns,
    rows: roster.value.map(row => keys.map(k => row[k]))
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
    a.download = `ReporteNomina.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  downloadExcel();
}




init();
</script>

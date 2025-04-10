import ExcelJS from 'exceljs';
import indpi from 'src/API/IndicatorApi.js';
import dayjs from 'dayjs';
import { vizmedia } from 'boot/axios';
import { mapStores } from 'pinia';

const generateExcel = async (data, classifications) => {
  console.log(data);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(data.nick);

  worksheet.addRow([`Nombre`, `${data.name} ${data.surnames}`]);
  worksheet.addRow([`Ult. Actualizacion`, `${dayjs(data.classification.updated_at).format('DD/MM/YYYY HH:mm:ss')}`]);
  worksheet.addRow([`Clasificacion`, `${data.classification.classification.name}`]);
  worksheet.addRow([`Sucursal`, `${data.classification.store.store.name}`]);
  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow(["Semana", "clasificacion", "porcentage", "puntos Asistencia", "Puntos Checklist"]);

  let returnTable = 6

  const maps = Object.entries(data.class).map(([semana, info]) => {
    return {
      Semana: semana,
      Clasificacion: classifications.find(e => e.id == info.classification).name,
      Porcentage: info.percentage,
      PuntosAsistencia: info.puntosAsistencia,
      PuntosChecklist: info.puntosChecklist,
      Faltas: info.asistencia.FALTAS,
      Retardos: info.asistencia.RETARDOS,
      Vacaciones: info.asistencia.VACACIONES,
      Turno: info.asistencia.TURNO,
      Sabado: info.asistencia.SABADO,
      Domingo: info.asistencia.DOMINGO,
      Lunes: info.asistencia.LUNES,
      Martes: info.asistencia.MARTES,
      Miercoles: info.asistencia.MIERCOLES,
      Jueves: info.asistencia.JUEVES,
      Viernes: info.asistencia.VIERNES,
    }
  })
  let responses = []
  Object.entries(data.class).forEach(([semana, info]) => {
    if (info.responses.length > 0) {
      info.responses.forEach(e => {
        let i = {
          semana: semana,
          Respuesta: e.response,
          Formulario: e.form,
          Pregunta: e.question,
          PuntosRet: e._retained,
          Respuesta: e.text,
          Calificacion: e.qualified,
          Fecha_hora: e.fecha_hora,
          Obervacion: e.observacion,
        }
        responses.push(i)
      })
    }
  })

  if (responses.length > 0) {
    worksheet.addTable({
      name: 'observaciones',
      ref: `A${returnTable}`,
      headerRow: true,
      style: { showRowStripes: true },
      columns: Object.keys(responses[0]).map(key => ({ name: key, filterButton: true })),
      rows: responses.map(row => Object.values(row))
    });

    returnTable = 8 + responses.length;
  }

  worksheet.addTable({
    name: 'Reporte',
    ref: `A${returnTable}`,
    headerRow: true,
    style: { showRowStripes: true },
    columns: Object.keys(maps[0]).map(key => ({ name: key, filterButton: true })),
    rows: maps.map(row => Object.values(row))
  });
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength < 10 ? 10 : maxLength;
  });

  await downloadExcel(workbook, `ReporteClasificacion${data.nick}`);
};


const downloadExcel = async (workbook, name) => {
  try {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error('Error al escribir el buffer:', err);
  }
};

export default { generateExcel };

import ExcelJS from 'exceljs';
import indpi from 'src/API/IndicatorApi.js';
import dayjs from 'dayjs';
import { vizmedia } from 'boot/axios';

const generateExcel = async (data, week) => {

  const workbook = new ExcelJS.Workbook();
  const firstDate = week?.[0]?.fecha || '';
  const lastDate = week?.[week.length - 1]?.fecha || firstDate;
  const semanaActual = week?.[0]?.week || '';

  data.forEach((sucursal) => {
    const worksheet = workbook.addWorksheet(sucursal.store.name);
    worksheet.addRow([`SUCURSAL: ${sucursal.store.name}`]);
    worksheet.addRow([`Clasificación: ${sucursal.clasification.name}`]);
    worksheet.addRow([`Semana -- Del ${firstDate} al ${lastDate}`]);
    worksheet.addRow([`Semana Actual: ${semanaActual}`]);
    worksheet.addRow([]);
    worksheet.addRow(["Esta hoja, así como la hoja de las firmas deben de regresarse el mismo día en su corte."]);

    worksheet.addTable({
      name: `Bonos_${sucursal.store.name}`,
      ref: 'A8',
      headerRow: true,
      totalsRow: true,
      style: { showRowStripes: true },
      columns: [
        { name: 'Nombre', filterButton: true },
        { name: 'Clasificacion', filterButton: true },
        { name: 'Bono Semana', filterButton: true, totalsRowFunction: 'sum' },
        { name: '%', filterButton: true },
        { name: 'PA', filterButton: true },
        { name: 'PC', filterButton: true },
      ],
      rows: sucursal.users.map(row => [
        `${row.name} ${row.surnames}`,
        row.classification?.classification?.name || 'Sin clasificación',
        (row.classification?.classification?.percentage / 100) * (row.classification?.import / 2) || 0,
        row.class?.percentage || 0,
        row.class?.puntosAsistencia || 0,
        row.class?.puntosChecklist || 0
      ])
    });

    let obs = sucursal.users.flatMap(row => {
      if (row.class?.responses?.length > 0) {
        return row.class.responses.map(obs => [
          `${row.name} ${row.surnames}`,
          obs.form || 'Sin Formulario',
          obs.fecha_hora || 'Fecha no disponible',
          obs.observacion || "-",
          obs.qualified || "-"
        ]);
      }
      return [];
    });

    if (obs.length > 0) {
      worksheet.addTable({
        name: `Observaciones_${sucursal.store.name}`,
        ref: 'H8',
        headerRow: true,
        style: { showRowStripes: true },
        columns: [
          { name: 'Nombre', filterButton: true },
          { name: 'Formulario', filterButton: true },
          { name: 'Fecha', filterButton: true },
          { name: 'Observacion', filterButton: true },
          { name: 'Calificacion', filterButton: true },
        ],
        rows: obs
      });
    }

    if (sucursal.users.length > 0) {
      const startRow = 9;
      const endRow = startRow + sucursal.users.length;

      for (let i = startRow; i <= endRow; i++) {
        worksheet.getCell(`C${i}`).numFmt = '"$"#,##0.00';
      }
    }
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

  });


  await downloadExcel(workbook, 'Respuestas Formulario');
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

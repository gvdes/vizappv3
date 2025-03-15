import ExcelJS from 'exceljs';
import indpi from 'src/API/IndicatorApi.js';
import dayjs from 'dayjs';
import { vizmedia } from 'boot/axios';

const generateExcel = async (data) => {

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Usuarios');

  worksheet.addTable({
    name: `Report_Users`,
    ref: 'A1',
    headerRow: true,
    totalsRow: true,
    style: { showRowStripes: true },
    columns: [
      { name: 'Nombre', filterButton: true },
      { name: 'Sucursal', filterButton: true, totalsRowFunction: 'count' },
      { name: 'Area', filterButton: true },
      { name: 'PUESTO', filterButton: true },
    ],
    rows: data.map(row => [
      `${row.name} ${row.surnames}`,
      row.store.name,
      row.rol.area.name,
      row.rol.name
    ])
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
  await downloadExcel(workbook, 'Reporte Usuarios');
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

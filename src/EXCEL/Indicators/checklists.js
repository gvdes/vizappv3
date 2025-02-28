import ExcelJS from 'exceljs';
import indpi from 'src/API/IndicatorApi.js';
import dayjs from 'dayjs';
import { vizmedia } from 'boot/axios';

const excel = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const promises = data.map((e, i) => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const resp = await indpi.viewResponseForm(e.id);
          if (resp.error) {
            console.log(resp);
          } else {
            console.log(resp);
            const response = resp.responses;
            const users = resp.usuarios;
            const sheetName = `${i}-${e.store.name}`.replace(/[/\\?*:[\]]/g, '_');
            const worksheet = workbook.addWorksheet(sheetName);
            // const worksheet = workbook.addWorksheet(`${i}-${e.store.name}`);

            const nameChecklist = worksheet.addRow([response.form.name]);
            worksheet.mergeCells(`A${nameChecklist.number}:B${nameChecklist.number}`);
            nameChecklist.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
            nameChecklist.getCell(1).font = { bold: true };

            // Aplicar estilos a los encabezados
            const headerRow = worksheet.addRow(['Preguntas', 'Respuestas']);
            headerRow.eachCell((cell) => {
              cell.font = { bold: true };
              cell.alignment = { horizontal: 'center', vertical: 'middle' };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } };
            });

            // Agregar respuestas
            worksheet.addRow(['CREACION DE EL REGISTRO', dayjs(response.created_at).format('DD/MM/YYYY HH:mm:ss')]);
            worksheet.addRow(['QUIEN CREO EL REGISTRO', `${response.user.name} ${response.user.surnames}`]);
            worksheet.addRow(['SUCURSAL', response.store.name]);
            worksheet.addRow([
              'GERENTE',
              users.filter(e =>
                e._store == response.store.id &&
                e.rol.hierarchy == 1 &&
                e.rol.type_rol == 2 &&
                (e.rol.area.id == 2 || e.rol.area.id == 3)
              ).map(i => `${i.name} ${i.surnames}`)[0]
            ]);

            response.responses.forEach(e => {
              if (e.question._type == 1 || e.question._type == 2) { // Texto u opciones
                worksheet.addRow([e.question.question, e.text]);
                if (JSON.parse(JSON.parse(e.condition))?.length > 0) {
                  let conditions = JSON.parse(JSON.parse(e.condition));
                  conditions.forEach(condition => {
                    worksheet.addRow(['', condition.question, hasObjectResponse(condition.response) ? 'QUE NO CUMPLIÓ' : '']);
                    let row;
                    if (Array.isArray(condition.response)) {
                      condition.response.forEach(c => {
                        console.log(typeof c)
                        if (typeof c === 'object') {
                          row = worksheet.addRow(['', getUserName(c.col, users), c.qualified]);
                        } else if (typeof c === 'number') {
                          row = worksheet.addRow(['', getUserName(c, users)]);
                        }
                        // row = worksheet.addRow(['', getUserName(c.col, users), c.qualified]);
                      });
                    } else {
                      row = worksheet.addRow(['', condition.response]);
                    }
                    const cell = worksheet.getCell(row.number, 2);
                    cell.font = { color: { argb: 'FF0000' }, bold: true }; // Texto rojo y negrita
                  });
                }
              } else if (e.question._type == 3) { // Evidencias
                if (e.text) {
                  let res = e.files?.map(fil => `${vizmedia}/${fil}`);
                  res.forEach((url, index) => {
                    let row;
                    if (index == 0) row = worksheet.addRow([e.question.question]);
                    row = worksheet.addRow(['']);
                    const cell = worksheet.getCell(row.number, 2);
                    cell.value = { text: `Imagen ${index + 1}`, hyperlink: url };
                    cell.font = { color: { argb: '0000FF' } }; // Azul para hipervínculo
                  });
                }
              } else if (e.question._type == 4) { // Colaborador
                if (Array.isArray(JSON.parse(e.text))) {
                  JSON.parse(e.text).forEach(el => {
                    if (typeof el === 'object') {
                      worksheet.addRow([e.question.question, getUserName(el, users), el.qualified]);
                    } else if (typeof el === 'number') {
                      worksheet.addRow([e.question.question, getUserName(el, users)]);
                    }
                  });
                } else {
                  e.text;
                }
              }
            });

            // Total de puntos
            let total_puntos = response.responses.reduce((sum, res) => {
              const selectedOption = res.question.options.find(e => e.id === res._option);
              return sum + (selectedOption?._correct === 1 ? res.question._points || 0 : 0);
            }, 0);

            const cel = worksheet.addRow(['Total Puntos', total_puntos]);
            const cell = worksheet.getCell(cel.number, 2);
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };

            // Ajustar automáticamente las columnas
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
          }
        } catch (error) {
          console.error('Error al obtener la respuesta:', error);
        }
        resolve();
      }, i * 1000);
    });
  });

  await Promise.all(promises);
  await downloadExcel(workbook, 'Respuestas Formulario');
};

const downloadExcel = async (workbook, name) => {
  const buffer = await workbook.xlsx.writeBuffer().catch(err => {
    console.error('Error al escribir el buffer:', err);
    return null;
  });
  if (!buffer) return;
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const getUserName = (userId, users) => {
  const user = users.find(e => e.id === userId);
  return user ? `${user.name} ${user.surnames}` : '';
};

const hasObjectResponse = (response) => {
  return Array.isArray(response) && response.some(respon => typeof respon === 'object');
};

export default { excel };

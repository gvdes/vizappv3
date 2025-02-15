import jsPDF from 'jspdf'
import autoTable from "jspdf-autotable";

const firmasPdf = async (data, week) => {
  data.forEach(branch => {
    branch.users.sort((a, b) => {
      const classA = a.classification.classification.name;
      const classB = b.classification.classification.name;
      return classA.localeCompare(classB);
    });
  });
  const fecha = new Date(week[0].fecha);
  const mes = fecha.toLocaleString("es-ES", { month: "long" });
  console.log(mes.toUpperCase())


  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 10;
  const titleFontSize = 20;
  const headerFontSize = 12;

  data.forEach((sucursal, index) => {
    if (index > 0) doc.addPage();
    let chunks = [];
    const arreglo = sucursal.users.map(user => [user.name + " " + user.surnames, "___________________________________"])
    const paginas = Math.ceil(arreglo.length / 29);
    for (var i = 0; i < arreglo.length; i += 29) {
      chunks.push(arreglo.slice(i, i + 29));
    }
    chunks.forEach(function (chunk, index) {
      if (index > 0) {
        doc.addPage();
      }
      doc.setFontSize(8);
      doc.text(`Pagina ${index + 1} de ${paginas}`, 5, 5, 'left')
      doc.setFontSize(titleFontSize);
      doc.setFont("helvetica", "bold");
      doc.setTextColor('1D2B53');
      doc.text(`${sucursal.store.name}  Clasificación ${sucursal.clasification.name}`, margin, 25);
      doc.setTextColor('D84040');
      doc.text(`${mes.toUpperCase()} SEMANA ${week[0].week}`, pageWidth / 2, 10, { align: "left" });
      doc.setFont("helvetica", "normal");
      doc.setTextColor('1D1616');
      doc.setFontSize(headerFontSize);
      doc.text("Recibí el 50% de mi bono de acuerdo con la clasificación de mi desempeño", margin, 35);
      autoTable(doc, {
        startY: 40,
        head: [["NOMBRE", "FIRMA"]],
        body: chunk,
        styles: { fontSize: 10, cellPadding: 2 },
        theme: 'plain',
      });
    })
  });

  doc.save("FirmasBonos.pdf");

}

const BonsPdf = async (data, week) => {
  data.forEach(branch => {
    branch.users.sort((a, b) => {
      const classA = a.classification.classification.name;
      const classB = b.classification.classification.name;
      return classA.localeCompare(classB);
    });
  });

  const fecha = new Date(week[0].fecha);
  const mes = fecha.toLocaleString("es-ES", { month: "long" });
  console.log(mes.toUpperCase())

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 10;
  const titleFontSize = 15;
  const headerFontSize = 10;

  data.forEach((sucursal, index) => {

    if (index > 0) doc.addPage();
    let chunks = [];
    const arreglo = sucursal.users.map(user => [user.name + " " + user.surnames, user.classification.classification.name, (user.classification.classification.percentage / 100) * (user.classification.import / 2), 'observaciones'])
    const paginas = Math.ceil(arreglo.length / 27);
    for (var i = 0; i < arreglo.length; i += 27) {
      chunks.push(arreglo.slice(i, i + 27));
    }
    chunks.forEach(function (chunk, index) {
      const totalBono = chunk.reduce((sum, row) => sum + parseFloat(row[2] || 0), 0);
      if (index > 0) {
        doc.addPage();
      }
      doc.setFontSize(8);
      doc.text(`Pagina ${index + 1} de ${paginas}`, 5, 5, 'left')
      doc.setFontSize(titleFontSize);
      doc.setFont("helvetica", "bold");
      doc.setTextColor('1D2B53');
      doc.text(`SUCURSAL ${sucursal.store.name}  Clasificación ${sucursal.clasification.name}`, margin, 25);
      doc.text("INFORMACIÓN EXCLUSIVA DEL GERENTE", pageWidth / 2, 10, { align: "center" });
      doc.setFontSize(headerFontSize);
      doc.setFont("helvetica", "bold");
      doc.setTextColor('D84040');
      doc.text(`Semana -- Del ${week[0].fecha} al ${week[5].fecha} `, margin, 30);
      doc.text(`Semana Actual ${week[0].week}`, margin, 35);
      doc.setTextColor('1D1616');

      doc.text("Esta hoja, asi como la hoja de las firmas deben de regresarse el mismo dia en su corte.", margin, 40);
      doc.setFont("helvetica", "normal");
      autoTable(doc, {
        startY: 45,
        head: [["NOMBRE", "CLASIFICACION", 'BONO SEMANA', 'OBSERVACIONES']],
        body: [...chunk.map(row => [
            { content: row[0], styles: { halign: 'left' } },
            { content: row[1], styles: { halign: 'center' } },
            { content: `$ ${row[2]}`, styles: { halign: 'center' } },
            row[3]
          ]),
          [
            { content: "TOTAL", styles: { halign: "right", fontStyle: "bold" }, colSpan: 2 },
            { content: `$ ${totalBono.toFixed(2)}`, styles: { halign: "center", fontStyle: "bold", } }
          ]
        ],
        styles: { fontSize: 10, cellPadding: 2 },
        theme: 'plain',
      });
    })
  });

  doc.save("Bonos.pdf");
}
export default { firmasPdf, BonsPdf };

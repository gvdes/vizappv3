import jsPDF from 'jspdf'
import dayjs from 'dayjs';


const pdf = async (data) => {
  console.log(data)
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("CARTA COMPROMISO", 105, 15, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.addImage('icons/tipelog.png', 'PNG', 3, 3, 40, 20);
  doc.setGState(new doc.GState({ opacity: 0.2 }));
  doc.addImage('icons/tipelog.png', "PNG", 20, 100, 170, 100, "", "FAST");
  doc.setGState(new doc.GState({ opacity: 1 }));

  let y = 30;
  doc.setFontSize(10);
  let header = `En la Ciudad de México, siendo las ${dayjs(data.created_at).format('HH:mm:ss')} horas del día ${dayjs(data.created_at).format('YYYY-MM-DD')}, estando en las instalaciones de ` +
    `Grupo Vizcarra, y ante la presencia del area de Recursos Humanos, representada por ${data.created_by.name.toUpperCase()} ${data.created_by.surnames.toUpperCase()} ` +
    `quien firman el alcance del presente documento, se procede a levantar la presente Carta Compormiso a ` +
    `${data.staff.gender == 'M' ? 'la' : 'el'} ${data.staff.gender == 'M' ? 'colaboradora' : 'colaborador'} ${data.staff.name.toUpperCase()} ${data.staff.surnames.toUpperCase()} quien ocupa el puesto de ${data.staff.rol.name}` +
    ` Dicho documento ha sido emitido para expresar la preocupación por : `
  doc.text(header, 10, y, { maxWidth: 180 });
  y += doc.splitTextToSize(header, 180).length * 4;
  y += 5;
  doc.setFontSize(9);
  doc.text(data.reason.toUpperCase(), 10, y, { maxWidth: 180 });
  y += doc.splitTextToSize(data.reason, 180).length * 4;
  y += 15;
  const staffName = `${data.staff.name.toUpperCase()} ${data.staff.surnames.toUpperCase()}`;
  const createdBy = `${data.created_by.name.toUpperCase()} ${data.created_by.surnames.toUpperCase()}`;
  const widthStaff = doc.getTextWidth(staffName);
  const widthCreated = doc.getTextWidth(createdBy);
  doc.line(10, y, 10 + widthStaff, y);
  doc.line(110, y, 110 + widthCreated, y);
  y += 5;
  doc.text(staffName, 10, y);
  doc.text(createdBy, 110, y);
  y += 15;
  const manager = `${data.manager.name.toUpperCase()} ${data.manager.surnames.toUpperCase()}`;
  const admin = `${data.admin.name.toUpperCase()} ${data.admin.surnames.toUpperCase()}`;
  const widthManager = doc.getTextWidth(manager);
  const widthAdmin = doc.getTextWidth(admin);
  doc.line(10, y, 10 + widthManager, y);
  doc.line(110, y, 110 + widthAdmin, y);
  y += 5;
  doc.text(manager, 10, y);
  doc.text(admin, 110, y);
  doc.save(`cartaCompromiso${data.staff.name}.pdf`);
}


export default { pdf }

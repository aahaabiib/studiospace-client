export async function downloadInvoice(b) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  const start = new Date(b.startTime);
  const end = new Date(b.endTime);
  const date = start.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const time = (d) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const invoiceNo = `SS-${String(b._id).slice(-6).toUpperCase()}`;

  doc.setFillColor(124, 58, 237);
  doc.rect(0, 0, 210, 32, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('StudioSpace', 14, 20);
  doc.setFontSize(11);
  doc.text('Booking Invoice', 150, 20);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.text(`Invoice no: ${invoiceNo}`, 14, 48);
  doc.text(`Status: ${b.status}`, 14, 55);
  doc.text(`Billed to: ${b.userName || ''}`, 14, 62);
  doc.text(`Email: ${b.userEmail || ''}`, 14, 69);

  doc.setDrawColor(203, 213, 225);
  doc.line(14, 78, 196, 78);

  doc.setFontSize(13);
  doc.text('Booking details', 14, 88);
  doc.setFontSize(11);
  doc.text(`Studio: ${b.studioTitle}`, 14, 98);
  doc.text(`Location: ${b.studioLocation || '-'}`, 14, 105);
  doc.text(`Date: ${date}`, 14, 112);
  doc.text(`Time: ${time(start)} - ${time(end)}`, 14, 119);
  doc.text(`Hourly rate: $${b.hourlyRate}`, 14, 126);
  doc.text(`Total hours: ${Number(b.totalHours).toFixed(1)}`, 14, 133);

  doc.line(14, 142, 196, 142);
  doc.setFontSize(15);
  doc.text(`Total: $${Number(b.totalPrice).toFixed(2)}`, 14, 154);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Thank you for booking with StudioSpace.', 14, 280);

  doc.save(`invoice-${invoiceNo}.pdf`);
}
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const printDocument = () => {
  const input = document.getElementById('pdf-div');
  if (!input) return;

  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    
    const imgWidth = 100;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    pdf.addImage(imgData, 'PNG', 50, position + 30, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 50, position + 30, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('score-card.pdf');
  });
};

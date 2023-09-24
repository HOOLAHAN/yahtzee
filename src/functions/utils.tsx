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

export const getButtonClass = (score: number) => score === 0
  ? "transition duration-300 ease-in-out transform py-2 px-4 rounded mb-2 mr-2 bg-green-200 text-white hover:bg-green-300 focus:ring focus:ring-green-100"
  : "transition duration-300 ease-in-out transform py-2 px-4 rounded mb-2 mr-2 bg-green-600 text-white hover:bg-green-700 focus:ring focus:ring-green-200";

export const getDieSize = (windowSize: number) => {
  if (windowSize < 640) return '3x';
  if (windowSize >= 640 && windowSize < 1024) return '4x';
  return '5x';
}
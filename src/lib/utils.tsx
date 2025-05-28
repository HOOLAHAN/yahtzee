import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const printDocument = (isTwoPlayer: boolean) => {
  const input = document.createElement('div');
  const player1ScoreCard = document.getElementById('pdf-div-player1');
  const player2ScoreCard = document.getElementById('pdf-div-player2');

  if (!player1ScoreCard) return;

  // Clone and append the player 1 scorecard to the input div
  const player1Clone = player1ScoreCard.cloneNode(true);
  input.appendChild(player1Clone);

  // If in two-player mode, clone and append the player 2 scorecard to the input div
  if (isTwoPlayer && player2ScoreCard) {
    const player2Clone = player2ScoreCard.cloneNode(true);
    input.appendChild(player2Clone);
  }

  // Temporarily append the input div to the body
  document.body.appendChild(input);

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

    // Remove the input div from the body
    document.body.removeChild(input);

    pdf.save('score-card.pdf');
  }).catch((error) => {
    console.error('Error generating PDF:', error);
    document.body.removeChild(input);
  });
};


export const getButtonClass = (score: number) => {
  if (score > 0) {
    return 'px-3 py-2 rounded-md font-semibold text-deepBlack bg-neonYellow shadow-[0_0_10px_#faff00] hover:brightness-110 transition duration-300 ease-in-out transform hover:scale-105';
  } else {
    return 'px-3 py-2 rounded-md font-semibold text-white bg-red-600 shadow-md hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105';
  }
};

export const getDieSize = (windowSize: number) => {
  if (windowSize < 640) return '3x';
  if (windowSize >= 640 && windowSize < 1024) return '4x';
  return '5x';
}
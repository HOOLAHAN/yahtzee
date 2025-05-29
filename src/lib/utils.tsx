import html2canvas from 'html2canvas';

export const shareScorecard = async (isTwoPlayer: boolean) => {
  const player1ScoreCard = document.getElementById('pdf-div-player1');
  const player2ScoreCard = document.getElementById('pdf-div-player2');

  if (!player1ScoreCard) return;

  const wrapper = document.createElement('div');
  const p1Clone = player1ScoreCard.cloneNode(true);
  wrapper.appendChild(p1Clone);

  if (isTwoPlayer && player2ScoreCard) {
    const p2Clone = player2ScoreCard.cloneNode(true);
    wrapper.appendChild(p2Clone);
  }

  wrapper.style.position = 'fixed';
  wrapper.style.top = '0';
  wrapper.style.left = '0';
  wrapper.style.zIndex = '-9999';
  document.body.appendChild(wrapper);

  try {
    const canvas = await html2canvas(wrapper);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));

    document.body.removeChild(wrapper);

    if (!blob) {
      alert("⚠️ Could not generate image.");
      return;
    }

    const file = new File([blob], "scorecard.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: "Check out my Yahtzee score!",
        files: [file],
      });
    } else {
      // fallback: open the image or copy to clipboard
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  } catch (err) {
    console.error("❌ Sharing failed", err);
    document.body.removeChild(wrapper);
  }
};


export const getButtonClass = (score: number) => {
  if (score > 0) {
    return 'px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md font-semibold text-deepBlack bg-neonYellow shadow-[0_0_10px_#faff00] hover:brightness-110 transition duration-300 ease-in-out transform hover:scale-105';
  } else {
    return 'px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base rounded-md font-semibold text-white bg-electricPink shadow-md hover:bg-red-700 scale-75 transition duration-300 ease-in-out transform hover:scale-105';
  }
};

export const getDieSize = (windowSize: number): '2x' | '3x' | '4x' | '5x' => {
  if (windowSize < 400) return '2x';
  if (windowSize >= 400 && windowSize < 640) return '3x';
  if (windowSize >= 640 && windowSize < 1024) return '4x';
  return '5x';
};
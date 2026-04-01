function stopTimer(idInterval) {
  clearInterval(idInterval);
}

function toSecond(timeInMillis) {
  const second = timeInMillis / 1000;
  return second;
}

let heureDepart;
let chrono;
let tempsEcoule = 0;

export function hiddenModalChrono() {
  const modalSart = document.getElementById("modalStart");

  if (!modalSart) return;

  modalSart.classList.add("hidden");

  if (chrono) stopTimer(chrono);

  heureDepart = Date.now();

  chrono = setInterval(() => {
    tempsEcoule = Date.now() - heureDepart;
  }, 10);
}

export function handleAnswer() {
  stopTimer(chrono);
  return toSecond(tempsEcoule);
}

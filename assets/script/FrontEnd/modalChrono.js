function stopTimer(idInterval) {
  clearInterval(idInterval);
}

function toSecond(timeInMillis) {
  const second = Math.floor(timeInMillis / 1000);
  const millisecond = timeInMillis % 1000;
  console.log(`${second} sec et ${millisecond} millisec`);
}

let heureDepart;
let chrono;
let tempsEcoule = 0;

export function initModal() {
  const modal = document.getElementById("modalStart");

  if (!modal) return;

  modal.classList.add("hidden");

  if (chrono) stopTimer(chrono);

  heureDepart = Date.now();

  chrono = setInterval(() => {
    tempsEcoule = Date.now() - heureDepart;
  }, 10);
}

export function handleAnswer() {
  stopTimer(chrono);
  toSecond(tempsEcoule);
}

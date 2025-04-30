const BONUS_INTERVAL = 600; // 10 minutes
const BONUS_AMOUNT = 5;
let countdownInterval = null;
import { syncCredits } from './credit.js';

export function startBonusCredits(updateCreditsCallback) {
  // Récupère l'heure du dernier bonus ou initialise à maintenant
  let lastBonusTime = parseInt(localStorage.getItem('lastBonusTime'), 10);
  if (isNaN(lastBonusTime)) {
    lastBonusTime = Date.now();
    localStorage.setItem('lastBonusTime', lastBonusTime);
  }

  function update() {
    const now = Date.now();
    const secondsSinceLastBonus = Math.floor((now - lastBonusTime) / 1000);
    let timeLeft = BONUS_INTERVAL - secondsSinceLastBonus;

    if (timeLeft <= 0) {
        const current = parseInt(localStorage.getItem('roulette_credits') || '100', 10);
        const updated = current + BONUS_AMOUNT;
        localStorage.setItem('roulette_credits', updated);
        syncCredits();
        showFloatingBonus(`+${BONUS_AMOUNT}€ bonus !`);
      
        // Redémarre le timer
        lastBonusTime = now;
        localStorage.setItem('lastBonusTime', lastBonusTime);
        timeLeft = BONUS_INTERVAL;
      }

    updateBonusDisplay(timeLeft);
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

function updateBonusDisplay(seconds) {
  const timerDiv = document.getElementById('bonus-timer');
  if (!timerDiv) return;

  const min = Math.floor(seconds / 60).toString().padStart(2, '0');
  const sec = (seconds % 60).toString().padStart(2, '0');
  timerDiv.textContent = `Bonus dans : ${min}:${sec}`;
}

function showFloatingBonus(text) {
  const div = document.createElement('div');
  div.textContent = text;
  div.style.position = 'absolute';
  div.style.top = '80%';
  div.style.left = '50%';
  div.style.transform = 'translate(-50%, -50%)';
  div.style.fontSize = '24px';
  div.style.color = '#4caf50';
  div.style.fontWeight = 'bold';
  div.style.zIndex = '9999';
  document.body.appendChild(div);

  setTimeout(() => div.remove(), 3000);
}
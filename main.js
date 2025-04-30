import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.8/+esm';
import { createScene } from './scene.js';
import { createWheel } from './wheel.js';
import { ball, startSpin, updateBall } from './ball.js';
import { spendCredits, addCredits, updateCreditsDisplay } from './credit.js';
import { startBonusCredits } from './bonus.js';

const token = localStorage.getItem('jwt');
if (!token) window.location.href = 'login.html';

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('jwt');
      window.location.href = 'login.html';
    });
  }
});

updateCreditsDisplay();
startBonusCredits(updateCreditsDisplay);

const canvas = document.getElementById('roulette-canvas');
const { scene, camera, renderer } = createScene(canvas);
const wheel = createWheel();
scene.add(wheel);
scene.add(ball);

// Animation
function animate() {
  requestAnimationFrame(animate);
  updateBall();
  renderer.render(scene, camera);
}
animate();

async function fetchHighScores() {
  try {
    const token = localStorage.getItem('jwt');
    if (!token) throw new Error('JWT manquant');

    const globalRes = await fetch('https://localhost/custom-api/games/highscore', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!globalRes.ok) {
      throw new Error('Erreur lors de la récupération du meilleur score mondial');
    }

    const global = await globalRes.json();

    document.getElementById('worldRecord').textContent = `🏆 Meilleur score mondial : ${global.globalHighScore} jetons`;

  } catch (err) {
    console.error('Erreur lors de la récupération des scores :', err);
  }
}

fetchHighScores();


// Lancer un jeu
document.getElementById('play').addEventListener('click', async () => {
  const playButton = document.getElementById('play');
  playButton.disabled = true;
  playButton.textContent = 'En cours...';

  const betAmount = parseInt(document.getElementById('betAmount').value);
  const betType = document.getElementById('betType').value;
  const betOn = document.getElementById('betOn').value;
  const specificNumber = document.getElementById('specificNumber').value;

  let finalBet = betOn;
  if (betType === 'number') {
    if (specificNumber === '' || specificNumber < 0 || specificNumber > 35) {
      alert('Veuillez entrer un numéro valide entre 0 et 35.');
      playButton.disabled = false;
      playButton.textContent = 'Jouer';
      return;
    }
    finalBet = specificNumber;
  }

  if (!spendCredits(betAmount)) {
    alert("Pas assez de crédits !");
    playButton.disabled = false;
    playButton.textContent = 'Jouer';
    return;
  }

  const payload = {
    betAmount,
    betType,
    betOn: finalBet,
  };

  if (betType === 'number') {
    payload.specificNumber = parseInt(finalBet);
  }

  try {
    const res = await axios.post('https://localhost/api/play', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { result, gain, hasWon, number } = res.data;
    startSpin(number);

    const resultMap = {
      red: 'Rouge',
      black: 'Noir',
      green: 'Vert'
    };
    const translatedResult = resultMap[result] || result;

    const label = (betType === 'number') ? `Numéro ${finalBet}` :
                  betType === 'even' ? 'Pair' :
                  betType === 'odd' ? 'Impair' :
                  betType === 'range_1_12' ? '1 à 12' :
                  betType === 'range_13_24' ? '13 à 24' :
                  betType === 'range_25_36' ? '25 à 36' :
                  resultMap[betOn] || betOn;

    setTimeout(() => {
      const resultElement = document.getElementById('result');
      resultElement.innerHTML =
        `Résultat : <b>${number}</b> (${translatedResult}) | Pari : <b>${label}</b> | ${hasWon ? 'Gagné' : 'Perdu'} | Gain : <b>${gain}€</b>`;
      resultElement.style.color = hasWon ? 'green' : 'red';
      if (hasWon) addCredits(gain);
      
      fetchHighScores();
      playButton.disabled = false;
      playButton.textContent = 'Jouer';
    }, 1000);

  } catch (err) {
    alert('Erreur : ' + (err.response?.data?.message || err.message));
    playButton.disabled = false;
    playButton.textContent = 'Jouer';
  }
});

// Initialisation des crédits avec LocalStorage
let credits = parseInt(localStorage.getItem('roulette_credits')) || 100;

// Créer l'affichage
const creditsDisplay = document.createElement('div');
creditsDisplay.id = 'credits';
creditsDisplay.style.position = 'absolute';
creditsDisplay.style.top = '10px';
creditsDisplay.style.left = '10px';
creditsDisplay.style.padding = '10px';
creditsDisplay.style.backgroundColor = '#222';
creditsDisplay.style.color = '#fff';
creditsDisplay.style.fontFamily = 'Arial';
creditsDisplay.style.fontSize = '16px';
creditsDisplay.style.borderRadius = '5px';
creditsDisplay.style.zIndex = '10';
creditsDisplay.innerText = `Crédits : ${credits} €`;
document.body.appendChild(creditsDisplay);

// Met à jour l'affichage et sauvegarde
function updateCreditsDisplay() {
  creditsDisplay.innerText = `Crédits : ${credits} €`;
  localStorage.setItem('roulette_credits', credits);
}

// Déduit les crédits (retourne false si pas assez)
export function spendCredits(amount) {
  if (amount > credits) return false;
  credits -= amount;
  updateCreditsDisplay();
  return true;
}

// Ajoute des crédits
export function addCredits(amount) {
  credits += amount;
  updateCreditsDisplay();
}

// Récupère le solde actuel
export function getCredits() {
  return credits;
}

// Réinitialise
export function resetCredits() {
  credits = 100;
  updateCreditsDisplay();
}

export { updateCreditsDisplay };

// Forcer la resynchro des crédits depuis le localStorage
export function syncCredits() {
    credits = parseInt(localStorage.getItem('roulette_credits') || '100', 10);
    updateCreditsDisplay();
  }
  
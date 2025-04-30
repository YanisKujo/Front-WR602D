import axios from 'axios';

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const message = document.getElementById('message');

  try {
    const response = await axios.post('https://localhost/api/login', {
      email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json'
      }
    });

    const { token } = response.data;
    localStorage.setItem('jwt', token);
    message.textContent = '✅ Connecté avec succès ! Redirection...';

    // Rediriger vers le jeu
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  } catch (error) {
    message.textContent = '❌ Email ou mot de passe incorrect';
    console.error(error);
  }
});
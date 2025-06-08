import './style.css';
import router from './routes/router.js';
import StoryApi from './models/StoryApi.js';

// Fungsi untuk memperbarui navigasi sesuai status login
function updateNavMenu() {
  const isLoggedIn = StoryApi.isLoggedIn();

  const navLogin = document.getElementById('nav-login');
  const navRegister = document.getElementById('nav-register');
  const navAdd = document.getElementById('nav-add');
  const navLogout = document.getElementById('nav-logout');

  if (navLogin && navRegister && navAdd && navLogout) {
    navLogin.style.display = isLoggedIn ? 'none' : 'inline';
    navRegister.style.display = isLoggedIn ? 'none' : 'inline';
    navAdd.style.display = isLoggedIn ? 'inline' : 'none';
    navLogout.style.display = isLoggedIn ? 'inline' : 'none';
  }
}

// Event untuk logout
function setupLogoutButton() {
  const logoutButton = document.getElementById('nav-logout');
  if (logoutButton) {
    // Hapus event listener lama agar tidak double binding
    logoutButton.replaceWith(logoutButton.cloneNode(true));
    const newLogoutButton = document.getElementById('nav-logout');
    newLogoutButton.addEventListener('click', () => {
      StoryApi.logout();
      updateNavMenu();
      window.location.hash = '#/login';
    });
  }
}

// Event saat navigasi berubah atau halaman pertama kali dimuat
window.addEventListener('hashchange', () => {
  router();
  updateNavMenu();
  setupLogoutButton();
  console.log('URL berubah menjadi:', window.location.hash);
});

window.addEventListener('DOMContentLoaded', () => {
  router();
  updateNavMenu();
  setupLogoutButton();
  console.log('Halaman dimuat pertama kali.');
});

import StoryApi from '../models/StoryApi.js';

const RegisterPresenter = {
  init() {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        await StoryApi.register({ name, email, password });
        alert('Registrasi berhasil! Silakan login.');
        window.location.hash = '#/login';
      } catch (error) {
        alert('Gagal daftar: ' + error.message);
      }
    });
  }
};

export default RegisterPresenter;

import StoryApi from '../models/StoryApi.js';

const LoginPresenter = {
  init() {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const result = await StoryApi.login({ email, password });
        StoryApi.saveToken(result.token);
        alert('Login berhasil!');
        window.location.hash = '#/home'; // route home

        // ini akan trigger listener di main.js untuk update UI jika perlu
      } catch (error) {
        alert('Login gagal: ' + error.message);
      }
    });
  }
};

export default LoginPresenter;

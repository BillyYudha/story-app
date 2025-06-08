// src/scripts/presenters/LoginPresenter.js
import StoryApi from '../models/StoryApi.js';
import LoginView from '../views/LoginView.js'; // Import LoginView yang sudah direfaktor

const LoginPresenter = {
  _view: null, // Properti untuk menyimpan instance LoginView

  init(viewInstance) {
    this._view = viewInstance; // Menerima instance View dari router

    // Langkah 1: Inisialisasi elemen View
    this._view.initViewElements();

    // Langkah 2: Atur listener untuk submit form melalui View
    this._view.setLoginSubmitHandler(async (formData) => {
      try {
        const result = await StoryApi.login({ email: formData.email, password: formData.password });
        StoryApi.saveToken(result.token);
        this._view.displayMessage('Login berhasil!');
        window.location.hash = '#/home'; // Navigasi bisa tetap di sini atau di router
      } catch (error) {
        this._view.displayMessage('Login gagal: ' + error.message);
      }
    });
  },
};

export default LoginPresenter;
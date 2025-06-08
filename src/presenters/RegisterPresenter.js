// src/scripts/presenters/RegisterPresenter.js
import StoryApi from '../models/StoryApi.js';
import RegisterView from '../views/RegisterView.js'; // Import RegisterView yang sudah direfaktor

const RegisterPresenter = {
  _view: null, // Properti untuk menyimpan instance RegisterView

  init(viewInstance) {
    this._view = viewInstance; // Menerima instance View dari router

    // Langkah 1: Inisialisasi elemen View
    this._view.initViewElements();

    // Langkah 2: Atur listener untuk submit form melalui View
    this._view.setRegisterSubmitHandler(async (formData) => {
      try {
        await StoryApi.register({ name: formData.name, email: formData.email, password: formData.password });
        this._view.displayMessage('Registrasi berhasil! Silakan login.');
        window.location.hash = '#/login'; // Navigasi bisa tetap di sini atau di router
      } catch (error) {
        this._view.displayMessage('Gagal daftar: ' + error.message);
      }
    });
  },
};

export default RegisterPresenter;
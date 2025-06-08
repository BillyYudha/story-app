// src/scripts/views/RegisterView.js
class RegisterView {
  constructor(containerId) {
    this._container = document.getElementById(containerId);
    if (!this._container) {
        console.error(`Error: Element dengan ID '${containerId}' tidak ditemukan untuk RegisterView.`);
    }
  }

  getTemplate() {
    return `
      <main id="main">
        <h1>Daftar Akun</h1>
        <form id="register-form">
          <label for="name">Nama</label><br>
          <input type="text" id="name" name="name" required autocomplete="name" /><br><br>

          <label for="email">Email</label><br>
          <input type="email" id="email" name="email" required autocomplete="email" /><br><br>

          <label for="password">Password</label><br>
          <input type="password" id="password" name="password" required minlength="8" autocomplete="new-password" /><br><br>

          <button type="submit">Daftar</button>
        </form>
        <p>Sudah punya akun? <a href="#/login">Login di sini</a></p>
      </main>
    `;
  }

  // Metode untuk mendapatkan referensi DOM setelah template dirender
  initViewElements() {
    this._formElement = this._container.querySelector('#register-form');
    this._nameInput = this._container.querySelector('#name');
    this._emailInput = this._container.querySelector('#email');
    this._passwordInput = this._container.querySelector('#password');
  }

  getRegisterFormData() {
    return {
      name: this._nameInput?.value || '',
      email: this._emailInput?.value || '',
      password: this._passwordInput?.value || '',
    };
  }

  setRegisterSubmitHandler(callback) {
    if (this._formElement) {
      this._formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        callback(this.getRegisterFormData()); // Kirim data form kembali ke Presenter
      });
    }
  }

  displayMessage(message) {
    // Gunakan elemen UI kustom untuk pesan daripada alert()
    alert(message);
  }
}

export default RegisterView;
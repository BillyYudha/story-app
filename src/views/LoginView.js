// src/scripts/views/LoginView.js
class LoginView {
  constructor(containerId) {
    this._container = document.getElementById(containerId);
    if (!this._container) {
        console.error(`Error: Element dengan ID '${containerId}' tidak ditemukan untuk LoginView.`);
    }
  }

  getTemplate() {
    return `
      <main id="main">
        <h1>Masuk</h1>
        <form id="login-form">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required autocomplete="email" /><br>

          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required autocomplete="current-password" /><br>

          <button type="submit">Login</button>
        </form>
      </main>
    `;
  }

  // Metode untuk mendapatkan referensi DOM setelah template dirender
  initViewElements() {
    this._formElement = this._container.querySelector('#login-form');
    this._emailInput = this._container.querySelector('#email');
    this._passwordInput = this._container.querySelector('#password');
  }

  getLoginFormData() {
    return {
      email: this._emailInput?.value || '',
      password: this._passwordInput?.value || '',
    };
  }

  setLoginSubmitHandler(callback) {
    if (this._formElement) {
      this._formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        callback(this.getLoginFormData()); // Kirim data form kembali ke Presenter
      });
    }
  }

  displayMessage(message) {
    // Gunakan elemen UI kustom untuk pesan daripada alert()
    alert(message);
  }
}

export default LoginView;
const RegisterView = () => `
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

export default RegisterView;

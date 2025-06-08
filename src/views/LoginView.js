const LoginView = () => {
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
};

export default LoginView;

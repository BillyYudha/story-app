const BASE_URL = 'https://story-api.dicoding.dev/v1';

const StoryApi = {
  // Ambil semua story dengan lokasi
  async getStories() {
    const token = this.getToken();

    const response = await fetch(`${BASE_URL}/stories?location=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal mengambil story');

    return data.listStory;
  },

  // Login user
  async login({ email, password }) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal login');

    return data.loginResult;
  },

  // Register user
  async register({ name, email, password }) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal registrasi');

    return data;
  },

  // Tambah cerita baru (dengan foto dan lokasi)
  async addStory(formData) {
    const token = this.getToken();

    const response = await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Jangan set Content-Type agar FormData boundary otomatis ditambahkan
      },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal menambahkan cerita');

    return data;
  },

  // Simpan token ke localStorage
  saveToken(token) {
    localStorage.setItem('token', token);
  },

  // Ambil token dari localStorage
  getToken() {
    return localStorage.getItem('token');
  },

  // Cek apakah user sudah login
  isLoggedIn() {
    return !!localStorage.getItem('token');
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
  }
};

export default StoryApi;

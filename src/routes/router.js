// src/scripts/routes/router.js
import HomeView from '../views/HomeView.js';
import AddView from '../views/AddView.js';
import LoginView from '../views/LoginView.js';
import RegisterView from '../views/RegisterView.js';
import LoginPresenter from '../presenters/LoginPresenter.js';
import StoryApi from '../models/StoryApi.js';
import HomePresenter from '../presenters/HomePresenter.js';
import AddPresenter from '../presenters/AddPresenter.js';
import RegisterPresenter from '../presenters/RegisterPresenter.js';

const routes = {
  // Sekarang, 'view' adalah class View itu sendiri, bukan fungsi yang langsung mengembalikan string
  '#/home': { view: HomeView, presenter: HomePresenter },
  '#/add': { view: AddView, presenter: AddPresenter },
  '#/login': { view: LoginView, presenter: LoginPresenter },
  '#/register': { view: RegisterView, presenter: RegisterPresenter }
};

const protectedRoutes = ['#/add'];

const router = () => {
  const app = document.getElementById('app'); // Pastikan ada <div id="app"> di index.html Anda
  const hash = window.location.hash || '#/home';

  const route = routes[hash] || routes['#/home'];

  // Proteksi rute
  if (protectedRoutes.includes(hash) && !StoryApi.isLoggedIn()) {
    window.location.hash = '#/login';
    return;
  }

  const renderContent = () => {
    // 1. Buat instance dari class View yang sesuai
    // Kita meneruskan 'app.id' ke konstruktor View agar View bisa mencari elemen di dalam 'app'
    const viewInstance = new route.view(app.id);

    // 2. Render HTML template dari instance View ke dalam elemen 'app'
    app.innerHTML = viewInstance.getTemplate();

    // 3. Inisialisasi Presenter, dan teruskan instance View ke dalamnya.
    // Presenter akan bertanggung jawab memanggil viewInstance.initViewElements()
    // dan mengatur semua event listener serta interaksi UI lainnya.
    if (route.presenter) {
      route.presenter.init(viewInstance);
    }
  };

  // Gunakan View Transition API jika tersedia
  if (document.startViewTransition) {
    document.startViewTransition(renderContent);
  } else {
    renderContent();
  }
};

export default router;
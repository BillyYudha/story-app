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
  '#/home': { view: HomeView, presenter: HomePresenter },
  '#/add': { view: AddView, presenter: AddPresenter },
  '#/login': { view: LoginView, presenter: LoginPresenter },
  '#/register': { view: RegisterView, presenter: RegisterPresenter }
};

const protectedRoutes = ['#/add'];

const router = () => {
  const app = document.getElementById('app');
  const hash = window.location.hash || '#/home';

  const route = routes[hash] || routes['#/home'];

  // Proteksi rute
  if (protectedRoutes.includes(hash) && !StoryApi.isLoggedIn()) {
    window.location.hash = '#/login';
    return;
  }

  const render = () => {
    app.innerHTML = route.view();
    route.presenter?.init();
  };

  // Gunakan View Transition API jika tersedia
  if (document.startViewTransition) {
    document.startViewTransition(render);
  } else {
    render();
  }
};

export default router;

// src/scripts/presenters/HomePresenter.js
import StoryApi from '../models/StoryApi.js';
import HomeView from '../views/HomeView.js'; // Import HomeView yang sudah direfaktor

const HomePresenter = {
  _view: null, // Properti untuk menyimpan instance HomeView

  async init(viewInstance) {
    this._view = viewInstance; // Menerima instance View dari router

    // Langkah 1: Inisialisasi elemen View
    this._view.initViewElements();

    // Langkah 2: Ambil data cerita dari Model (StoryApi)
    try {
      const stories = await StoryApi.getStories();
      this._view.renderStories(stories); // Meminta View untuk merender daftar cerita

      // Langkah 3: Inisialisasi peta dan minta View untuk merender marker
      this._view.initStoryMap(0, 0, 2); // Atur tampilan awal peta (misalnya, pusat dunia)
      this._view.renderStoryMarkers(stories); // Meminta View untuk merender marker pada peta
    } catch (err) {
      this._view.displayStoryLoadError(err.message); // Meminta View untuk menampilkan pesan error
    }
  },
};

export default HomePresenter;
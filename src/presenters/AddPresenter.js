// src/scripts/presenters/AddPresenter.js
import StoryApi from '../models/StoryApi.js';
import AddView from '../views/AddView.js'; // Import AddView yang sudah direfaktor

const AddPresenter = {
  _view: null, // Properti untuk menyimpan instance AddView
  _currentMediaStream: null, // Untuk menyimpan referensi stream kamera agar bisa dihentikan

  async init(viewInstance) {
    this._view = viewInstance; // Menerima instance View dari router

    // Langkah 1: Inisialisasi elemen View dan event listener di View
    this._view.initViewElements();

    // Langkah 2: Atur listener untuk klik peta melalui View
    this._view.setMapClickListener((lat, lng) => {
      this._view.setLatLonInput(lat, lng);
      this._view.renderMarker(lat, lng, `Lokasi dipilih: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    });

    // Langkah 3: Inisialisasi kamera melalui View
    try {
      this._currentMediaStream = await this._view.initCameraStream(); // View akan mengembalikan stream
    } catch (err) {
      this._view.displayMessage('Tidak dapat mengakses kamera: ' + err.message);
    }

    // Langkah 4: Atur listener untuk tombol 'Ambil Foto' dan 'Ulangi Foto' melalui View
    this._view.setCaptureButtonHandler((dataUrl) => {
      this._view.displayPhotoPreview(dataUrl);
    });
    this._view.setRetakeButtonHandler(() => {
      this._view.resetPhotoPreview();
    });

    // Langkah 5: Atur listener untuk submit form melalui View
    this._view.setFormSubmitHandler(async (formData) => {
      if (!formData.photoData) {
        this._view.displayMessage('Silakan ambil foto terlebih dahulu.');
        return;
      }

      // Konversi data URL ke Blob (fungsi helper ini bisa di util/models)
      const blob = this._dataURLtoBlob(formData.photoData);
      const dataToSend = new FormData();
      dataToSend.append('description', formData.description);
      dataToSend.append('photo', blob, 'photo.png');
      if (formData.lat && formData.lon) {
        dataToSend.append('lat', formData.lat);
        dataToSend.append('lon', formData.lon);
      }

      try {
        await StoryApi.addStory(dataToSend);
        this._view.displayMessage('Cerita berhasil ditambahkan!');
        window.location.hash = '#/home'; // Navigasi bisa tetap di sini atau di router
      } catch (error) {
        this._view.displayMessage('Gagal menambahkan cerita: ' + error.message);
      }
    });

    // Menghentikan kamera saat meninggalkan halaman (idealnya diatur oleh router)
    window.addEventListener('hashchange', () => {
      // Hanya hentikan stream jika halaman saat ini BUKAN lagi halaman tambah
      if (window.location.hash !== '#/add' && this._currentMediaStream) {
        this._view.stopCameraStream(); // Meminta View untuk menghentikan stream
      }
    });
  },

  // Fungsi helper untuk konversi DataURL ke Blob (bisa dipindahkan ke utilities)
  _dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  },
};

export default AddPresenter;
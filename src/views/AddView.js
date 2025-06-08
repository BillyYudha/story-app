// src/scripts/views/AddView.js
import L from 'leaflet'; // Import Leaflet karena View yang akan menggunakannya

class AddView {
  constructor(containerId) {
    // Referensi ke elemen kontainer utama tempat view ini akan dirender
    this._container = document.getElementById(containerId);
    if (!this._container) {
      console.error(`Error: Element dengan ID '${containerId}' tidak ditemukan untuk AddView.`);
      // Jika elemen tidak ditemukan, mungkin Anda ingin melempar error atau menghentikan eksekusi
    }

    // Variabel internal untuk instance Leaflet Map dan Marker
    this._map = null;
    this._marker = null;
    this._mediaStream = null; // Stream kamera
  }

  // Metode untuk mendapatkan template HTML dari View
  getTemplate() {
    return `
      <main id="main" role="main" tabindex="-1">
        <h1>Tambah Cerita Baru</h1>
        <form id="story-form">
          <div>
            <label for="description">Deskripsi</label><br />
            <textarea id="description" name="description" required></textarea>
          </div>

          <div>
            <label>Ambil Foto dengan Kamera</label><br />
            <video id="video" width="320" height="240" autoplay playsinline></video><br />
            <button type="button" id="capture-btn">Ambil Foto</button>
            <button type="button" id="retake-btn" style="display: none;">Ulangi Foto</button><br />
            <canvas id="canvas" width="320" height="240" style="display: none;"></canvas>
            <img id="preview" src="" alt="Preview Foto" style="display: none; margin-top: 1rem; width: 100%; max-width: 320px;" />
            <input type="hidden" id="photo-data" name="photo-data" />
          </div>

          <div id="map" style="height: 300px; margin-top: 1rem;"></div>
          <input type="hidden" id="lat" name="lat" />
          <input type="hidden" id="lon" name="lon" />
          <button type="submit">Kirim</button>
        </form>
      </main>
    `;
  }

  // Metode ini akan dipanggil oleh Presenter setelah HTML dirender ke DOM.
  // Bertanggung jawab untuk mendapatkan referensi DOM dan menginisialisasi komponen
  initViewElements() {
    // Dapatkan referensi elemen DOM menggunakan this._container.querySelector
    // Ini memastikan kita mencari di dalam DOM yang relevan dengan view ini
    this._mapElement = this._container.querySelector('#map');
    this._latInput = this._container.querySelector('#lat');
    this._lonInput = this._container.querySelector('#lon');

    this._videoElement = this._container.querySelector('#video');
    this._canvasElement = this._container.querySelector('#canvas');
    this._captureButton = this._container.querySelector('#capture-btn');
    this._retakeButton = this._container.querySelector('#retake-btn');
    this._previewImage = this._container.querySelector('#preview');
    this._photoDataInput = this._container.querySelector('#photo-data');
    this._descriptionInput = this._container.querySelector('#description');
    this._formElement = this._container.querySelector('#story-form');

    // Inisialisasi Peta Leaflet
    if (this._mapElement) {
      this._map = L.map(this._mapElement).setView([-6.2, 106.8], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this._map);
    } else {
        console.warn("Elemen peta dengan ID 'map' tidak ditemukan. Fungsionalitas peta mungkin tidak bekerja.");
    }
  }

  // --- Metode untuk Peta ---
  setMapClickListener(callback) {
    if (this._map) {
      this._map.on('click', (e) => {
        callback(e.latlng.lat, e.latlng.lng); // Panggil callback dengan koordinat
      });
    }
  }

  renderMarker(lat, lon, popupText) {
    if (!this._map) return; // Pastikan peta sudah diinisialisasi
    if (this._marker) this._marker.remove(); // Hapus marker lama jika ada
    this._marker = L.marker([lat, lon]).addTo(this._map)
      .bindPopup(popupText)
      .openPopup();
  }

  setLatLonInput(lat, lon) {
    if (this._latInput) this._latInput.value = lat;
    if (this._lonInput) this._lonInput.value = lon;
  }

  // --- Metode untuk Kamera dan Preview ---
  async initCameraStream() {
    try {
      this._mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (this._videoElement) {
        this._videoElement.srcObject = this._mediaStream;
      }
      return this._mediaStream; // Mengembalikan stream
    } catch (err) {
      console.error('Error akses kamera:', err);
      throw err; // Lempar kembali error agar Presenter bisa menanganinya
    }
  }

  setCaptureButtonHandler(callback) {
    if (this._captureButton) {
      this._captureButton.addEventListener('click', () => {
        if (this._canvasElement && this._videoElement) {
          const context = this._canvasElement.getContext('2d');
          context.drawImage(this._videoElement, 0, 0, this._canvasElement.width, this._canvasElement.height);
          const dataUrl = this._canvasElement.toDataURL('image/png');
          callback(dataUrl); // Kirim dataUrl kembali ke Presenter
        }
      });
    }
  }

  displayPhotoPreview(dataUrl) {
    if (this._photoDataInput) this._photoDataInput.value = dataUrl;
    if (this._previewImage) this._previewImage.src = dataUrl;

    if (this._canvasElement) this._canvasElement.style.display = 'none';
    if (this._previewImage) this._previewImage.style.display = 'block';
    if (this._videoElement) this._videoElement.style.display = 'none';
    if (this._captureButton) this._captureButton.style.display = 'none';
    if (this._retakeButton) this._retakeButton.style.display = 'inline';
  }

  setRetakeButtonHandler(callback) {
    if (this._retakeButton) {
      this._retakeButton.addEventListener('click', () => {
        callback(); // Beri tahu Presenter
      });
    }
  }

  resetPhotoPreview() {
    if (this._previewImage) this._previewImage.style.display = 'none';
    if (this._previewImage) this._previewImage.src = '';
    if (this._photoDataInput) this._photoDataInput.value = '';

    if (this._videoElement) this._videoElement.style.display = 'block';
    if (this._captureButton) this._captureButton.style.display = 'inline';
    if (this._retakeButton) this._retakeButton.style.display = 'none';
  }

  stopCameraStream() {
    if (this._mediaStream) {
      this._mediaStream.getTracks().forEach(track => track.stop());
      this._mediaStream = null;
    }
  }

  // --- Metode untuk Form Submit ---
  getStoryFormData() {
    return {
      description: this._descriptionInput?.value || '',
      photoData: this._photoDataInput?.value || '',
      lat: this._latInput?.value || '',
      lon: this._lonInput?.value || '',
    };
  }

  setFormSubmitHandler(callback) {
    if (this._formElement) {
      this._formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        callback(this.getStoryFormData()); // Kirim data form kembali ke Presenter
      });
    }
  }

  // --- Metode untuk Feedback Pengguna (Alerts/Messages) ---
  displayMessage(message) {
    // Idealnya, Anda membuat elemen UI kustom untuk menampilkan pesan ini
    // daripada menggunakan alert() yang memblokir.
    alert(message);
  }
}

export default AddView;
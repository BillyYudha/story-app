import StoryApi from '../models/StoryApi.js';
import L from 'leaflet';

const AddPresenter = {
  init() {
    // Inisialisasi Peta
    const map = L.map('map').setView([-6.2, 106.8], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    let marker;
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      document.getElementById('lat').value = lat;
      document.getElementById('lon').value = lng;

      if (marker) marker.remove();
      marker = L.marker([lat, lng]).addTo(map)
        .bindPopup(`Lokasi dipilih: ${lat.toFixed(5)}, ${lng.toFixed(5)}`)
        .openPopup();
    });

    // Inisialisasi Kamera & Preview
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('capture-btn');
    const retakeBtn = document.getElementById('retake-btn');
    const previewImg = document.getElementById('preview');
    const photoDataInput = document.getElementById('photo-data');

    let mediaStream;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        mediaStream = stream;
        video.srcObject = stream;
      })
      .catch((err) => {
        alert('Tidak dapat mengakses kamera: ' + err.message);
      });

    captureBtn.addEventListener('click', () => {
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/png');
      photoDataInput.value = dataUrl;
      previewImg.src = dataUrl;

      // Tampilkan preview
      canvas.style.display = 'none';
      previewImg.style.display = 'block';
      video.style.display = 'none';
      captureBtn.style.display = 'none';
      retakeBtn.style.display = 'inline';
    });

    retakeBtn.addEventListener('click', () => {
      // Reset preview
      previewImg.style.display = 'none';
      previewImg.src = '';
      photoDataInput.value = '';

      video.style.display = 'block';
      captureBtn.style.display = 'inline';
      retakeBtn.style.display = 'none';
    });

    // Submit Form
    const form = document.getElementById('story-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const description = document.getElementById('description').value;
      const photoData = document.getElementById('photo-data').value;
      const lat = document.getElementById('lat').value;
      const lon = document.getElementById('lon').value;

      if (!photoData) {
        alert('Silakan ambil foto terlebih dahulu.');
        return;
      }

      const blob = dataURLtoBlob(photoData);
      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', blob, 'photo.png');
      if (lat && lon) {
        formData.append('lat', lat);
        formData.append('lon', lon);
      }

      try {
        await StoryApi.addStory(formData);
        alert('Cerita berhasil ditambahkan!');
        window.location.hash = '#/home';
      } catch (error) {
        alert('Gagal menambahkan cerita: ' + error.message);
      }
    });

    // Hentikan kamera saat keluar dari halaman (opsional)
    window.addEventListener('hashchange', () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    });
  }
};

// Konversi base64 ke Blob
function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}

export default AddPresenter;

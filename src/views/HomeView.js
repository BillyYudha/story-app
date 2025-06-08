// src/scripts/views/HomeView.js
import L from 'leaflet';

class HomeView {
  constructor(containerId) {
    this._container = document.getElementById(containerId);
    if (!this._container) {
        console.error(`Error: Element dengan ID '${containerId}' tidak ditemukan untuk HomeView.`);
    }
    this._map = null; // Instance peta Leaflet
  }

  getTemplate() {
    return `
      <main id="main">
        <h1>Daftar Cerita</h1>
        <div id="map-view" style="height: 300px; margin-bottom: 1rem;" aria-label="Peta lokasi cerita"></div>
        <div id="story-list">Memuat...</div>
      </main>
    `;
  }

  // Metode untuk mendapatkan referensi DOM setelah template dirender
  initViewElements() {
    this._storyListContainer = this._container.querySelector('#story-list');
    this._mapViewElement = this._container.querySelector('#map-view');
  }

  // --- Metode untuk Daftar Cerita ---
  renderStories(stories) {
    if (this._storyListContainer) {
      this._storyListContainer.innerHTML = stories.map((story) => `
        <article class="story-card">
          <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" />
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <time>${new Date(story.createdAt).toLocaleString()}</time>
        </article>
      `).join('');
    }
  }

  displayStoryLoadError(message) {
    if (this._storyListContainer) {
      this._storyListContainer.innerHTML = `<p style="color:red">Gagal memuat story: ${message}</p>`;
    }
  }

  // --- Metode untuk Peta Cerita ---
  initStoryMap(initialLat, initialLon, initialZoom) {
    if (this._mapViewElement) {
      this._map = L.map(this._mapViewElement).setView([initialLat, initialLon], initialZoom);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this._map);
    } else {
        console.warn("Elemen peta dengan ID 'map-view' tidak ditemukan. Fungsionalitas peta mungkin tidak bekerja.");
    }
  }

  renderStoryMarkers(stories) {
    if (!this._map) return; // Pastikan peta sudah diinisialisasi

    // Opsional: Hapus marker lama sebelum merender yang baru
    // Jika Anda ingin memastikan marker tidak duplikat saat update
    // this._map.eachLayer((layer) => {
    //   if (layer instanceof L.Marker) {
    //     this._map.removeLayer(layer);
    //   }
    // });

    const validMarkersCoords = [];
    stories.forEach((story) => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon])
          .addTo(this._map)
          .bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
        validMarkersCoords.push([story.lat, story.lon]);
      }
    });

    // Sesuaikan tampilan peta agar semua marker terlihat
    if (validMarkersCoords.length > 0) {
      const bounds = L.latLngBounds(validMarkersCoords);
      this._map.fitBounds(bounds);
    } else if (this._map) {
      // Jika tidak ada marker, atur tampilan default (misalnya, pusat dunia)
      this._map.setView([0, 0], 2);
    }
  }
}

export default HomeView;
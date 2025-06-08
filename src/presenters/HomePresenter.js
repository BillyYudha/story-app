import StoryApi from '../models/StoryApi.js';
import L from 'leaflet';

const HomePresenter = {
  async init() {
    const container = document.getElementById('story-list');
    try {
      const stories = await StoryApi.getStories();

      container.innerHTML = stories.map((story) => `
        <article class="story-card">
          <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" />
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <time>${new Date(story.createdAt).toLocaleString()}</time>
        </article>
      `).join('');

      // Peta
      const map = L.map('map-view').setView([0, 0], 2);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      stories.forEach((story) => {
        if (story.lat && story.lon) {
          L.marker([story.lat, story.lon])
            .addTo(map)
            .bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
        }
      });

    } catch (err) {
      container.innerHTML = `<p style="color:red">Gagal memuat story: ${err.message}</p>`;
    }
  }
};

export default HomePresenter;

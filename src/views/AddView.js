export default function AddView() {
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

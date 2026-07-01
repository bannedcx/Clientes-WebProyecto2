views.renderArtist = async (container, artistName) => {
    container.innerHTML = `
        <div style="margin-bottom: 2rem;">
            <button class="btn" onclick="window.history.back()" style="margin-bottom: 1rem;">⬅️ Volver</button> 
            <h2 id="artist-title" style="color: var(--accent-color);">Obras de: ${artistName}</h2>
            <p id="artist-bio" style="color: var(--text-secondary); max-width: 800px;"></p>
            <p id="artist-stats" style="font-weight: 600;"></p>
        </div>
        <div id="artist-gallery"></div>
        <div id="artist-pagination" style="display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 2rem; display: none;">
            <button id="btn-art-prev" class="btn">⬅️ Anterior</button>
            <span id="art-page-indicator">Página 1</span>
            <button id="btn-art-next" class="btn">Siguiente ➡️</button>
        </div>
    `;

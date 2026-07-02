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

    const ui = {
        gallery: document.getElementById('artist-gallery'),
        pagination: document.getElementById('artist-pagination'),
        bioText: document.getElementById('artist-bio'),
        statsText: document.getElementById('artist-stats'),
        btnPrev: document.getElementById('btn-art-prev'),
        btnNext: document.getElementById('btn-art-next'),
        pageInd: document.getElementById('art-page-indicator')
    };
    
    const myNavToken = window.appNavToken;
    let currentPage = 1;
    let objectIDs = [];
    let totalResults = 0;
    const ITEMS_PER_PAGE = 12;

    const renderPage = async () => {
        if (!document.getElementById('artist-gallery')) return; 
        
        ui.gallery.innerHTML = '<loading-state></loading-state>';
        ui.pagination.style.display = 'none';

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const pageIDs = objectIDs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        try {
            const batchSize = 4;
            let resultadosTotales = [];

            for (let i = 0; i < pageIDs.length; i += batchSize) {
                if (window.appNavToken !== myNavToken) return;
                const batch = pageIDs.slice(i, i + batchSize);
                const promises = batch.map(id => MetAPI.getObject(id));
                const results = await Promise.allSettled(promises);
                resultadosTotales.push(...results);
            }

            if (window.appNavToken !== myNavToken || !document.getElementById('artist-gallery')) return;

            const obras = resultadosTotales.filter(r => r.status === 'fulfilled').map(r => r.value);
            const obrasFallidas = resultadosTotales.filter(r => r.status === 'rejected').length;

            ui.gallery.innerHTML = '';
            const grid = document.createElement('div');
            grid.className = 'art-grid';
            
            obras.forEach(obra => {
                grid.appendChild(views.createArtCard(obra));
                // Rescata la biografía de la primera obra que la tenga
                if (obra.artistDisplayBio && ui.bioText.textContent === '') {
                    ui.bioText.textContent = obra.artistDisplayBio;
                }
            });

            if (obras.length === 0) {
                ui.gallery.innerHTML = '<p>Fallo general descargando las obras de esta página.</p>';
            } else {
                ui.gallery.appendChild(grid);
                if (obrasFallidas > 0) {
                    const failNote = document.createElement('p');
                    failNote.style.cssText = 'color: var(--text-secondary); font-size: 0.85rem; text-align: center; margin-top: 1rem;';
                    failNote.textContent = `Nota: ${obrasFallidas} obra(s) omitida(s) por inestabilidad de la API.`;
                    ui.gallery.appendChild(failNote);
                }
            }

            ui.pageInd.textContent = `Página ${currentPage} de ${Math.ceil(totalResults / ITEMS_PER_PAGE)}`;
            ui.btnPrev.disabled = currentPage === 1;
            ui.btnNext.disabled = startIndex + ITEMS_PER_PAGE >= totalResults;
            ui.pagination.style.display = 'flex';

        } catch (error) {
            if (window.appNavToken !== myNavToken) return;
            ui.gallery.innerHTML = '<error-state message="Error asíncrono dibujando las obras."></error-state>';
            const errorState = ui.gallery.querySelector('error-state');
            if (errorState) errorState.addEventListener('retry', renderPage); // Botón de Reintento
        }
    };

Views.renderHome = async (container) => {
    container.innerHTML = `
        <section class="hero" style="text-align: center; margin-bottom: 3rem; padding: 2rem 0; border-bottom: 1px solid var(--border-color);">
            <h1>Explora la colección del Met</h1>
            <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto;">Descubre más de 470,000 obras de arte que abarcan 5,000 años de cultura mundial, desde la prehistoria hasta el presente, directo desde Nueva York.</p>
        </section>
        
        <section class="stats" id="home-stats" style="display: flex; justify-content: center; gap: 3rem; margin-bottom: 3rem;"></section>

        <section class="gallery">
            <h2>Obras Destacadas</h2>
            <div id="home-gallery-container"></div>
        </section>
    `;

    const myNavToken = window.appNavToken; 

    const loadHome = async () => {
        const statsContainer = document.getElementById('home-stats');
        const galleryContainer = document.getElementById('home-gallery-container');
        if (!statsContainer || !galleryContainer) return;

        statsContainer.innerHTML = '';
        galleryContainer.innerHTML = '<loading-state></loading-state>';

        try {
            
            const [deptResult, searchResult] = await Promise.allSettled([
                MetAPI.getDepartments(),
                MetAPI.search('*', '&isHighlight=true&hasImages=true')
            ]);

            if (window.appNavToken !== myNavToken) return;

            const deptData = deptResult.status === 'fulfilled' ? deptResult.value : { departments: [] };
            const searchData = searchResult.status === 'fulfilled' ? searchResult.value : { total: 0, objectIDs: [] };

            statsContainer.innerHTML = ''; 

            const divDepts = document.createElement('div');
            const h2Depts = document.createElement('h2');
            h2Depts.style.color = 'var(--accent-color)';
            h2Depts.textContent = deptData.departments.length;
            const pDepts = document.createElement('p');
            pDepts.textContent = 'Departamentos';
            divDepts.appendChild(h2Depts);
            divDepts.appendChild(pDepts);

            const divWorks = document.createElement('div');
            const h2Works = document.createElement('h2');
            h2Works.style.color = 'var(--accent-color)';
            h2Works.textContent = searchData.total.toLocaleString();
            const pWorks = document.createElement('p');
            pWorks.textContent = 'Obras Destacadas';
            divWorks.appendChild(h2Works);
            divWorks.appendChild(pWorks);

            statsContainer.appendChild(divDepts);
            statsContainer.appendChild(divWorks);

            if (searchData.objectIDs && searchData.objectIDs.length > 0) {
                const top12IDs = searchData.objectIDs.slice(0, 12);
                let resultadosTotales = [];
                const batchSize = 4;

                galleryContainer.innerHTML = `
                    <div class="loading-container">
                        <div class="spinner"></div>
                        <p>Descargando fichas de las obras destacadas...</p>
                    </div>
                `;

                for (let i = 0; i < top12IDs.length; i += batchSize) {
                    if (window.appNavToken !== myNavToken) return;
                    const batch = top12IDs.slice(i, i + batchSize);
                    const promises = batch.map(id => MetAPI.getObject(id));
                    const results = await Promise.allSettled(promises);
                    resultadosTotales.push(...results);
                }

                if (window.appNavToken !== myNavToken) return;

                const obras = resultadosTotales.filter(r => r.status === 'fulfilled').map(r => r.value);
                const obrasFallidas = resultadosTotales.filter(r => r.status === 'rejected').length;

                galleryContainer.innerHTML = '';
                
                if (obras.length === 0) {
                    galleryContainer.innerHTML = '<p>Las fichas de las obras destacadas no pudieron cargarse por saturación del servidor.</p>';
                } else {
                    const grid = document.createElement('div');
                    grid.className = 'art-grid';

                    obras.forEach(obra => {
                        grid.appendChild(views.createArtCard(obra));
                    });

                    galleryContainer.appendChild(grid);
                    
                    if (obrasFallidas > 0) {
                        const failNote = document.createElement('p');
                        failNote.style.cssText = 'color: var(--text-secondary); font-size: 0.85rem; text-align: center; margin-top: 1rem;';
                        failNote.textContent = `Nota: ${obrasFallidas} obra(s) omitida(s) por inestabilidad de la API.`;
                        galleryContainer.appendChild(failNote);
                    }
                }

            } else {
                galleryContainer.innerHTML = '<p>No se encontraron obras destacadas.</p>';
            }

        } catch (error) {
            if (window.appNavToken !== myNavToken) return;
            galleryContainer.innerHTML = '<error-state message="La conexión con el museo está inestable."></error-state>';
            const errorState = galleryContainer.querySelector('error-state');
            if (errorState) errorState.addEventListener('retry', loadHome);
        }
    };

    loadHome();
};

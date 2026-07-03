views.renderCompare = async (container, preloadedId = null) => {
    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <h2>Comparador de Obras</h2>
            <p style="color: var(--text-secondary);">Busca y selecciona dos obras para comparar sus atributos frente a frente.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
            
            <div id="panel-a" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; display: flex; flex-direction: column;">
                <h3 style="color: var(--accent-color); margin-bottom: 1rem; text-align: center;">Obra A</h3>
                <div id="search-container-a">
                    <input type="text" id="search-a" placeholder="Busca una obra por nombre, artista..." style="width: 100%; padding: 0.8rem; border-radius: 4px; background: var(--bg-dark); color: white; border: 1px solid var(--border-color); margin-bottom: 1rem;">
                    <div id="results-a" style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 400px; overflow-y: auto;"></div>
                </div>
                <div id="selected-a" style="display: none; flex-direction: column; align-items: center; gap: 1rem;"></div>
            </div>

            <div id="panel-b" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; display: flex; flex-direction: column;">
                <h3 style="color: var(--accent-color); margin-bottom: 1rem; text-align: center;">Obra B</h3>
                <div id="search-container-b">
                    <input type="text" id="search-b" placeholder="Busca una obra por nombre, artista..." style="width: 100%; padding: 0.8rem; border-radius: 4px; background: var(--bg-dark); color: white; border: 1px solid var(--border-color); margin-bottom: 1rem;">
                    <div id="results-b" style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 400px; overflow-y: auto;"></div>
                </div>
                <div id="selected-b" style="display: none; flex-direction: column; align-items: center; gap: 1rem;"></div>
            </div>

        </div>

        <div id="compare-table-container" style="display: none; overflow-x: auto; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem;">
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr style="border-bottom: 2px solid var(--accent-color);">
                        <th style="padding: 1rem; width: 20%;">Atributo</th>
                        <th style="padding: 1rem; width: 40%;" id="th-obra-a">Obra A</th>
                        <th style="padding: 1rem; width: 40%;" id="th-obra-b">Obra B</th>
                    </tr>
                </thead>
                <tbody id="compare-tbody"></tbody>
            </table>
            <div id="year-diff" style="text-align: center; margin-top: 1.5rem; color: var(--accent-color); font-weight: bold;"></div>
        </div>
    `;

    let state = {
        a: { selected: null, timeout: null, currentSearchId: 0 },
        b: { selected: null, timeout: null, currentSearchId: 0 }
    };

    const myNavToken = window.appNavToken;

    const createMiniCard = (obra, panelId) => {
        const div = document.createElement('div');
        div.style.cssText = 'display: flex; align-items: center; gap: 1rem; padding: 0.5rem; background: var(--bg-dark); border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; transition: 0.2s;';
        
        const otherPanelId = panelId === 'a' ? 'b' : 'a';
        if (state[otherPanelId].selected && state[otherPanelId].selected.objectID === obra.objectID) {
            div.style.opacity = '0.5';
            div.style.cursor = 'not-allowed';
            div.innerHTML = `<p style="font-size: 0.8rem; margin:0; padding: 0.5rem; text-align:center; width:100%;">Ya está seleccionada en el otro panel</p>`;
            return div;
        }

        const img = document.createElement('img');
        img.src = obra.primaryImageSmall || 'https://via.placeholder.com/50';
        img.style.cssText = 'width: 50px; height: 50px; object-fit: cover; border-radius: 4px;';
        
        const info = document.createElement('div');
        const title = document.createElement('h4');
        title.textContent = obra.title || 'Sin título';
        title.style.cssText = 'margin: 0; font-size: 0.9rem;';
        const artist = document.createElement('p');
        artist.textContent = obra.artistDisplayName || 'Desconocido';
        artist.style.cssText = 'margin: 0; font-size: 0.8rem; color: var(--text-secondary);';
        
        info.appendChild(title);
        info.appendChild(artist);
        div.appendChild(img);
        div.appendChild(info);

        div.onmouseover = () => div.style.borderColor = 'var(--accent-color)';
        div.onmouseout = () => div.style.borderColor = 'var(--border-color)';
        div.onclick = () => selectArtwork(obra, panelId);
        return div;
    };

    const setupSearch = (panelId) => {
        const input = document.getElementById(`search-${panelId}`);
        if (!input) return;

        const executeSearch = async () => {
            const query = input.value.trim();
            const resultsDiv = document.getElementById(`results-${panelId}`);
            if (!resultsDiv || !query) return;

            const searchId = ++state[panelId].currentSearchId;
            resultsDiv.innerHTML = '<loading-state></loading-state>';

            try {
                const data = await MetAPI.search(query, '&hasImages=true');
                
                if (window.appNavToken !== myNavToken || searchId !== state[panelId].currentSearchId) return;
                
                const updatedResultsDiv = document.getElementById(`results-${panelId}`);
                if (!updatedResultsDiv) return;

                if (!data.objectIDs || data.objectIDs.length === 0) {
                    updatedResultsDiv.innerHTML = '<p style="text-align: center; font-size:0.9rem;">No se encontraron obras con ese término</p>';
                    return;
                }
                
                const topIDs = data.objectIDs.slice(0, 5);
                const promises = topIDs.map(id => MetAPI.getObject(id));
                const results = await Promise.allSettled(promises);
                
                if (window.appNavToken !== myNavToken || searchId !== state[panelId].currentSearchId) return;

                const obras = results.filter(r => r.status === 'fulfilled').map(r => r.value);
                
                const finalResultsDiv = document.getElementById(`results-${panelId}`);
                if (!finalResultsDiv) return;
                
                finalResultsDiv.innerHTML = '';
                if (obras.length === 0) {
                    finalResultsDiv.innerHTML = '<p style="color: var(--text-secondary); font-size:0.9rem;">Error al descargar las fichas. Intenta otra búsqueda.</p>';
                } else {
                    obras.forEach(obra => {
                        finalResultsDiv.appendChild(createMiniCard(obra, panelId));
                    });
                }
            } catch (err) {
                if (window.appNavToken !== myNavToken || searchId !== state[panelId].currentSearchId) return;
                
                const errorResultsDiv = document.getElementById(`results-${panelId}`);
                if (errorResultsDiv) {
                    errorResultsDiv.innerHTML = '<error-state message="Error en la búsqueda."></error-state>';
                    const errorState = errorResultsDiv.querySelector('error-state');
                    if (errorState) errorState.addEventListener('retry', executeSearch);
                }
            }
        };

        input.oninput = (e) => {
            clearTimeout(state[panelId].timeout);
            const query = e.target.value.trim();
            const resultsDiv = document.getElementById(`results-${panelId}`);
            if (resultsDiv && !query) {
                resultsDiv.innerHTML = '';
                return;
            }
            state[panelId].timeout = setTimeout(executeSearch, 400);
        };
    };

    const selectArtwork = (obra, panelId) => {
        state[panelId].selected = obra;
        const searchContainer = document.getElementById(`search-container-${panelId}`);
        const selectedDiv = document.getElementById(`selected-${panelId}`);

        if (searchContainer) searchContainer.style.display = 'none';
        if (selectedDiv) {
            selectedDiv.innerHTML = '';

            const img = document.createElement('img');
            img.src = obra.primaryImageSmall || 'https://via.placeholder.com/300';
            img.style.cssText = 'width: 100%; max-height: 300px; object-fit: contain; border-radius: 8px;';

            const title = document.createElement('h3');
            title.style.cssText = 'margin:0; text-align:center;';
            title.textContent = obra.title || 'Sin título';

            const artist = document.createElement('p');
            artist.style.cssText = 'margin:0; color:var(--text-secondary); text-align:center;';
            artist.textContent = obra.artistDisplayName || 'Desconocido';

            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.style.cssText = 'margin-top: 1rem; width: 100%;';
            btn.textContent = 'Cambiar selección';
            
            btn.onclick = () => {
                state[panelId].selected = null;
                selectedDiv.style.display = 'none';
                const reSearchContainer = document.getElementById(`search-container-${panelId}`);
                if (reSearchContainer) reSearchContainer.style.display = 'block';
                const reSearchInput = document.getElementById(`search-${panelId}`);
                if (reSearchInput) reSearchInput.value = '';
                const reResultsDiv = document.getElementById(`results-${panelId}`);
                if (reResultsDiv) reResultsDiv.innerHTML = '';
                updateTable();
            };

            selectedDiv.appendChild(img);
            selectedDiv.appendChild(title);
            selectedDiv.appendChild(artist);
            selectedDiv.appendChild(btn);
            
            selectedDiv.style.display = 'flex';
        }
        updateTable();
    };

    const updateTable = () => {
        const tableContainer = document.getElementById('compare-table-container');
        const tbody = document.getElementById('compare-tbody');
        const diffText = document.getElementById('year-diff');
        const thA = document.getElementById('th-obra-a');
        const thB = document.getElementById('th-obra-b');

        if (!tableContainer || !tbody || !diffText) return;

        const { a, b } = state;

        if (!a.selected || !b.selected) {
            tableContainer.style.display = 'none';
            return;
        }

        tableContainer.style.display = 'block';
        tbody.innerHTML = '';
        
        if (thA) thA.textContent = a.selected.title || 'Obra A';
        if (thB) thB.textContent = b.selected.title || 'Obra B';

        const attributes = [
            { label: 'Artista', key: 'artistDisplayName', default: 'Desconocido' },
            { label: 'Departamento', key: 'department', default: 'N/A' },
            { label: 'Técnica', key: 'medium', default: 'N/A' },
            { label: 'Clasificación', key: 'classification', default: 'N/A' },
            { label: 'Cultura', key: 'culture', default: 'N/A' },
            { label: 'Dominio Público', key: 'isPublicDomain', isBool: true },
            { label: 'Destacada', key: 'isHighlight', isBool: true }
        ];

        attributes.forEach(attr => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--border-color)';
            
            let valA = attr.isBool ? (a.selected[attr.key] ? 'Sí' : 'No') : (a.selected[attr.key] || attr.default);
            let valB = attr.isBool ? (b.selected[attr.key] ? 'Sí' : 'No') : (b.selected[attr.key] || attr.default);

            const isDifferent = valA !== valB;
            const bgA = isDifferent ? 'rgba(212, 175, 55, 0.1)' : 'transparent';
            const bgB = isDifferent ? 'rgba(212, 175, 55, 0.1)' : 'transparent';
            const color = isDifferent ? 'var(--accent-color)' : 'inherit';

            const tdLabel = document.createElement('td');
            tdLabel.style.cssText = 'padding: 1rem; font-weight: 600; color: var(--text-secondary);';
            tdLabel.textContent = attr.label;

            const tdA = document.createElement('td');
            tdA.style.cssText = `padding: 1rem; background: ${bgA}; color: ${color};`;
            tdA.textContent = valA;

            const tdB = document.createElement('td');
            tdB.style.cssText = `padding: 1rem; background: ${bgB}; color: ${color};`;
            tdB.textContent = valB;

            tr.appendChild(tdLabel);
            tr.appendChild(tdA);
            tr.appendChild(tdB);
            
            tbody.appendChild(tr);
        });

        const getYear = (obj) => (obj.objectEndDate !== undefined && obj.objectEndDate !== null && obj.objectEndDate !== "") ? obj.objectEndDate : obj.objectBeginDate;
        const yearA = getYear(a.selected);
        const yearB = getYear(b.selected);

        if (yearA !== undefined && yearB !== undefined) {
            const diff = Math.abs(yearA - yearB);
            diffText.textContent = diff === 0 ? 'Las obras son del mismo año.' : `Diferencia en el tiempo: ${diff} años.`;
        } else {
            diffText.textContent = 'No hay datos de fecha exactos para comparar.';
        }
    };

    setupSearch('a');
    setupSearch('b');

    if (preloadedId) {
        const initialResultsA = document.getElementById(`results-a`);
        if (initialResultsA) initialResultsA.innerHTML = '<loading-state></loading-state>';
        
        MetAPI.getObject(preloadedId).then(obra => {
            const currentResultsA = document.getElementById(`results-a`);
            if (!currentResultsA || window.appNavToken !== myNavToken) return; 
            currentResultsA.innerHTML = '';
            selectArtwork(obra, 'a');
        }).catch(err => {
            const currentResultsA = document.getElementById(`results-a`);
            if (currentResultsA) currentResultsA.innerHTML = '<p style="color:var(--text-secondary);">Error cargando obra preseleccionada.</p>';
        });
    }
};

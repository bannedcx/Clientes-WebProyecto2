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

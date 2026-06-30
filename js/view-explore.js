if (!window.metSearchCache) window.metSearchCache = new Map();

views.renderExplore = async (container, urlParams = new URLSearchParams()) => {
    const sliderCSS = `
        <style>
            .dual-slider { position: relative; width: 100%; height: 40px; margin-top: 5px; }
            .dual-slider .track { position: absolute; width: 100%; height: 4px; background: var(--border-color, #444); top: 50%; transform: translateY(-50%); border-radius: 2px; z-index: 1; }
            .dual-slider input[type="range"] { position: absolute; width: 100%; top: 50%; transform: translateY(-50%); appearance: none; background: transparent; pointer-events: none; z-index: 2; margin: 0; }
            .dual-slider input[type="range"]::-webkit-slider-thumb { pointer-events: auto; appearance: none; width: 18px; height: 18px; background: var(--accent-color, #d4af37); border-radius: 50%; cursor: pointer; }
            .dual-slider input[type="range"]::-moz-range-thumb { pointer-events: auto; appearance: none; width: 18px; height: 18px; background: var(--accent-color, #d4af37); border-radius: 50%; cursor: pointer; border: none; }
            .slider-inputs { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 5px; }
            .year-input { width: 75px; padding: 4px; background: var(--bg-dark, #222); color: white; border: 1px solid var(--border-color, #444); border-radius: 4px; text-align: center; font-size: 0.85rem; }
            .year-input:focus { border-color: var(--accent-color, #d4af37); outline: none; }
        </style>
    `;

    container.innerHTML = sliderCSS + `
        <div style="display: grid; grid-template-columns: 250px 1fr; gap: 2rem; align-items: start;">
            
            <aside style="background: var(--bg-card); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-color); position: sticky; top: 20px;">
                <h3 style="color: var(--accent-color); margin-bottom: 1.5rem;">Filtros de Búsqueda</h3>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; font-size: 0.9rem; margin-bottom: 0.3rem;">Término de búsqueda</label>
                    <input type="text" id="filter-q" placeholder="Ej: Van Gogh, espada..." value="" style="width: 100%; padding: 0.5rem; border-radius: 4px; background: var(--bg-dark); color: white; border: 1px solid var(--border-color);">
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="display: block; font-size: 0.9rem; margin-bottom: 0.3rem;">Departamento</label>
                    <select id="filter-dept" style="width: 100%; padding: 0.5rem; border-radius: 4px; background: var(--bg-dark); color: white; border: 1px solid var(--border-color);">
                        <option value="">Todos los departamentos</option>
                    </select>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-size: 0.9rem; margin-bottom: 0.5rem;">Rango de Años</label>
                    <div class="slider-inputs">
                        <input type="number" id="input-year-start" class="year-input" value="-4000" min="-4000" max="2026">
                        <span>a</span>
                        <input type="number" id="input-year-end" class="year-input" value="2026" min="-4000" max="2026">
                    </div>
                    <div class="dual-slider">
                        <div class="track"></div>
                        <input type="range" id="filter-year-start" min="-4000" max="2026" value="-4000">
                        <input type="range" id="filter-year-end" min="-4000" max="2026" value="2026">
                    </div>
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer;">
                        <input type="checkbox" id="filter-highlight"> Solo obras destacadas
                    </label>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer;">
                        <input type="checkbox" id="filter-images" checked> Solo con imagen
                    </label>
                </div>

                <button id="btn-search" class="btn" style="width: 100%; margin-bottom: 0.5rem; background: var(--accent-color); color: black;">Aplicar Filtros</button>
                <button id="btn-reset" class="btn" style="width: 100%;">Limpiar Filtros</button>
            </aside>

            <main>
                <div id="aggregates-panel" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 1rem; background: var(--bg-card); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 2rem;">
                    <div><p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">Total Resultados</p><h3 id="agg-total" style="margin: 0; color: var(--accent-color);">-</h3></div>
                    <div><p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">Obras Cargadas</p><h3 id="agg-loaded" style="margin: 0;">-</h3></div>
                    <div><p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">Depto Dominante</p><h4 id="agg-dept" style="margin: 0; font-size: 0.9rem;">-</h4></div>
                    <div><p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">Siglo Frecuente</p><h4 id="agg-century" style="margin: 0; font-size: 0.9rem;">-</h4></div>
                    <div><p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">Cultura Frecuente</p><h4 id="agg-culture" style="margin: 0; font-size: 0.9rem;">-</h4></div>
                    <div style="grid-column: 1 / -1;"><small style="color: #666;">Nota: Agregados calculados sobre las obras visibles en esta página.</small></div>
                </div>

                <div id="explore-gallery"></div>
                
                <div id="pagination-controls" style="display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 2rem; display: none;">
                    <button id="btn-prev" class="btn">⬅ Anterior</button>
                    <span id="page-indicator">Página 1</span>
                    <button id="btn-next" class="btn">Siguiente ➡</button>
                </div>
            </main>
        </div>
    `;

    const myNavToken = window.appNavToken; 
    let currentPage = 1;
    let currentObjectIDs = [];
    let totalResults = 0;
    const ITEMS_PER_PAGE = 12;
    let currentSearchId = 0; 
    let currentPageRenderId = 0;

    const ui = {
        deptSelect: document.getElementById('filter-dept'),
        qInput: document.getElementById('filter-q'),
        sliderStart: document.getElementById('filter-year-start'),
        sliderEnd: document.getElementById('filter-year-end'),
        inputStart: document.getElementById('input-year-start'),
        inputEnd: document.getElementById('input-year-end'),
        highlight: document.getElementById('filter-highlight'),
        images: document.getElementById('filter-images'),
        gallery: document.getElementById('explore-gallery'),
        btnSearch: document.getElementById('btn-search'),
        btnReset: document.getElementById('btn-reset'),
        btnPrev: document.getElementById('btn-prev'),
        btnNext: document.getElementById('btn-next'),
        pageIndicator: document.getElementById('page-indicator'),
        paginationDiv: document.getElementById('pagination-controls')
    };

    const syncFromSlider = (e) => {
        let valStart = parseInt(ui.sliderStart.value);
        let valEnd = parseInt(ui.sliderEnd.value);
        if (valStart > valEnd) {
            if (e.target.id === 'filter-year-start') { ui.sliderStart.value = valEnd; valStart = valEnd; }
            else { ui.sliderEnd.value = valStart; valEnd = valStart; }
        }
        ui.inputStart.value = valStart;
        ui.inputEnd.value = valEnd;
    };

    const syncFromInput = () => {
        let valStart = parseInt(ui.inputStart.value) || -4000;
        let valEnd = parseInt(ui.inputEnd.value) || 2026;
        
        if (valStart < -4000) valStart = -4000;
        if (valEnd > 2026) valEnd = 2026;
        if (valStart > valEnd) { valStart = valEnd; ui.inputStart.value = valStart; }

        ui.sliderStart.value = valStart;
        ui.sliderEnd.value = valEnd;
    };

    ui.sliderStart.addEventListener('input', syncFromSlider);
    ui.sliderEnd.addEventListener('input', syncFromSlider);
    ui.inputStart.addEventListener('change', syncFromInput);
    ui.inputEnd.addEventListener('change', syncFromInput);

    const getCentury = (yearStr) => {
        const year = parseInt(yearStr, 10);
        if (isNaN(year)) return null;
        if (year < 0) return `${Math.ceil(Math.abs(year) / 100)} a.C.`;
        return `S. ${Math.ceil(year / 100)}`;
    };

    const toggleControls = (disabled) => {
        if (ui.btnSearch) ui.btnSearch.disabled = disabled;
        if (ui.btnPrev) ui.btnPrev.disabled = disabled || currentPage === 1;
        if (ui.btnNext) ui.btnNext.disabled = disabled || (currentPage * ITEMS_PER_PAGE >= totalResults);
        if (ui.sliderStart) ui.sliderStart.disabled = disabled;
        if (ui.sliderEnd) ui.sliderEnd.disabled = disabled;
        if (ui.inputStart) ui.inputStart.disabled = disabled;
        if (ui.inputEnd) ui.inputEnd.disabled = disabled;
    };

    try {
        const deptData = await MetAPI.getDepartments();
        if (window.appNavToken !== myNavToken) return;

        if(ui.deptSelect) {
            deptData.departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.departmentId;
                option.textContent = dept.displayName;
                ui.deptSelect.appendChild(option);
            });
            if(urlParams.get('dept')) {
                ui.deptSelect.value = urlParams.get('dept');
                if (ui.qInput) ui.qInput.value = ''; 
            }
        }
    } catch (e) {
        console.error('Error cargando departamentos', e);
    }

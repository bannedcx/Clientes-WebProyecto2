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

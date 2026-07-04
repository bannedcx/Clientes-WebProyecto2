views.renderHome = async (container) => {
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
            const [deptData, searchData] = await Promise.all([
                MetAPI.getDepartments(),
                MetAPI.search('*', '&isHighlight=true&hasImages=true')
            ]);

            if (window.appNavToken !== myNavToken) return;

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

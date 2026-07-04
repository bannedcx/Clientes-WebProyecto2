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

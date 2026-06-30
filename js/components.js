class MetNavbar extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <header class="navbar">
                <div class="nav-brand">
                    <a href="#home"><h1>MetHub</h1></a>
                </div>
                <nav class="nav-links">
                    <a href="#home">Inicio</a>
                    <a href="#explore">Explorar</a>
                    <a href="#departments">Departamentos</a>
                    <a href="#compare">Comparar</a>
                </nav>
            </header>
        `;
    }

    connectedCallback() {
        window.addEventListener('hashchange', () => this.updateActiveLink());
        this.updateActiveLink(); 
    }

    updateActiveLink() {
        const currentHash = window.location.hash || '#home';
        const links = this.querySelectorAll('.nav-links a');
        
        links.forEach(link => {
            link.classList.remove('active');
            if (currentHash.startsWith(link.getAttribute('href'))) {
                link.classList.add('active');
            }
        });
    }
}
customElements.define('met-navbar', MetNavbar);

class MetFooter extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <footer class="footer">
                <p>Desarrollado por Eric Vargas y Santiago Carrasquero - Clientes Web-2026</p>
                <p><small>Datos provistos por la Open Access API del Metropolitan Museum of Art. Esta aplicación no está afiliada al museo.</small></p>
            </footer>
        `;
    }
}
customElements.define('met-footer', MetFooter);

class LoadingState extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="loading-container">
                <div class="spinner"></div>
                <p>Cargando información del museo...</p>
            </div>
        `;
    }
}
customElements.define('loading-state', LoadingState);

class ErrorState extends HTMLElement {
    connectedCallback() {
        const message = this.getAttribute('message') || 'Ocurrió un error al cargar los datos de la API.';
        
        this.innerHTML = ''; 

        const container = document.createElement('div');
        container.className = 'error-container';

        const title = document.createElement('h3');
        title.textContent = '¡Uy! Algo salió mal';

        const p = document.createElement('p');
        p.textContent = message; // Asignación segura del texto

        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.id = 'btn-retry';
        btn.textContent = 'Reintentar';

        btn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('retry', { bubbles: true }));
        });

        container.appendChild(title);
        container.appendChild(p);
        container.appendChild(btn);
        
        this.appendChild(container);
    }
}
customElements.define('error-state', ErrorState);

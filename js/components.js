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

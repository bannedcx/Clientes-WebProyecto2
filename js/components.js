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

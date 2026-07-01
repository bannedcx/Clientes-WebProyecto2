const router = {
    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    },
    
    handleRoute() {
        try {
            window.appNavToken = Date.now();

            const fullHash = window.location.hash || '#home';
            const container = document.getElementById('app-container');
            
            if (container) container.innerHTML = ''; 
            
            const hashWithoutQuery = fullHash.split('?')[0]; 
            const hashParts = hashWithoutQuery.split('/');
            
            const route = hashParts[0]; 
            const param = hashParts[1] ? decodeURIComponent(hashParts[1]) : null; 

            const queryString = fullHash.includes('?') ? fullHash.substring(fullHash.indexOf('?') + 1) : '';
            const urlParams = new URLSearchParams(queryString);

            switch (route) {
                case '#home':
                    views.renderHome(container); 
                    break;
                case '#explore':
                    views.renderExplore(container, urlParams);
                    break;
                case '#departments':
                    views.renderDepartments(container); 
                    break;
                case '#compare':
                    views.renderCompare(container, urlParams.get('id')); 
                    break;
                case '#detail':
                    if (param) views.renderDetail(container, param); 
                    else window.location.hash = '#home';
                    break;
                case '#artist':
                    if (param) views.renderArtist(container, param);
                    else window.location.hash = '#home';
                    break;
                default:
                    window.location.hash = '#home'; 
                    break;
            }
        } catch (error) {
            console.error("Error crítico en el enrutador:", error);
            const container = document.getElementById('app-container');
            if (container) {
                container.innerHTML = '<error-state message="Ocurrió un error inesperado al navegar. Haz clic en Inicio para recargar."></error-state>';
            }
        }
    }
};

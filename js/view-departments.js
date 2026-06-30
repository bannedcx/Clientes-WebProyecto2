views.renderDepartments = async (container) => {
    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <h2>Departamentos Curatoriales</h2>
            <p style="color: var(--text-secondary);">Explora la colección dividida en las 19 áreas de especialidad del museo.</p>
        </div>
        <div id="dept-container">
            <loading-state></loading-state>
        </div>
    `;

    const deptContainer = document.getElementById('dept-container');
    const myNavToken = window.appNavToken;

    const fallbackImages = {
        1: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=400&auto=format&fit=crop', 
        3: 'https://images.unsplash.com/photo-1599939571322-792a326e9085?q=80&w=400&auto=format&fit=crop', 
        4: 'https://images.unsplash.com/photo-1590422749908-622fdb289196?q=80&w=400&auto=format&fit=crop', 
        5: 'https://images.unsplash.com/photo-1580136608260-4ebf15fac612?q=80&w=400&auto=format&fit=crop', 
        6: 'https://images.unsplash.com/photo-1528360354687-839420409a6d?q=80&w=400&auto=format&fit=crop', 
        7: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=400&auto=format&fit=crop',
        8: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400&auto=format&fit=crop', 
        9: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&auto=format&fit=crop', 
        10: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=400&auto=format&fit=crop',
        11: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?q=80&w=400&auto=format&fit=crop', 
        12: 'https://images.unsplash.com/photo-1555431693-e45f949cbfda?q=80&w=400&auto=format&fit=crop', 
        13: 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?q=80&w=400&auto=format&fit=crop', 
        14: 'https://images.unsplash.com/photo-1564769661441-2a628e8dc48c?q=80&w=400&auto=format&fit=crop', 
        15: 'https://images.unsplash.com/photo-1582561424760-0321d6cb28cb?q=80&w=400&auto=format&fit=crop', 
        16: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&auto=format&fit=crop', 
        17: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=400&auto=format&fit=crop', 
        18: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=400&auto=format&fit=crop', 
        19: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop', 
        21: 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=400&auto=format&fit=crop'  
    };
    const defaultFallback = 'https://images.unsplash.com/photo-1518998053401-878f4e08c07e?q=80&w=400&auto=format&fit=crop';

    const queryMap = {
        1: "chair", 3: "stone", 4: "sword", 5: "mask", 6: "scroll",
        7: "cross", 8: "dress", 9: "sketch", 10: "statue", 11: "canvas", 
        12: "marble", 13: "vase", 14: "tile", 15: "painting", 
        16: "book", 17: "gold", 18: "guitar", 19: "photo", 21: "abstract"
    };

    const loadDepartments = async () => {
        try {
            const data = await MetAPI.getDepartments();
            if (window.appNavToken !== myNavToken) return;

            deptContainer.innerHTML = '';
            const grid = document.createElement('div');
            grid.className = 'art-grid'; 

            data.departments.forEach(dept => {
                const card = document.createElement('div');
                card.className = 'art-card';
                card.id = `dept-card-${dept.departmentId}`;
                
                const bgUrl = fallbackImages[dept.departmentId] || defaultFallback;

                card.style.backgroundImage = `linear-gradient(rgba(18, 18, 18, 0.75), rgba(18, 18, 18, 0.75)), url('${bgUrl}')`;
                card.style.backgroundSize = 'cover';
                card.style.backgroundPosition = 'center';
                card.style.justifyContent = 'center';
                card.style.alignItems = 'center';
                card.style.padding = '4rem 1rem';
                card.style.textAlign = 'center';
                card.style.borderTop = '4px solid var(--accent-color)';
                card.style.transition = 'background-image 0.4s ease-in-out'; 

                card.onclick = () => window.location.hash = `#explore?dept=${dept.departmentId}`; 

                const title = document.createElement('h3');
                title.textContent = dept.displayName;
                title.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
                title.style.position = 'relative';
                title.style.zIndex = '2';

                card.appendChild(title);
                grid.appendChild(card);
            });

            deptContainer.appendChild(grid);

            for (const dept of data.departments) {
                if (window.appNavToken !== myNavToken) break;
                try {
                    const queryTerm = queryMap[dept.departmentId] || 'art';
                    const searchData = await MetAPI.search(queryTerm, `&departmentId=${dept.departmentId}&hasImages=true`);
                    
                    if (window.appNavToken !== myNavToken) break;

                    if (searchData.objectIDs && searchData.objectIDs.length > 0) {
                        const obraId = searchData.objectIDs[0];
                        const obra = await MetAPI.getObject(obraId);
                        
                        if (obra && obra.primaryImageSmall) {
                            const testImg = new Image();
                            testImg.src = obra.primaryImageSmall;
                            testImg.onload = () => {
                                const card = document.getElementById(`dept-card-${dept.departmentId}`);
                                if (card) {
                                    card.style.backgroundImage = `linear-gradient(rgba(18, 18, 18, 0.75), rgba(18, 18, 18, 0.75)), url('${obra.primaryImageSmall}')`;
                                }
                            };
                        }
                    }
                } catch (err) {
                    console.error(`Error al cargar datos para el departamento ${dept.departmentId}:`, err);
                }
            }

        } catch (error) {
            if (window.appNavToken !== myNavToken) return;
            deptContainer.innerHTML = '<error-state message="No pudimos cargar la lista de departamentos."></error-state>';
            const errorState = deptContainer.querySelector('error-state');
            if (errorState) errorState.addEventListener('retry', loadDepartments);
        }
    };

    loadDepartments();
};

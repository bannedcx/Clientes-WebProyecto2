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

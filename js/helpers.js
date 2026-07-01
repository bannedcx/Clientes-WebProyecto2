const views = {
    createArtCard(obra) {
        const card = document.createElement('div');
        card.className = 'art-card';
        card.onclick = () => window.location.hash = #detail/${obra.objectID};

        const img = document.createElement('img');
        img.src = obra.primaryImageSmall  'https://via.placeholder.com/300x250/222222/d4af37?text=Sin+Imagen'; 
        img.alt = obra.title  'Obra sin título';
        img.loading = 'lazy';
        card.appendChild(img);

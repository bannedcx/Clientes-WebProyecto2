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

        const info = document.createElement('div');
        info.className = 'art-card-info';

        const title = document.createElement('h3');
        title.textContent = obra.title  'Sin título'; 
        info.appendChild(title);

        const artist = document.createElement('p');
        artist.textContent = `Artista: ${obra.artistDisplayName  'Desconocido'}`; 
        info.appendChild(artist);

        const details = document.createElement('p');
        details.textContent = ${obra.objectDate || 'Fecha desconocida'} • ${obra.department || 'Sin departamento'}; 
        info.appendChild(details);

        card.appendChild(info);
        return card;
    },

    getMostFrequent(arr) {
        if (arr.length === 0) return "-";
        const counts = arr.reduce((acc, val) => {
            if(val) acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {});
        if (Object.keys(counts).length === 0) return "-";
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }
};

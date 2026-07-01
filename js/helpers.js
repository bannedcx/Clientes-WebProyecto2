const views = {
    createArtCard(obra) {
        const card = document.createElement('div');
        card.className = 'art-card';
        card.onclick = () => window.location.hash = #detail/${obra.objectID};

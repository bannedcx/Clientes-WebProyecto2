views.renderDetail = async (container, id) => {
    const myNavToken = window.appNavToken;

    const loadDetail = async () => {
        container.innerHTML = `<loading-state></loading-state>`; 
        
        try {
            const obra = await MetAPI.getObject(id);
            
            if (window.appNavToken !== myNavToken) return;

            container.innerHTML = ''; 

            const detailContainer = document.createElement('div');
            detailContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 2rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 2rem; margin-top: 1rem;';
            
            const backBtn = document.createElement('button');
            backBtn.className = 'btn';
            backBtn.textContent = '⬅️ Volver';
            backBtn.onclick = () => window.history.back(); 
            container.appendChild(backBtn);

            const leftCol = document.createElement('div');
            leftCol.style.cssText = 'flex: 1; min-width: 300px;';
            
            const mainImg = document.createElement('img');
            mainImg.src = obra.primaryImage || obra.primaryImageSmall || 'https://via.placeholder.com/600x800/222222/d4af37?text=Sin+Imagen+Disponible'; 
            mainImg.alt = obra.title || 'Obra';
            mainImg.style.cssText = 'width: 100%; border-radius: 8px; border: 1px solid var(--border-color);';
            leftCol.appendChild(mainImg);

            if (obra.additionalImages && obra.additionalImages.length > 0) {
                const extrasContainer = document.createElement('div');
                extrasContainer.style.cssText = 'display: flex; gap: 10px; overflow-x: auto; margin-top: 1rem; padding-bottom: 0.5rem;';
                
                const extras = obra.additionalImages.slice(0, 8); 
                extras.forEach(imgSrc => {
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.style.cssText = 'height: 80px; border-radius: 4px; border: 1px solid var(--border-color); cursor: pointer;';
                    img.onclick = () => mainImg.src = imgSrc;
                    extrasContainer.appendChild(img);
                });
                leftCol.appendChild(extrasContainer);
            }
            detailContainer.appendChild(leftCol);

            const rightCol = document.createElement('div');
            rightCol.style.cssText = 'flex: 1; min-width: 300px; display: flex; flex-direction: column; gap: 1rem;';

            const title = document.createElement('h2');
            title.textContent = obra.title || 'Sin título'; 
            title.style.color = 'var(--accent-color)';
            title.style.marginBottom = '0';
            rightCol.appendChild(title);

            const artistContainer = document.createElement('div');
            const artistName = obra.artistDisplayName || 'Artista desconocido'; 
            
            const artistLink = document.createElement('a');
            artistLink.href = `#artist/${encodeURIComponent(artistName)}`; 
            artistLink.textContent = artistName;
            artistLink.style.textDecoration = 'underline';
            artistLink.style.color = 'inherit';
            
            const artistTitle = document.createElement('h3');
            artistTitle.appendChild(artistLink);
            artistContainer.appendChild(artistTitle);

            const artistBio = document.createElement('p');
            artistBio.textContent = obra.artistDisplayBio || 'Sin biografía disponible'; 
            artistBio.style.cssText = 'color: var(--text-secondary); font-size: 0.9rem;';
            artistContainer.appendChild(artistBio);
            rightCol.appendChild(artistContainer);

            const gridDetails = document.createElement('div');
            gridDetails.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;';
            
            const addDetail = (label, value) => {
                const div = document.createElement('div');
                const str = document.createElement('strong');
                str.textContent = `${label}: `;
                div.appendChild(str);
                div.appendChild(document.createElement('br'));
                div.appendChild(document.createTextNode((value && value.trim() !== '') ? value : '-')); 
                gridDetails.appendChild(div);
            };

            addDetail('Fecha', obra.objectDate); 
            addDetail('Técnica', obra.medium); 
            addDetail('Dimensiones', obra.dimensions); 
            addDetail('Departamento', obra.department); 
            addDetail('Cultura', obra.culture); 
            addDetail('Periodo', obra.period); 
            addDetail('Clasificación', obra.classification); 
            addDetail('Adquisición', obra.creditLine); 
            rightCol.appendChild(gridDetails);

            if (obra.tags && obra.tags.length > 0) {
                const tagsContainer = document.createElement('div');
                tagsContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;';
                
                const tagsList = obra.tags.slice(0, 12); 
                tagsList.forEach(tag => {
                    const span = document.createElement('span');
                    span.textContent = tag.term; 
                    span.style.cssText = 'background: var(--border-color); padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem;';
                    tagsContainer.appendChild(span);
                });
                rightCol.appendChild(tagsContainer);
            }

            const actionsContainer = document.createElement('div');
            actionsContainer.style.cssText = 'margin-top: auto; padding-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;';
            
            if (obra.artistDisplayName) { 
                const btnArtist = document.createElement('button');
                btnArtist.className = 'btn';
                btnArtist.textContent = 'Ver más obras del artista'; 
                btnArtist.onclick = () => window.location.hash = `#artist/${encodeURIComponent(artistName)}`;
                actionsContainer.appendChild(btnArtist);
            }

            const btnCompare = document.createElement('button');
            btnCompare.className = 'btn';
            btnCompare.textContent = 'Comparar'; 
            btnCompare.onclick = () => window.location.hash = `#compare?id=${obra.objectID}`;
            actionsContainer.appendChild(btnCompare);

            if (obra.objectURL) { 
                const linkMuseum = document.createElement('a');
                linkMuseum.className = 'btn';
                linkMuseum.href = obra.objectURL;
                linkMuseum.target = '_blank';
                linkMuseum.textContent = 'Ver en museo original ↗️';
                linkMuseum.style.cssText = 'background: transparent; border-color: var(--accent-color); color: var(--accent-color); text-decoration: none; display: flex; align-items: center; justify-content: center; padding: 0.5rem 1rem;';
                actionsContainer.appendChild(linkMuseum);
            }

            rightCol.appendChild(actionsContainer);
            detailContainer.appendChild(rightCol);
            container.appendChild(detailContainer);

        } catch (error) {
            if (window.appNavToken !== myNavToken) return;
            
            container.innerHTML = '';
            const errorElement = document.createElement('error-state');
            
            if (error.message && error.message.includes('404')) {
                errorElement.setAttribute('message', 'La obra solicitada no existe.'); 
            } else {
                errorElement.setAttribute('message', 'No pudimos cargar los detalles de la obra.');
            }
            
            container.appendChild(errorElement);
            errorElement.addEventListener('retry', loadDetail);
        }
    };

    loadDetail();
};

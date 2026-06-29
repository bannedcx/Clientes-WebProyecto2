const API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1';

async function fetchWithTimeout(url, timeoutMs = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

const MetAPI = {
    async getDepartments() {
        return fetchWithTimeout(`${API_BASE}/departments`);
    },

    async search(query, params = '') {
        return fetchWithTimeout(`${API_BASE}/search?q=${query}${params}`);
    },

    async getObject(id) {
        return fetchWithTimeout(`${API_BASE}/objects/${id}`);
    },

    async getObjectsInParallel(ids) {
        if (!ids || ids.length === 0) return [];
        
        const promises = ids.map(id => this.getObject(id));
        
        const results = await Promise.allSettled(promises);
        
        return results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
    }
};

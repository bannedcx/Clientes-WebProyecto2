const MetAPI = {
    baseUrl: 'https://collectionapi.metmuseum.org/public/collection/v1',

    async fetchWithTimeout(url, timeoutMs = 12000) { 
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(id);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            clearTimeout(id);
            throw error; 
        }
    },

    async searchWithRetry(url, retries = 2, backoff = 1000) {
        for (let i = 0; i <= retries; i++) {
            try {
                // Usamos los 12 segundos completos aquí para aguantar búsquedas globales
                return await this.fetchWithTimeout(url, 12000); 
            } catch (error) {
                if (i === retries) throw error;
                await new Promise(res => setTimeout(res, backoff * Math.pow(2, i))); 
            }
        }
    },

    async getObjectWithRetry(url, retries = 1, backoff = 500) {
        for (let i = 0; i <= retries; i++) {
            try {
                return await this.fetchWithTimeout(url, 8000); 
            } catch (error) {
                if (i === retries) throw error;
                await new Promise(res => setTimeout(res, backoff * Math.pow(2, i)));
            }
        }
    },

    async getDepartments() {
        return this.fetchWithTimeout(`${this.baseUrl}/departments`);
    },

    async search(query, params = '') {
        const encodedQuery = encodeURIComponent(query);
        return this.searchWithRetry(`${this.baseUrl}/search?q=${encodedQuery}${params}`);
    },

    async getObject(id) {
        return this.getObjectWithRetry(`${this.baseUrl}/objects/${id}`);
    }
};

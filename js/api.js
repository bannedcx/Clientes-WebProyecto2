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

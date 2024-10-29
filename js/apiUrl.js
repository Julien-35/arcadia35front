async function fetchFromApi(endpoint, options = {}) {
    const apiUrl = (window.location.hostname === "localhost")
        ? "http://localhost:8000/"
        : "https://arcadia35380-f680d3a74682.herokuapp.com/";

    try {
        const response = await fetch(`${apiUrl}${endpoint}`, options);

        // Vérifier si la réponse est correcte
        if (!response.ok) {
            let errorMessage = await response.text(); 
            try {
                const jsonError = JSON.parse(errorMessage);
                throw new Error(`Erreur: ${jsonError.error || jsonError.message || response.statusText}`);
            } catch {
                throw new Error(`Erreur: ${errorMessage || response.statusText}`);
            }
        }
        // Tenter de lire la réponse en tant que JSON, sinon retourner la réponse brute
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return await response.text(); 
        }
    } catch (error) {
        throw error; 
    }
}

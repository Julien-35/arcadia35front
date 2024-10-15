async function fetchFromApi(endpoint) {
    const apiUrl = (window.location.hostname === "localhost")
        ? "http://localhost:8000/"
        : "https://arcadia35380-f680d3a74682.herokuapp.com/";

    try {
        const response = await fetch(`${apiUrl}${endpoint}`);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in fetchFromApi:', error);
        throw error;
    }
}
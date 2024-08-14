

if (document.readyState === "loading") {
    // Loading hasn't finished yet
    services-container.addEventListener('DOMContentLoaded', voirService);


  } else {
    // `DOMContentLoaded` has already fired
    voirService();
  }
  async function fetchData(url, headers) {
    const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
        mode: "cors",
    };

    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) throw new Error("Impossible de récupérer les informations");
        return response.json();
    } catch (error) {
        console.error("Fetch Error:", error);
        throw error;
    }
}


  async function voirService() {
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", "38f1c426526d1aeebb80d777b8733f1ef09fc484");

    try {
        const items = await fetchData("https://127.0.0.1:8000/api/service/get", myHeaders);
        const servicesContainer = document.getElementById("getService");
        servicesContainer.innerHTML = ''; // Clear existing content

        items.forEach(item => {
            const serviceElement = document.createElement('div');

            serviceElement.innerHTML = `
                    <div class="container text-center">
                        <h2 class="m-4 p-5">${item.nom}</h2>
                        <div class="container text-center row row-cols-1 row-cols-lg-2 d-flex justify-content-evenly align-items-center">
                            <p class="col">${item.description}</p>
                            <div><img class="img-fluid rounded w-100 h-100"src="${item.image_data}" alt="Image de ${item.nom}"></div>
                        </div>
                        <hr>
                    </div> 
            `;

            servicesContainer.appendChild(serviceElement);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}
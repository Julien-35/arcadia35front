

if (document.readyState === "loading") {
    // Loading hasn't finished yet
    servicesContainer.addEventListener('DOMContentLoaded', voirRapport);


  } else {
    voirRapport();
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

async function voirRapport() {
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", "38f1c426526d1aeebb80d777b8733f1ef09fc484");

    try {
        const items = await fetchData("https://127.0.0.1:8000/api/rapportveterinaire/get", myHeaders);
        const servicesContainer = document.getElementById("getRapport");

        if (!servicesContainer) {
            console.error("Element with ID 'getRapport' not found");
            return;
        }

        servicesContainer.innerHTML = ''; 

        items.forEach(item => {
            const rapportElement = document.createElement('div');

            rapportElement.innerHTML = `
                <div class="container text-center">
                    <h2 class="m-4">${item.date}</h2>
                    <p class="col">${item.detail}</p>
                    <p class="col">${item.animal_prenom}</p> <!-- Notez le changement de 'item.animal.prenom' à 'item.animal_prenom' -->
                    <hr>
                </div>
            `;

            servicesContainer.appendChild(rapportElement);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}
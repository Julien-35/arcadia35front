
const avis = document.getElementById("getAvis");
const service = document.getElementById("getService")
if (document.readyState === "loading") {
    // Loading hasn't finished yet
    service.addEventListener('DOMContentLoaded', voirService);
    avis.addEventListener('DOMContentLoaded', getAvis);

  } else {
    voirService();
    getAvis();
  }



async function getAvis() {
    try {
        const response = await fetch("https://arcadia35380-f680d3a74682.herokuapp.com/api/avis/get");
        if (!response.ok) throw new Error('Failed to fetch avis');
        const result = await response.json();

        const avisContainer = document.getElementById("getAvis");
        let content = '';
        result.forEach(item => {
            if (item.isVisible) {
                content += `
                    <ol class="list-group">
                        <li class="list-group-item justify-content-between align-items-start text-dark m-2 border border-primary">
                            <div class="ms-2 p-2">
                                <div class="fw-bold">${item.pseudo}</div>
                                <p>${item.commentaire}</p>
                            </div>
                        </li>
                    </ol>`;
            }
        });
        avisContainer.innerHTML = content;
    } catch (error) {
        console.error('Error in getAvis:', error);
        document.getElementById("getAvis").innerHTML = "<p>Impossible de récupérer les avis.</p>";
    }
}

async function submitAvis() {
    const pseudo = document.getElementById('pseudo').value;
    const commentaire = document.getElementById('commentaire').value;

    const avisData = {
        pseudo: pseudo,
        commentaire: commentaire,
        is_visible: false  
    };

    try {
        const response = await fetch("https://arcadia35380-f680d3a74682.herokuapp.com/api/avis/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(avisData)
        });
        if (!response.ok) throw new Error('Failed to send avis');
        const myModal = new bootstrap.Modal(document.getElementById('MessageAvis'));
        myModal.show();
    } catch (error) {
        console.error('Error in submitAvis:', error);
        alert("Impossible d'envoyer l'avis. Veuillez réessayer plus tard.");
    }
}

async function fetchData(url, headers) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: headers,
            mode: "cors"
        });
        if (!response.ok) throw new Error("Impossible de récupérer les informations");
        return response.json();
    } catch (error) {
        console.error("Fetch Error in fetchData:", error);
        throw error;
    }
}

async function voirService() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const items = await fetchData("https://arcadia35380-f680d3a74682.herokuapp.com/api/service/get", myHeaders);
        const servicesContainer = document.getElementById("getService");
        servicesContainer.innerHTML = ''; // Clear existing content

        items.forEach(item => {
            // Créer un nouvel élément sans utiliser innerHTML
            const serviceElement = document.createElement('div');
            serviceElement.classList.add('container', 'border', 'border-primary', 'p-3', 'mb-3', 'rounded'); // Ajouter les classes

            // Créer un élément pour le nom du service
            const serviceTitle = document.createElement('h5');
            serviceTitle.classList.add('my-4');
            serviceTitle.textContent = `- ${item.nom}`; // Nom du service

            // Créer un élément pour la description
            const serviceDescription = document.createElement('p');
            serviceDescription.textContent = item.description; // Description du service

            // Ajouter les éléments au conteneur de service
            serviceElement.appendChild(serviceTitle);  // Ajouter le titre
            serviceElement.appendChild(serviceDescription);  // Ajouter la description

            // Ajouter l'élément au conteneur principal
            servicesContainer.appendChild(serviceElement);
        });
    } catch (error) {
        console.error("Error in voirService:", error);
        document.getElementById("getService").textContent = "Impossible de récupérer les services.";
    }
}


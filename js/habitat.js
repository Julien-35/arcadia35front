if (document.readyState === "loading") {
    // Loading hasn't finished yet
    services-container.addEventListener('DOMContentLoaded', voirHabitat);
  } else {
    voirHabitat();
  }


// Fonction pour obtenir le token d'authentification
function getToken() {
    return localStorage.getItem('apiToken');
}


// Fonction pour récupérer les données depuis une URL
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

// Fonction pour afficher les habitats
async function voirHabitat() {
    const myHeaders = new Headers({
        "Content-Type": "application/json"
    });

    try {
        const habitats = await fetchData("https://arcadia35380-f680d3a74682.herokuapp.com/api/habitat/get", myHeaders);
        const habitatsContainer = document.getElementById("habitats-container");
        habitatsContainer.innerHTML = '';

        habitats.forEach(habitat => {
            // Créer le conteneur pour chaque habitat
            const habitatElement = document.createElement('div');
            habitatElement.className = 'habitat';

            // Ajouter le titre, l'image de l'habitat et la description masquée
            habitatElement.innerHTML = `
                <div class="container d-flex align-items-center flex-column">
                    <h2 class="m-4">${habitat.nom}</h2>
                    <div class="habitat-info d-flex flex-column flex-lg-row align-items-center d-flex justify-content-evenly">
                        <img class="col-12 col-lg-3 img-fluid rounded" src="${habitat.image_data}" alt="Image de ${habitat.nom}" type="button" id="toggle-${habitat.id}" style="width: 648px; height: 435px;">
                        <div id="description-${habitat.id}" style="display: none;" class="col-12 col-lg-3 mt-3 mt-lg-0">
                            <p class="text-center">${habitat.description}</p>
                        </div>
                    </div>
                    <div id="animals-${habitat.id}" class="animal-container" style="display: none;"></div>
                </div>
                <hr class="container-fluid">
            `;

            habitatsContainer.appendChild(habitatElement);

            // Ajouter un événement de clic sur l'image pour afficher/masquer la description et les animaux
            const toggleButton = document.getElementById(`toggle-${habitat.id}`);
            const descriptionElement = document.getElementById(`description-${habitat.id}`);
            const animalContainer = document.getElementById(`animals-${habitat.id}`);

            toggleButton.addEventListener("click", async () => {
                if (descriptionElement.style.display === "none") {
                    descriptionElement.style.display = "block";
                    if (animalContainer.style.display === "none") {
                        animalContainer.style.display = "block";
                        // Assurer que l'élément est bien récupéré avant de passer à fetchAnimals
                        await fetchAnimals(habitat.id, animalContainer);
                    }
                } else {
                    descriptionElement.style.display = "none";
                    animalContainer.style.display = "none";
                }
            });
        });
    } catch (error) {
        console.error("Erreur dans la récupération des habitats:", error);
    }
}

// Fonction pour afficher les animaux d'un habitat spécifique
async function fetchAnimals(habitatId, animalContainer) {
    if (!animalContainer) {
        console.error(`Container pour les animaux avec l'ID ${habitatId} est introuvable.`);
        return;
    }

    const myHeaders = new Headers({
        "Content-Type": "application/json"
    });

    try {
        // Récupérer les animaux pour un habitat spécifique
        const animals = await fetchData(`https://arcadia35380-f680d3a74682.herokuapp.com/api/animal/get?habitat_id=${habitatId}`, myHeaders);
        animalContainer.innerHTML = '';

        animals.forEach(animal => {
            const createdAt = animal.created_at ? new Date(animal.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';
            const feedingTime = animal.feeding_time ? animal.feeding_time : 'N/A';

            animalContainer.innerHTML += `
                <div class="col mt-3">
                    <img src="${animal.image_data}" alt="Image de ${animal.id}" style="width: 294px; height: 185px;" class="img-thumbnail img-responsive" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWidth${animal.id}" aria-expanded="false" aria-controls="collapseWidth${animal.id}">
                    <div class="collapse" id="collapseWidth${animal.id}" style="width: 294px; height: 185px;">
                        <div class="card card-body mx-auto mb-5">
                            <table class="table">
                                <tbody class="text-center">
                                    <tr><th scope="row" class="text-dark">Race</th><td class="text-dark">${animal.race}</td></tr>
                                    <tr><th scope="row" class="text-dark">PRÉNOM</th><td class="text-dark">${animal.prenom}</td></tr>
                                    <tr><th scope="row" class="text-dark">ÉTAT de l'animal</th><td class="text-dark">${animal.etat}</td></tr>
                                    <tr><th scope="row" class="text-dark">La nourriture proposée</th><td class="text-dark">${animal.nourriture}</td></tr>
                                    <tr><th scope="row" class="text-dark">Quantité du dernier repas</th><td class="text-dark">${animal.grammage}</td></tr>
                                    <tr><th scope="row" class="text-dark">Dernier passage</th><td class="text-dark">${createdAt}</td></tr>
                                    <tr><th scope="row" class="text-dark">Heure de passage</th><td class="text-dark">${feedingTime}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Erreur dans la récupération des animaux:", error);
    }
}




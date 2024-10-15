if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', voirHabitat);
} else {
    voirHabitat();
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
        const animals = await fetchData(`http://localhost:8000/api/animal/get?habitat_id=${habitatId}`, myHeaders);
        animalContainer.innerHTML = '';

        // Créer une seule div.row pour tous les animaux
        const rowElement = document.createElement('div');
        rowElement.classList.add("row");

        animals.forEach(animal => {
            const createdAt = animal.created_at ? animal.created_at : 'N/A';
            const feedingTime = animal.feeding_time ? animal.feeding_time : 'N/A';

            // Créer une colonne pour chaque animal
            const animalCard = `
            <div class="col-lg-3 col-md-6 col-sm-6 col-12 mt-3"> <!-- Ajout de col-12 pour les petits écrans -->
                <div class="d-flex flex-column align-items-center">
                    <img src="${animal.image_data}" alt="Image de ${animal.id}" style="width: 294px; height: 185px;" class="img-thumbnail img-responsive" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWidth${animal.id}" aria-expanded="false" aria-controls="collapseWidth${animal.id}">
                    
                    <div class="collapse" id="collapseWidth${animal.id}" style="width: 100%;">
                        <div class="card card-body mx-auto mb-5" style="width: 294px;">
                            <div style="width: 100%;">
                                <table class="table" style="width: 100%;">
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
                </div>
            </div>
        `;
        
            // Ajouter la carte d'animal à la row
            rowElement.innerHTML += animalCard;
        });

        // Ajouter la row contenant tous les animaux au conteneur
        animalContainer.appendChild(rowElement);

    } catch (error) {
        console.error("Erreur dans la récupération des animaux:", error);
    }
}




async function voirHabitat() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const items = await fetchData("http://localhost:8000/api/habitat/get", myHeaders);

        const servicesContainer = document.getElementById("voirHabitat");
        servicesContainer.innerHTML = ''; 

        items.forEach(item => {
            // Container principal
            const serviceElement = document.createElement('div');
            serviceElement.classList.add("container", "text-center");

            // Titre de l'habitat
            const serviceTitle = document.createElement('h2');
            serviceTitle.classList.add("my-4");
            serviceTitle.textContent = decodeHtml(item.nom);
            serviceElement.appendChild(serviceTitle);

            // Ligne pour la description et l'image
            const rowElement = document.createElement('div');
            rowElement.classList.add("container", "text-center", "row", "row-cols-1", "row-cols-lg-2", "d-flex", "justify-content-evenly", "align-items-center");

            // Description de l'habitat
            const descriptionElement = document.createElement('p');
            descriptionElement.classList.add("col", "text-start"); // ajout 'text-start' pour aligner le texte à gauche
            descriptionElement.textContent = decodeHtml(item.description);  
            rowElement.appendChild(descriptionElement);

            // Conteneur de l'image
            const imageElementContainer = document.createElement('div');
            const imageElement = document.createElement('img');
            imageElement.classList.add("img-fluid", "rounded", "w-100", "h-100");
            imageElement.setAttribute('src', item.image_data);  
            imageElement.setAttribute('alt', `Image de ${item.nom}`);
            
            // Ajouter l'image au conteneur
            imageElementContainer.appendChild(imageElement);
            rowElement.appendChild(imageElementContainer);
            serviceElement.appendChild(rowElement);

            // Ajouter un conteneur vide pour les animaux
            const animalContainer = document.createElement('div');
            animalContainer.id = `animals-${item.id}`; // Créer un ID unique pour chaque conteneur d'animaux
            animalContainer.classList.add("row", "my-1", "d-none");
            serviceElement.appendChild(animalContainer);

            // Ajouter un séparateur (ligne horizontale)
            const hrElement = document.createElement('hr');
            serviceElement.appendChild(hrElement);

            // Ajouter l'élément au conteneur principal
            servicesContainer.appendChild(serviceElement);

            // Ajouter un événement de clic sur l'image pour charger les animaux associés
            imageElement.addEventListener('click', () => {
                if (animalContainer.classList.contains('d-none')) {
                    fetchAnimals(item.id, animalContainer);
                    animalContainer.classList.remove('d-none');
                } else {
                    animalContainer.classList.add('d-none');
                }
            });
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

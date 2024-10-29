if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', voirHabitat);
} else {
    voirHabitat();
}


// Fonction pour afficher les animaux d'un habitat spécifique
async function voirAnimal(habitatId, animalContainer) {
    if (!animalContainer) {
        return;
    }

    try {
        const animals = await fetchFromApi(`api/animal/get?habitat_id=${habitatId}`);
        // Vider le contenu existant dans le conteneur
        animalContainer.textContent = '';

        // Créer un élément row pour contenir les cartes d'animaux
        const rowElement = document.createElement('div');
        rowElement.classList.add("row", "g-3");

        animals.forEach(animal => {
            const animalElement = document.createElement('div');
            animalElement.classList.add("col-lg-3", "col-md-4", "col-sm-6", "col-12", "mt-3");

            const cardContainer = document.createElement('div');
            cardContainer.classList.add("d-flex", "flex-column", "align-items-center", "h-100");

            const imageElement = document.createElement('img');
            imageElement.classList.add("img-thumbnail", "img-responsive");
            imageElement.setAttribute('src', animal.image_data);
            imageElement.setAttribute('alt', `Image de ${animal.prenom}`);
            imageElement.setAttribute('type', 'button');
            imageElement.setAttribute('data-bs-toggle', 'collapse');
            imageElement.setAttribute('data-bs-target', `#collapseWidth${animal.id}`);
            imageElement.setAttribute('aria-expanded', 'false');
            imageElement.setAttribute('aria-controls', `collapseWidth${animal.id}`);
            
            // Style pour l'image
            imageElement.setAttribute('style', `
                width: 100%;
                height: 200px;
                object-fit: cover;
            `);

            // Ajouter l'image au conteneur de la carte
            cardContainer.appendChild(imageElement);

            // Créer le conteneur collapse pour les détails de l'animal
            const collapseContainer = document.createElement('div');
            collapseContainer.classList.add("collapse");
            collapseContainer.setAttribute('id', `collapseWidth${animal.id}`);
            collapseContainer.setAttribute('style', 'width: 100%;'); 

            // Reste du code pour construire la card
            const cardBody = document.createElement('div');
            cardBody.classList.add("card", "card-body", "mx-auto", "mt-3");
            cardBody.setAttribute('style', 'width: 100%;'); 

            // Table contenant les détails de l'animal
            const tableElement = document.createElement('table');
            tableElement.classList.add("table");
            tableElement.setAttribute('style', 'width: 100%;');

            const tableBody = document.createElement('tbody');
            tableBody.classList.add("text-center");

            const details = [
                { label: "Race", value: animal.race },
                { label: "Prénom", value: animal.prenom },
                { label: "État de l'animal", value: animal.etat },
                { label: "Nourriture", value: animal.nourriture },
                { label: "Quantité du dernier repas", value: animal.grammage },
                { label: "Dernier passage", value: animal.created_at ? animal.created_at : 'N/A' },
                { label: "Heure de passage", value: animal.feeding_time ? animal.feeding_time : 'N/A' }
            ];

            details.forEach(detail => {
                const row = document.createElement('tr');
                const th = document.createElement('th');
                th.setAttribute('scope', 'row');
                th.classList.add("text-dark");
                th.textContent = detail.label;

                const td = document.createElement('td');
                td.classList.add("text-dark");
                td.textContent = detail.value;

                row.appendChild(th);
                row.appendChild(td);
                tableBody.appendChild(row);
            });

            tableElement.appendChild(tableBody);
            cardBody.appendChild(tableElement);
            collapseContainer.appendChild(cardBody);
            cardContainer.appendChild(collapseContainer);
            animalElement.appendChild(cardContainer);
            rowElement.appendChild(animalElement);

            // Ajouter un événement d'incrémentation lors de l'ouverture du collapse
            let hasBeenOpened = false;
            collapseContainer.addEventListener('show.bs.collapse', async () => {
                if (!hasBeenOpened) {
                    try {
                        await fetchFromApi(`api/animal/${animal.id}/increment`, { method: 'POST' });
                        hasBeenOpened = true; // Marque l'animal comme déjà vu
                    } catch (error) {
                        console.error("Erreur lors de l'incrémentation de l'animal:", error);
                    }
                }
            });
        });

        animalContainer.appendChild(rowElement);

    } catch (error) {
        console.error("Erreur dans la récupération des animaux:", error);
    }
}

async function voirHabitat() {
    try {
        // Ajout du token dans les headers
        const items = await fetchFromApi("api/habitat/get")

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
                    voirAnimal(item.id, animalContainer);
                    animalContainer.classList.remove('d-none');
                } else {
                    animalContainer.classList.add('d-none');
                }
            });
        });
    } catch (error) {
    }
}

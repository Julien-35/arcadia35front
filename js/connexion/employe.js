
const Avis = document.getElementById("avis");

if (document.readyState === "loading") {
  // Loading hasn't finished yet
  Avis.addEventListener('DOMContentLoaded', voirAvis);
} else {
  voirAvis();
  voirService();
  voirHabitat();
  voirAnimal();

}


  async function voirService() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const items = await fetchData("http://localhost:8000/api/service/get", myHeaders);
        const servicesContainer = document.getElementById("voirService");
        servicesContainer.innerHTML = ''; // Effacer le contenu précédent

        items.forEach(item => {
            // Création d'un conteneur pour le service
            const serviceElement = document.createElement('div');
            serviceElement.classList.add("container", "text-center", "mb-4"); // Ajout d'un espacement entre les services


            // Ligne pour le nom
            const nameRow = document.createElement('div');
            nameRow.classList.add("row", "mb-3"); // Ajouter une marge en bas
            const nameCol = document.createElement('div');
            nameCol.classList.add("col-md-12"); // Utiliser toute la largeur pour le nom

            const nameInput = document.createElement('input',);
            nameInput.classList.add("form-control", "text-center","text-dark"); // Ajout de la classe personnalisée
            nameInput.type = "text";
            nameInput.value = decodeHtml(item.nom);
            nameCol.appendChild(nameInput);
            nameRow.appendChild(nameCol);
            serviceElement.appendChild(nameRow);

            // Ligne pour la description et l'image
            const descriptionRow = document.createElement('div');
            descriptionRow.classList.add("row", "align-items-center");

            // Colonne pour la description
            const descriptionCol = document.createElement('div');
            descriptionCol.classList.add("col-md-6"); // Utiliser 50% de la largeur
            const descriptionInput = document.createElement('textarea');
            descriptionInput.classList.add("form-control","text-dark","text-center","py-4");
            descriptionInput.rows = 3;
            descriptionInput.value = decodeHtml(item.description);
            descriptionCol.appendChild(descriptionInput);
            descriptionRow.appendChild(descriptionCol);

            // Colonne pour l'image
            const imageCol = document.createElement('div');
            imageCol.classList.add("col-md-6");
            const imageElementContainer = document.createElement('div');
            const imageElement = document.createElement('img');
            imageElement.classList.add("img-fluid", "rounded", "w-100", "h-100");
            imageElement.setAttribute('src', item.image_data);
            imageElement.setAttribute('alt', `Image de ${item.nom}`);
            imageElementContainer.appendChild(imageElement);

            // Input pour sélectionner une nouvelle image
            const imageInput = document.createElement('input');
            imageInput.type = "file";
            imageInput.classList.add("form-control", "my-2");
            imageCol.appendChild(imageElementContainer);
            imageCol.appendChild(imageInput);
            descriptionRow.appendChild(imageCol);

            serviceElement.appendChild(descriptionRow);

            // Bouton pour sauvegarder les modifications
            const saveButton = document.createElement('button');
            saveButton.classList.add("btn", "btn-primary", "my-2");
            saveButton.textContent = "Modifier le service";
            saveButton.onclick = () => {
                modifierService(item.id, item.image_data, nameInput.value, descriptionInput.value, imageInput);
            };
            serviceElement.appendChild(saveButton);

            // Ajouter un séparateur horizontal (hr)
            const hrElement = document.createElement('hr');
            serviceElement.appendChild(hrElement);

            // Ajouter l'élément de service au conteneur principal
            servicesContainer.appendChild(serviceElement);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

async function modifierService(serviceId, oldImageData, nom, description, imageInput) {
    const sanitizedNom = sanitizeInput(nom); // Gardez les caractères spéciaux
    const sanitizedDescription = sanitizeInput(description); // Gardez les caractères spéciaux
    let image_data = oldImageData; // Utiliser l'ancienne image par défaut

    // Vérifie si une image a été sélectionnée
    if (imageInput && imageInput.files.length > 0) {
        const file = imageInput.files[0];
        const validImageTypes = ['image/png', 'image/jpeg', 'image/avif'];
        if (!validImageTypes.includes(file.type)) {
            alert('Format d\'image non supporté. Veuillez sélectionner une image PNG, JPEG ou AVIF.');
            return;
        }

        try {
            const base64Image = await readFileAsBase64(file);
            image_data = `data:${file.type};base64,${base64Image}`;
        } catch (error) {
            alert('Erreur lors de la lecture de l\'image.');
            console.error(error);
            return;
        }
    }

    const serviceData = { nom: sanitizedNom, description: sanitizedDescription, image_data };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const response = await fetch(`http://localhost:8000/api/service/${serviceId}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(serviceData)
        });
       
        const textResponse = await response.text(); // Lire la réponse en tant que texte

        // Supprimer le caractère '#' de la réponse si présent
        const cleanedResponse = textResponse.replace(/#/g, '');

        if (!response.ok) {
            // Si la réponse n'est pas OK, tenter de l'analyser comme JSON
            let errorResponse;
            try {
                errorResponse = JSON.parse(cleanedResponse);
                alert(`Erreur lors de la modification du service: ${errorResponse.error || response.statusText}`);
            } catch (e) {
                // Afficher la réponse brute en cas d'erreur d'analyse
                console.error("Erreur lors de l'analyse de la réponse:", e);
                alert("Erreur lors de la mise à jour du service : " + cleanedResponse);
            }
            return; // Sortir de la fonction après une erreur
        }

        // Si la mise à jour a réussi, essayez de traiter la réponse
        let updatedService;
        try {
            updatedService = JSON.parse(cleanedResponse); // Analyser la réponse comme JSON
            alert("Service mis à jour avec succès !");
            location.reload(); // Actualiser la page
        } catch (e) {
            console.error("Erreur lors de l'analyse de la réponse :", e);
            alert("Le service a été mis à jour, mais une erreur s'est produite lors de l'analyse de la réponse.");
        }
    } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur lors de la mise à jour du service : " + error.message);
    }
}


async function voirAvis() {
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken()); // Utilisation de X-AUTH-TOKEN
    myHeaders.append("Content-Type", "application/json");

    try {
        // Récupération des avis
        const items = await fetchData("http://localhost:8000/api/avis/get", myHeaders);
        const avissContainer = document.getElementById("voirAvis");
        avissContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter les nouveaux éléments

        items.forEach(item => {
            // Création des éléments de manière sécurisée
            const avisElement = document.createElement('div');
            avisElement.classList.add("container", "text-start", "text-dark", "py-4", 'my-1', "border", "border-primary", "rounded");

            // Créer et insérer le titre (pseudo de l'utilisateur)
            const avisPseudo = document.createElement('h5');
            avisPseudo.classList.add("ms-2");
            avisPseudo.textContent = decodeHtml(item.pseudo);  // Décoder le pseudo si nécessaire
            avisElement.appendChild(avisPseudo);

            // Créer la div contenant la description et le bouton de visibilité
            const rowElement = document.createElement('div');
            rowElement.classList.add("d-flex", "align-items-center");

            // Créer et insérer la description (commentaire)
            const commentaireElement = document.createElement('p');
            commentaireElement.classList.add("col", "text-start");
            commentaireElement.textContent = decodeHtml(item.commentaire);
            rowElement.appendChild(commentaireElement);

            // Créer et insérer le bouton de visibilité
            const visibleElement = document.createElement('button');
            visibleElement.classList.add("btn", 'fw-bold', 'btn-sm'); // Ajout de 'p-0' pour enlever le padding

            // Définir la couleur et le texte du bouton selon l'état de visibilité
            if (item.isVisible) {
                visibleElement.classList.add('btn-primary'); // Couleur pour "Affiché"
                visibleElement.textContent = "Cacher"; // Texte simplifié
            } else {
                visibleElement.classList.add('btn-danger'); // Couleur pour "Caché"
                visibleElement.textContent = "Afficher"; // Texte simplifié
            }

            // Ajouter l'événement de clic pour changer la visibilité
            visibleElement.addEventListener('click', async () => {
                const newValue = !item.isVisible; // Inverser la visibilité actuelle

                try {
                    // Requête PUT pour changer l'état de visibilité
                    const putRequestOptions = {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-AUTH-TOKEN': getToken() // Ajouter le X-AUTH-TOKEN
                        },
                        body: JSON.stringify({ isVisible: newValue }) // Envoyer comme un objet
                    };

                    // Envoyer la requête PUT
                    const response = await fetch(`http://localhost:8000/api/avis/${item.id}`, putRequestOptions);

                    // Vérification des erreurs de la réponse
                    if (!response.ok) {
                        const errorResponse = await response.text(); // Lire la réponse brute
                        console.error(`Error lors de la mise à jour de l'avis ${item.id}:`, errorResponse);
                        throw new Error(`Erreur lors de la mise à jour de l'avis ${item.id}: ${response.status} - ${errorResponse}`);
                    }

                    // Si la mise à jour est réussie, mettre à jour l'état local
                    item.isVisible = newValue;

                    // Mettre à jour l'apparence du bouton en fonction du nouvel état
                    visibleElement.textContent = newValue ? "Cacher" : "Afficher";
                    visibleElement.classList.toggle('btn-primary', newValue);
                    visibleElement.classList.toggle('btn-danger', !newValue);

                } catch (error) {
                    console.error(`Failed to toggle visibility for avis ${item.id}:`, error);
                    alert(`Une erreur est survenue lors de la mise à jour de la visibilité pour l'avis ${item.id}.`);
                }
            });

            // Ajouter le bouton de visibilité au rowElement
            rowElement.appendChild(visibleElement);
            
            // Ajouter les éléments au conteneur d'avis
            avisElement.appendChild(rowElement);
            avissContainer.appendChild(avisElement);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}



// Fonction pour voir et modifier les habitats

async function voirHabitat() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const items = await fetchData("http://localhost:8000/api/habitat/get", myHeaders);
        const habitatsContainer = document.getElementById("voirHabitat");
        habitatsContainer.innerHTML = ''; 

        items.forEach(item => {
            // Création d'un conteneur pour le habitat
            const habitatElement = document.createElement('div');
            habitatElement.classList.add("container", "text-center", "py-4","border",'border-primary',"rounded",'my-3'); 


            // Ligne pour le nom
            const nameRow = document.createElement('div');
            nameRow.classList.add("row", "mb-3");
            const nameCol = document.createElement('div');
            nameCol.classList.add("col-md-12"); 

            const nameInput = document.createElement('input',);
            nameInput.classList.add("form-control", "text-center","text-dark"); 
            nameInput.type = "text";
            nameInput.value = decodeHtml(item.nom);
            nameCol.appendChild(nameInput);
            nameRow.appendChild(nameCol);
            habitatElement.appendChild(nameRow);

            // Ligne pour la description et l'image
            const descriptionRow = document.createElement('div');
            descriptionRow.classList.add("row", "align-items-center");

            // Colonne pour la description
            const descriptionCol = document.createElement('div');
            descriptionCol.classList.add("col-md-6"); // Utiliser 50% de la largeur
            const descriptionInput = document.createElement('textarea');
            descriptionInput.classList.add("form-control","text-dark","text-center","py-4");
            descriptionInput.rows = 3;
            descriptionInput.value = decodeHtml(item.description);
            descriptionCol.appendChild(descriptionInput);
            descriptionRow.appendChild(descriptionCol);

            // Colonne pour l'image
            const imageCol = document.createElement('div');
            imageCol.classList.add("col-md-6");
            const imageElementContainer = document.createElement('div');
            const imageElement = document.createElement('img');
            imageElement.classList.add("img-fluid", "rounded", "w-100", "h-100");
            imageElement.setAttribute('src', item.image_data);
            imageElement.setAttribute('alt', `Image de ${item.nom}`);
            imageElementContainer.appendChild(imageElement);

            // Input pour sélectionner une nouvelle image
            const imageInput = document.createElement('input');
            imageInput.type = "file";
            imageInput.classList.add("form-control", "my-2");
            imageCol.appendChild(imageElementContainer);
            imageCol.appendChild(imageInput);
            descriptionRow.appendChild(imageCol);

            habitatElement.appendChild(descriptionRow);

            
            // Créer une ligne pour le commentaire
            const commentaireRow = document.createElement('h3');
            commentaireRow.classList.add("row", "my-2"); 
            // Créer une colonne pour le commentaire
            const commentaireCol = document.createElement('h3');
            commentaireCol.classList.add("col-md-12"); 

            // Créer un élément pour afficher le texte du commentaire
            const commentaireText = document.createElement('h3'); 
            commentaireText.classList.add("text-center", "text-dark"); 
            commentaireText.innerHTML = decodeHtml(item.commentaire_habitat); 

            // Ajouter le texte au commentaireCol
            commentaireCol.appendChild(commentaireText);

            // Ajouter la colonne à la ligne et la ligne à l'élément parent
            commentaireRow.appendChild(commentaireCol);
            habitatElement.appendChild(commentaireRow);

            // Bouton pour sauvegarder les modifications
            const saveButton = document.createElement('button');
            saveButton.classList.add("btn", "btn-primary", "my-2");
            saveButton.textContent = "Modifier l'habitat";
            saveButton.onclick = () => {
                modifierHabitat(item.id, item.image_data, nameInput.value, descriptionInput.value, imageInput);
            };
            habitatElement.appendChild(saveButton);

            // Ajouter un séparateur horizontal (hr)
            const hrElement = document.createElement('hr');
            habitatElement.appendChild(hrElement);

            // Ajouter l'élément de habitat au conteneur principal
            habitatsContainer.appendChild(habitatElement);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

async function modifierHabitat(habitatId, oldImageData, nom, description, imageInput) {
    const sanitizedNom = sanitizeInput(nom); // Gardez les caractères spéciaux
    const sanitizedDescription = sanitizeInput(description); // Gardez les caractères spéciaux
    let image_data = oldImageData; // Utiliser l'ancienne image par défaut

    // Vérifie si une image a été sélectionnée
    if (imageInput && imageInput.files.length > 0) {
        const file = imageInput.files[0];
        const validImageTypes = ['image/png', 'image/jpeg', 'image/avif'];
        if (!validImageTypes.includes(file.type)) {
            alert('Format d\'image non supporté. Veuillez sélectionner une image PNG, JPEG ou AVIF.');
            return;
        }

        try {
            const base64Image = await readFileAsBase64(file);
            image_data = `data:${file.type};base64,${base64Image}`;
        } catch (error) {
            alert('Erreur lors de la lecture de l\'image.');
            console.error(error);
            return;
        }
    }

    const habitatData = { nom: sanitizedNom, description: sanitizedDescription, image_data };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const response = await fetch(`http://localhost:8000/api/habitat/${habitatId}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(habitatData)
        });

        const textResponse = await response.text(); // Lire la réponse en tant que texte

        // Supprimer le caractère '#' de la réponse si présent
        const cleanedResponse = textResponse.replace(/#/g, '');

        if (!response.ok) {
            // Si la réponse n'est pas OK, tenter de l'analyser comme JSON
            let errorResponse;
            try {
                errorResponse = JSON.parse(cleanedResponse);
                alert(`Erreur lors de la modification du habitat: ${errorResponse.error || response.statusText}`);
            } catch (e) {
                // Afficher la réponse brute en cas d'erreur d'analyse
                console.error("Erreur lors de l'analyse de la réponse:", e);
                alert("Erreur lors de la mise à jour du habitat : " + cleanedResponse);
            }
            return; // Sortir de la fonction après une erreur
        }

        // Si la mise à jour a réussi, essayez de traiter la réponse
        let updatedHabitat;
        try {
            updatedHabitat = JSON.parse(cleanedResponse); // Analyser la réponse comme JSON
            alert("Habitat mis à jour avec succès !");
            location.reload(); // Actualiser la page
        } catch (e) {
            console.error("Erreur lors de l'analyse de la réponse :", e);
            alert("L'Habitat a été mis à jour, mais une erreur s'est produite lors de l'analyse de la réponse.");
        }
    } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur lors de la mise à jour du service : " + error.message);
    }
}

// fonction pour voir les animaux

async function voirAnimal() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const items = await fetchData("http://localhost:8000/api/animal/get", myHeaders);
        const animauxContainer = document.getElementById("voirAnimal");
        animauxContainer.innerHTML = ''; // Effacer le contenu précédent

        const row = document.createElement('div'); // Créez une ligne (row) Bootstrap pour contenir les cartes
        row.classList.add("row");

        items.forEach(item => {

            
            // Création d'un conteneur pour chaque animal
            const animalElement = document.createElement('div');
            animalElement.classList.add("col-lg-3", "col-md-6", "col-sm-12", "mt-3", "d-flex", "justify-content-center");

            

            // Création de la carte de l'animal
            const card = document.createElement('div');
            card.classList.add("card", "shadow-sm", "p-3", "mb-5", "bg-white", "rounded");
            card.style.width = "18rem";

            // Ajout de l'image de l'animal
            const imageElement = document.createElement('img');
            imageElement.classList.add("card-img-top", "img-fluid", "rounded");
            imageElement.setAttribute('src', item.image_data);
            imageElement.setAttribute('alt', `Image de ${item.prenom}`);
            card.appendChild(imageElement);

            // Ajout du prénom en tant que titre
            const cardBody = document.createElement('div');
            cardBody.classList.add("card-body");

            const prenomTitle = document.createElement('h5');
            prenomTitle.classList.add("card-title", "text-center", "text-dark");
            prenomTitle.innerText = decodeHtml(item.prenom);
            cardBody.appendChild(prenomTitle);

            // Bouton pour afficher/cacher les détails
            const toggleButton = document.createElement('button');
            toggleButton.classList.add("btn", "btn-primary", "w-100");
            toggleButton.setAttribute("data-bs-toggle", "collapse");
            toggleButton.setAttribute("data-bs-target", `#collapse${item.id}`); // Cible correcte ici
            toggleButton.innerText = "Voir détails";
            cardBody.appendChild(toggleButton);

            // Détails de l'animal (collapse)
            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add("collapse");
            detailsDiv.setAttribute("id", `collapse${item.id}`); // Correction de l'ID

            const detailsBody = document.createElement('div');
            detailsBody.classList.add("mt-3");

            const detailsTable = `
                <table class="table">
                    <tr><th class="text-dark">Habitat</th><td class="text-dark">${decodeHtml(item.habitat || 'Non spécifié')}</td></tr>
                    <tr><th class="text-dark">Race</th><td class="text-dark">${decodeHtml(item.race || 'Non spécifié')}</td></tr>
                    <tr><th class="text-dark">Nourriture</th><td class="text-dark">${decodeHtml(item.nourriture)}</td></tr>
                    <tr><th class="text-dark">Quantité du dernier repas</th><td class="text-dark pt-4">${decodeHtml(item.grammage)}</td></tr>
                    <tr><th class="text-dark">Heure du repas</th><td class="text-dark">${decodeHtml(item.feeding_time)}</td></tr>
                    <tr><th class="text-dark">Jour du repas</th><td class="text-dark">${decodeHtml(item.created_at.split('T')[0] || 'Non spécifié')}</td></tr>
                    <tr><th class="text-dark">État</th><td class="text-dark">${decodeHtml(item.etat)}</td></tr>
                </table>
            `;
            detailsBody.innerHTML = detailsTable;

            // Ajouter le formulaire de mise à jour
            const updateForm = document.createElement('form');
            updateForm.classList.add("mt-3");

            const grammageInput = document.createElement('input');
            grammageInput.type = 'text'; // Changer à 'text' pour accepter des chaînes
            grammageInput.classList.add("form-control", "mb-2");
            grammageInput.placeholder = "Nouvelle quantité (en grammes)";
            grammageInput.value = item.grammage || ''; // Valeur actuelle ou vide
            
            const feedingTimeInput = document.createElement('input');
            feedingTimeInput.type = 'time';
            feedingTimeInput.classList.add("form-control", "mb-2");
            // Assurez-vous que la valeur est au format "HH:mm"
            feedingTimeInput.value = item.feeding_time || ''; // Valeur actuelle ou vide
            
            const createdAtInput = document.createElement('input');
            createdAtInput.type = 'date';
            createdAtInput.classList.add("form-control", "mb-2");
            // Utilisez la valeur de created_at au format YYYY-MM-DD
            createdAtInput.value = item.created_at ? item.created_at.split('T')[0] : ''; // Assurez-vous d'avoir une valeur

            const updateButton = document.createElement('button');
            updateButton.type = 'button'; // Empêcher le rechargement de la page
            updateButton.classList.add("btn", "btn-primary", "w-100");
            updateButton.innerText = "Mettre à jour";
            updateButton.onclick = async () => {
                const newGrammage = grammageInput.value;
                const newFeedingTime = feedingTimeInput.value; // Cela doit être en format "HH:mm"
                const newCreatedAt = createdAtInput.value; // Cela doit être au format "YYYY-MM-DD"
            
                const updatedAnimal = await updateAnimal(item.id, newGrammage, newFeedingTime, newCreatedAt);
                
                if (updatedAnimal) {
                    // Afficher le message de succès
                    alert('Les données ont bien été modifiées.');
            
                    // Mettez à jour les détails affichés après la mise à jour
                    detailsBody.innerHTML = `
                        <table class="table">
                            <tr><th class="text-dark">Habitat</th><td class="text-dark">${decodeHtml(item.habitat || 'Non spécifié')}</td></tr>
                            <tr><th class="text-dark">Race</th><td class="text-dark">${decodeHtml(item.race || 'Non spécifié')}</td></tr>
                            <tr><th class="text-dark">Nourriture</th><td class="text-dark">${decodeHtml(item.nourriture || 'Non spécifié')}</td></tr>
                            <tr><th class="text-dark">Quantité du dernier repas</th><td class="text-dark pt-4">${decodeHtml(updatedAnimal.grammage || 'Non spécifié')}</td></tr>
                            <tr><th class="text-dark">Heure du repas</th><td class="text-dark">${decodeHtml(updatedAnimal.feeding_time || 'Non spécifié')}</td></tr>
                            <tr><th class="text-dark">Jour du repas</th><td class="text-dark">${decodeHtml(updatedAnimal.created_at || 'Non spécifié')}</td></tr>
                            <tr><th class="text-dark">État</th><td class="text-dark">${decodeHtml(item.etat || 'Non spécifié')}</td></tr>
                        </table>
                    `;
                }
            };
            
            
            updateForm.appendChild(grammageInput);
            updateForm.appendChild(feedingTimeInput);
            updateForm.appendChild(createdAtInput);
            updateForm.appendChild(updateButton);

            detailsBody.appendChild(updateForm);

            // Ajouter les rapports vétérinaires (liste des détails)
            if (item.rapport_veterinaire && item.rapport_veterinaire.length > 0) {
                const rapportTitle = document.createElement('h6');
                rapportTitle.classList.add("text-dark", "mt-3");
                rapportTitle.innerText = "Rapport du Vétérinaire:";
                detailsBody.appendChild(rapportTitle);

                const rapportList = document.createElement('ul');
                rapportList.classList.add("list-group");

                item.rapport_veterinaire.forEach(rapport => {
                    const rapportItem = document.createElement('li');
                    rapportItem.classList.add("list-group-item", "text-dark");
                    rapportItem.innerText = decodeHtml(rapport.detail);
                    rapportList.appendChild(rapportItem);
                });

                detailsBody.appendChild(rapportList);
            } else {
                // Si pas de rapport, afficher un message
                const noRapportMessage = document.createElement('p');
                noRapportMessage.classList.add("text-dark", "mt-3");
                noRapportMessage.innerText = "Aucun rapport n'est disponible.";
                detailsBody.appendChild(noRapportMessage);
            }

            detailsDiv.appendChild(detailsBody);
            cardBody.appendChild(detailsDiv);

            // Ajouter le corps de la carte au conteneur principal
            card.appendChild(cardBody);
            animalElement.appendChild(card);

            // Ajouter la carte dans la rangée
            row.appendChild(animalElement);
        });

        // Ajouter la rangée dans le conteneur d'animaux
        animauxContainer.appendChild(row);

    } catch (error) {
        console.error("Error:", error);
    }
}

async function updateAnimal(id, grammage, feeding_time, created_at) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = {
        grammage: grammage,
        feeding_time: feeding_time,
        created_at: created_at
    };

    try {
        const response = await fetch(`http://localhost:8000/api/animal/${id}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(data)
        });

        const textResponse = await response.text(); // Lire la réponse en tant que texte

        // Supprimer le caractère '#' de la réponse si présent
        const cleanedResponse = textResponse.replace(/#/g, '');

        if (!response.ok) {
            let errorResponse;
            try {
                errorResponse = JSON.parse(cleanedResponse);
                alert(`Erreur lors de la mise à jour de l'animal : ${errorResponse.error || response.statusText}`);
            } catch (e) {
                alert("Erreur lors de la mise à jour de l'animal : " + cleanedResponse);
            }
            return; // Sortir de la fonction après une erreur
        }

        let updatedAnimal;
        try {
            updatedAnimal = JSON.parse(cleanedResponse); // Analyser la réponse comme JSON
            return updatedAnimal.animal; // Retourner l'animal mis à jour
        } catch (e) {
            alert("L'animal a été mis à jour, mais une erreur s'est produite lors de l'analyse de la réponse.");
        }
    } catch (error) {
        alert("Erreur lors de la mise à jour de l'animal : " + error.message);
    }
}




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
    try {
        const items = await fetchFromApi("api/service/get")

        const servicesContainer = document.getElementById("voirService");
        servicesContainer.innerHTML = ''; // Effacer le contenu précédent

        items.forEach(item => {

            const serviceElement = document.createElement('div');
            serviceElement.classList.add("container", "text-center", "mb-4"); 

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
            serviceElement.appendChild(nameRow);

            // Ligne pour la description et l'image
            const descriptionRow = document.createElement('div');
            descriptionRow.classList.add("row", "align-items-center");

            // Colonne pour la description
            const descriptionCol = document.createElement('div');
            descriptionCol.classList.add("col-md-6"); 
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
    const sanitizedNom = sanitizeInput(nom); 
    const sanitizedDescription = sanitizeInput(description); 
    let image_data = oldImageData; 

    // Vérifier si une image a été sélectionnée
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
            return;
        }
    }

    const serviceData = { nom: sanitizedNom, description: sanitizedDescription, image_data };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        
        const response = await fetchFromApi(`api/service/${serviceId}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(serviceData)
        });

        alert("Service mis à jour avec succès !");
        console.log("Réponse de l'API :", response);
    } catch (error) {
    }
}

async function voirAvis() {
    try {
        const items = await fetchFromApi("api/avis/get");

        const avissContainer = document.getElementById("voirAvis");
        avissContainer.innerHTML = ''; 

        items.forEach(item => {
            // Création du conteneur pour chaque avis
            const avisElement = document.createElement('div');
            avisElement.classList.add("container", "text-start", "text-dark", "py-4", 'my-1', "border", "border-primary", "rounded");

            // Ajout du pseudo
            const avisPseudo = document.createElement('h5');
            avisPseudo.classList.add("ms-2");
            avisPseudo.textContent = decodeHtml(item.pseudo);
            avisElement.appendChild(avisPseudo);

            // Création d'une ligne pour le commentaire et les boutons
            const rowElement = document.createElement('div');
            rowElement.classList.add("d-flex", "align-items-center", "justify-content-between");

            // Ajout du commentaire
            const commentaireElement = document.createElement('p');
            commentaireElement.classList.add("col", "text-start");
            commentaireElement.textContent = decodeHtml(item.commentaire);
            rowElement.appendChild(commentaireElement);

            // Création du bouton pour afficher/cacher l'avis
            const visibleElement = document.createElement('button');
            visibleElement.classList.add("btn", 'fw-bold', 'btn-sm');
            btnModifierAvis(visibleElement, item.isVisible);

            // Écouteur d'événements pour le bouton de visibilité
            visibleElement.addEventListener('click', async () => {
                const newValue = !item.isVisible;

                try {
                    await modifierAvis(item.id, newValue);
                    item.isVisible = newValue;
                    btnModifierAvis(visibleElement, newValue);
                } catch (error) {
                    console.error(`Failed to toggle visibility for avis ${item.id}:`, error);
                    alert(`Une erreur est survenue lors de la mise à jour de la visibilité pour l'avis ${item.id}.`);
                }
            });

            // Création du bouton de suppression
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('btn', 'btn-danger', 'fw-bold', 'btn-sm', 'ms-2');
            deleteButton.textContent = "Supprimer";

            // Écouteur d'événements pour le bouton de suppression
            deleteButton.addEventListener('click', async () => {
                const confirmDelete = confirm("Voulez-vous vraiment supprimer cet avis ?");
                if (confirmDelete) {
                    try {
                        await supprimerAvis(item.id);
                        avisElement.remove(); 
                    } catch (error) {
                        console.error(`Failed to delete avis ${item.id}:`, error);
                        alert(`Une erreur s'est produite lors de la suppression de l'avis ${item.id}.`);
                    }
                }
            });

            // Regroupement des boutons
            const buttonGroup = document.createElement('div');
            buttonGroup.classList.add('d-flex', 'gap-2');

            buttonGroup.appendChild(visibleElement);
            buttonGroup.appendChild(deleteButton);
            rowElement.appendChild(buttonGroup);
            avisElement.appendChild(rowElement);
            avissContainer.appendChild(avisElement);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des avis :", error);
        alert("Erreur lors de la récupération des avis : " + error.message);
    }
}

// Fonction pour mettre à jour le bouton de visibilité
function btnModifierAvis(button, isVisible) {
    button.classList.toggle('btn-primary', isVisible);
    button.classList.toggle('btn-secondary', !isVisible);
    button.innerHTML = isVisible ? 'Avis Affiché' : 'Avis Caché';
}

async function modifierAvis(avisId, newValue) {
    const requestData = {
        isVisible: newValue
    };

    try {
        const response = await fetchFromApi(`api/avis/${avisId}`, {
            method: 'PUT',
            body: JSON.stringify(requestData),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response; 
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'avis ${avisId}:`, error);
        alert(`Une erreur s'est produite lors de la mise à jour de l'avis. Détails : ${error.message}`);
        throw error; 
    }
}

async function supprimerAvis(id) {
    try {
        const deleteRequestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        await fetchFromApi(`api/avis/${id}`, deleteRequestOptions);

        alert(`L'avis a été supprimé avec succès.`);
    } catch (error) {
        console.error("Erreur lors de la suppression de l'avis:", error);
        alert(`Une erreur s'est produite lors de la suppression de l'avis ${id}. Détails : ${error.message}`);
        throw error; 
    }
}

// Fonction pour voir et modifier les habitats
async function voirHabitat() {
    try {
        const items = await fetchFromApi("api/habitat/get")

        const habitatsContainer = document.getElementById("voirHabitat");
        habitatsContainer.textContent = ''; 

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
            descriptionCol.classList.add("col-md-6"); 
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
            commentaireText.textContent = decodeHtml(item.commentaire_habitat); 

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
    const sanitizedNom = sanitizeInput(nom); 
    const sanitizedDescription = sanitizeInput(description);
    let image_data = oldImageData; 

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
        const response = await fetchFromApi(`api/habitat/${habitatId}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(habitatData)
        });

        alert("Habitat mis à jour avec succès !");
        console.log("Réponse de l'API :", response); 
    } catch (error) {
        console.error("Erreur lors de la mise à jour du habitat :", error);
        alert("Erreur lors de la mise à jour du habitat : " + error.message);
    }
}

// fonction pour voir et modifier les animaux
async function voirAnimal() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
        const items = await fetchFromApi("api/animal/get")
        const animauxContainer = document.getElementById("voirAnimal");
        animauxContainer.innerHTML = ''; 

        const row = document.createElement('div');
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
            toggleButton.setAttribute("data-bs-target", `#collapse${item.id}`);
            toggleButton.innerText = "Voir détails";
            cardBody.appendChild(toggleButton);

            // Détails de l'animal (collapse)
            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add("collapse");
            detailsDiv.setAttribute("id", `collapse${item.id}`); 

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
            grammageInput.type = 'text'; 
            grammageInput.classList.add("form-control", "mb-2");
            grammageInput.placeholder = "Nouvelle quantité (en grammes)";
            grammageInput.value = item.grammage || ''; 
            
            const feedingTimeInput = document.createElement('input');
            feedingTimeInput.type = 'time';
            feedingTimeInput.classList.add("form-control", "mb-2");
            feedingTimeInput.value = item.feeding_time || ''; 
            
            const createdAtInput = document.createElement('input');
            createdAtInput.type = 'date';
            createdAtInput.classList.add("form-control", "mb-2");
            createdAtInput.value = item.created_at ? item.created_at.split('T')[0] : '';

            const updateButton = document.createElement('button');
            updateButton.type = 'button';
            updateButton.classList.add("btn", "btn-primary", "w-100");
            updateButton.innerText = "Mettre à jour";
            updateButton.onclick = async () => {
                const newGrammage = grammageInput.value;
                const newFeedingTime = feedingTimeInput.value; 
                const newCreatedAt = createdAtInput.value; 
            
                const updatedAnimal = await modifierAnimal(item.id, newGrammage, newFeedingTime, newCreatedAt);
                
                if (updatedAnimal) {        
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

            // Ajout les rapports vétérinaires
            if (item.rapport_veterinaire && item.rapport_veterinaire.length > 0) {
                const rapportTitle = document.createElement('h6');
                rapportTitle.classList.add("text-dark", "mt-3");
                rapportTitle.innerText = "Rapport du Vétérinaire:";
                detailsBody.appendChild(rapportTitle);

                const rapportList = document.createElement('p');

                item.rapport_veterinaire.forEach(rapport => {
                    const rapportItem = document.createElement('p');
                    rapportItem.classList.add("text-dark","border",'rounded');
                    rapportItem.innerText = decodeHtml(rapport.detail);
                    rapportList.appendChild(rapportItem);
                });

                detailsBody.appendChild(rapportList);
            } else {
                const noRapportMessage = document.createElement('p');
                noRapportMessage.classList.add("text-dark", "mt-3");
                noRapportMessage.innerText = "Aucun rapport n'est disponible.";
                detailsBody.appendChild(noRapportMessage);
            }

            detailsDiv.appendChild(detailsBody);
            cardBody.appendChild(detailsDiv);

            // Ajout le corps de la carte au conteneur principal
            card.appendChild(cardBody);
            animalElement.appendChild(card);

            // Ajout la carte dans la rangée
            row.appendChild(animalElement);
        });
        // Ajout la rangée dans le conteneur d'animaux
        animauxContainer.appendChild(row);

    } catch (error) {
        console.error("Error:", error);
    }
}

async function modifierAnimal(id, grammage, feeding_time, created_at) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = {
        grammage: grammage,
        feeding_time: feeding_time,
        created_at: created_at
    };

    try {
        const response = await fetchFromApi(`api/animal/${id}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(data)
        });

        alert("Animal mis à jour avec succès !");
        console.log("Réponse de l'API :", response); 
        return response.animal; 
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'animal :", error);
        alert("Erreur lors de la mise à jour de l'animal : " + error.message);
    }
}

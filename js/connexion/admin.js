const voirAnimaux = document.getElementById("voirAnimal");
if (document.readyState !== "loading") {
  voirAnimal();
  voirService();
  voirHoraire();
  voirHabitat();
  voirRace();
  voirAnimalStat();
}

// Fonction pour voir et modifier les horaires
async function voirHoraire() {
    try {
        const items = await fetchFromApi("api/horaire/get")
        const horairesContainer = document.getElementById("voirHoraire");
        horairesContainer.innerHTML = ''; // Vide le conteneur avant d'ajouter les nouveaux éléments

        items.forEach(item => {
            // Création des éléments de manière sécurisée
            const horaireElement = document.createElement('div');
            horaireElement.classList.add("container","d-flex","flex-column");

            // Créer et insérer le titre avec un input
            const horaireTitleInput = document.createElement('input');
            horaireTitleInput.type = 'text';
            horaireTitleInput.value = decodeHtml(item.titre.replace(/^#/, '')); 5
            horaireTitleInput.classList.add('rounded','border','border-primary',"text-center", "text-dark",'my-2'); 
            horaireElement.appendChild(horaireTitleInput);

            // Ajouter un champ pour la description avec un input
            const messageInput = document.createElement('input');
            messageInput.type = 'text';
            messageInput.value = decodeHtml(item.message.replace(/^#/, ''));
            messageInput.classList.add('rounded','border','border-primary',"text-center", "text-dark",'my-2');
            horaireElement.appendChild(messageInput);

            // Créer des inputs pour l'heure de début et l'heure de fin
            const heureDebutInput = document.createElement('input');
            heureDebutInput.type = 'time';
            heureDebutInput.value = decodeHtml(item.heure_debut.replace(/^#/, '')); 
            heureDebutInput.classList.add('rounded','border','border-primary',"text-center", "text-dark",'my-2');

            horaireElement.appendChild(heureDebutInput);

            const heureFinInput = document.createElement('input');
            heureFinInput.type = 'time';
            heureFinInput.value = decodeHtml(item.heure_fin.replace(/^#/, '')); 
            heureFinInput.classList.add('rounded','border','border-primary',"text-center", "text-dark",'my-2');

            horaireElement.appendChild(heureFinInput);

            // Ajouter un champ pour le jour avec un input
            const jourInput = document.createElement('input');
            jourInput.type = 'text';
            jourInput.value = decodeHtml(item.jour.replace(/^#/, ''));
            jourInput.classList.add('rounded','border','border-primary',"text-center", "text-dark",'my-2');
            
            horaireElement.appendChild(jourInput);

            // Ajouter un bouton pour sauvegarder les modifications
            const saveButton = document.createElement('button');
            saveButton.classList.add("btn", "btn-primary", "my-2");
            saveButton.textContent = "Sauvegarder";
            saveButton.onclick = async () => {
                await modifierHoraire(item.id, {
                    titre: horaireTitleInput.value,
                    message: messageInput.value,
                    jour: jourInput.value,
                    heure_debut: heureDebutInput.value,
                    heure_fin: heureFinInput.value
                });
            };
            horaireElement.appendChild(saveButton);

            // Ajouter l'élément de service au conteneur principal
            horairesContainer.appendChild(horaireElement);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

async function modifierHoraire(horaireId, { titre, message, jour, heure_debut, heure_fin }) {
    // Vérifier si tous les champs sont remplis
    if (!titre || !message || !jour || !heure_debut || !heure_fin) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    const horaireData = { titre, message, jour, heure_debut, heure_fin };

    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());
    myHeaders.append("Content-Type", "application/json");

    try {
        // Utiliser fetchFromApi pour envoyer la requête PUT pour mettre à jour le service
       await fetchFromApi(`api/horaire/${horaireId}`, { 
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(horaireData)
        });

        alert("Horaire mis à jour avec succès !");
        location.reload(); // Actualiser la page après succès

    } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur lors de la mise à jour de l'horaire : " + error.message); // Afficher le message d'erreur
    }
}

// fonction CRUD sur les services 
      function ouvrirModal(serviceId, oldImageData, nom, description) {
        // Ouvrir le modal
        $('#editServiceModal').modal('show');
    
        // Pré-remplir les champs du modal avec les données du service
        const serviceIdInput = document.getElementById('serviceId');
        const serviceNameInput = document.getElementById('serviceName');
        const serviceDescriptionInput = document.getElementById('serviceDescription');
        const imageInput = document.getElementById('image_data');
    
        if (serviceIdInput) serviceIdInput.value = serviceId;
        if (serviceNameInput) serviceNameInput.value = decodeHtml(nom); // Décoder le nom
        if (serviceDescriptionInput) serviceDescriptionInput.value = decodeHtml(description); // Décoder la description
        if (imageInput) imageInput.value = ''; // Réinitialiser l'input d'image
    
        const confirmBtn = document.getElementById('editServiceForm');
        confirmBtn.onsubmit = (event) => {
            event.preventDefault(); // Empêche la soumission par défaut du formulaire
            modifierService(serviceId, oldImageData); // Passer l'ID et l'ancienne image
            $('#editServiceModal').modal('hide'); // Fermer le modal après soumission
        };
    }
    
    async function voirService() {
        try {
            const items = await fetchFromApi("api/service/get")
    
            const servicesContainer = document.getElementById("voirService");
            servicesContainer.innerHTML = ''; // Vide le conteneur avant d'ajouter les nouveaux éléments
    
            items.forEach(item => {
                // Création des éléments de manière sécurisée
                const serviceElement = document.createElement('div');
                serviceElement.classList.add("container", "text-center","text-dark");
    
                // Créer et insérer le titre
                const serviceTitle = document.createElement('h2');
                serviceTitle.classList.add("my-4");
                serviceTitle.textContent = decodeHtml(item.nom); // Décoder le nom
                serviceElement.appendChild(serviceTitle);
    
                // Ajouter la description
                const descriptionElement = document.createElement('p');
                descriptionElement.textContent = decodeHtml(item.description); // Décoder la description
                serviceElement.appendChild(descriptionElement);
    
                // Ajouter l'image
                const imageElement = document.createElement('img');
                imageElement.classList.add("img-fluid", "rounded", "w-100", "h-100");
                imageElement.setAttribute('src', item.image_data);
                imageElement.setAttribute('alt', `Image de ${decodeHtml(item.nom)}`); // Décoder le nom pour l'alt
                serviceElement.appendChild(imageElement);
    
                // Ajouter le bouton Modifier
                const modifyServiceButton = document.createElement('button');
                modifyServiceButton.classList.add("btn", "btn-primary", "m-2");
                modifyServiceButton.textContent = "Modifier";
                modifyServiceButton.onclick = () => {
                    ouvrirModal(item.id, item.image_data, item.nom, item.description); // Ouvre le modal avec les données du service
                };
                serviceElement.appendChild(modifyServiceButton);
    
                // Ajouter le bouton Supprimer
                const deleteButton = document.createElement('button');
                deleteButton.classList.add("btn", "btn-danger", "m-2");
                deleteButton.textContent = "Supprimer";
                deleteButton.onclick = () => {
                    supprimerService(item.id); // Appelle la fonction pour supprimer le service
                };
                serviceElement.appendChild(deleteButton);
    
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
    
    async function modifierService(serviceId, oldImageData) {
        const nom = sanitizeInput(document.getElementById('serviceName').value); // Garder les caractères spéciaux
        const description = sanitizeInput(document.getElementById('serviceDescription').value); // Garder les caractères spéciaux
        const imageInput = document.getElementById('image_data'); // Utiliser l'input d'image
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
    
        const serviceData = { nom, description, image_data };
    
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        try {
            // Utiliser fetchFromApi pour envoyer la requête PUT pour mettre à jour le service
            const response = await fetchFromApi(`api/service/${serviceId}`, {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(serviceData)
            });
    
            // Lire la réponse en tant que texte pour effectuer des opérations sur le contenu
            const textResponse = typeof response === 'string' ? response : JSON.stringify(response);
    
            // Supprimer le caractère '#' de la réponse si présent
            const cleanedResponse = textResponse.replace(/#/g, '');
    
            // Tenter de parser la réponse nettoyée en JSON
            let updatedService;
            try {
                updatedService = JSON.parse(cleanedResponse);
                alert("Service mis à jour avec succès !");
                voirService(); // Appeler la fonction pour afficher le service mis à jour
            } catch (e) {
                throw new Error(`Erreur lors de la mise à jour du service: ${cleanedResponse}`); // Afficher le texte brut si l'analyse échoue
            }
        } catch (error) {
            alert("Erreur lors de la mise à jour du service : " + error.message); // Afficher le message d'erreur
        }
    }
    
    
    async function supprimerService(serviceId) {
        const myHeaders = new Headers();
        myHeaders.append("X-AUTH-TOKEN", getToken()); // Assurez-vous que la fonction getToken() retourne un jeton valide
        myHeaders.append("Content-Type", "application/json");
        try {
            // Utiliser fetchFromApi pour envoyer la requête PUT pour mettre à jour le service
           await fetchFromApi(`api/service/${serviceId}`, { 
                method: 'DELETE',
                headers: myHeaders
            });
    
            alert("Service supprimé avec succès !");
            voirService(); 
        } catch (error) {
            alert("Erreur lors de la suppression du service : " + error.message);
        }
    }
    
 // Fonction pour ouvrir la modal des habitats
 function ouvrirModalHabitat(habitatId, oldImageData, nom, description) {
    // Ouvrir le modal
    $('#editHabitatModal').modal('show');

    // Pré-remplir les champs du modal avec les données de l'habitat
    const habitatIdInput = document.getElementById('habitatId');
    const habitatNameInput = document.getElementById('habitatNom');
    const habitatDescriptionInput = document.getElementById('habitatDescription');
    const imageInput = document.getElementById('habitatImage_data');

    // Remplir les champs avec les valeurs reçues
    if (habitatIdInput) habitatIdInput.value = habitatId;
    if (habitatNameInput) habitatNameInput.value = decodeHtml(nom); // Décoder le nom
    if (habitatDescriptionInput) habitatDescriptionInput.value = decodeHtml(description); // Décoder la description
    if (imageInput) imageInput.value = ''; // Réinitialiser l'input d'image

    // Ajoutez l'événement de soumission du formulaire pour modifier l'habitat
    const confirmBtn = document.getElementById('editHabitatForm');
    confirmBtn.onsubmit = (event) => {
        event.preventDefault(); // Empêche la soumission par défaut du formulaire
        modifierHabitat(habitatId, oldImageData); // Appelle la fonction de modification de l'habitat
        $('#editHabitatModal').modal('hide'); // Fermer le modal après soumission
    };
}

// Fonction pour voir les habitats et les afficher
async function voirHabitat() {
    try {
        const items = await fetchFromApi("api/habitat/get")

        const habitatsContainer = document.getElementById("voirHabitat");
        habitatsContainer.innerHTML = ''; // Vide le conteneur avant d'ajouter les nouveaux éléments

        items.forEach(item => {
            // Création des éléments de manière sécurisée
            const habitatElement = document.createElement('div');
            habitatElement.classList.add("container", "text-center","text-dark");

            // Créer et insérer le titre
            const habitatTitle = document.createElement('h2');
            habitatTitle.classList.add("my-4");
            habitatTitle.textContent = decodeHtml(item.nom); // Décoder le nom
            habitatElement.appendChild(habitatTitle);

            // Ajouter la description
            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = decodeHtml(item.description); // Décoder la description
            habitatElement.appendChild(descriptionElement);

            // Ajouter l'image
            const imageElement = document.createElement('img');
            imageElement.classList.add("img-fluid", "rounded", "w-100", "h-100");
            imageElement.setAttribute('src', item.image_data);
            imageElement.setAttribute('alt', `Image de ${decodeHtml(item.nom)}`); // Décoder le nom pour l'alt
            habitatElement.appendChild(imageElement);

            // Ajouter le bouton Modifier
            const modifyHabitatButton = document.createElement('button');
            modifyHabitatButton.classList.add("btn", "btn-primary", "m-2");
            modifyHabitatButton.textContent = "Modifier";
            modifyHabitatButton.onclick = () => {
                ouvrirModalHabitat(item.id, item.image_data, item.nom, item.description); // Ouvre le modal avec les données de l'habitat
            };
            habitatElement.appendChild(modifyHabitatButton);

            // Ajouter le bouton Supprimer
            const deleteButton = document.createElement('button');
            deleteButton.classList.add("btn", "btn-danger", "m-2");
            deleteButton.textContent = "Supprimer";
            deleteButton.onclick = () => {
                supprimerHabitat(item.id); // Appelle la fonction pour supprimer l'habitat
            };
            habitatElement.appendChild(deleteButton);

            // Ajouter un séparateur horizontal (hr)
            const hrElement = document.createElement('hr');
            habitatElement.appendChild(hrElement);

            // Ajouter l'élément d'habitat au conteneur principal
            habitatsContainer.appendChild(habitatElement);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

// Fonction pour modifier l'habitat
async function modifierHabitat(habitatId, oldImageData) {
    const nom = sanitizeInput(document.getElementById('habitatNom').value); // Garde les caractères spéciaux
    const description = sanitizeInput(document.getElementById('habitatDescription').value); // Garde les caractères spéciaux
    const imageInput = document.getElementById('habitatImage_data'); // Utiliser l'input d'image
    let image_data = oldImageData; // Utiliser l'ancienne image par défaut

    // Vérifie si une nouvelle image a été sélectionnée
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

    const habitatData = { nom, description, image_data };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        await fetchFromApi(`api/habitat/${habitatId}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(habitatData)
        });

        const cleanedResponse = textResponse.replace(/#/g, '');

        let updatedHabitat;
        try {
            updatedHabitat = JSON.parse(cleanedResponse); // Analyser la réponse nettoyée
            alert("Habitat mis à jour avec succès !");
            voirHabitat(); // Recharger les habitats
        } catch (e) {
        }
    } catch (error) {
    }
}

    async function supprimerHabitat(habitatId) {
        const myHeaders = new Headers();
        myHeaders.append("X-AUTH-TOKEN", getToken());
        myHeaders.append("Content-Type", "application/json");
    
        try {
            // Utiliser fetchFromApi pour envoyer la requête PUT pour mettre à jour le service
           await fetchFromApi(`api/habitat/${habitatId}`, { 
                method: 'DELETE',
                headers: myHeaders
            });
    
            if (!response.ok) {
                throw new Error(`Erreur lors de la suppression de l'habitat: ${response.statusText}`);
            }
    
            alert("Habitat supprimé avec succès !");
            voirHabitat(); // Recharge la liste des habitats
        } catch (error) {
            alert("Erreur lors de la suppression de l'habitat : " + error.message);
        }
    }
    
// Fonction pour voir les animaux et les afficher
async function voirAnimal() {
    try {
        const items = await fetchFromApi("api/animal/get")

        const animalsContainer = document.getElementById("voirAnimal");
        animalsContainer.innerHTML = ''; // Vide le conteneur avant d'ajouter les nouveaux éléments

        items.forEach(item => {
            // Création de l'élément principal de l'animal
            const animalElement = document.createElement('div');
            animalElement.classList.add("container", "my-4");

            // Créer et insérer le titre de l'animal
            const animalTitle = document.createElement('h2');
            animalTitle.classList.add("text-center", "w-100"); // Centrer le titre
            animalTitle.textContent = decodeHtml(item.prenom); // Décoder le prénom
            animalsContainer.appendChild(animalTitle); // Ajouter le titre avant les colonnes

            // Créer un conteneur pour les informations (labels et valeurs en deux colonnes)
            const infoRow = document.createElement('div');
            infoRow.classList.add("row", "w-100", "mb-4"); 

            // Colonne pour les valeurs
            const valueColumn = document.createElement('div');
            valueColumn.classList.add("col-md-12", "text-center"); 

            const values = [
                { label: 'Son ETAT:', value: decodeHtml(item.etat) },
                { label: 'Nourriture:', value: decodeHtml(item.nourriture) },
                { label: 'Grammage:', value: item.grammage },
                { label: 'Heure du dernier repas:', value: item.feeding_time },
                { label: 'Jour du dernier repas:', value: item.created_at},
                { label: 'Habitat:', value: decodeHtml(item.habitat) },
                { label: 'Race:', value: decodeHtml(item.race) }
            ];
            
            values.forEach(({ label, value }) => {
                const rowElement = document.createElement('div');
                rowElement.classList.add('row','ms-2','mb-2','border','border-primary','rounded');

                // Label en gras
                const labelElement = document.createElement('div');
                labelElement.classList.add('col-md-6', 'text-left'); 
                labelElement.innerHTML = `<p>${label}</p>`; 

                // Valeur normale
                const valueElement = document.createElement('div');
                valueElement.classList.add('col-md-6', 'text-left'); // Aligné à gauche
                valueElement.textContent = value;

                rowElement.appendChild(labelElement);
                rowElement.appendChild(valueElement);
                valueColumn.appendChild(rowElement); 
            });
            
            // Ajouter les colonnes de labels et de valeurs à la ligne d'informations
            infoRow.appendChild(valueColumn);
            
            // Ajouter la ligne d'informations (les deux colonnes) à l'élément principal
            animalElement.appendChild(infoRow);
            
            // Ajouter les boutons Modifier et Supprimer sous les informations
            const buttonRow = document.createElement('div');
            buttonRow.classList.add("d-flex", "justify-content-center", "my-3");
            
            const modifyAnimalButton = document.createElement('button');
            modifyAnimalButton.classList.add("btn", "btn-primary", "m-2");
            modifyAnimalButton.textContent = "Modifier";
            modifyAnimalButton.onclick = () => {
                ouvrirModalAnimal(
                    item.id,
                    item.image_data,
                    item.prenom,
                    item.etat,
                    item.nourriture,
                    item.grammage,
                    item.feeding_time,
                    item.created_at,
                    item.habitat,
                    item.race.label
                );
            };

            const deleteButton = document.createElement('button');
            deleteButton.classList.add("btn", "btn-danger", "m-2");
            deleteButton.textContent = "Supprimer";
            deleteButton.onclick = () => {
                supprimerAnimal(item.id); // Appelle la fonction pour supprimer l'animal
            };

            buttonRow.appendChild(modifyAnimalButton);
            buttonRow.appendChild(deleteButton);
            animalElement.appendChild(buttonRow);

            // Ajouter l'image en dessous des informations et des boutons
            const imageElement = document.createElement('img');
            imageElement.classList.add("img-fluid", "rounded", "w-100", "h-auto", "my-3");
            imageElement.setAttribute('src', item.image_data);
            imageElement.setAttribute('alt', `Image de ${decodeHtml(item.prenom)}`); // Décoder le prénom pour l'alt
            animalElement.appendChild(imageElement);

            // Ajouter l'élément de l'animal au conteneur principal
            animalsContainer.appendChild(animalElement);

            // Ajouter un séparateur horizontal (hr)
            const hrElement = document.createElement('hr');
            animalsContainer.appendChild(hrElement);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

// Fonction pour ouvrir la modal d'édition de l'animal
async function ouvrirModalAnimal(animalId, oldImageData, prenom, etat, nourriture, grammage, feeding_time, created_at, habitat,race) {
    // Charger les options d'habitats et de races
    await voirHabitatAnimal(); // Fonction pour peupler les habitats
    await voirRaceAnimal(); // Fonction pour peupler les races

    // Ouvrir le modal
    $('#editAnimalModal').modal('show');

    // Pré-remplir les champs du modal avec les données de l'animal
    document.getElementById('animalId').value = animalId || '';
    document.getElementById('animalPrenom').value = prenom || '';
    document.getElementById('animalEtat').value = etat || '';
    document.getElementById('animalNourriture').value = nourriture || '';
    document.getElementById('animalGrammage').value = grammage || '';
    document.getElementById('animalFeedingTime').value = feeding_time || '';
    document.getElementById('animalCreatedAt').value = created_at || '';
    
    // Sélectionner l'habitat et la race dans les listes déroulantes
    document.getElementById('voirNomHabitatPut').value = habitat || '';
    document.getElementById('voirNomRacePut').value = race || ''; 
    
    // Réinitialiser l'input d'image
    document.getElementById('image_dataAnimal').value = '';

    // Gérer la soumission du formulaire
    const confirmBtn = document.getElementById('editAnimalForm');
    confirmBtn.onsubmit = (event) => {
        event.preventDefault(); // Empêche la soumission par défaut du formulaire
        modifierAnimal(animalId, oldImageData); // Passer l'ID et l'ancienne image
        $('#editAnimalModal').modal('hide'); // Fermer le modal après soumission
    };
}

async function voirHabitatAnimal() {
    try {
        const habitats = await fetchFromApi("api/habitat/get")

        const habitatSelect = document.getElementById('voirNomHabitatPut');
        habitatSelect.innerHTML = '<option value="" disabled selected>Sélectionner un habitat</option>';

        habitats.forEach(habitat => {
            const option = document.createElement('option');
            option.value = habitat.id; // Utiliser l'ID de l'habitat comme valeur
            option.textContent = habitat.nom; // Afficher le nom de l'habitat
            habitatSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des habitats:", error);
    }
}

// Fonction pour afficher et peupler la liste des races
async function voirRaceAnimal() {
    try {
        const races = await fetchFromApi("api/race/get")

        const raceSelect = document.getElementById('voirNomRacePut');
        raceSelect.innerHTML = '<option value="" disabled selected>Sélectionner une race</option>';

        races.forEach(race => {
            const option = document.createElement('option');
            option.value = race.id; // Utiliser l'ID de la race comme valeur
            option.textContent = race.label; // Afficher le nom de la race
            raceSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des races:", error);
    }
}

async function modifierAnimal(animalId, oldImageData) {
    const prenom = sanitizeInput(document.getElementById('animalPrenom').value);
    const etat = sanitizeInput(document.getElementById('animalEtat').value);
    const nourriture = sanitizeInput(document.getElementById('animalNourriture').value);
    const grammage = document.getElementById('animalGrammage').value;
    const feeding_time = document.getElementById('animalFeedingTime').value;
    const created_at = document.getElementById('animalCreatedAt').value;
    const habitat = document.getElementById('voirNomHabitatPut').value;
    const race = document.getElementById('voirNomRacePut').value; // Renommer race à label
    const imageInput = document.getElementById('image_dataAnimal');
    let image_data = oldImageData;


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

    const animalData = { prenom, etat, nourriture, grammage, feeding_time, created_at, habitat, race, image_data };
    try {
        const response = await fetchFromApi(`api/animal/${animalId}`, { 
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(animalData)
        });

        if (!response.ok) {
            const errorResponse = await response.text();
            throw new Error(`Erreur lors de la modification de l'animal: ${errorResponse}`);
        }

        alert("Animal mis à jour avec succès !");
        voirAnimal(); 
    } catch (error) {
    }
}


// Fonction pour supprimer un animal
async function supprimerAnimal(animalId) {
    const myHeaders = new Headers({
        "X-AUTH-TOKEN": getToken(),
        "Content-Type": "application/json"
    });
    try {
       await fetchFromApi(`api/animal/${animalId}`, { 
            method: 'DELETE',
            headers: myHeaders
        });

        alert("Animal supprimé avec succès !");
        voirAnimal(); 
    } catch (error) {
        alert("Erreur lors de la suppression de l'animal : " + error.message);
    }
}



async function voirAnimalStat() {
    try {
        const animals = await fetchFromApi(`api/animal/get`);
        const animalContainer = document.getElementById("voirAnimalStats");

        if (!animalContainer) {
            console.error("Container 'voirAnimalStats' introuvable.");
            return;
        }

        // Vider le contenu existant
        animalContainer.textContent = '';

        // Créer un élément tableau
        const table = document.createElement('table');
        table.classList.add("table", "table-striped", "table-bordered", "text-center");

        // Créer l'en-tête du tableau
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Prénom', 'Image', 'Visites'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Créer le corps du tableau
        const tbody = document.createElement('tbody');

        animals.forEach(animal => {
            if (!animal.image_data || !animal.prenom || animal.visits == null) {
                console.warn("Données manquantes pour un animal:", animal);
                return;
            }

            const row = document.createElement('tr');

            const prenomCell = document.createElement('td');
            prenomCell.textContent = animal.prenom;

            const imageCell = document.createElement('td');
            const imageElement = document.createElement('img');
            imageElement.src = animal.image_data;
            imageElement.alt = `Image de ${animal.prenom}`;
            imageElement.style.width = '100px'; // Ajustez la taille si nécessaire
            imageCell.appendChild(imageElement);

            const visitsCell = document.createElement('td');
            visitsCell.textContent = animal.visits;

            row.appendChild(prenomCell);
            row.appendChild(imageCell);
            row.appendChild(visitsCell);
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        animalContainer.appendChild(table);

    } catch (error) {
        console.error("Erreur dans la récupération des statistiques des animaux:", error);
    }
}



async function voirRace() {
    try {
        const items = await fetchFromApi("api/race/get")

        const racesContainer = document.getElementById("voirRace");
        racesContainer.textContent = ''; 

        items.forEach(item => {
            // Création des éléments de manière sécurisée
            const raceElement = document.createElement('div');
            raceElement.classList.add("container", "text-center","text-dark");

            // Créer et insérer le label de la race
            const raceLabel = document.createElement('h2');
            raceLabel.classList.add("my-4");
            raceLabel.textContent = decodeHtml(item.label); // Décoder le nom
            raceElement.appendChild(raceLabel);

            // Ajouter le bouton Modifier
            const modifyRaceButton = document.createElement('button');
            modifyRaceButton.classList.add("btn", "btn-primary", "m-2");
            modifyRaceButton.textContent = "Modifier";
            modifyRaceButton.onclick = () => {
                ouvrirModalRace(item.id, item.label); 
            };
           raceElement.appendChild(modifyRaceButton);

            // Ajouter le bouton Supprimer
            const deleteButtonRace = document.createElement('button');
            deleteButtonRace.classList.add("btn", "btn-danger", "m-2");
            deleteButtonRace.textContent = "Supprimer";
            deleteButtonRace.onclick = () => {
                supprimerRace(item.id); 
            };
            raceElement.appendChild(deleteButtonRace);

            const hrElement = document.createElement('hr');
            raceElement.appendChild(hrElement);

           racesContainer.appendChild(raceElement);
        });
    } catch (error) {
    }
}

async function modifierRace(raceId) {
    const label = sanitizeInput(document.getElementById('raceLabel').value); 

    const raceData = { label };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        // Utiliser fetchFromApi pour envoyer la requête PUT pour mettre à jour le service
        const response = await fetchFromApi(`api/race/${raceId}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(raceData)
        });

        // Lire la réponse en tant que texte pour effectuer des opérations sur le contenu
        const textResponse = typeof response === 'string' ? response : JSON.stringify(response);

        // Supprimer le caractère '#' de la réponse si présent
        const cleanedResponse = textResponse.replace(/#/g, '');

        // Tenter de parser la réponse nettoyée en JSON
        let updatedRace;
        try {
            updatedRace = JSON.parse(cleanedResponse);
            alert("La race est mis à jour avec succès !");
            voirRace(); 
        } catch (e) {
            throw new Error(`Erreur lors de la mise à jour de la race: ${cleanedResponse}`); // Afficher le texte brut si l'analyse échoue
        }
    } catch (error) {
        alert("Erreur lors de la mise à jour du service : " + error.message); // Afficher le message d'erreur
    }
}


async function supprimerRace(raceId) {
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken()); // Assurez-vous que la fonction getToken() retourne un jeton valide
    myHeaders.append("Content-Type", "application/json");
    try {
        // Utiliser fetchFromApi pour envoyer la requête PUT pour mettre à jour le service
       await fetchFromApi(`api/race/${raceId}`, { 
            method: 'DELETE',
            headers: myHeaders
        });

        alert("Race supprimé avec succès !");
        voirRace(); 
    } catch (error) {
        alert("Erreur lors de la suppression de la race : " + error.message);
    }
}

function ouvrirModalRace(raceId, label) {
    // Ouvrir le modal
    $('#editRaceModal').modal('show');

    // Pré-remplir les champs du modal avec les données du service
    const raceIdInput = document.getElementById('raceId');
    const raceLabelInput = document.getElementById('raceName');


    if (raceIdInput) raceIdInput.value = raceId;
    if (raceLabelInput) raceLabelInput.value = decodeHtml(label); 

    const confirmBtn = document.getElementById('editRaceForm');
    confirmBtn.onsubmit = (event) => {
        event.preventDefault(); // Empêche la soumission par défaut du formulaire
        modifierRace(raceId); 
        $('#editRaceModal').modal('hide'); // Fermer le modal après soumission
    };
}
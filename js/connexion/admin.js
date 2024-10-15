
const voirAnimaux = document.getElementById("voirAnimal");
if (document.readyState !== "loading") {
  voirAnimal();
  voirService();
  voirHoraire();
  voirHabitat();
}


async function creerUnService() {
    const form = document.getElementById("creerService");
    const formData = new FormData(form);
    const titre = formData.get('titreService');
    const commentaire = formData.get('commentaireService');
    const imageInput = document.getElementById('image_dataService'); 
    let image_data = '';

    // Vérification des champs requis
    if (!titre || !commentaire) {
        alert("Les champs titre et commentaire ne peuvent pas être vides");
        return;
    }

    // Vérifiez si le titre ou le commentaire contient des scripts
    if (containsScript(titre) || containsScript(commentaire)) {
        alert("Veuillez ne pas inclure de scripts dans les champs titre ou commentaire.");
        return;
    }

    // Sanitize les entrées utilisateur
    const sanitizedTitre = sanitizeInput(titre);
    const sanitizedCommentaire = sanitizeInput(commentaire);

    // Vérifiez si un fichier a été sélectionné
    if (imageInput && imageInput.files.length > 0) {
        const file = imageInput.files[0];

        // Vérifiez le type de fichier (PNG, JPEG, etc.)
        const validImageTypes = ['image/png', 'image/jpeg', 'image/avif'];
        if (!validImageTypes.includes(file.type)) {
            alert('Format d\'image non supporté. Veuillez sélectionner une image PNG, JPEG ou AVIF.');
            return;
        }

        // Fonction pour lire le fichier image en base64
        try {
            const base64Data = await readFileAsBase64(file);
            image_data = `data:${file.type};base64,${base64Data}`;
        } catch (error) {
            alert('Erreur lors de la lecture de l\'image.');
            console.error(error);
            return;
        }
    } else {
        alert("Aucune image sélectionnée.");
        return;
    }

    try {
        await createService(sanitizedTitre, sanitizedCommentaire, image_data);
        alert("Le service a été créé avec succès");
        location.reload();
    } catch (error) {
        console.error('Erreur lors de la création du service:', error);
        alert("Erreur lors de la création du service: " + error.message);
    }
}


async function createService(titreService, commentaireService, image_dataService) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "nom": titreService,
        "description": commentaireService,
        "image_data": image_dataService
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`http://localhost:8000/api/service/post`, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Fonction pour créer un habitat
async function creerUnHabitat() {
    const form = document.getElementById("creerHabitat");
    const formData = new FormData(form);
    const titre = formData.get('titreHabitat');
    const commentaire = formData.get('commentaireHabitat');
    const description = formData.get('descriptionHabitat');
    const imageInput = document.getElementById('image_dataHabitat'); // Corrigez l'ID ici
    let image_data = '';

    // Vérification des champs requis
    if (!titre || !commentaire || !description) {
        alert("Les champs titre, commentaire et description ne peuvent pas être vides");
        return;
    }

    // Vérifiez si le titre, le commentaire ou la description contiennent des scripts
    if (containsScript(titre) || containsScript(commentaire) || containsScript(description)) {
        alert("Veuillez ne pas inclure de scripts dans les champs titre, commentaire ou description.");
        return; // ou rediriger l'utilisateur si nécessaire
    }

    // Sanitize les entrées utilisateur
    const sanitizedTitre = sanitizeInput(titre);
    const sanitizedCommentaire = sanitizeInput(commentaire);
    const sanitizedDescription = sanitizeInput(description);

    // Vérifiez si un fichier a été sélectionné
    if (imageInput && imageInput.files.length > 0) {
        const file = imageInput.files[0];

        // Vérifiez le type de fichier (PNG, JPEG, etc.)
        const validImageTypes = ['image/png', 'image/jpeg', 'image/avif'];
        if (!validImageTypes.includes(file.type)) {
            alert('Format d\'image non supporté. Veuillez sélectionner une image PNG, JPEG ou AVIF.');
            return;
        }

        // Vérifiez la taille du fichier (5 Mo par exemple)
        const maxSizeInBytes = 5 * 1024 * 1024; // 5 Mo
        if (file.size > maxSizeInBytes) {
            alert('L\'image sélectionnée est trop volumineuse. Veuillez sélectionner une image de moins de 5 Mo.');
            return;
        }

        // Fonction pour lire le fichier image en base64
        try {
            const base64Data = await readFileAsBase64(file);

            // Ajoutez le préfixe en fonction du type MIME
            image_data = `data:${file.type};base64,${base64Data}`;
        } catch (error) {
            alert('Erreur lors de la lecture de l\'image.');
            console.error(error);
            return;
        }
    }

    try {
        await creationHabitat(sanitizedTitre, sanitizedCommentaire, sanitizedDescription, image_data);
        alert("L'habitat a été créé avec succès");
        location.reload(); // Recharge la page pour voir le changement
    } catch (error) {
        alert("Erreur lors de la création de l'habitat");
        console.error(error);
    }
}

// Fonction de création de l'habitat
async function creationHabitat(titreHabitat, commentaireHabitat, descriptionHabitat, image_dataHabitat) {
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "nom": titreHabitat,
        "commentaire_habitat": commentaireHabitat,
        "description": descriptionHabitat,
        "image_data": image_dataHabitat
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`http://localhost:8000/api/habitat`, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
    }
}


// Fonction pour ouvrir le modal et pré-remplir les champs
function ouvrirModalHoraire(horaireId, titre, message, heure_debut, heure_fin, jour) {
    // Ouvrir le modal
    $('#editHoraireModal').modal('show');

    // Pré-remplir les champs du modal avec les données de l'horaire
    document.getElementById('horaireId').value = horaireId;
    document.getElementById('horaireTitre').value = decodeHtml(titre.replace(/^#/, ''));
    document.getElementById('horaireMessage').value = decodeHtml(message.replace(/^#/, ''));
    document.getElementById('horairDebut').value = decodeHtml(heure_debut.replace(/^#/, ''));
    document.getElementById('horaireFin').value = decodeHtml(heure_fin.replace(/^#/, ''));
    document.getElementById('horaireJour').value = decodeHtml(jour.replace(/^#/, ''));

    // Gérer la soumission du formulaire
    const editHoraireForm = document.getElementById('editHoraireForm');
    
    // Retirer les gestionnaires d'événements précédents
    editHoraireForm.onsubmit = null;
    
    // Ajouter un nouveau gestionnaire de soumission
    editHoraireForm.onsubmit = (event) => {
        event.preventDefault(); // Empêche la soumission par défaut du formulaire
        modifierHoraire(horaireId); // Appeler la fonction pour modifier l'horaire
        $('#editHoraireModal').modal('hide'); // Fermer le modal après soumission
    };
}


async function voirHoraire() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const items = await fetchData("http://localhost:8000/api/horaire/get", myHeaders);
        const horairesContainer = document.getElementById("voirHoraire");
        horairesContainer.innerHTML = ''; // Vide le conteneur avant d'ajouter les nouveaux éléments

        items.forEach(item => {
            // Création des éléments de manière sécurisée
            const horaireElement = document.createElement('div');
            horaireElement.classList.add("container", "text-center","text-dark");

            // Créer et insérer le titre
            const horaireTitle = document.createElement('h2');
            horaireTitle.classList.add("my-4");
            horaireTitle.textContent = decodeHtml(item.titre.replace(/^#/, ''));  // Supprime le '#' au début
            horaireElement.appendChild(horaireTitle);

            // Ajouter la description
            const messageElement = document.createElement('p');
            messageElement.textContent = decodeHtml(item.message.replace(/^#/, '')); // Supprime le '#' au début
            horaireElement.appendChild(messageElement);

            // Ajouter l'heure de début
            const heureDebutElement = document.createElement('p');
            heureDebutElement.textContent = decodeHtml(item.heure_debut.replace(/^#/, '')); // Supprime le '#' au début
            horaireElement.appendChild(heureDebutElement);

            // Ajouter l'heure de fin
            const heureFinElement = document.createElement('p');
            heureFinElement.textContent = decodeHtml(item.heure_fin.replace(/^#/, '')); // Supprime le '#' au début
            horaireElement.appendChild(heureFinElement);

            // Ajouter le jour
            const jourElement = document.createElement('p');
            jourElement.textContent = decodeHtml(item.jour.replace(/^#/, '')); // Supprime le '#' au début
            horaireElement.appendChild(jourElement);

            // Ajouter le bouton Modifier
            const modifierHoraireButton = document.createElement('button');
            modifierHoraireButton.classList.add("btn", "btn-primary", "my-2");
            modifierHoraireButton.textContent = "Modifier";
            modifierHoraireButton.onclick = () => {
                ouvrirModalHoraire(item.id, item.titre, item.message, item.heure_debut, item.heure_fin, item.jour);
            };
            horaireElement.appendChild(modifierHoraireButton);

            // Ajouter l'élément de service au conteneur principal
            horairesContainer.appendChild(horaireElement);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

// Fonction pour modifier l'horaire
async function modifierHoraire(horaireId) {
    // Récupérer les valeurs des champs
    const titre = sanitizeInput(document.getElementById('horaireTitre').value.trim());
    const message = sanitizeInput(document.getElementById('horaireMessage').value.trim());
    const jour = sanitizeInput(document.getElementById('horaireJour').value.trim());
    const heure_debut = sanitizeInput(document.getElementById('horairDebut').value.trim());
    const heure_fin = sanitizeInput(document.getElementById('horaireFin').value.trim());

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
        // Envoyer la requête PUT pour mettre à jour l'horaire
        const response = await fetch(`http://localhost:8000/api/horaire/${horaireId}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(horaireData)
        });

        const textResponse = await response.text(); // Lire la réponse en tant que texte

        // Supprimer le caractère '#' de la réponse si présent
        const cleanedResponse = textResponse.replace(/#/g, '');

        // Vérifier si la réponse n'est pas OK
        if (!response.ok) {
            let errorResponse;
            try {
                errorResponse = JSON.parse(cleanedResponse); // Analyser la réponse nettoyée
                throw new Error(`Erreur lors de la modification de l'horaire: ${errorResponse.error || response.statusText}`);
            } catch (e) {
                throw new Error(`Erreur lors de la modification de l'horaire: ${cleanedResponse}`); // Afficher le texte brut si l'analyse échoue
            }
        }

        // Réponse réussie
        let updatedHoraire;
        try {
            updatedHoraire = JSON.parse(cleanedResponse); // Analyser la réponse
            console.log("Horaire mis à jour avec succès :", updatedHoraire);
            alert("Horaire mis à jour avec succès !");
            location.reload(); // Actualiser la page

        } catch (e) {
            throw new Error(`Erreur lors de la mise à jour de l'horaire: ${cleanedResponse}`); // Afficher le texte brut si l'analyse échoue
        }
    } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur lors de la mise à jour de l'horaire : " + error.message); // Afficher le message d'erreur
    }
}





   // Créer une race
async function creerUneRace() {
    const form = document.getElementById("creerRace");
    const formData = new FormData(form);
    const label = formData.get('labelRace');

    // Vérification des champs requis
    if (!label) {
        alert("Le champ label ne peut pas être vide");
        return;
    }

    // Vérifiez si le label contient des scripts
    if (containsScript(label)) {
        alert("Veuillez ne pas inclure de scripts dans le champ label.");
        return; // ou rediriger l'utilisateur si nécessaire
    }

    // Sanitize l'entrée utilisateur
    const sanitizedLabel = sanitizeInput(label);

    try {
        await createRace(sanitizedLabel);
        alert("La race a été créée avec succès");
        location.reload();
    } catch (error) {
        alert("Erreur lors de la création de la race");
        console.error(error);
    }
}

// Fonction pour créer la race
async function createRace(labelRace) {
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "label": labelRace,
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`http://localhost:8000/api/race`, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
    }
}


// fonction pour voir les services 


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
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        try {
            const items = await fetchData("http://localhost:8000/api/service/get", myHeaders);
    
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
            const response = await fetch(`http://localhost:8000/api/service/${serviceId}`, {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(serviceData)
            });
    
            const textResponse = await response.text(); // Lire la réponse en tant que texte
    
            // Supprimer le caractère '#' de la réponse si présent
            const cleanedResponse = textResponse.replace(/#/g, '');
    
            if (!response.ok) {
                // Analyser uniquement si le format est correct
                let errorResponse;
                try {
                    errorResponse = JSON.parse(cleanedResponse); // Analyser la réponse nettoyée
                    throw new Error(`Erreur lors de la modification du service: ${errorResponse.error || response.statusText}`);
                } catch (e) {
                    throw new Error(`Erreur lors de la modification du service: ${cleanedResponse}`); // Afficher le texte brut si l'analyse échoue
                }
            }
    
            let updatedService;
            try {
                updatedService = JSON.parse(cleanedResponse); // Analyser la réponse nettoyée
                console.log("Service mis à jour avec succès :", updatedService);
                alert("Service mis à jour avec succès !");
                voirService(); // Appeler la fonction pour afficher le service mis à jour
            } catch (e) {
                throw new Error(`Erreur lors de la mise à jour du service: ${cleanedResponse}`); // Afficher le texte brut si l'analyse échoue
            }
        } catch (error) {
            console.error("Erreur :", error);
            alert("Erreur lors de la mise à jour du service : " + error.message); // Afficher le message d'erreur
        }
    }
    
    
    async function supprimerService(serviceId) {
        const myHeaders = new Headers();
        myHeaders.append("X-AUTH-TOKEN", getToken()); // Assurez-vous que la fonction getToken() retourne un jeton valide
        myHeaders.append("Content-Type", "application/json");
    
        try {
            const response = await fetch(`http://localhost:8000/api/service/${serviceId}`, { 
                method: 'DELETE',
                headers: myHeaders
            });
    
            if (!response.ok) {
                throw new Error(`Erreur lors de la suppression du service: ${response.statusText}`);
            }
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
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const items = await fetchData("http://localhost:8000/api/habitat/get", myHeaders);

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
            console.error(error);
            return;
        }
    }

    const habitatData = { nom, description, image_data };

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

        // Vérifier si la réponse n'est pas OK
        if (!response.ok) {
            let errorResponse;
            try {
                errorResponse = JSON.parse(cleanedResponse); // Analyser la réponse nettoyée
                throw new Error(`Erreur lors de la modification de l'habitat: ${errorResponse.error || response.statusText}`);
            } catch (e) {
                throw new Error(`Erreur lors de la modification de l'habitat: ${cleanedResponse}`); // Afficher le texte brut si l'analyse échoue
            }
        }

        let updatedHabitat;
        try {
            updatedHabitat = JSON.parse(cleanedResponse); // Analyser la réponse nettoyée
            console.log("Habitat mis à jour avec succès :", updatedHabitat);
            alert("Habitat mis à jour avec succès !");
            voirHabitat(); // Recharger les habitats
        } catch (e) {
            throw new Error(`Erreur lors de la mise à jour de l'habitat: ${cleanedResponse}`); // Afficher le texte brut si l'analyse échoue
        }
    } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur lors de la mise à jour de l'habitat : " + error.message); // Afficher le message d'erreur
        location.reload(); 

    }
}

    async function supprimerHabitat(habitatId) {
        const myHeaders = new Headers();
        myHeaders.append("X-AUTH-TOKEN", getToken());
        myHeaders.append("Content-Type", "application/json");
    
        try {
            const response = await fetch(`http://localhost:8000/api/habitat/${habitatId}`, {
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
    


// fonction pour voir les animaux 



async function creerUnAnimal() {
    const form = document.getElementById("creerAnimal");
    const formData = new FormData(form);

    const prenom = formData.get('prenomAnimal');
    const etat = formData.get('etatAnimal');
    const nourriture = formData.get('nourritureAnimal');
    const grammage = formData.get('grammageAnimal');

    // Extraction des valeurs datetime
    const feeding = formData.get('feeding_timeAnimal');
    const create = formData.get('created_atAnimal');

    const habitatId = formData.get('voirNomHabitat');
    const raceId = formData.get('voirLabel');

    const imageInput = document.getElementById('image_dataAnimal');
    let image_data = '';

    if (!prenom || !etat || !nourriture || !grammage || !habitatId || !raceId || !feeding || !create) {
        alert("Tous les champs doivent être remplis.");
        return;
    }

    if (imageInput && imageInput.files.length > 0) {
        const file = imageInput.files[0];
        const validImageTypes = ['image/png', 'image/jpeg', 'image/avif'];
        if (!validImageTypes.includes(file.type)) {
            alert('Format d\'image non supporté. Veuillez sélectionner une image PNG, JPEG ou AVIF.');
            return;
        }

        try {
            const base64Data = await readFileAsBase64(file);
            image_data = `data:${file.type};base64,${base64Data}`;
        } catch (error) {
            alert('Erreur lors de la lecture de l\'image.');
            console.error(error);
            return;
        }
    }

    try {
        await creationAnimal(prenom, etat, nourriture, grammage, habitatId, raceId, feeding, create, image_data);
        alert("L'animal a été créé avec succès");
        location.reload();
    } catch (error) {
        alert("Erreur lors de la création de l'animal");
        console.error(error);
    }
}

async function creationAnimal(prenomAnimal, etatAnimal, nourritureAnimal, grammageAnimal, habitatId, raceId, feeding_timeAnimal, created_atAnimal, image_dataAnimal) {
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "Prenom": prenomAnimal,
        "etat": etatAnimal,
        "nourriture": nourritureAnimal,
        "grammage": grammageAnimal,
        "habitat_id": habitatId,
        "race_id": raceId,
        "feeding_time": feeding_timeAnimal,
        "created_at": created_atAnimal,
        "image_data": image_dataAnimal
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`http://localhost:8000/api/animal/post`, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Appel de l'initialisation des données lors de l'ouverture du modal
const modal = document.getElementById("staticBackdropAnimalPost");
modal.addEventListener('show.bs.modal', () => {
    voirRace(); // Charger les races
    voirHabitatAnimal(); // Charger les habitats
});

// Fonction pour voir les races
async function voirRace() {
    const myHeaders = new Headers({
        "Content-Type": "application/json"
    });

    try {
        const races = await fetchData("http://localhost:8000/api/race/get", myHeaders);
        
        // Trier les races par ordre alphabétique en fonction de la propriété 'label'
        races.sort((a, b) => a.label.localeCompare(b.label));

        const raceSelect = document.getElementById("voirLabel"); // Référence au select pour les races
        raceSelect.innerHTML = '<option value="">Sélectionner une race</option>'; // Réinitialisation avec l'option par défaut

        races.forEach(race => {
            // Créer un élément option pour chaque race
            const option = document.createElement('option');
            option.value = race.id; // ID de la race pour l'envoi
            option.textContent = race.label; // Nom de la race à afficher
            raceSelect.appendChild(option); // Ajouter l'option au select
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des races:", error);
    }
}


async function voirHabitatAnimal() {
    const myHeaders = new Headers({
        "Content-Type": "application/json"
    });

    try {
        const habitats = await fetchData("http://localhost:8000/api/habitat/get", myHeaders);
        const habitatSelect = document.getElementById("voirNomHabitat"); // Référence au select pour les habitats
        habitatSelect.innerHTML = '<option value="">Sélectionner un habitat</option>'; // Réinitialisation avec l'option par défaut

        habitats.forEach(habitat => {
            // Créer un élément option pour chaque habitat
            const option = document.createElement('option');
            option.value = habitat.id; // ID de l'habitat pour l'envoi
            option.textContent = habitat.nom; // Nom de l'habitat à afficher
            habitatSelect.appendChild(option); // Ajouter l'option au select
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des habitats:", error);
    }
}


// Fonction pour ouvrir la modal d'édition de l'animal
function ouvrirModalAnimal(animalId, oldImageData, prenom, etat, nourriture, grammage, feedingTime, createdAt, habitat, race) {
    console.log('Ouvrir modal pour Animal ID:', animalId);
    console.log('Données:', {prenom, etat, nourriture, grammage, feedingTime, createdAt, habitat, race});

    $('#editAnimalModal').modal('show');

    const animalIdInput = document.getElementById('animalId');
    const prenomInput = document.getElementById('prenomAnimal');
    const etatInput = document.getElementById('etatAnimal');
    const nourritureInput = document.getElementById('nourritureAnimal');
    const grammageInput = document.getElementById('grammageAnimal');
    const feedingTimeInput = document.getElementById('feeding_timeAnimal');
    const createdAtInput = document.getElementById('created_atAnimal');
    const habitatSelect = document.getElementById('habitatAnimal');
    const raceSelect = document.getElementById('raceAnimal');
    const imageInput = document.getElementById('image_dataAnimal');

    if (animalIdInput) animalIdInput.value = animalId;
    if (prenomInput) prenomInput.value = decodeHtml(prenom);
    if (etatInput) etatInput.value = decodeHtml(etat);
    if (nourritureInput) nourritureInput.value = decodeHtml(nourriture);
    if (grammageInput) grammageInput.value = grammage;
    if (feedingTimeInput) feedingTimeInput.value = feedingTime || '';
    if (createdAtInput) createdAtInput.value = createdAt || '';
    if (habitatSelect) habitatSelect.value = habitat;
    if (raceSelect) raceSelect.value = race;
    if (imageInput) imageInput.value = '';

    const confirmBtn = document.getElementById('editAnimalForm');
    confirmBtn.onsubmit = (event) => {
        event.preventDefault();
        modifierAnimal(animalId, oldImageData);
        $('#editAnimalModal').modal('hide');
    };
}


// Fonction pour voir les animaux et les afficher
async function voirAnimal() {
    const myHeaders = new Headers({
        "Content-Type": "application/json"
    });

    try {
        const items = await fetchData("http://localhost:8000/api/animal/get", myHeaders);

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
            infoRow.classList.add("row", "w-100", "mb-4"); // Conteneur des deux colonnes


            // Colonne droite pour les valeurs
            const valueColumn = document.createElement('div');
            valueColumn.classList.add("col-md-12", "text-center"); // Colonne droite pour les valeurs

            const values = [
                { label: '- Son ETAT:', value: decodeHtml(item.etat) },
                { label: '- Nourriture:', value: decodeHtml(item.nourriture) },
                { label: '- Grammage:', value: item.grammage },
                { label: '- Heure du dernier repas:', value: item.feeding_time },
                { label: '- Jour du dernier repas:', value: new Date(item.created_at).toLocaleDateString() },
                { label: '- Habitat:', value: decodeHtml(item.habitat) },
                { label: '- Race:', value: decodeHtml(item.race) }
            ];
            
            values.forEach(({ label, value }) => {
                const rowElement = document.createElement('div');
                rowElement.classList.add('row', 'mb-2');
            
                // Label en gras
                const labelElement = document.createElement('div');
                labelElement.classList.add('col-md-', 'text-center');
                labelElement.innerHTML = `<strong>${label}</strong>`; // Label en gras
            
                // Valeur normale
                const valueElement = document.createElement('div');
                valueElement.classList.add('col-md-', 'text-center');
                valueElement.textContent = value;
            
                rowElement.appendChild(labelElement);
                rowElement.appendChild(valueElement);
                valueColumn.appendChild(rowElement); // Ajoute la ligne de label et valeur dans la colonne des valeurs
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
                    item.race
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




// Fonction pour modifier l'animal
async function modifierAnimal(animalId, oldImageData) {
    // Récupérer les valeurs des inputs
    const prenom = sanitizeInput(document.getElementById('prenomAnimal').value);
    const etat = sanitizeInput(document.getElementById('etatAnimal').value);
    const nourriture = sanitizeInput(document.getElementById('nourritureAnimal').value);
    const grammage = document.getElementById('grammageAnimal').value;
    const feedingTime = document.getElementById('feeding_timeAnimal').value;
    const createdAt = document.getElementById('created_atAnimal').value;
    const habitatId = document.getElementById('habitatAnimal').value;
    const raceId = document.getElementById('raceAnimal').value;
    const imageInput = document.getElementById('image_dataAnimal'); // Utiliser l'input d'image
    let image_data = oldImageData; // Garder l'ancienne image par défaut

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
            image_data = `data:${file.type};base64,${base64Image}`; // Mettre à jour l'image
        } catch (error) {
            alert('Erreur lors de la lecture de l\'image.');
            console.error(error);
            return;
        }
    }

    // Créer l'objet animalData avec les nouvelles valeurs
    const animalData = {
        id: animalId,
        prenom,
        etat,
        nourriture,
        grammage,
        feeding_time: feedingTime,
        created_at: createdAt,
        habitat_id: habitatId,
        race_id: raceId,
        image_data
    };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const response = await fetch(`http://localhost:8000/api/animal/${animalId}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(animalData)
        });

        const textResponse = await response.text(); // Lire la réponse en tant que texte

        if (!response.ok) {
            // Analyser uniquement si le format est correct
            let errorResponse;
            try {
                errorResponse = JSON.parse(textResponse);
                throw new Error(`Erreur lors de la modification de l'animal: ${errorResponse.error || response.statusText}`);
            } catch (e) {
                throw new Error(`Erreur lors de la modification de l'animal: ${textResponse}`); // Afficher le texte brut si l'analyse échoue
            }
        }

        let updatedAnimal;
        try {
            updatedAnimal = JSON.parse(textResponse);
            console.log("Animal mis à jour avec succès :", updatedAnimal);
            alert("Animal mis à jour avec succès !");
            voirAnimal(); 
        } catch (e) {
            throw new Error(`Erreur lors de la mise à jour de l'animal: ${textResponse}`); // Afficher le texte brut si l'analyse échoue
        }
    } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur lors de la mise à jour de l'animal : " + error.message); // Afficher le message d'erreur
    }
}


// Fonction pour supprimer un animal
async function supprimerAnimal(animalId) {
    const myHeaders = new Headers({
        "X-AUTH-TOKEN": getToken(),
        "Content-Type": "application/json"
    });

    try {
        const response = await fetch(`http://localhost:8000/api/animal/${animalId}`, {
            method: 'DELETE',
            headers: myHeaders
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la suppression de l'animal: ${response.statusText}`);
        }

        alert("Animal supprimé avec succès !");
        voirAnimal(); 
    } catch (error) {
        alert("Erreur lors de la suppression de l'animal : " + error.message);
    }
}

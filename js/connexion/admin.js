if (document.readyState === "loading") {
    // Loading hasn't finished yet
    services-container.addEventListener('DOMContentLoaded', voirHabitat);
    services-container.addEventListener('DOMContentLoaded', voirRace);


  } else {
    // `DOMContentLoaded` has already fired
    voirHabitat();
    voirRace();

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
        return; // ou rediriger l'utilisateur si nécessaire
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

            // Ajoutez le préfixe en fonction du type MIME
            image_data = `data:${file.type};base64,${base64Data}`;
        } catch (error) {
            alert('Erreur lors de la lecture de l\'image.');
            console.error(error);
            return;
        }
    }

    try {
        await createService(sanitizedTitre, sanitizedCommentaire, image_data);
        alert("Le service a été créé avec succès");
    } catch (error) {
        alert("Erreur lors de la création du service");
        console.error(error);
    }
}

// Fonction pour détecter les scripts
function containsScript(input) {
    const scriptPattern = /<script.*?>.*?<\/script>/i; // RegEx pour détecter les balises <script>
    return scriptPattern.test(input);
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
        const response = await fetch(`https://127.0.0.1:8000/api/service/post`, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
    }
}



// créer un habitat
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
        alert("Les champs titre et commentaire ne peuvent pas être vides");
        return;
    }

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

            // Ajoutez le préfixe en fonction du type MIME
            image_data = `data:${file.type};base64,${base64Data}`;
        } catch (error) {
            alert('Erreur lors de la lecture de l\'image.');
            console.error(error);
            return;
        }
    }

    try {
        await creationHabitat(titre, commentaire,description, image_data);
        alert("L'habitat a été créé avec succès");
    } catch (error) {
        alert("Erreur lors de la création de l'habitat");
        console.error(error);
    }
}

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
        const response = await fetch(`https://127.0.0.1:8000/api/habitat`, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
    }
}



async function creerUnAnimal() {
    const form = document.getElementById("creerAnimal");
    const formData = new FormData(form);

    const prenom = formData.get('prenomAnimal');
    const etat = formData.get('etatAnimal');
    const nourriture = formData.get('nourritureAnimal');
    const grammage = formData.get('grammageAnimal');
    
    // Correction : extraction des valeurs datetime
    const feeding = formData.get('feeding_timeAnimal'); // Valeur datetime sous forme de chaîne
    const create = formData.get('created_atAnimal'); // Valeur datetime sous forme de chaîne

    const habitatId = formData.get('habitat_id');
    const raceId = formData.get('race_id');

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
        const response = await fetch(`https://127.0.0.1:8000/api/animal/post`, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function voirHabitat() {
    const myHeaders = new Headers({
        "Content-Type": "application/json"
    });

    try {
        // Fonction fetchData non fournie, remplacez par fetch directement
        const response = await fetch("https://127.0.0.1:8000/api/habitat/get", {
            method: 'GET',
            headers: myHeaders
        });

        if (!response.ok) {
            throw new Error('Failed to fetch habitats: ' + response.statusText);
        }

        const habitats = await response.json();

        const habitatSelect = document.getElementById("habitat_id");

        // Vider le menu déroulant avant d’ajouter les nouvelles options
        habitatSelect.innerHTML = '<option value="">Sélectionner un habitat</option>';

        habitats.forEach(habitat => {
            const option = document.createElement('option');
            option.value = habitat.id;
            option.textContent = habitat.nom;
            habitatSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Erreur dans la récupération des habitats:", error);
    }
}




async function voirRace() {
    const myHeaders = new Headers({
        "Content-Type": "application/json"
    });

    try {
        // Fonction fetchData non fournie, remplacez par fetch directement
        const response = await fetch("https://127.0.0.1:8000/api/race/get", {
            method: 'GET',
            headers: myHeaders
        });

        if (!response.ok) {
            throw new Error('Failed to fetch races: ' + response.statusText);
        }

        const races = await response.json();

        const raceSelect = document.getElementById("race_id");

        // Vider le menu déroulant avant d’ajouter les nouvelles options
        raceSelect.innerHTML = '<option value="">Sélectionner une race</option>';

        races.forEach(race => {
            const option = document.createElement('option');
            option.value = race.id;
            option.textContent = race.label;
            raceSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Erreur dans la récupération des races:", error);
    }
}


// Fonction pour modifier les horaires

const getHoraire = document.getElementById("voirDate");
    if (document.readyState !== "loading") {
    voirHoraire();
    }


    async function voirHoraire() {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
    
        try {
            const response = await fetch("https://127.0.0.1:8000/api/horaire/get", requestOptions);
    
            if (!response.ok) {
                throw new Error("Impossible de récupérer les informations horaire");
            }
    
            const result = await response.json();
            getHoraire.innerHTML = '';
    
            result.forEach(item => {
                const horaireElement = document.createElement('div');
                horaireElement.classList.add('horaire-container', 'mb-4');
    
                horaireElement.innerHTML = `
                    <div class="card shadow-sm text-dark">
                        <div class="card-body">
                            <h3 class="fw-bold fs-4">${item.titre}</h3>
                            <p class="fw-normal fs-4">${item.message}</p>
                            <p class="fw-normal fs-4">${item.jour}</p>
                            <p class="fw-normal fs-4">${item.heure_debut} - ${item.heure_fin}</p>
                            <button class="modifierBouton btn btn-primary mt-3">Modifier</button>
                            <div class="modifyForm container text-center text-dark border border-primary rounded mt-3" style="display: none;">
                                <h5 class="text-center my-2">Modifier l'horaire</h5>
                                <input type="text" id="titre-${item.id}" value="${item.titre}" placeholder="Titre" class="form-control text-center">
                                <textarea rows="3" id="message-${item.id}" placeholder="Message" class="form-control my-2 text-center">${item.message}</textarea>
                                <input type="text" id="jour-${item.id}" value="${item.jour}" placeholder="Jour" class="form-control my-2 text-center">
                                <input type="time" id="heure_debut-${item.id}" value="${item.heure_debut}" class="form-control my-2 text-center">
                                <input type="time" id="heure_fin-${item.id}" value="${item.heure_fin}" class="form-control my-2 text-center">
                                <button class="validerBouton btn btn-primary my-3">Valider la modification</button>
                            </div>
                        </div>
                    </div>
                `;
    
                getHoraire.appendChild(horaireElement);
    
                const modifierBouton = horaireElement.querySelector('.modifierBouton');
                const modifyForm = horaireElement.querySelector('.modifyForm');
    
                modifierBouton.addEventListener('click', () => {
                    modifyForm.style.display = 'block';
                });
    
                const validerBouton = horaireElement.querySelector('.validerBouton');
                validerBouton.addEventListener('click', () => {
                    modifierHoraire(item.id); // Appelle directement la fonction de modification
                });
            });
    
        } catch (error) {
            console.error(error);
        }
    }
    
    async function modifierHoraire(horaireId) {
        // Récupérer les valeurs des champs en utilisant `textContent` pour éviter les injections XSS
        const titre = sanitizeInput(document.getElementById(`titre-${horaireId}`).value);
        const message = sanitizeInput(document.getElementById(`message-${horaireId}`).value);
        const jour = sanitizeInput(document.getElementById(`jour-${horaireId}`).value);
        const heure_debut = sanitizeInput(document.getElementById(`heure_debut-${horaireId}`).value);
        const heure_fin = sanitizeInput(document.getElementById(`heure_fin-${horaireId}`).value);
    
        const horaireData = { titre, message, jour, heure_debut, heure_fin };
    
        const myHeaders = new Headers();
        myHeaders.append("X-AUTH-TOKEN", getToken());
        myHeaders.append("Content-Type", "application/json");
    
        try {

            // Envoyer la requête PUT pour mettre à jour l'horaire

            const response = await fetch(`https://127.0.0.1:8000/api/horaire/${horaireId}`, {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(horaireData)
            });
            // Gérer la réponse et vérifier si elle est correcte
            if (!response.ok) {
                throw new Error(`Erreur lors de la modification de l'horaire: ${response.statusText}`);
            }
    
            // Extraire et traiter la réponse JSON
            const updatedHoraire = await response.json();
            console.log("Horaire mis à jour avec succès :", updatedHoraire);
    
            // Message de succès pour l'utilisateur
            alert("Horaire mis à jour avec succès !");
            voirHoraire(); // Recharger les horaires pour voir les changements
        } catch (error) {
            // Gestion des erreurs
            console.error("Erreur :", error);
            alert("Erreur lors de la mise à jour de l'horaire !");
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
    

        try {
            await createRace(label);
            alert("La race a été créé avec succès");
        } catch (error) {
            alert("Erreur lors de la création de la race");
            console.error(error);
        }
    }
    
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
            const response = await fetch(`https://127.0.0.1:8000/api/race`, requestOptions);
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

      const voirServices = document.getElementById("getService");
      if (document.readyState !== "loading") {
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
        myHeaders.append("Content-Type", "application/json");
    
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
    
        try {
            const response = await fetch("https://127.0.0.1:8000/api/service/get", requestOptions);
    
            if (!response.ok) {
                throw new Error("Impossible de récupérer les informations service");
            }
    
            const result = await response.json();
            const voirServices = document.getElementById('getService'); // Assurez-vous d'avoir cet élément dans votre HTML
            voirServices.innerHTML = ''; // Clear existing content
    
            result.forEach(item => {
                const serviceElement = document.createElement('div');
                serviceElement.classList.add('service-container', 'mb-4');
    
                // Créer la carte
                const card = document.createElement('div');
                card.classList.add('card', 'shadow-sm', 'text-dark', 'text-center');
    
                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');
    
                // Créer le titre du service
                const serviceTitle = document.createElement('h3');
                serviceTitle.classList.add('fw-bold', 'fs-4');
                serviceTitle.textContent = item.nom;
    
                // Créer la description du service
                const serviceDescription = document.createElement('p');
                serviceDescription.classList.add('fw-normal');
                serviceDescription.textContent = item.description;
    
                // Créer l'image du service
                const serviceImage = document.createElement('img');
                serviceImage.src = item.image_data;
                serviceImage.classList.add('img-fluid', 'my-3');
                serviceImage.alt = item.nom;
    
                // Créer le bouton Modifier
                const modifyButton = document.createElement('button');
                modifyButton.classList.add('modifierBouton', 'btn', 'btn-primary', 'mt-3');
                modifyButton.textContent = 'Modifier';
    
                // Créer le bouton Supprimer
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('supprimerBouton', 'btn', 'btn-danger', 'mt-3');
                deleteButton.textContent = 'Supprimer';
    
                // Créer le formulaire de modification
                const modifyForm = document.createElement('div');
                modifyForm.classList.add('modifyForm', 'container', 'text-center', 'text-dark', 'border', 'border-primary', 'rounded', 'mt-3');
                modifyForm.style.display = 'none'; // Masquer le formulaire par défaut
    
                // Ajouter le titre de modification
                const modifyTitle = document.createElement('h5');
                modifyTitle.classList.add('text-center', 'my-2');
                modifyTitle.textContent = 'Modifier le service';
                modifyForm.appendChild(modifyTitle);
    
                // Créer un champ pour le nom du service
                const inputNom = document.createElement('input');
                inputNom.type = 'text';
                inputNom.id = `nom-${item.id}`;
                inputNom.value = item.nom;
                inputNom.placeholder = 'Titre';
                inputNom.classList.add('form-control', 'text-center');
    
                // Créer un champ pour la description
                const textareaDescription = document.createElement('textarea');
                textareaDescription.rows = 5;
                textareaDescription.id = `description-${item.id}`;
                textareaDescription.placeholder = 'Message';
                textareaDescription.classList.add('form-control', 'my-2', 'text-center');
                textareaDescription.textContent = item.description;
    
                // Créer un champ pour l'image
                const inputImage = document.createElement('input');
                inputImage.type = 'file';
                inputImage.id = `image-${item.id}`;
                inputImage.classList.add('form-control', 'my-2');
    
                // Créer un bouton pour fermer le formulaire
                const closeButton = document.createElement('button');
                closeButton.classList.add('fermerBouton', 'btn', 'btn-secondary', 'my-3');
                closeButton.textContent = 'Fermer';
    
                // Créer un bouton pour valider la modification
                const validateButton = document.createElement('button');
                validateButton.classList.add('validerBouton', 'btn', 'btn-primary', 'my-3');
                validateButton.textContent = 'Valider la modification';
    
                // Ajouter les champs au formulaire de modification
                modifyForm.appendChild(inputNom);
                modifyForm.appendChild(textareaDescription);
                modifyForm.appendChild(inputImage);
                modifyForm.appendChild(closeButton);
                modifyForm.appendChild(validateButton);
    
                // Ajouter tous les éléments au corps de la carte
                cardBody.appendChild(serviceTitle);
                cardBody.appendChild(serviceDescription);
                cardBody.appendChild(serviceImage);
                cardBody.appendChild(modifyButton);
                cardBody.appendChild(deleteButton); // Ajouter le bouton Supprimer
                cardBody.appendChild(modifyForm);
    
                // Ajouter le corps de la carte à la carte
                card.appendChild(cardBody);
    
                // Ajouter la carte à l'élément service
                serviceElement.appendChild(card);
    
                // Ajouter l'élément au conteneur principal
                voirServices.appendChild(serviceElement);
    
                // Gestion des événements pour les boutons
                modifyButton.addEventListener('click', () => {
                    modifyForm.style.display = 'block'; // Afficher le formulaire
                });
    
                closeButton.addEventListener('click', () => {
                    modifyForm.style.display = 'none'; // Masquer le formulaire
                });
    
                validateButton.addEventListener('click', () => {
                    modifierService(item.id); // Appelle directement la fonction de modification
                });
    
                // Gestion de l'événement pour le bouton Supprimer
                deleteButton.addEventListener('click', async () => {
                    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce service ?");
                    if (confirmation) {
                        await supprimerService(item.id);
                        voirService(); // Rafraîchir la liste des services après la suppression
                    }
                });
            });
    
        } catch (error) {
            console.error(error);
        }
    }
    
    async function convertirImageEnBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result); // C'est ici que l'image est convertie en base64
            reader.onerror = reject;
            reader.readAsDataURL(file); // Assurez-vous que cela fonctionne pour tous les types d'images
        });
    }
    
    async function modifierService(serviceId) {
        const nom = sanitizeInput(document.getElementById(`nom-${serviceId}`).value);
        const description = sanitizeInput(document.getElementById(`description-${serviceId}`).value);
        const imageInput = document.getElementById(`image-${serviceId}`);
        const imageFile = imageInput.files[0]; // Récupérer le fichier image sélectionné
    
        let imageBase64 = null;
    
        if (imageFile) {
            try {
                imageBase64 = await convertirImageEnBase64(imageFile);
            } catch (error) {
                console.error("Erreur lors de la conversion de l'image en base64 :", error);
                alert("Erreur lors de la conversion de l'image.");
                return;
            }
        }
    
        const serviceData = { 
            nom, 
            description 
        };
    
        if (imageBase64) {
            serviceData.image_data = imageBase64;  
        }
    
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        try {
            const response = await fetch(`https://127.0.0.1:8000/api/service/${serviceId}`, {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(serviceData)
            });
    
            if (!response.ok) {
                throw new Error(`Erreur lors de la modification du service: ${response.statusText}`);
            }
    
            const updatedService = await response.json();
            console.log("Service mis à jour avec succès :", updatedService);
            alert("Service mis à jour avec succès !");
            voirService(); // Recharger les services après la mise à jour
        } catch (error) {
            console.error("Erreur :", error);
            alert("Erreur lors de la mise à jour du service !");
        }
    }
    

 // Fonction put et get sur les habitats
    
    const voirHabitats = document.getElementById("getHabitat");
    if (document.readyState !== "loading") {
      voirHabitat();
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
  
async function voirHabitat() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    try {
        const response = await fetch("https://127.0.0.1:8000/api/habitat/get", requestOptions);

        if (!response.ok) {
            throw new Error("Impossible de récupérer les informations habitat");
        }

        const result = await response.json();
        voirHabitats.innerHTML = '';

        result.forEach(item => {
            const habitatElement = document.createElement('div');
            habitatElement.classList.add('habitat-container', 'mb-4');

            habitatElement.innerHTML = `
            <div class="card shadow-sm text-dark text-center">
                <div class="card-body">
                    <h3 class="fw-bold fs-4">${item.nom}</h3>
                    <p class="fw-normal">${item.description}</p>
                    <img src="${item.image_url}" class="img-fluid my-3" alt="${item.nom}">
                    <button class="modifierBouton btn btn-primary mt-3">Modifier</button>
                    <div class="modifyForm container text-center text-dark border border-primary rounded mt-3" style="display: none;">
                        <h5 class="text-center my-2">Modifier l'habitat</h5>
                        <input type="text" id="nom-${item.id}" value="${item.nom}" placeholder="Titre" class="form-control text-center">
                        <textarea rows="5" id="description-${item.id}" placeholder="Message" class="form-control my-2 text-center">${item.description}</textarea>
                        <input type="file" id="image-${item.id}" class="form-control my-2">
                        <button class="fermerBouton btn btn-secondary my-3">Fermer</button>
                        <button class="validerBouton btn btn-primary my-3">Valider la modification</button>
                    </div>
                </div>
            </div>
        `;

            voirHabitats.appendChild(habitatElement);

            const modifierBouton = habitatElement.querySelector('.modifierBouton');
            const modifyForm = habitatElement.querySelector('.modifyForm');
            const fermerBouton = habitatElement.querySelector('.fermerBouton');

            modifierBouton.addEventListener('click', () => {
                modifyForm.style.display = 'block';
            });

            fermerBouton.addEventListener('click', () => {
                modifyForm.style.display = 'none';
            });

            const validerBouton = habitatElement.querySelector('.validerBouton');
            validerBouton.addEventListener('click', () => {
                modifierHabitat(item.id); // Appelle directement la fonction de modification
            });
        });

    } catch (error) {
        console.error(error);
    }
}

async function voirHabitat() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    try {
        const response = await fetch("https://127.0.0.1:8000/api/habitat/get", requestOptions);

        if (!response.ok) {
            throw new Error("Impossible de récupérer les informations habitat");
        }

        const result = await response.json();
        voirHabitats.innerHTML = '';

        result.forEach(item => {
            const habitatElement = document.createElement('div');
            habitatElement.classList.add('habitat-container', 'mb-4');

            habitatElement.innerHTML = `
            <div class="card shadow-sm text-dark text-center">
                <div class="card-body">
                    <h3 class="fw-bold fs-4">${item.nom}</h3>
                    <p class="fw-normal">${item.description}</p>
                    <img class="img-fluid rounded w-100" src="${item.image_data}" alt="Image de ${item.nom}">
                    <button class="modifierBouton btn btn-primary mt-3">Modifier</button>
                    <div class="modifyForm container text-center text-dark border border-primary rounded mt-3" style="display: none;">
                        <h5 class="text-center my-2">Modifier l'habitat</h5>
                        <input type="text" id="nom-${item.id}" value="${item.nom}" placeholder="Titre" class="form-control text-center">
                        <textarea rows="5" id="description-${item.id}" placeholder="Message" class="form-control my-2 text-center">${item.description}</textarea>
                        <input type="file" id="image-${item.id}" class="form-control my-2">
                        <button class="fermerBouton btn btn-secondary my-3">Fermer</button>
                        <button class="validerBouton btn btn-primary my-3">Valider la modification</button>
                    </div>
                </div>
            </div>
        `;

            voirHabitats.appendChild(habitatElement);

            const modifierBouton = habitatElement.querySelector('.modifierBouton');
            const modifyForm = habitatElement.querySelector('.modifyForm');
            const fermerBouton = habitatElement.querySelector('.fermerBouton');

            modifierBouton.addEventListener('click', () => {
                modifyForm.style.display = 'block';
            });

            fermerBouton.addEventListener('click', () => {
                modifyForm.style.display = 'none';
            });

            const validerBouton = habitatElement.querySelector('.validerBouton');
            validerBouton.addEventListener('click', () => {
                modifierHabitat(item.id); // Appelle directement la fonction de modification
            });
        });

    } catch (error) {
        console.error(error);
    }
}



async function modifierHabitat(habitatId) {
    const nom = document.getElementById(`nom-${habitatId}`).value;
    const description = document.getElementById(`description-${habitatId}`).value;
    const imageInput = document.getElementById(`image-${habitatId}`);
    const imageFile = imageInput.files[0]; // Récupérer le fichier image sélectionné

    let imageBase64 = null;

    if (imageFile) {
        try {
            imageBase64 = await convertirImageEnBase64(imageFile);
        } catch (error) {
            console.error("Erreur lors de la conversion de l'image en base64 :", error);
            alert("Erreur lors de la conversion de l'image.");
            return;
        }
    }

    const habitatData = { 
        nom, 
        description 
    };

    if (imageBase64) {
        habitatData.image_data = imageBase64;  
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const response = await fetch(`https://127.0.0.1:8000/api/habitat/${habitatId}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(habitatData)
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la modification de l'habitat: ${response.statusText}`);
        }

        const updatedHabitat = await response.json();
        console.log("Habitat mis à jour avec succès :", updatedHabitat);
        alert("Habitat mis à jour avec succès !");
        voirHabitat(); // Recharger les habitats après la mise à jour
    } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur lors de la mise à jour de l'habitat !");
    }
}



// fonction pour voir les animaux 


const voirAnimaux = document.getElementById("getAnimal");
if (document.readyState !== "loading") {
  voirAnimal();
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

async function voirAnimal() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
  };

  try {
      const response = await fetch("https://127.0.0.1:8000/api/animal/get", requestOptions);

      if (!response.ok) {
          throw new Error("Impossible de récupérer les informations animal");
      }

      const result = await response.json();
      voirAnimaux.innerHTML = '';

      result.forEach(item => {
          const animalElement = document.createElement('div');
          animalElement.classList.add('animal-container', 'mb-4');

          animalElement.innerHTML = `
          <div class="card shadow-sm text-dark text-center">
              <div class="card-body">
                  <h3 class="fw-bold fs-4">${item.prenom}</h3>
                                <p class="fw-normal">${item.etat}</p>
                                <p class="fw-normal">${item.nourriture}</p>
                                <p class="fw-normal">${item.grammage}</p>
                                <p class="fw-normal">${item.feeding_time}</p>
                                <p class="fw-normal">${item.created_at}</p>
                                <img src="${item.image_data}" class="img-fluid my-3 rounded" alt="${item.nom}">

                  <button class="modifierBouton btn btn-primary mt-3">Modifier</button>
                  <div class="modifyForm container text-center text-dark border border-primary rounded mt-3" style="display: none;">
                      <h5 class="text-center my-2">Modifier le animal</h5>
                      <input type="text" id="Prenom-${item.id}" value="${item.prenom}" placeholder="Prenom" class="form-control text-center">
                                            <input type="text" id="etat-${item.id}" value="${item.etat}" placeholder="etat" class="form-control text-center">
                                            <input type="text" id="nourriture-${item.id}" value="${item.nourriture}" placeholder="Nourriture" class="form-control text-center">
                                            <input type="text" id="grammage-${item.id}" value="${item.grammage}" placeholder="Grammage" class="form-control text-center">
                                            <input type="text" id="feedingTime-${item.id}" value="${item.feeding_time}" placeholder="Date du dernier passage" class="form-control text-center">
                                            <input type="text" id="createdAt-${item.id}" value="${item.created_at}" placeholder="Heure du dernier passage" class="form-control text-center">
                        <input type="file" id="image-${item.id}" class="form-control my-2">
                      <button class="fermerBouton btn btn-secondary my-3">Fermer</button>
                      <button class="validerBouton btn btn-primary my-3">Valider la modification</button>
                  </div>
              </div>
          </div>
      `;

          voirAnimaux.appendChild(animalElement);

          const modifierBouton = animalElement.querySelector('.modifierBouton');
          const modifyForm = animalElement.querySelector('.modifyForm');
          const fermerBouton = animalElement.querySelector('.fermerBouton');

          modifierBouton.addEventListener('click', () => {
              modifyForm.style.display = 'block';
          });

          fermerBouton.addEventListener('click', () => {
              modifyForm.style.display = 'none';
          });

          const validerBouton = animalElement.querySelector('.validerBouton');
          validerBouton.addEventListener('click', () => {
              modifierAnimal(item.id); // Appelle directement la fonction de modification
          });
      });

  } catch (error) {
      console.error(error);
  }
}


async function modifierAnimal(animalId) {
    const prenom = document.getElementById(`Prenom-${animalId}`).value;
    const etat = document.getElementById(`etat-${animalId}`).value;
    const nourriture = document.getElementById(`nourriture-${animalId}`).value;
    const grammage = document.getElementById(`grammage-${animalId}`).value;
    const createdAt = document.getElementById(`createdAt-${animalId}`).value;  // Remplacez "create" par "createdAt"
    const feedingTime = document.getElementById(`feedingTime-${animalId}`).value;  // Remplacez "feeding" par "feedingTime"

    const imageInput = document.getElementById(`image-${animalId}`);
    const imageFile = imageInput.files[0]; 
    let imageBase64 = null;

    if (imageFile) {
        try {
            imageBase64 = await convertirImageEnBase64(imageFile);
        } catch (error) {
            console.error("Erreur lors de la conversion de l'image en base64 :", error);
            alert("Erreur lors de la conversion de l'image.");
            return;
        }
    }

    const animalData = { 
        prenom, 
        etat,
        nourriture,
        grammage,
        created_at: createdAt,  // Utiliser "created_at"
        feeding_time: feedingTime,  // Utiliser "feeding_time"
    };

    if (imageBase64) {
        animalData.image_data = imageBase64;  
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const response = await fetch(`https://127.0.0.1:8000/api/animal/${animalId}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(animalData) 
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la modification de l'animal: ${response.statusText}`);
        }

        const updatedAnimal = await response.json();
        console.log("Animal mis à jour avec succès :", updatedAnimal);
        alert("Animal mis à jour avec succès !");
        voirAnimal(); 
    } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur lors de la mise à jour de l'animal !");
    }
}


// Fonction pour supprimer un service
async function supprimerService(serviceId) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-AUTH-TOKEN", getToken());


    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
    };

    try {
        const response = await fetch(`https://127.0.0.1:8000/api/service/${serviceId}`, requestOptions);

        if (!response.ok) {
            throw new Error("Erreur lors de la suppression du service");
        }

        // Rafraîchir la liste des services après la suppression
        voirService();
    } catch (error) {
        console.error(error);
    }
}

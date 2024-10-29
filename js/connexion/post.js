// Appel de l'initialisation des données lors de l'ouverture du modal
const modal = document.getElementById("staticBackdropAnimalPost");
modal.addEventListener('show.bs.modal', () => {
    voirRaceHabitat(); 
    voirHabitatAnimal(); 
});


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
        alert("Erreur lors de la création du service: " + error.message);
    }
}

async function createService(titreService, commentaireService, image_dataService) {
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());
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
        await fetchFromApi(`api/service/post`, requestOptions);
    } catch (error) {
        alert("Erreur lors de la création du service: " + error.message);
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
        const response = await fetch(`http://localhost:8000/api/race/post`, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
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

// Fonction pour voir les races lors de la création d'un animal
async function voirRaceHabitat() {
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

        const habitatSelect = document.getElementById('voirNomHabitat');
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

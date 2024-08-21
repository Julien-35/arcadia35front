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
    const imageInput = document.getElementById('image_dataService'); // Corrigez l'ID ici
    let image_data = '';

    // Vérification des champs requis
    if (!titre || !commentaire) {
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
        await createService(titre, commentaire, image_data);
        alert("Le service a été créé avec succès");
    } catch (error) {
        alert("Erreur lors de la création du service");
        console.error(error);
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
        const response = await fetch(`https://127.0.0.1:8000/api/service`, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Fonction pour lire le fichier image en base64
const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};



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
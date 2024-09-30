const SeeDates = document.getElementById("voirDate");

    if (document.readyState !== "loading") {
        voirHoraire();
    }


    async function voirHoraire() {
        try {
            const response = await fetch("https://127.0.0.1:8000/api/horaire/get");
            const responseText = await response.text(); // Lire la réponse brute
            
            // Retirer tout caractère non désiré (comme le '#')
            const cleanResponseText = responseText.replace(/^#/, ''); // Supprime le '#' au début s'il est présent
            
            // Tentez d'analyser le JSON après nettoyage
            const result = JSON.parse(cleanResponseText);
    
            const horairesContainer = document.getElementById("voirDate");
            horairesContainer.innerHTML = ''; // Clear the existing content
    
            // Titre pour la section horaires
            const horairesTitle = document.createElement('h3');
            horairesTitle.classList.add('fw-bold', 'fs-4');
            horairesTitle.textContent = "NOS HORAIRES"; // Titre de la section horaires
            horairesContainer.appendChild(horairesTitle);
    
            result.forEach(item => {
                // Créer un élément pour le titre
                const titreElement = document.createElement('p');
                titreElement.classList.add('fw-bold', 'fs-4'); // Optionnel : ajouter des classes pour le style
                titreElement.textContent = item.titre; // Titre
    
                // Créer un élément pour le message
                const messageElement = document.createElement('p');
                messageElement.classList.add('fw-normal', 'fs-4', 'pt-1'); // Optionnel : ajouter des classes pour le style
                messageElement.textContent = item.message; // Message
    
                // Créer un élément pour le jour
                const jourElement = document.createElement('p');
                jourElement.classList.add('fw-normal', 'fs-4', 'pt-1'); // Optionnel : ajouter des classes pour le style
                jourElement.textContent = `Jour: ${item.jour}`; // Jour
    
                // Créer un élément pour les heures
                const heureElement = document.createElement('p');
                heureElement.classList.add('fw-normal', 'fs-4', 'pt-1'); // Optionnel : ajouter des classes pour le style
                heureElement.textContent = `Horaires: ${item.heure_debut} à ${item.heure_fin}`; // Heures
    
                // Ajouter les éléments au conteneur horaires
                horairesContainer.appendChild(titreElement);
                horairesContainer.appendChild(messageElement);
                horairesContainer.appendChild(jourElement);
                horairesContainer.appendChild(heureElement);
            });
    
        } catch (error) {
            console.error('Error in getHoraire:', error);
            document.getElementById("voirDate").innerHTML = "<p>Impossible de récupérer les horaires.</p>";
        }
    }
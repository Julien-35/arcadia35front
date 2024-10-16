const SeeDates = document.getElementById("voirLesHoraires");

    if (document.readyState !== "loading") {
        voirHoraire();
    }


    async function voirHoraire() {
        try {
            // Appel API sans en-tête particulier
            const items = await fetchFromApi("api/horaire/get"); // Pas de token ici
    
            // Récupérer l'élément pour afficher les horaires
            const horairesContainer = document.getElementById("voirLesHoraires");
            horairesContainer.innerHTML = ''; // Vider le contenu existant
    
            // Parcourir chaque item pour construire l'affichage des horaires
            items.forEach(item => {
                const horaireDiv = document.createElement('div');
                horaireDiv.classList.add('fw-normal', 'fs-4');
    
                // Créer et insérer le titre
                const titreElement = document.createElement('h3');
                titreElement.textContent = decodeHtml(item.titre);
                
                // Créer et insérer le jour
                const jourElement = document.createElement('p');
                jourElement.textContent = decodeHtml(item.jour);
                
                // Créer et insérer les heures de début et fin
                const heureElement = document.createElement('p');
                heureElement.textContent = `De ${decodeHtml(item.heure_debut)} à ${decodeHtml(item.heure_fin)}`;
                
                // Créer et insérer le message
                const messageElement = document.createElement('p');
                messageElement.textContent = decodeHtml(item.message);
                
                // Ajouter tous les éléments au conteneur horaire
                horaireDiv.appendChild(titreElement);
                horaireDiv.appendChild(messageElement);
                horaireDiv.appendChild(jourElement);
                horaireDiv.appendChild(heureElement);
                
                // Ajouter l'élément horaire complet au conteneur principal
                horairesContainer.appendChild(horaireDiv);
            });
            
        } catch (error) {
            console.error('Error in voirHoraire:', error);
            document.getElementById("voirLesHoraires").innerHTML = "<p>Impossible de récupérer les horaires.</p>";
        }
    }
    
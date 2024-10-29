const SeeDates = document.getElementById("voirHoraires");

    if (document.readyState !== "loading") {
        voirHoraire();
    }


    async function voirHoraire() {
        try {
            const items = await fetchFromApi("api/horaire/get"); 
    
            // Récupérer l'élément pour afficher les horaires
            const horairesContainer = document.getElementById("voirHoraires");
            horairesContainer.innerHTML = ''; 
    
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
            document.getElementById("voirHoraire").innerHTML = "<p>Impossible de récupérer les horaires.</p>";
        }
    }
    
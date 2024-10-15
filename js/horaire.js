const SeeDates = document.getElementById("voirLesHoraires");

    if (document.readyState !== "loading") {
        voirHoraire();
    }


    async function voirHoraire() {
        try {
            const response = await fetch(" http://localhost:8000/api/horaire/get");
    
            // Afficher le statut de la réponse
            console.log('Response Status:', response.status);
            console.log('Response Headers:', response.headers);
    
            // Vérifier si la réponse est OK
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
    
            const responseText = await response.text(); // Lire la réponse brute
            const cleanResponseText = responseText.replace(/^#/, ''); // Supprime le '#' au début s'il est présent
            const result = JSON.parse(cleanResponseText); // Analyser le JSON
            
            // Récupérer l'élément pour afficher les horaires
            const horairesContainer = document.getElementById("voirLesHoraires");
            horairesContainer.innerHTML = ''; // Vider le contenu existant
    
            result.forEach(item => {
                const horaireDiv = document.createElement('div');
                horaireDiv.classList.add('fw-normal', 'fs-4');
    
                const titreElement = document.createElement('h3');
                titreElement.textContent = decodeHtml(item.titre);
                
                const jourElement = document.createElement('p');
                jourElement.textContent = decodeHtml(item.jour);
                
                const heureElement = document.createElement('p');
                heureElement.textContent = `De ${decodeHtml(item.heure_debut)} à ${decodeHtml(item.heure_fin)}`;
                
                const messageElement = document.createElement('p');
                messageElement.textContent = decodeHtml(item.message);
                
                horaireDiv.appendChild(titreElement);
                horaireDiv.appendChild(messageElement);
                horaireDiv.appendChild(jourElement);
                horaireDiv.appendChild(heureElement);
                
                horairesContainer.appendChild(horaireDiv);
            });
            
        } catch (error) {
            console.error('Error in voirHoraire:', error);
            document.getElementById("voirLesHoraires").innerHTML = "<p>Impossible de récupérer les horaires.</p>";
        }
    }
    
    
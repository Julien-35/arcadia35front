const SeeDates = document.getElementById("voirLesHoraires");

    if (document.readyState !== "loading") {
        voirHoraire();
    }


    async function voirHoraire() {
        try {
            const response = await fetch("https://arcadia35380-f680d3a74682.herokuapp.com/api/horaire/get");
            const responseText = await response.text(); // Lire la réponse brute
            
            // Retirer tout caractère non désiré (comme le '#')
            const cleanResponseText = responseText.replace(/^#/, ''); // Supprime le '#' au début s'il est présent
            
            // Tentez d'analyser le JSON après nettoyage
            const result = JSON.parse(cleanResponseText);
    
            const horairesContainer = document.getElementById("voirLesHoraires");
            horairesContainer.innerHTML = ''; // Vider le contenu existant
    
            result.forEach(item => {
                // Créer un conteneur pour chaque horaire
                const horaireDiv = document.createElement('div');
                horaireDiv.classList.add('fw-normal', 'fs-4');
    
                // Créer un élément pour le titre (décodé)
                const titreElement = document.createElement('h3');
                titreElement.textContent = decodeHtml(item.titre); // Décoder le titre
    
                // Créer un élément pour le jour (décodé)
                const jourElement = document.createElement('p');
                jourElement.textContent = decodeHtml(item.jour); // Décoder le jour
    
                // Créer un élément pour les heures (décodé)
                const heureElement = document.createElement('p');
                heureElement.textContent = `De ${decodeHtml(item.heure_debut)} à ${decodeHtml(item.heure_fin)}`; // Décoder les heures
    
                // Créer un élément pour le message (décodé)
                const messageElement = document.createElement('p');
                messageElement.textContent = decodeHtml(item.message); // Décoder le message
    
                // Ajouter les éléments au div du service horaire
                horaireDiv.appendChild(titreElement);
                horaireDiv.appendChild(messageElement);
                horaireDiv.appendChild(jourElement);
                horaireDiv.appendChild(heureElement);
    
                // Ajouter le div au conteneur horaires
                horairesContainer.appendChild(horaireDiv);
            });
    
        } catch (error) {
            console.error('Error in voirHoraire:', error);
            document.getElementById("voirLesHoraires").innerHTML = "<p>Impossible de récupérer les horaires.</p>";
        }
    }
    
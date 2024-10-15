

if (document.readyState === "loading") {
    // Loading hasn't finished yet
    servicesContainer.addEventListener('DOMContentLoaded', voirAnimal);


  } else {

    voirAnimal();

  }


  async function createRapport(animalId, rapport) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = {
        animal_id: animalId, // Lier le rapport à l'animal
        detail: rapport // Le contenu du rapport
    };

    try {
        const response = await fetch(`http://localhost:8000/api/rapportveterinaire/post`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            let errorResponse;
            try {
                const errorText = await response.text();
                errorResponse = JSON.parse(errorText);
                alert(`Erreur lors de la création du rapport : ${errorResponse.error || response.statusText}`);
            } catch (e) {
                alert("Erreur lors de la création du rapport : " + response.statusText);
            }
            return null; // Sortir de la fonction après une erreur
        }

        const createdRapport = await response.json(); // Analyser la réponse comme JSON
        return createdRapport; // Retourner le rapport créé
    } catch (error) {
        alert("Erreur lors de la création du rapport : " + error.message);
    }
}


// fonction pour voir les animaux

async function voirAnimal() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const items = await fetchData("http://localhost:8000/api/animal/get", myHeaders);
        const animauxContainer = document.getElementById("voirAnimal");
        animauxContainer.innerHTML = ''; // Effacer le contenu précédent

        const row = document.createElement('div'); // Créez une ligne (row) Bootstrap pour contenir les cartes
        row.classList.add("row");

        items.forEach(item => {
            // Création d'un conteneur pour chaque animal
            const animalElement = document.createElement('div');
            animalElement.classList.add("col-lg-3", "col-md-6", "col-sm-12", "mt-3", "d-flex", "justify-content-center");

            // Création de la carte de l'animal
            const card = document.createElement('div');
            card.classList.add("card", "shadow-sm", "p-3", "mb-5", "bg-white", "rounded");
            card.style.width = "18rem";

            // Ajout de l'image de l'animal
            const imageElement = document.createElement('img');
            imageElement.classList.add("card-img-top", "img-fluid", "rounded");
            imageElement.setAttribute('src', item.image_data || 'default_image.jpg'); // Image par défaut
            imageElement.setAttribute('alt', `Image de ${item.prenom}`);
            card.appendChild(imageElement);

            // Ajout du prénom en tant que titre
            const cardBody = document.createElement('div');
            cardBody.classList.add("card-body");

            const prenomTitle = document.createElement('h5');
            prenomTitle.classList.add("card-title", "text-center", "text-dark");
            prenomTitle.innerText = decodeHtml(item.prenom);
            cardBody.appendChild(prenomTitle);

            // Bouton pour afficher/cacher les détails
            const toggleButton = document.createElement('button');
            toggleButton.classList.add("btn", "btn-primary", "w-100");
            toggleButton.setAttribute("data-bs-toggle", "collapse");
            toggleButton.setAttribute("data-bs-target", `#collapse${item.id}`); // Cible correcte ici
            toggleButton.innerText = "Voir détails";
            cardBody.appendChild(toggleButton);

            // Détails de l'animal (collapse)
            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add("collapse");
            detailsDiv.setAttribute("id", `collapse${item.id}`); // Correction de l'ID

            const detailsBody = document.createElement('div');
            detailsBody.classList.add("mt-3");

            const detailsTable = `
                <table class="table">
                    <tr><th class="text-dark">Habitat</th><td class="text-dark">${decodeHtml(item.habitat || 'Non spécifié')}</td></tr>
                    <tr><th class="text-dark">Race</th><td class="text-dark">${decodeHtml(item.race || 'Non spécifié')}</td></tr>
                    <tr><th class="text-dark">Nourriture</th><td class="text-dark">${decodeHtml(item.nourriture || 'Non spécifié')}</td></tr>
                    <tr><th class="text-dark">Quantité du dernier repas</th><td class="text-dark pt-4">${decodeHtml(item.grammage || 'Non spécifié')}</td></tr>
                    <tr><th class="text-dark">Heure du repas</th><td class="text-dark">${decodeHtml(item.feeding_time || 'Non spécifié')}</td></tr>
                    <tr><th class="text-dark">Jour du repas</th><td class="text-dark">${decodeHtml(item.created_at.split('T')[0] || 'Non spécifié')}</td></tr>
                    <tr><th class="text-dark">État</th><td class="text-dark">${decodeHtml(item.etat)}</td></tr>
                </table>
            `;
            detailsBody.innerHTML = detailsTable;

            // Ajouter le formulaire pour mettre à jour le rapport et l'état
            const updateForm = document.createElement('form');
            updateForm.classList.add("mt-3");

            const etatInput = document.createElement('input');
            etatInput.type = 'text'; // Pour l'état
            etatInput.classList.add("form-control", "mb-2");
            etatInput.placeholder = "Nouvel état de l'animal";
            etatInput.value = item.etat || ''; // Valeur actuelle ou vide

            const rapportInput = document.createElement('textarea'); // Pour le rapport
            rapportInput.classList.add("form-control", "mb-2");
            rapportInput.placeholder = "Nouveau rapport vétérinaire";
            rapportInput.value = item.rapport_veterinaire && item.rapport_veterinaire.length > 0 
                ? item.rapport_veterinaire.map(r => r.detail).join('\n') 
                : ''; // Valeur actuelle ou vide

            const updateButton = document.createElement('button');
            updateButton.type = 'button'; // Empêcher le rechargement de la page
            updateButton.classList.add("btn", "btn-primary", "w-100");
            updateButton.innerText = "Mettre à jour";

            updateButton.onclick = async () => {
                const newEtat = etatInput.value.trim(); // Supprimer les espaces
                let newRapport = rapportInput.value.split('\n').map(r => r.trim()).filter(r => r); // Transformer et filtrer les rapports vides

                if (newEtat === '' && newRapport.length === 0) {
                    alert("Veuillez entrer un nouvel état ou un rapport vétérinaire.");
                    return; // Sortir si rien à mettre à jour
                }

                // Mettre à jour l'état de l'animal
                const updatedAnimal = await updateAnimal(item.id, newEtat, newRapport);

                // Créer des rapports vétérinaires si nécessaire
                if (newRapport.length > 0) {
                    await Promise.all(newRapport.map(rapportDetail => createRapport(item.id, rapportDetail)));
                }

                if (updatedAnimal) {
                    alert('Les données de l\'animal ont été mises à jour.');
                    // Mettre à jour les détails affichés
                    detailsBody.innerHTML = `
                        <table class="table">
                            <tr><th class="text-dark">Habitat</th><td class="text-dark">${decodeHtml(item.habitat || 'Non spécifié')}</td></tr>
                            <tr><th class="text-dark">Race</th><td class="text-dark">${decodeHtml(item.race || 'Non spécifié')}</td></tr>
                            <tr><th class="text-dark">Nourriture</th><td class="text-dark">${decodeHtml(item.nourriture || 'Non spécifié')}</td></tr>
                            <tr><th class="text-dark">Quantité du dernier repas</th><td class="text-dark pt-4">${decodeHtml(item.grammage || 'Non spécifié')}</td></tr>
                            <tr><th class="text-dark">Heure du repas</th><td class="text-dark">${decodeHtml(item.feeding_time || 'Non spécifié')}</td></tr>
                            <tr><th class="text-dark">Jour du repas</th><td class="text-dark">${decodeHtml(item.created_at.split('T')[0] || 'Non spécifié')}</td></tr>
                            <tr><th class="text-dark">État</th><td class="text-dark">${decodeHtml(newEtat || 'Non spécifié')}</td></tr>
                        </table>
                    `;

                    // Recréer le rapport vétérinaire
                    if (newRapport.length > 0) {
                        const rapportTitle = document.createElement('h6');
                        rapportTitle.classList.add("text-dark", "mt-3");
                        rapportTitle.innerText = "Rapport du Vétérinaire:";
                        detailsBody.appendChild(rapportTitle);

                        const rapportList = document.createElement('ul');
                        rapportList.classList.add("list-group");

                        newRapport.forEach(detail => {
                            const rapportItem = document.createElement('li');
                            rapportItem.classList.add("list-group-item", "text-dark");
                            rapportItem.innerText = decodeHtml(detail);
                            rapportList.appendChild(rapportItem);
                        });

                        detailsBody.appendChild(rapportList);
                    }
                } else {
                    alert('Échec de la mise à jour des données.');
                }
            };

            updateForm.appendChild(etatInput);
            updateForm.appendChild(rapportInput);
            updateForm.appendChild(updateButton);

            detailsBody.appendChild(updateForm);

            // Ajouter les rapports vétérinaires (liste des détails)
            if (item.rapport_veterinaire && item.rapport_veterinaire.length > 0) {
                const rapportTitle = document.createElement('h6');
                rapportTitle.classList.add("text-dark", "mt-3");
                rapportTitle.innerText = "Rapport du Vétérinaire:";
                detailsBody.appendChild(rapportTitle);

                const rapportList = document.createElement('ul');
                rapportList.classList.add("list-group");

                item.rapport_veterinaire.forEach(rapport => {
                    const rapportItem = document.createElement('li');
                    rapportItem.classList.add("list-group-item", "text-dark");
                    rapportItem.innerText = decodeHtml(rapport.detail);
                    rapportList.appendChild(rapportItem);
                });

                detailsBody.appendChild(rapportList);
            } else {
                // Si pas de rapport, afficher un message
                const noRapportMessage = document.createElement('p');
                noRapportMessage.classList.add("text-dark", "mt-3");
                noRapportMessage.innerText = "Aucun rapport n'est disponible.";
                detailsBody.appendChild(noRapportMessage);
            }

            detailsDiv.appendChild(detailsBody);
            cardBody.appendChild(detailsDiv);

            // Ajouter le corps de la carte au conteneur principal
            card.appendChild(cardBody);
            animalElement.appendChild(card);

            // Ajouter la carte dans la rangée
            row.appendChild(animalElement);
        });

        // Ajouter la rangée dans le conteneur d'animaux
        animauxContainer.appendChild(row);

    } catch (error) {
        console.error("Error:", error);
        alert("Une erreur s'est produite lors de la récupération des animaux.");
    }
}

async function updateAnimal(id, etat, rapport) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = {
        etat: etat,
        rapport_veterinaire: rapport
    };

    try {
        const response = await fetch(`http://localhost:8000/api/animal/${id}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(data)
        });

        const textResponse = await response.text(); // Lire la réponse en tant que texte

        // Supprimer le caractère '#' de la réponse si présent
        const cleanedResponse = textResponse.replace(/#/g, '');

        if (!response.ok) {
            let errorResponse;
            try {
                errorResponse = JSON.parse(cleanedResponse);
                alert(`Erreur lors de la mise à jour de l'animal : ${errorResponse.error || response.statusText}`);
            } catch (e) {
                alert("Erreur lors de la mise à jour de l'animal : " + cleanedResponse);
            }
            return; // Sortir de la fonction après une erreur
        }

        let updatedAnimal;
        try {
            updatedAnimal = JSON.parse(cleanedResponse); // Analyser la réponse comme JSON
            return updatedAnimal.animal; // Retourner l'animal mis à jour
        } catch (e) {
            alert("L'animal a été mis à jour, mais une erreur s'est produite lors de l'analyse de la réponse.");
        }
    } catch (error) {
        alert("Erreur lors de la mise à jour de l'animal : " + error.message);
    }
}

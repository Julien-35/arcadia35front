
const Avis = document.getElementById("avis");

if (document.readyState === "loading") {
  // Loading hasn't finished yet
  Avis.addEventListener('DOMContentLoaded', voirAvis);
} else {
  voirAvis();
  
}
if (document.readyState === "loading") {
    // Loading hasn't finished yet
    services-container.addEventListener('DOMContentLoaded', voirService);
  } else {
    // `DOMContentLoaded` has already fired
    voirService();
  }



async function voirService() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const items = await fetchData("https://127.0.0.1:8000/api/service/get", myHeaders);

        const servicesContainer = document.getElementById("getService");
        servicesContainer.innerHTML = ''; // Vide le conteneur avant d'ajouter les nouveaux éléments

        items.forEach(item => {
            // Création des éléments de manière sécurisée
            const serviceElement = document.createElement('div');
            serviceElement.classList.add("container", "text-center");

            // Créer et insérer le titre
            const serviceTitle = document.createElement('h2');
            serviceTitle.classList.add("my-4");
            serviceTitle.textContent = decodeHtml(item.nom);  // Décoder le nom si nécessaire
            serviceElement.appendChild(serviceTitle);

            // Créer la div contenant la description et l'image
            const rowElement = document.createElement('div');
            rowElement.classList.add("container", "text-center", "row", "row-cols-1", "row-cols-lg-2", "d-flex", "justify-content-evenly", "align-items-center");

            // Créer et insérer la description
            const descriptionElement = document.createElement('p');
            descriptionElement.classList.add("col");
            descriptionElement.textContent = decodeHtml(item.description);  // Décoder la description si nécessaire
            rowElement.appendChild(descriptionElement);

            // Créer et insérer l'image
            const imageElementContainer = document.createElement('div');
            const imageElement = document.createElement('img');
            imageElement.classList.add("img-fluid", "rounded", "w-100", "h-100");
            imageElement.setAttribute('src', item.image_data);  // Utilisation de setAttribute pour l'URL de l'image
            imageElement.setAttribute('alt', `Image de ${item.nom}`);
            imageElementContainer.appendChild(imageElement);

            rowElement.appendChild(imageElementContainer);
            serviceElement.appendChild(rowElement);

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




function ouvrirModal(serviceId, oldImageData) {
    $('#confirmationModal').modal('show');

    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    confirmBtn.onclick = () => {
        modifierService(serviceId, oldImageData);
        $('#confirmationModal').modal('hide');
    };

    cancelBtn.onclick = () => {
        $('#confirmationModal').modal('hide');
    };
}

async function modifierService(serviceId, oldImageData) {
    const nom = document.getElementById(`nom-${serviceId}`).value;
    const description = document.getElementById(`description-${serviceId}`).value;
    const imageInput = document.getElementById(`image_data-${serviceId}`);
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
            image_data = await readFileAsBase64(file);
            image_data = `data:${file.type};base64,${image_data}`;
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
        voirService();
    } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur lors de la mise à jour du service !");
    }
}




async function voirAvis() {
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken()); // Assurez-vous que cette fonction renvoie le bon token
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    try {
        const response = await fetch("https://127.0.0.1:8000/api/avis/get", requestOptions);
        if (!response.ok) throw new Error('Failed to fetch avis');

        const result = await response.json();
        let content = '';
        result.forEach(item => {
            const buttonText = item.isVisible ? "Cacher l'avis" : "Afficher l'avis";
            const buttonClass = item.isVisible ? 'btn btn-danger toggle-avis-button' : 'btn btn-success toggle-avis-button';
            content += `
                <ol class="list-group">
                    <li class="list-group-item justify-content-between align-items-start text-dark">
                        <div class="ms-2">
                            <div class="fw-bold">${item.pseudo}</div>
                            <p>${item.commentaire}</p>
                        </div>
                        <button class="${buttonClass}" data-avis-id="${item.id}" data-avis-visible="${item.isVisible}">
                            ${buttonText}
                        </button>
                    </li>
                </ol>`;
        });
        document.getElementById("avis").innerHTML = content;

        // Ajout des event listeners pour chaque bouton
        document.querySelectorAll('.toggle-avis-button').forEach(button => {
            button.addEventListener('click', async () => {
                const avisId = button.getAttribute('data-avis-id');
                const currentVisibility = JSON.parse(button.getAttribute('data-avis-visible'));
                const newValue = !currentVisibility;

                try {
                    console.log(`Toggling visibility for avis ${avisId}. New value: ${newValue}`);

                    // Préparer les options de la requête PUT
                    const putRequestOptions = {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-AUTH-TOKEN': getToken() // Vérifiez ici si getToken renvoie un token valide
                        },
                        body: JSON.stringify({ isVisible: newValue })
                    };

                    // Envoyer la requête PUT
                    const response = await fetch(`https://127.0.0.1:8000/api/avis/${avisId}`, putRequestOptions);
                    const result = await response.json();

                    console.log("Response from server:", result);
                    if (!response.ok) {
                        console.error("Server returned an error", result);
                        throw new Error(`Failed to toggle visibility for avis ${avisId}`);
                    }

                    // Mettre à jour les attributs et le texte du bouton
                    button.setAttribute('data-avis-visible', newValue);
                    button.textContent = newValue ? "Cacher l'avis" : "Afficher l'avis";
                    button.className = newValue ? 'btn btn-danger toggle-avis-button' : 'btn btn-success toggle-avis-button';

                } catch (error) {
                    console.error('Error:', error);
                    alert(`An error occurred while toggling visibility for avis ${avisId}`);
                }
            });
        });

    } catch (error) {
        console.error('Error fetching avis:', error);
        console.log("Impossible de récupérer les informations d'avis");
    }
}



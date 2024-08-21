

if (document.readyState === "loading") {
    // Loading hasn't finished yet
    services-container.addEventListener('DOMContentLoaded', voirService);


  } else {
    // `DOMContentLoaded` has already fired
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
    try {
        const items = await fetchData("https://127.0.0.1:8000/api/service/get", myHeaders);
        const servicesContainer = document.getElementById("getService");
        servicesContainer.innerHTML = '';

        let rowElement = document.createElement('div');
        rowElement.classList.add('row', 'text-center', 'justify-content-center');

        items.forEach((item, index) => {
            const serviceElement = document.createElement('div');
            serviceElement.classList.add('col-lg-4', 'mb-4', 'd-flex', 'align-items-stretch');

            serviceElement.innerHTML = `
                <div class="card shadow-sm h-100 text-dark">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <h2 class="card-title">${item.nom}</h2>
                        <div class="row">
                            <p class="col-12">${item.description}</p>
                            <div class="col-12">
                                <img class="img-fluid rounded w-100" src="${item.image_data}" alt="Image de ${item.nom}">
                            </div>
                        </div>
                        <div class="modifyForm create-Habitat-form container text-center text-dark border border-primary rounded mb-5">
                            <h5 class="text-center my-2">Modifier le service</h5>
                            <input type="text" id="nom-${item.id}" value="${item.nom}" placeholder="Nom du service" class="form-control text-center">
                            <textarea rows="5" id="description-${item.id}" placeholder="Description" class="form-control my-5 text-center">${item.description}</textarea>
                            <input type="file" id="image_data-${item.id}" class="form-control">
                            <button class="validerBouton btn btn-primary my-5">Valider la modification</button>
                        </div>
                    </div>
                </div>
            `;

            rowElement.appendChild(serviceElement);

            if ((index + 1) % 3 === 0) {
                servicesContainer.appendChild(rowElement);
                rowElement = document.createElement('div');
                rowElement.classList.add('row', 'text-center', 'justify-content-center');
            }

            // Ajouter l'événement pour le bouton de validation
            const validerBouton = serviceElement.querySelector('.validerBouton');
            validerBouton.addEventListener('click', () => {
                ouvrirModal(item.id, item.image_data);
            });
        });

        if (rowElement.childElementCount > 0) {
            servicesContainer.appendChild(rowElement);
        }

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

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
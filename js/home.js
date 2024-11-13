
const avis = document.getElementById("voirAvis");
const service = document.getElementById("voirService")
if (document.readyState === "loading") {
    service.addEventListener('DOMContentLoaded', voirService);
    avis.addEventListener('DOMContentLoaded', voirAvis);

  } else {
    voirService();
    voirAvis();
  }



  async function voirAvis() {
    try {
        const result = await fetchFromApi("api/avis/get"); 

        const avisContainer = document.getElementById("voirAvis");
        avisContainer.textContent = '';

        result.forEach(item => {
            if (item.isVisible) {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'justify-content-between', 'align-items-start', 'text-dark', 'm-2', 'border', 'border-primary', 'rounded');

                const divContainer = document.createElement('div');
                divContainer.classList.add('ms-2', 'p-2');

                // Pseudo sécurisé
                const pseudoElement = document.createElement('div');
                pseudoElement.classList.add('fw-bold');
                pseudoElement.textContent = item.pseudo; 

                // Commentaire sécurisé
                const commentaireElement = document.createElement('p');
                commentaireElement.textContent = item.commentaire; 

                // Ajouter le pseudo et le commentaire dans le conteneur
                divContainer.appendChild(pseudoElement);
                divContainer.appendChild(commentaireElement);

                // Ajouter le conteneur à l'élément de liste
                listItem.appendChild(divContainer);

                // Ajouter l'élément de liste au conteneur principal
                avisContainer.appendChild(listItem);
            }
        });
    } catch (error) {
        document.getElementById("voirAvis").textContent = "<p>Impossible de récupérer les avis.</p>";
    }
}

async function voirService() {
    try {
        const items = await fetchFromApi("api/service/get");
        const servicesContainer = document.getElementById("voirService");
        servicesContainer.textContent = ''; 

        items.forEach(item => {
            const serviceElement = document.createElement('div');
            serviceElement.classList.add('container', 'm-1', 'fw-bold');

            const serviceTitle = document.createElement('p');
            serviceTitle.textContent = `- ${item.nom}`;

            serviceElement.appendChild(serviceTitle);
            servicesContainer.appendChild(serviceElement);
        });
    } catch (error) {
        document.getElementById("voirService").textContent = "Impossible de récupérer les services.";
    }
}

async function creerUnAvis() {
    const form = document.getElementById("creerAvis");
    const formData = new FormData(form);
    const pseudo = formData.get('pseudoAvis');
    const commentaire = formData.get('commentaireAvis');

    // Vérification des champs requis
    if (!pseudo || !commentaire) {
        alert("Le champ pseudo et commentaire ne peuvent pas être vides");
        return;
    }

    // Vérifiez si le pseudo ou le commentaire contiennent des scripts
    if (containsScript(pseudo) || containsScript(commentaire)) {
        alert("Des caractères non valides ont été détectés.");
        return; 
    }

    // Sanitize les entrées utilisateur
    const sanitizedpseudo = sanitizeInput(pseudo);
    const sanitizedcommentaire = sanitizeInput(commentaire);

    try {
        // Appel de la fonction pour créer l'avis
        await createAvis(sanitizedpseudo, sanitizedcommentaire);

        // Ouvrir la modal après la création de l'avis
        const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        confirmationModal.show();

        // Ajout d'un listener au bouton pour rediriger l'utilisateur vers l'accueil
        document.getElementById('Redirection').addEventListener('click', function() {
            window.location.href = "/home"; 
        });

    } catch (error) {
        alert("Erreur lors de la création de l'avis");
    }
}

// Fonction pour créer l'avis dans l'API
async function createAvis(pseudoAvis, commentaireAvis) {
    const raw = JSON.stringify({
        pseudo: pseudoAvis,
        commentaire: commentaireAvis,
        isVisible: false
    });

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: raw,
        redirect: "follow",
        mode: "cors"
    };

    try {
        const result = await fetchFromApi("api/avis/post", requestOptions); 
        return result; 
    } catch (error) {
        throw error;
    }
}


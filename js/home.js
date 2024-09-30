
const avis = document.getElementById("voirAvis");
const service = document.getElementById("voirService")
if (document.readyState === "loading") {
    // Loading hasn't finished yet
    service.addEventListener('DOMContentLoaded', voirService);
    avis.addEventListener('DOMContentLoaded', voirAvis);

  } else {
    voirService();
    voirAvis();
  }

  async function creerUnAvis() {
    const pseudo = document.getElementById('pseudo').value;
    const commentaire = document.getElementById('commentaire').value;

    const avisData = {
        pseudo: pseudo,
        commentaire: commentaire,
        is_visible: false  
    };

    try {
        const response = await fetch("https://127.0.0.1:8000/api/avis/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(avisData)
        });
        if (!response.ok) throw new Error("Erreur lors de l'envoie de l'avis");
        const myModal = new bootstrap.Modal(document.getElementById('MessageAvis'));
        myModal.show();
    } catch (error) {
        console.error('Error in creerUnAvis:', error);
        alert("Impossible d'envoyer l'avis. Veuillez réessayer plus tard.");
    }
}


  async function voirAvis() {
    try {
        const response = await fetch("https://127.0.0.1:8000/api/avis/get");
        const responseText = await response.text(); // Lire la réponse brute
        
        // Retirer tout caractère non désiré (comme le '#')
        const cleanResponseText = responseText.replace(/^#/, ''); // Supprime le '#' au début s'il est présent
        
        // Tentez d'analyser le JSON après nettoyage
        const result = JSON.parse(cleanResponseText);

        const avisContainer = document.getElementById("voirAvis");
        avisContainer.innerHTML = ''; // Clear the existing content

        result.forEach(item => {
            if (item.isVisible) {
                // Créer les éléments en toute sécurité sans utiliser innerHTML
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'justify-content-between', 'align-items-start', 'text-dark', 'm-2', 'border', 'border-primary', 'rounded');
                
                const divContainer = document.createElement('div');
                divContainer.classList.add('ms-2', 'p-2');

                // Pseudo sécurisé
                const pseudoElement = document.createElement('div');
                pseudoElement.classList.add('fw-bold');
                pseudoElement.textContent = item.pseudo; // Utilisez textContent pour éviter XSS

                // Commentaire sécurisé
                const commentaireElement = document.createElement('p');
                commentaireElement.textContent = item.commentaire; // Utilisez textContent pour éviter XSS

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
        console.error('Error in voirAvis:', error);
        document.getElementById("voirAvis").innerHTML = "<p>Impossible de récupérer les avis.</p>";
    }
}



async function voirService() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        const items = await fetchData("https://127.0.0.1:8000/api/service/get", myHeaders);
        const servicesContainer = document.getElementById("voirService");
        servicesContainer.innerHTML = ''; // Clear existing content

        items.forEach(item => {
            // Créer un nouvel élément sans utiliser innerHTML
            const serviceElement = document.createElement('div');
            serviceElement.classList.add('container','m-1','fw-bold'); // Ajouter les classes

            // Créer un élément pour le nom du service
            const serviceTitle = document.createElement('p');
            serviceTitle.textContent = `- ${item.nom}`; // Nom du service

            // // Créer un élément pour la description
            // const serviceDescription = document.createElement('p');
            // serviceDescription.textContent = item.description; // Description du service

            // // Ajouter les éléments au conteneur de service
            serviceElement.appendChild(serviceTitle);  // Ajouter le titre
            // serviceElement.appendChild(serviceDescription);  // Ajouter la description

            // Ajouter un séparateur horizontal (hr)
            //  const hrElement = document.createElement('hr');
            // serviceElement.appendChild(hrElement);

            // Ajouter l'élément au conteneur principal
            servicesContainer.appendChild(serviceElement);
        });
    } catch (error) {
        console.error("Error in voirService:", error);
        document.getElementById("voirService").textContent = "Impossible de récupérer les services.";
    }
}


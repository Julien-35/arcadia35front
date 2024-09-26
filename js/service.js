
function getToken() {
    return localStorage.getItem('apiToken');
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
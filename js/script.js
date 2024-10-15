
// Création des variables pour les cookies
const tokenCookieName = "apiToken";
const roleCookieName = "userRole";

// Création de la variable pour le bouton de déconnexion
const btnSignout = document.getElementById("btnSignout");

// Création de l'événement pour le bouton de déconnexion
btnSignout.addEventListener("click", deconnexion);

// Fonction pour la déconnexion
function deconnexion() {
    eraseCookie(tokenCookieName);
    eraseCookie(roleCookieName);
    window.location.reload(); 
}

document.getElementById('btnSignout').addEventListener('click', () => {
    deconnexion();
});

// Fonction pour définir un cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Fonction pour obtenir la valeur d'un cookie
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let c of ca) {
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Fonction pour effacer un cookie
function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


// Fonction pour obtenir les rôles de l'utilisateur
const getRoles = () => {
    return sessionStorage.getItem("userRole") || "disconnected";
};

// Fonction pour vérifier si l'utilisateur est connecté
const isConnected = () => {
    return getCookie(tokenCookieName) !== null;
};

// Fonction pour afficher ou masquer les éléments en fonction du rôle
function showAndHideElementsForRoles() {
    const userConnected = isConnected(); 
    const userRole = getCookie(roleCookieName);

    document.querySelectorAll('[data-show]').forEach(element => {
        const showRole = element.dataset.show; 
        let shouldShow = false;

        switch (showRole) {
            case 'disconnected':
                shouldShow = !userConnected;
                break;
            case 'connected':
                shouldShow = userConnected;
                break;
            case 'admin':
                shouldShow = userRole === 'ROLE_ADMIN';
                break;
            case 'employe':
                shouldShow = userRole === 'ROLE_EMPLOYE';
                break;
            case 'veterinaire':
                shouldShow = userRole === 'ROLE_VETERINAIRE';
                break;
        }
        
        element.classList.toggle("d-none", !shouldShow); 
    });
}


// Appeler la fonction lors du chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    showAndHideElementsForRoles();
});


// Fonction pour se connecter 
async function login(email, password) {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
        // Enregistre le token et le rôle dans des cookies
        setCookie(tokenCookieName, data.apiToken, 7); // Enregistre le token dans un cookie
        setCookie(roleCookieName, data.roles[0], 7); // Enregistre le premier rôle dans un cookie
        window.location.href = '/'; 
    } else {
        alert(data.message);
    }
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

        return await response.json(); // Récupération directe du JSON
    } catch (error) {
        console.error("Error fetching data:", error); // Log the error
        throw error;
    }
}

// Fonction pour décoder les entités HTML
function decodeHtml(html) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    return textArea.value;
}

function sanitizeInput(input){
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
}


function getToken() {
    return getCookie(tokenCookieName); // Utilise getCookie pour récupérer le token
}
  
// Fonction pour lire le fichier image en base64

const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Fonction pour détecter les scripts
function containsScript(input) {
    const scriptPattern = /<script.*?>.*?<\/script>/i; // RegEx pour détecter les balises <script>
    
    // Si un script est détecté, redirigez l'utilisateur
    if (scriptPattern.test(input)) {
        alert("Des scripts ont été détectés dans l'entrée. Vous allez être redirigé.");
        window.location.href = "https://www.cybermalveillance.gouv.fr/"; // Remplacez par l'URL de redirection souhaitée
        return true; // Retourne vrai si un script est détecté
    }
    return false; // Retourne faux si aucun script n'est détecté
}




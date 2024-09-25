// Création des variables pour les cookies
const tokenCookieName = "accestoken";
const roleCookieName = "role";

// Création de la variable pour le bouton de déconnexion
const btnSignout = document.getElementById("btnSignout");

// Création de l'événement pour le bouton de déconnexion
btnSignout.addEventListener("click", deconnexion);

// Fonction pour la déconnexion
function deconnexion() {
    eraseCookie(tokenCookieName);
    eraseCookie(roleCookieName);
    localStorage.removeItem('apiToken');
    localStorage.removeItem('userRole');
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
    const userConnected = localStorage.getItem('apiToken') !== null;
    const userRole = localStorage.getItem('userRole');
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


// Fonction pour se connecter (exemple)
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
        localStorage.setItem('apiToken', data.apiToken);
        localStorage.setItem('userRole', data.roles[0]); 
        window.location.href = '/'; 
    } else {
        alert(data.message);
    }
}
function getToken() {
    return localStorage.getItem('apiToken');
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

// Fonction pour nettoyer les entrées utilisateur avant de les envoyer au serveur.
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}
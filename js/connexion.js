// Références aux éléments du DOM
const InputEmail = document.getElementById("EmailInput");
const InputPassword = document.getElementById("PasswordInput");
const btnConnexion = document.getElementById("btnConnexion");

// Ajouter des écouteurs d'événements pour la validation en temps réel
InputEmail.addEventListener("keyup", validateForm);
InputPassword.addEventListener("keyup", validateForm);

// Ajouter un écouteur d'événement pour le bouton de connexion
btnConnexion.addEventListener("click", ConnexionUtilisateur);

// Fonction pour valider le formulaire de connexion
function validateForm() {
    const pwdOk = validatePassword(InputPassword);
    const mailOk = validateMail(InputEmail);
    btnConnexion.disabled = !(pwdOk && mailOk);
}

// Fonction pour vérifier la configuration de l'e-mail via un regex
function validateMail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mailUser = input.value;
    const isValid = emailRegex.test(mailUser);
    updateValidationState(input, isValid);
    return isValid;
}

// Fonction pour définir la validité du mot de passe
function validatePassword(input) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    const passwordUser = input.value;
    const isValid = passwordRegex.test(passwordUser);
    updateValidationState(input, isValid);
    return isValid;
}

// Fonction pour mettre à jour l'état de validation d'un champ
function updateValidationState(input, isValid) {
    if (isValid) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
    }
}

// Fonction pour la connexion de l'utilisateur
async function ConnexionUtilisateur(event) {
    event.preventDefault();

    const email = InputEmail.value.trim();
    const password = InputPassword.value.trim();

    if (!validateMail(InputEmail) || !validatePassword(InputPassword)) {
        return; // Ne pas envoyer la requête si les validations échouent
    }

    const loginData = {
        email: email,
        password: password
    };

    try {
        const response = await fetch("https://127.0.0.1:8000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData),
            mode: "cors"
        });

        if (!response.ok) {
            throw new Error('Erreur de connexion : ' + response.statusText);
        }

        const result = await response.json();

        // Stocker le token et les données dans le localStorage
        localStorage.setItem('apiToken', result.apiToken); // Stocker le token d'authentification
        localStorage.setItem('userRole', result.roles[0]); // Stocker le rôle utilisateur

        // Rediriger vers la page appropriée
        window.location.href = '/home'; // Modifier cette ligne en fonction de votre logique de redirection

    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la connexion.');
    }
}

// Fonction pour obtenir le token
function getToken() {
    return localStorage.getItem('apiToken');
}

// Fonction pour vérifier les champs requis (par exemple, non vides)
function validateRequire(input) {
    const isValid = input.value.trim() !== '';
    updateValidationState(input, isValid);
    return isValid;
}

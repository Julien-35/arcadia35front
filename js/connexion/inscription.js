const InputPrenom = document.getElementById("PrenomInput");
const InputNom = document.getElementById("NomInput");
const InputEmail = document.getElementById("EmailInput");
const InputPassword = document.getElementById("PasswordInput");
const InputRole = document.getElementById("RoleInput"); 
const btnInscription = document.getElementById("btnInscription");
const FormInscription = document.getElementById("formulaireInscription");

InputPrenom.addEventListener("keyup", validateForm);
InputNom.addEventListener("keyup", validateForm);
InputEmail.addEventListener("keyup", validateForm);
InputPassword.addEventListener("keyup", validateForm);
InputRole.addEventListener("change", validateForm); // Ajoutez cet écouteur pour le rôle
btnInscription.addEventListener("click", InscrireUtilisateur);

function validateForm() {
    const PrenomOk = validatePrenom(InputPrenom);
    const NomOk = validateNom(InputNom);
    const pwdOk = validatePassword(InputPassword);
    const mailOk = validateMail(InputEmail);
    const roleOk = validateRole(InputRole); // Validez le rôle

    btnInscription.disabled = !(PrenomOk && NomOk && pwdOk && mailOk && roleOk);
}

function validateMail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mailUser = input.value;
    if (mailUser.match(emailRegex)) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

function validatePassword(input) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    const passwordUser = input.value;
    if (passwordUser.match(passwordRegex)) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

function validatePrenom(input) {
    if (input.value.trim() !== '') {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

function validateNom(input) {
    if (input.value.trim() !== '') {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

function validateRole(input) {
    if (input.value.trim() !== '') {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

function InscrireUtilisateur(event) {
    event.preventDefault();

    let dataForm = new FormData(FormInscription);
    let userData = {
        "prenom": dataForm.get("prenom"),
        "nom": dataForm.get("nom"),
        "email": dataForm.get("email"),
        "password": dataForm.get("password"),
        "role": dataForm.get("role") 
    };

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify(userData);

    let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://127.0.0.1:8000/api/registration", requestOptions)
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorText => {
                    throw new Error(`Erreur ${response.status}: ${errorText}`);
                });
            }
            return response.json();
        })
        .then(result => {
            console.log("Inscription réussie:", result);

            let templateParams = {
                from_name: `${userData.prenom} ${userData.nom}`,
                to_email: userData.email,
                message: `Bienvenue ${userData.prenom} ${userData.nom}! Votre inscription a été réussie.`
            };

            emailjs.send('service_veuyjvv', 'templateId', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    alert('Inscription réussie et e-mail envoyé!');
                }, function(error) {
                    console.log('FAILED...', error);
                    alert('Inscription réussie mais échec de l\'envoi du message.');
                });
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'inscription. Veuillez vérifier les données.');
        });
}

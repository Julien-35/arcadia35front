(function() {
    emailjs.init("hiebLS3jQ2Yh7c-d-"); // Remplacez par votre ID utilisateur EmailJS
})();

const contact = document.getElementById("contactTitle");
const message = document.getElementById("contactDescription");
const email = document.getElementById("exampleInputEmail1");
const btnSend = document.getElementById("btnSend");

contact.addEventListener("keyup", validateFormContact);
email.addEventListener("keyup", validateFormContact);
message.addEventListener("keyup", validateFormContact);

function validateFormContact() {
    const contactOk = validateData(contact);
    const messageOk = validateTextArea(message);
    const emailOk = validateMailVisiteur(email);
    btnSend.disabled = !(contactOk && messageOk && emailOk);
}

function validateData(input) {
    if (input.value !== '') {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

function validateTextArea(textarea) {
    if (textarea.value !== '') {
        textarea.classList.add("is-valid");
        textarea.classList.remove("is-invalid");
        return true;
    } else {
        textarea.classList.remove("is-valid");
        textarea.classList.add("is-invalid");
        return false;
    }
}

function validateMailVisiteur(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mailVisiteur = input.value;
    if (mailVisiteur.match(emailRegex)) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let templateParams = {
        from_name: contact.value,
        message: message.value,
        reply_to: email.value
    };

    emailjs.send('service_veuyjvv', 'template_qxe5e1n', templateParams) // Remplacez par votre Service ID , et votre Template ID
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('Message envoyé avec succès!');
        }, function(error) {
            console.log('FAILED...', error);
            alert('Échec de l\'envoi du message.');
        });
});



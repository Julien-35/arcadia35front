import { validateMail, validatePassword, validateForm } from '../js/connexion.js';

describe('Tests unitaires de la fonction de validation de connexion', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <input id="EmailInput" type="email" />
            <input id="PasswordInput" type="password" />
            <button id="btnConnexion" disabled>Connexion</button>
        `;
    });

    test('validateMail doit valider les formats d\'email corrects', () => {
        const inputEmail = document.getElementById('EmailInput');
        inputEmail.value = 'test@example.com';
        expect(validateMail(inputEmail)).toBe(true);

        inputEmail.value = 'user@sub.domain.org';
        expect(validateMail(inputEmail)).toBe(true);

        inputEmail.value = 'invalid-email';
        expect(validateMail(inputEmail)).toBe(false);
    });

    test('validatePassword doit valider les mots de passe forts', () => {
        const inputPassword = document.getElementById('PasswordInput');
        inputPassword.value = 'StrongP@ss1';
        expect(validatePassword(inputPassword)).toBe(true);

        inputPassword.value = 'weakpassword';
        expect(validatePassword(inputPassword)).toBe(false);
    });

    test('validateForm doit activer/désactiver le bouton de connexion', () => {
        const inputEmail = document.getElementById('EmailInput');
        const inputPassword = document.getElementById('PasswordInput');
        const btnConnexion = document.getElementById('btnConnexion');

        inputEmail.value = 'test@example.com';
        inputPassword.value = 'StrongP@ss1';
        validateForm();  // Appel explicite de la fonction validateForm
        expect(btnConnexion.disabled).toBe(false);  // Le bouton doit être activé

        inputEmail.value = 'invalid-email';
        inputPassword.value = 'StrongP@ss1';
        validateForm();
        expect(btnConnexion.disabled).toBe(true);  // Le bouton doit être désactivé

        inputEmail.value = 'test@example.com';
        inputPassword.value = 'weakpassword';
        validateForm();
        expect(btnConnexion.disabled).toBe(true);  // Le bouton doit être désactivé
    });
});

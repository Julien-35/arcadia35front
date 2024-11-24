# Front-End du Projet

Ce projet est le front-end du projet Arcadia utilisant **HTML**, **JavaScript**, et **Bootstrap**. I

## Structure du Dossier

- **images/** : Contient toutes les images utilisées dans le projet en format brut.
- **js/** : Ce dossier contient les fichiers JavaScript, y compris les scripts pour la logique de l'application ainsi que les différentes Methods CRUD.
- **node_modules/** : Dossier généré par npm qui contient les modules et dépendances Node.js pour l'utilisation de Bootstrap.
- **pages/** : Ce dossier contient tous les fichiers HTML des différentes pages.
- **Router/** : Contient les fichiers JavaScript relatifs au système de routage.
- **scss/** : Dossier contenant les fichiers SCSS pour la mise en forme du projet.
- **index.html** : Page d'accueil du projet.
- **package-lock.json** : Fichier généré automatiquement qui verrouille les versions exactes des dépendances installées.
- **package.json** : Fichier de configuration pour npm qui répertorie les scripts, les dépendances, et les métadonnées du projet.
- **README.MD** : Le fichier que vous lisez actuellement, contenant la documentation du projet.

## Installation

1. **Cloner le projet** :
   Clonez ce dépôt sur votre machine locale.

   ``bash
   git clone https://github.com/Julien-35/arcadia35front.git
   cd votre-projet


   
2. **Installer les Dépendances** :

Il faudra utilisez npm pour gérer les dépendances (comme Bootstrap via npm), installez-les avec la commande suivante :

- **Si le projet n'est pas encore initialisé/** npm init -y : Cela génère un fichier package.json pour gérer les dépendances de votre projet.
- **Installer Bootstrap via npm/** npm install bootstrap : Cela installera Bootstrap dans le dossier node_modules.
- **Ajouter Bootstrap dans votre fichier HTML/**    
<!-- Lien vers le fichier CSS Bootstrap --> <link href="node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">     
<!-- Script JavaScript Bootstrap --><script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>

- **Compilation des fichiers SCSS/**   npm install sass --save-dev puis créez un fichier SCSS dans votre projet et importez Bootstrap : @import "node_modules/bootstrap/scss/bootstrap";
- **Compilez-le avec sass/** sass --watch your-scss-file.scss:your-css-file.css : 
- **Incluez ensuite le fichier CSS généré dans votre HTML./**  Ouvrez votre fichier index.html dans un navigateur pour vérifier que Bootstrap est chargé via les fichiers locaux.









import Route from "./Route.js";

// Définir ici vos routes
export const allRoutes = [
    new Route("/home", "Accueil", "page/home.html", [] , "js/home.js"),
    new Route("/habitat", "Les habitats", "page/habitat.html", [], "js/habitat.js"),
    new Route("/service", "Nos services", "page/service.html", [], "js/service.js"),
    new Route("/contact", "Contact", "page/contact.html", [], "js/contact.js"),
    new Route("/connexion", "Connexion", "page/connexion.html", ["disconnected"], "js/connexion.js"),
    new Route("/admin", "Administrateur", "page/connecte/admin.html", ["ROLE_ADMIN"], "js/connexion/admin.js"),
    new Route("/employe", "Employe", "page/connecte/employe.html", [], "js/connexion/employe.js"),
    new Route("/veterinaire", "Veterinaire", "page/connecte/veterinaire.html", ["VETERINAIRE"], "js/connexion/veterinaire.js"),
    new Route("/inscription", "inscrire utilisateur", "page/connecte/inscription.html", [], "js/connexion/inscription.js"),

    new Route("/incrementation", "incrementation", "page/connecte/incrementation.html", [], "js/incrementation.js"),

];

// Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Zoo Arcadia";

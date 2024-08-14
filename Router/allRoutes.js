import Route from "./Route.js";

// Définir ici vos routes
export const allRoutes = [
    new Route("/accueil", "Accueil", "page/accueil.html", [] , "js/home.js"),
    new Route("/habitat", "Les habitats", "page/habitat.html", [], "js/habitat.js"),
    new Route("/service", "Nos services", "page/service.html", [], "js/service.js"),
    new Route("/contact", "Contact", "page/contact.html", [], "js/contact.js"),
    new Route("/connexion", "Connexion", "page/connexion.html", ["disconnected"], "js/auth/signin.js"),
    new Route("/admin", "Administrateur", "page/connecte/admin.html", ["ROLE_ADMIN"], "js/admin.js"),
    new Route("/employe", "Employe", "page/connecte/employe.html", ["ROLE_EMPLOYE"], "js/employe.js"),
    new Route("/veterinaire", "Veterinaire", "page/connecte/veterinaire.html", ["ROLE_VETERINAIRE"], "js/veterinaire.js"),
];

// Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Zoo Arcadia";

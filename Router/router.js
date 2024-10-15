import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("404", "Page introuvable", "/page/404.html", []);

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
  let currentRoute = null;
  allRoutes.forEach((element) => {
      if (element.url === url) {
          currentRoute = element;
      }
  });
  return currentRoute || route404;
};

// Fonction pour charger le contenu de la page
// Fonction pour charger le contenu de la page
const LoadContentPage = async () => {
  const path = window.location.pathname;
  const actualRoute = getRouteByUrl(path);

  // Récupération du contenu HTML de la route
  const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
  document.getElementById("main-page").innerHTML = html;

  // Vérifier les droits d'accès à la page
  const allRolesArray = actualRoute.authorize;

  // Obtenir le rôle de l'utilisateur et l'état de connexion
  const userRole = getCookie('userRole'); // Récupérer le rôle de l'utilisateur
  const isUserConnected = userRole !== null; // Vérifier si l'utilisateur est connecté

  // Logique d'accès
  if (allRolesArray.length > 0) {
      // Si l'itinéraire nécessite d'être déconnecté
      if (allRolesArray.includes("disconnected")) {
          if (isUserConnected) {
              // Rediriger l'utilisateur connecté vers la page d'accueil
              window.location.replace("/home");
              return;
          }
      } else {
          // Vérifier si le rôle de l'utilisateur est valide pour cet itinéraire
          if (!allRolesArray.includes(userRole)) {
              // Rediriger si le rôle n'est pas valide
              window.location.replace("/home");
              return;
          }
      }
  }

  // Ajout du contenu JavaScript
  if (actualRoute.pathJS !== "") {
      var scriptTag = document.createElement("script");
      scriptTag.setAttribute("type", "text/javascript");
      scriptTag.setAttribute("src", actualRoute.pathJS);

      // Ajout de la balise script au corps du document
      document.querySelector("body").appendChild(scriptTag);
  }

  // Changement du titre de la page
  document.title = actualRoute.title + " - " + websiteName;

  // Afficher et masquer les éléments
  showAndHideElementsForRoles();
};

// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
  event = event || window.event;
  event.preventDefault();
  // Mise à jour de l'URL dans l'historique du navigateur
  window.history.pushState({}, "", event.target.href);
  // Chargement du contenu de la nouvelle page
  LoadContentPage();
};

// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.onpopstate = LoadContentPage;
// Assignation de la fonction routeEvent à la propriété route de la fenêtre
window.route = routeEvent;
// Chargement du contenu de la page au chargement initial
LoadContentPage();
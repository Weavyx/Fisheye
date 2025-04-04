/**
 * Initialise l'application en fonction de la page actuelle.
 * Détecte la page et appelle les méthodes appropriées du contrôleur.
 *
 * @module App
 */
import { AppModel } from "./models/Model.js";
import { AppView } from "./views/View.js";
import { AppController } from "./controller/Controller.js";

// Initialisation du contrôleur
const app = new AppController(new AppModel(), new AppView());

// Détection de la page actuelle
const CURRENT_PAGE = window.location.pathname;

/**
 * Exécute le code après le chargement complet du DOM.
 *
 * @event DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", () => {
  if (CURRENT_PAGE.includes("index.html") || CURRENT_PAGE === "/") {
    app.renderHomePage(); // Renommé pour refléter son rôle
  } else if (CURRENT_PAGE.includes("photographer.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const photographerId = urlParams.get("id");
    app.renderPhotographerPage(photographerId); // Renommé pour refléter son rôle

    // Attacher les événements de la lightbox
    app.view.attachLightboxEvents();
  }
});

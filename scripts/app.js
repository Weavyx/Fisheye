import { AppModel } from "./models/Model.js";
import { AppView } from "./views/View.js";
import { AppController } from "./controller/Controller.js";
import { EventManager } from "./utils/EventManager.js";
// Initialisation des singletons
const app = new AppController(
  new AppModel(),
  new AppView(),
  new EventManager()
);

// Détection de la page actuelle
const CURRENT_PAGE = window.location.pathname;

/**
 * Initialise l'application.
 */
function initializeApp() {
  try {
    if (CURRENT_PAGE.includes("index.html") || CURRENT_PAGE === "/") {
      app.renderHomePage();
    } else if (CURRENT_PAGE.includes("photographer.html")) {
      // Récupère l'ID du photographe dans l'URL
      const urlParams = new URLSearchParams(window.location.search);
      const photographerId = urlParams.get("id");

      app.renderPhotographerPage(photographerId);
    }
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de l'application :",
      error.message
    );
  }
}

/**
 * Exécute le code après le chargement complet du DOM.
 */
app.eventManager.addEvent(document, "DOMContentLoaded", () => {
  initializeApp();
});
